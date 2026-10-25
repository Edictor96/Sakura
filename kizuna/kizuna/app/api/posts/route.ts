import { NextResponse } from "next/server";
import { moderate } from "@/lib/moderation";
import { requireCurrentUser } from "@/lib/server/auth";
import { createGroupRepository } from "@/lib/server/repositories/groupRepository";
import { createPostRepository } from "@/lib/server/repositories/postRepository";
import { prisma } from "@/lib/server/db/prisma";
import { recordActivity } from "@/lib/server/services/activityService";

// POST /api/posts  { roomSlug, author, body }
// Prototype: runs the same moderation as the browser, then saves to Supabase if it is connected.
// Before launch: require a signed-in user and send flagged posts to a review queue.

export async function POST(req: Request) {
  let payload: { roomSlug?: string; body?: string; isSpoiler?: boolean };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Send JSON." }, { status: 400 });
  }

  const roomSlug = String(payload.roomSlug ?? "").slice(0, 80);
  const body = String(payload.body ?? "").trim();

  if (!roomSlug) return NextResponse.json({ ok: false, error: "roomSlug is required." }, { status: 400 });

  const verdict = moderate(body);
  if (!verdict.ok) {
    return NextResponse.json({ ok: false, error: `This post ${verdict.reason}.` }, { status: 422 });
  }

  if (!body || body.length > 5000) return NextResponse.json({ ok: false, error: "Post content must be 1-5000 characters." }, { status: 400 });
  const user = await requireCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Sign in required." }, { status: 401 });
  const group = await createGroupRepository(prisma).findBySlug(roomSlug);
  if (!group) return NextResponse.json({ ok: false, error: "Group not found." }, { status: 404 });
  const membership = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId: user.id, groupId: group.id } },
  });
  if (!membership) return NextResponse.json({ ok: false, error: "Join this group before posting." }, { status: 403 });
  const post = await createPostRepository(prisma).create({ groupId: group.id, authorId: user.id, content: body, isSpoiler: Boolean(payload.isSpoiler) });
  try {
    await recordActivity({ userId: user.id, interactionType: "POST", entityType: "GROUP", entityId: group.id, metadata: { source: "ui", postId: post.id } });
  } catch (error) {
    console.error("post activity recording failed", error);
  }
  return NextResponse.json({ ok: true, persisted: true, postId: post.id });
}
