import type { Prisma, PrismaClient } from "@prisma/client";

export function createActivityRepository(db: PrismaClient) {
  return {
    record(input: {
      userId: string;
      interactionType: string;
      entityType: string;
      entityId: string;
      metadata?: Prisma.InputJsonValue;
    }) {
      return db.activity.create({ data: input });
    },
    findByUserId(userId: string) {
      return db.activity.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    },
  };
}
