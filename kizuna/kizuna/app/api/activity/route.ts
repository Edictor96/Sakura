import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { INTERACTION_TYPES, recordActivity, type InteractionType } from "@/lib/server/services/activityService";

const entityTypes = new Set(["MEDIA", "GROUP", "EVENT", "PRODUCT"]);

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) return NextResponse.json({ ok: false, error: "Activity storage is not configured." }, { status: 503 });
  let payload: { interactionType?: string; entityType?: string; entityId?: string; metadata?: Record<string, string> };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Send JSON." }, { status: 400 });
  }
  if (!payload.entityId || !entityTypes.has(payload.entityType ?? "") || !INTERACTION_TYPES.includes(payload.interactionType as InteractionType)) {
    return NextResponse.json({ ok: false, error: "Invalid activity." }, { status: 400 });
  }
  const entityType = payload.entityType as "MEDIA" | "GROUP" | "EVENT" | "PRODUCT";
  const entityId = payload.entityId;
  const user = await requireCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Sign in required." }, { status: 401 });
  try {
    await recordActivity({
      userId: user.id,
      interactionType: payload.interactionType as InteractionType,
      entityType,
      entityId,
      metadata: { source: "ui", ...payload.metadata },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("activity write failed", error);
    return NextResponse.json({ ok: false, error: "Activity could not be saved." }, { status: 503 });
  }
}
