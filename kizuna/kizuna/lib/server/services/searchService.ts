import { prisma } from "../db/prisma";

export type SearchType = "MEDIA" | "GROUP" | "EVENT" | "PRODUCT";

export async function searchContent(query: string, types?: SearchType[], limit = 24) {
  const term = query.trim();
  if (!term) return [];
  const allowed = types?.length ? new Set(types) : new Set<SearchType>(["MEDIA", "GROUP", "EVENT", "PRODUCT"]);
  const [media, groups, events, products] = await Promise.all([
    allowed.has("MEDIA") ? prisma.media.findMany({ where: { OR: [{ title: { contains: term, mode: "insensitive" } }, { description: { contains: term, mode: "insensitive" } }, { tags: { has: term.toLowerCase() } }] }, include: { images: true }, take: limit, orderBy: { updatedAt: "desc" } }) : [],
    allowed.has("GROUP") ? prisma.group.findMany({ where: { OR: [{ name: { contains: term, mode: "insensitive" } }, { description: { contains: term, mode: "insensitive" } }, { tags: { has: term.toLowerCase() } }] }, take: limit, orderBy: { memberCount: "desc" } }) : [],
    allowed.has("EVENT") ? prisma.event.findMany({ where: { OR: [{ title: { contains: term, mode: "insensitive" } }, { description: { contains: term, mode: "insensitive" } }, { tags: { has: term.toLowerCase() } }] }, take: limit, orderBy: { startTime: "asc" } }) : [],
    allowed.has("PRODUCT") ? prisma.product.findMany({ where: { OR: [{ name: { contains: term, mode: "insensitive" } }, { description: { contains: term, mode: "insensitive" } }, { category: { contains: term, mode: "insensitive" } }, { tags: { has: term.toLowerCase() } }] }, take: limit, orderBy: { updatedAt: "desc" } }) : [],
  ]);
  return [
    ...media.map((item) => ({
      entityType: "MEDIA" as const,
      entityId: item.id,
      id: item.id,
      title: item.title,
      type: item.type,
      description: item.description,
      imageUrl: item.imageUrl,
      images: item.images,
      tags: item.tags,
    })),
    ...groups.map((item) => ({ entityType: "GROUP" as const, entityId: item.id, title: item.name, description: item.description, tags: item.tags })),
    ...events.map((item) => ({ entityType: "EVENT" as const, entityId: item.id, title: item.title, description: item.description, tags: item.tags })),
    ...products.map((item) => ({ entityType: "PRODUCT" as const, entityId: item.id, title: item.name, description: item.description, tags: item.tags })),
  ].slice(0, limit);
}
