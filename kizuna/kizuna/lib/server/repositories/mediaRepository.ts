import type { PrismaClient } from "@prisma/client";

export function createMediaRepository(db: PrismaClient) {
  return {
    findMany(world?: string) {
      return db.media.findMany({
        where: world ? { world } : undefined,
        include: { images: true },
        orderBy: { createdAt: "asc" },
      });
    },
    findById(id: string) {
      return db.media.findUnique({ where: { id }, include: { images: true } });
    },
    async toggleSaved(userId: string, mediaId: string) {
      const media = await db.media.findUnique({ where: { id: mediaId } });
      if (!media) return null;
      const existing = await db.savedMedia.findUnique({ where: { userId_mediaId: { userId, mediaId } } });
      if (existing) {
        await db.savedMedia.delete({ where: { id: existing.id } });
        return false;
      }
      await db.savedMedia.create({ data: { userId, mediaId } });
      return true;
    },
  };
}
