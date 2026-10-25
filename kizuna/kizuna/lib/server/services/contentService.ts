import type { CatalogueItem, EventItem, Post, Product, Room, World } from "@/lib/types";
import { createEventRepository } from "../repositories/eventRepository";
import { createGroupRepository } from "../repositories/groupRepository";
import { createMediaRepository } from "../repositories/mediaRepository";
import { createPostRepository } from "../repositories/postRepository";
import { createProductRepository } from "../repositories/productRepository";
import { prisma } from "../db/prisma";
import { api as mock } from "@/lib/data/mock";

function shouldUseDemoFallback(error: unknown) {
  return error instanceof Error && "code" in error && ["P2021", "P1001"].includes(String(error.code));
}

const media = createMediaRepository(prisma);
const groups = createGroupRepository(prisma);
const posts = createPostRepository(prisma);
const events = createEventRepository(prisma);
const products = createProductRepository(prisma);

const toCatalogue = (item: Awaited<ReturnType<typeof media.findMany>>[number]): CatalogueItem => ({
  id: item.id,
  title: item.title,
  kind: item.type as CatalogueItem["kind"],
  world: item.world as World,
  year: item.year ?? undefined,
  maker: item.maker ?? undefined,
  blurb: item.blurb ?? item.description ?? "",
  tags: item.tags,
  imageUrl: item.imageUrl ?? undefined,
  originalTitle: item.originalTitle ?? undefined,
  genres: item.genres,
  themes: item.themes,
  status: item.status ?? undefined,
  score: item.score ?? undefined,
  episodeCount: item.episodeCount ?? undefined,
  runtimeMinutes: item.runtimeMinutes ?? undefined,
  images: item.images.map((image) => ({
    type: image.type,
    url: image.url,
    provider: image.provider,
    sourceUrl: image.sourceUrl ?? undefined,
    width: image.width ?? undefined,
    height: image.height ?? undefined,
  })),
});

const toRoom = (group: Awaited<ReturnType<typeof groups.findMany>>[number]): Room => ({
  slug: group.slug,
  name: group.name,
  blurb: group.description ?? "",
  kind: group.kind as Room["kind"],
  glyph: group.glyph,
  tags: group.tags,
  dimension: (group.dimension as Room["dimension"]) ?? undefined,
  citySlug: group.city ?? undefined,
});

const toPost = (post: Awaited<ReturnType<typeof posts.findByGroupSlug>>[number]): Post => ({
  id: post.id,
  roomSlug: post.group.slug,
  author: post.author.name ?? post.author.username,
  body: post.content,
  createdAt: post.createdAt.toISOString(),
});

const toEvent = (event: Awaited<ReturnType<typeof events.findMany>>[number]): EventItem => ({
  id: event.id,
  title: event.title,
  citySlug: event.citySlug ?? event.city ?? "online",
  date: event.startTime.toISOString(),
  venue: event.venue ?? "Venue to be announced",
  blurb: event.blurb ?? event.description ?? "",
  tags: event.tags,
  roomSlug: event.roomSlug ?? undefined,
});

const toProduct = (product: Awaited<ReturnType<typeof products.findMany>>[number]): Product => ({
  id: product.id,
  title: product.name,
  category: product.category as Product["category"],
  brand: product.brand ?? "SAKURA",
  partner: product.partner ?? "Partner to be signed",
  partnerUrl: product.partnerUrl ?? undefined,
  verified: product.verified,
  blurb: product.description ?? "",
});

export const contentService = {
  async getRooms() {
    try { return (await groups.findMany()).map(toRoom); } catch (error) { if (shouldUseDemoFallback(error)) return mock.getRooms(); throw error; }
  },
  async getRoom(slug: string) {
    try { const group = await groups.findBySlug(slug); return group ? toRoom(group) : undefined; } catch (error) { if (shouldUseDemoFallback(error)) return mock.getRoom(slug); throw error; }
  },
  async getPosts(roomSlug: string) {
    try { return (await posts.findByGroupSlug(roomSlug)).map(toPost); } catch (error) { if (shouldUseDemoFallback(error)) return mock.getPosts(roomSlug); throw error; }
  },
  async getEvents(citySlug?: string) {
    try { return (await events.findMany(citySlug)).map(toEvent); } catch (error) { if (shouldUseDemoFallback(error)) return mock.getEvents(citySlug); throw error; }
  },
  async getCatalogue(world?: World) {
    try { return (await media.findMany(world)).map(toCatalogue); } catch (error) { if (shouldUseDemoFallback(error)) return mock.getCatalogue(world); throw error; }
  },
  async getCatalogueItem(id: string) {
    try { const item = await media.findById(id); return item ? toCatalogue(item) : undefined; } catch (error) { if (shouldUseDemoFallback(error)) return mock.getCatalogueItem(id); throw error; }
  },
  async getProducts() {
    try { return (await products.findMany()).map(toProduct); } catch (error) { if (shouldUseDemoFallback(error)) return mock.getProducts(); throw error; }
  },
};
