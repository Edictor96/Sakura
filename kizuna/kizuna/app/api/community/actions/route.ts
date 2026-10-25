import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { createComment, createReport, toggleBlock, toggleReaction } from "@/lib/server/services/communityService";
import { recordActivity } from "@/lib/server/services/activityService";

export async function GET(request: Request) {
  const postId = new URL(request.url).searchParams.get("postId")?.trim();
  if (!postId || postId.length > 100) return NextResponse.json({ error: "postId is required." }, { status: 400 });
  const { listComments } = await import("@/lib/server/services/communityService");
  return NextResponse.json({ comments: await listComments(postId) });
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Send JSON." }, { status: 400 }); }
  const user = await requireCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  try {
    const action = typeof payload.action === "string" ? payload.action : "";
    if (action === "comment") {
      const postId = typeof payload.postId === "string" ? payload.postId.trim() : "";
      const content = typeof payload.content === "string" ? payload.content.trim() : "";
      if (!postId || !content || content.length > 5000) return NextResponse.json({ error: "Invalid comment." }, { status: 400 });
      const comment = await createComment({ postId, authorId: user.id, content, parentId: typeof payload.parentId === "string" ? payload.parentId : undefined });
      await recordActivity({ userId: user.id, interactionType: "COMMENT", entityType: "POST", entityId: postId, metadata: { commentId: comment.id } });
      return NextResponse.json({ comment }, { status: 201 });
    }
    if (action === "reaction") {
      const entityType = typeof payload.entityType === "string" ? payload.entityType : "";
      const entityId = typeof payload.entityId === "string" ? payload.entityId.trim() : "";
      if (!entityId) return NextResponse.json({ error: "Reaction target is required." }, { status: 400 });
      const active = await toggleReaction({ userId: user.id, entityType, entityId, reactionType: typeof payload.reactionType === "string" ? payload.reactionType : undefined });
      if (active) await recordActivity({ userId: user.id, interactionType: "REACTION", entityType, entityId });
      return NextResponse.json({ active });
    }
    if (action === "report") {
      const entityType = typeof payload.entityType === "string" ? payload.entityType : "";
      const entityId = typeof payload.entityId === "string" ? payload.entityId.trim() : "";
      const reason = typeof payload.reason === "string" ? payload.reason.trim() : "";
      if (!entityId || !reason || reason.length > 500) return NextResponse.json({ error: "Invalid report." }, { status: 400 });
      return NextResponse.json({ report: await createReport({ reporterId: user.id, entityType, entityId, reason }) }, { status: 201 });
    }
    if (action === "block") {
      const blockedId = typeof payload.blockedId === "string" ? payload.blockedId.trim() : "";
      if (!blockedId) return NextResponse.json({ error: "blockedId is required." }, { status: 400 });
      return NextResponse.json({ active: await toggleBlock(user.id, blockedId) });
    }
    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  } catch (error) {
    console.error("community action failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Community action failed." }, { status: 400 });
  }
}
