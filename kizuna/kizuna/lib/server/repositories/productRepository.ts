import type { PrismaClient } from "@prisma/client";

export function createProductRepository(db: PrismaClient) {
  return {
    findMany() {
      return db.product.findMany({ orderBy: { createdAt: "asc" } });
    },
    async toggleWishlist(userId: string, productId: string) {
      const product = await db.product.findUnique({ where: { id: productId } });
      if (!product) return null;
      const existing = await db.wishlistItem.findUnique({ where: { userId_productId: { userId, productId } } });
      if (existing) {
        await db.wishlistItem.delete({ where: { id: existing.id } });
        return false;
      }
      await db.wishlistItem.create({ data: { userId, productId } });
      return true;
    },
  };
}
