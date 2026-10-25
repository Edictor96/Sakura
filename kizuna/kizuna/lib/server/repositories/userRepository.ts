import type { PrismaClient } from "@prisma/client";

export function createUserRepository(db: PrismaClient) {
  return {
    findById(id: string) {
      return db.user.findUnique({ where: { id } });
    },
    findByEmail(email: string) {
      return db.user.findUnique({ where: { email } });
    },
  };
}
