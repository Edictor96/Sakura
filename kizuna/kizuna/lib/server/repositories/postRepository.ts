import type { PrismaClient } from "@prisma/client";

export function createPostRepository(db: PrismaClient) {
  return {
    findByGroupSlug(slug: string) {
      return db.post.findMany({
        where: { group: { slug } },
        include: { author: true, group: true },
        orderBy: { createdAt: "desc" },
      });
    },
    create(input: { groupId: string; authorId: string; content: string; isSpoiler?: boolean }) {
      return db.post.create({
        data: input,
        include: { author: true, group: true },
      });
    },
  };
}
