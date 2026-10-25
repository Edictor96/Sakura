import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { createGroupRepository } from "@/lib/server/repositories/groupRepository";
import { createEventRepository } from "@/lib/server/repositories/eventRepository";
import { createMediaRepository } from "@/lib/server/repositories/mediaRepository";
import { createProductRepository } from "@/lib/server/repositories/productRepository";
import { prisma } from "@/lib/server/db/prisma";
import { recordActivity } from "@/lib/server/services/activityService";

const kinds = ["GROUP", "EVENT", "MEDIA", "PRODUCT"] as const;
type EntityType = (typeof kinds)[number];

export async function POST(request: Request) {
  let payload: { entityType?: EntityType; entityId?: string };
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Send JSON." }, { status: 400 }); }
  const entityType = payload.entityType;
  const entityId = typeof payload.entityId === "string" ? payload.entityId.trim() : "";
  if (!entityType || !kinds.includes(entityType) || !entityId || entityId.length > 100) return NextResponse.json({ error: "Invalid relationship." }, { status: 400 });
  const user = await requireCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  let active: boolean | null = null;
  if (entityType === "GROUP") active = await createGroupRepository(prisma).toggleMembership(user.id, entityId);
  if (entityType === "EVENT") active = await createEventRepository(prisma).toggleRsvp(user.id, entityId);
  if (entityType === "MEDIA") active = await createMediaRepository(prisma).toggleSaved(user.id, entityId);
  if (entityType === "PRODUCT") active = await createProductRepository(prisma).toggleWishlist(user.id, entityId);
  if (active === null) return NextResponse.json({ error: "Entity not found." }, { status: 404 });
  const interactionType = entityType === "GROUP" ? (active ? "JOIN_GROUP" : "LEAVE_GROUP") : entityType === "EVENT" ? "RSVP" : entityType === "MEDIA" ? "SAVE" : "WISHLIST";
  await recordActivity({ userId: user.id, interactionType, entityType, entityId, metadata: { source: "ui" } });
  return NextResponse.json({ ok: true, active });
}
