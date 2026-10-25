import type { PrismaClient } from "@prisma/client";

export function createEventRepository(db: PrismaClient) {
  return {
    findMany(citySlug?: string) {
      return db.event.findMany({
        where: citySlug ? { citySlug } : undefined,
        orderBy: { startTime: "asc" },
      });
    },
    async toggleRsvp(userId: string, eventId: string) {
      const event = await db.event.findUnique({ where: { id: eventId } });
      if (!event) return null;
      const existing = await db.eventRsvp.findUnique({ where: { userId_eventId: { userId, eventId } } });
      if (existing) {
        await db.eventRsvp.delete({ where: { id: existing.id } });
        return false;
      }
      await db.eventRsvp.create({ data: { userId, eventId } });
      return true;
    },
  };
}
