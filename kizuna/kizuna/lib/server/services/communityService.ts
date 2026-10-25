import { prisma } from "../db/prisma";

const entityTypes = new Set(["POST", "COMMENT", "MEDIA", "GROUP", "EVENT", "PRODUCT"]);

export async function listComments(postId: string) {
  return prisma.comment.findMany({
    where: { postId },
    include: { author: { select: { id: true, username: true, name: true, avatarUrl: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function createComment(input: { postId: string; authorId: string; content: string; parentId?: string }) {
  const post = await prisma.post.findUnique({ where: { id: input.postId }, select: { id: true } });
  if (!post) throw new Error("Post not found.");
  if (input.parentId) {
    const parent = await prisma.comment.findFirst({ where: { id: input.parentId, postId: input.postId }, select: { id: true } });
    if (!parent) throw new Error("Parent comment not found.");
  }
  return prisma.comment.create({
    data: { postId: input.postId, authorId: input.authorId, parentId: input.parentId, content: input.content },
  });
}

export async function toggleReaction(input: { userId: string; entityType: string; entityId: string; reactionType?: string }) {
  const entityType = input.entityType.toUpperCase();
  if (!entityTypes.has(entityType)) throw new Error("Unsupported reaction target.");
  const reactionType = (input.reactionType ?? "LIKE").toUpperCase();
  const where = { userId_entityType_entityId_reactionType: { userId: input.userId, entityType, entityId: input.entityId, reactionType } };
  const existing = await prisma.reaction.findUnique({ where });
  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } });
    return false;
  }
  await prisma.reaction.create({ data: { userId: input.userId, entityType, entityId: input.entityId, reactionType } });
  return true;
}

export async function createReport(input: { reporterId: string; entityType: string; entityId: string; reason: string }) {
  if (!entityTypes.has(input.entityType.toUpperCase())) throw new Error("Unsupported report target.");
  return prisma.report.create({
    data: { reporterId: input.reporterId, entityType: input.entityType.toUpperCase(), entityId: input.entityId, reason: input.reason },
  });
}

export async function toggleBlock(blockerId: string, blockedId: string) {
  if (blockerId === blockedId) throw new Error("You cannot block yourself.");
  const existing = await prisma.block.findUnique({ where: { blockerId_blockedId: { blockerId, blockedId } } });
  if (existing) {
    await prisma.block.delete({ where: { id: existing.id } });
    return false;
  }
  const blocked = await prisma.user.findUnique({ where: { id: blockedId }, select: { id: true } });
  if (!blocked) throw new Error("User not found.");
  await prisma.block.create({ data: { blockerId, blockedId } });
  return true;
}
