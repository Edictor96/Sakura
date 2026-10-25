import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db/prisma";
import { recordActivity } from "@/lib/server/services/activityService";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id: eventId } = await params;
  const event = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true } });
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });
  const rsvp = await prisma.eventRsvp.findUnique({ where: { userId_eventId: { userId: user.id, eventId } } });
  if (!rsvp) return NextResponse.json({ error: "RSVP before checking in." }, { status: 409 });
  const checkIn = await prisma.eventCheckIn.upsert({
    where: { userId_eventId: { userId: user.id, eventId } },
    update: {},
    create: { userId: user.id, eventId, reference: request.headers.get("x-check-in-reference")?.slice(0, 120) },
  });
  await recordActivity({ userId: user.id, interactionType: "CHECK_IN", entityType: "EVENT", entityId: eventId });
  return NextResponse.json({ checkIn });
}
