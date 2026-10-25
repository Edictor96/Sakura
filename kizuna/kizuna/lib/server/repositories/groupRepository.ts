import type { PrismaClient } from "@prisma/client";

export function createGroupRepository(db: PrismaClient) {
  return {
    findMany() {
      return db.group.findMany({ orderBy: { createdAt: "asc" } });
    },
    findBySlug(slug: string) {
      return db.group.findUnique({ where: { slug } });
    },
    async toggleMembership(userId: string, slug: string) {
      const group = await db.group.findUnique({ where: { slug } });
      if (!group) return null;
      const existing = await db.groupMembership.findUnique({ where: { userId_groupId: { userId, groupId: group.id } } });
      if (existing) {
        await db.$transaction([
          db.groupMembership.delete({ where: { id: existing.id } }),
          db.group.update({ where: { id: group.id }, data: { memberCount: { decrement: 1 } } }),
        ]);
        return false;
      }
      await db.$transaction([
        db.groupMembership.create({ data: { userId, groupId: group.id } }),
        db.group.update({ where: { id: group.id }, data: { memberCount: { increment: 1 } } }),
      ]);
      return true;
    },
  };
}
