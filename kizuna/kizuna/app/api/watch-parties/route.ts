import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db/prisma";

export async function GET(request: Request) {
  const eventId = new URL(request.url).searchParams.get("eventId")?.trim();
  const parties = await prisma.watchParty.findMany({
    where: eventId ? { eventId } : undefined,
    include: { participants: { select: { userId: true, status: true } }, host: { select: { id: true, username: true, name: true } } },
    orderBy: { startsAt: "asc" },
  });
  return NextResponse.json({ parties });
}

export async function POST(request: Request) {
  const user = await requireCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  let payload: Record<string, unknown>;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Send JSON." }, { status: 400 }); }
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const startsAt = typeof payload.startsAt === "string" ? new Date(payload.startsAt) : new Date(NaN);
  if (!title || title.length > 160 || Number.isNaN(startsAt.getTime())) return NextResponse.json({ error: "Valid title and startsAt are required." }, { status: 400 });
  const eventId = typeof payload.eventId === "string" ? payload.eventId.trim() : undefined;
  const groupId = typeof payload.groupId === "string" ? payload.groupId.trim() : undefined;
  if (!eventId && !groupId) return NextResponse.json({ error: "eventId or groupId is required." }, { status: 400 });
  let authorized = false;
  if (groupId) {
    authorized = Boolean(await prisma.groupMembership.findUnique({
      where: { userId_groupId: { userId: user.id, groupId } },
    }));
  }
  if (eventId) {
    const [event, rsvp] = await Promise.all([
      prisma.event.findUnique({ where: { id: eventId }, select: { hostUserId: true } }),
      prisma.eventRsvp.findUnique({ where: { userId_eventId: { userId: user.id, eventId } } }),
    ]);
    if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });
    authorized ||= event.hostUserId === user.id || Boolean(rsvp);
  }
  if (groupId && !(await prisma.group.findUnique({ where: { id: groupId }, select: { id: true } }))) {
    return NextResponse.json({ error: "Group not found." }, { status: 404 });
  }
  if (!authorized) return NextResponse.json({ error: "Join the group or RSVP to the event before hosting a watch party." }, { status: 403 });
  const party = await prisma.watchParty.create({
    data: {
      title, startsAt, eventId, groupId, hostId: user.id,
      agenda: Array.isArray(payload.agenda) ? payload.agenda.filter((item) => typeof item === "object" && item !== null) : undefined,
      participants: { create: { userId: user.id } },
    },
  });
  return NextResponse.json({ party }, { status: 201 });
}
