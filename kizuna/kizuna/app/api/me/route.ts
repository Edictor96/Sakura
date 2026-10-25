import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db/prisma";

export async function GET() {
  const user = await requireCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const [memberships, saves, rsvps, wishlist, activities] = await Promise.all([
    prisma.groupMembership.findMany({ where: { userId: user.id }, include: { group: true }, orderBy: { createdAt: "desc" } }),
    prisma.savedMedia.findMany({ where: { userId: user.id }, include: { media: true }, orderBy: { createdAt: "desc" } }),
    prisma.eventRsvp.findMany({ where: { userId: user.id }, include: { event: true }, orderBy: { createdAt: "desc" } }),
    prisma.wishlistItem.findMany({ where: { userId: user.id }, include: { product: true }, orderBy: { createdAt: "desc" } }),
    prisma.activity.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 100 }),
  ]);
  return NextResponse.json({
    user,
    memberships,
    saves,
    rsvps,
    wishlist,
    activities,
    sets: {
      rooms: memberships.map(({ group }) => group.slug),
      events: rsvps.map(({ eventId }) => eventId),
      saved: saves.map(({ mediaId }) => mediaId),
      wishlist: wishlist.map(({ productId }) => productId),
    },
  });
}

export async function PATCH(request: Request) {
  const user = await requireCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  let payload: Record<string, unknown>;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Send JSON." }, { status: 400 }); }
  const data: { name?: string; username?: string; bio?: string; city?: string; interests?: string[] } = {};
  if (typeof payload.name === "string" && payload.name.length <= 120) data.name = payload.name.trim();
  if (typeof payload.username === "string" && /^[a-z0-9_-]{3,30}$/i.test(payload.username)) data.username = payload.username.toLowerCase();
  if (typeof payload.bio === "string" && payload.bio.length <= 1000) data.bio = payload.bio.trim();
  if (typeof payload.city === "string" && payload.city.length <= 120) data.city = payload.city.trim();
  if (Array.isArray(payload.interests) && payload.interests.every((value) => typeof value === "string") && payload.interests.length <= 30) data.interests = payload.interests.map((value) => value.trim()).filter(Boolean);
  if (!Object.keys(data).length) return NextResponse.json({ error: "No valid profile fields." }, { status: 400 });
  try {
    return NextResponse.json({ user: await prisma.user.update({ where: { id: user.id }, data }) });
  } catch (error) {
    console.error("profile update failed", error);
    return NextResponse.json({ error: "Profile could not be updated." }, { status: 409 });
  }
}
