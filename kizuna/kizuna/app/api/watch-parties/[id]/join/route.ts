import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db/prisma";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id: watchPartyId } = await params;
  const party = await prisma.watchParty.findUnique({ where: { id: watchPartyId }, select: { id: true } });
  if (!party) return NextResponse.json({ error: "Watch party not found." }, { status: 404 });
  const participant = await prisma.watchPartyParticipant.upsert({
    where: { watchPartyId_userId: { watchPartyId, userId: user.id } },
    update: { status: "joined" },
    create: { watchPartyId, userId: user.id },
  });
  return NextResponse.json({ participant });
}
