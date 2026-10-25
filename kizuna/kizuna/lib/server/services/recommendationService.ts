import type { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import { createActivityRepository } from "../repositories/activityRepository";

export type RecommendationEntityType = "MEDIA" | "GROUP" | "EVENT" | "PRODUCT";

export interface Recommendation {
  entityId: string;
  entityType: RecommendationEntityType;
  score: number;
  reason: string;
  reasonType: "interest" | "similar" | "community" | "trending" | "event" | "merch";
}

export interface InterestProfile {
  userId: string;
  categories: Record<string, number>;
  genres: Record<string, number>;
  tags: Record<string, number>;
  franchises: Record<string, number>;
  mediaTypes: Record<string, number>;
  groupInterests: Record<string, number>;
  activityCount: number;
}

export interface PersonalizedHome {
  pickedForYou: Recommendation[];
  trending: Recommendation[];
  continueExploring: Recommendation[];
  communityRecommendations: Recommendation[];
  eventRecommendations: Recommendation[];
  merchRecommendations: Recommendation[];
}

const weights: Record<string, number> = {
  VIEW: 1, SEARCH: 2, LIKE: 3, SAVE: 4, JOIN_GROUP: 5, COMMENT: 4,
  POST: 6, REACTION: 2, RSVP: 5, CHECK_IN: 6, WISHLIST: 4, SHARE: 3, PURCHASE: 7,
};

const categoryFor = (type: string, tags: string[] = []) => {
  const lower = [type, ...tags].map((value) => value.toLowerCase());
  if (lower.some((value) => ["music", "jpop", "rock", "ost"].includes(value))) return "music";
  if (lower.some((value) => ["film", "cinema", "ghibli"].includes(value))) return "films";
  if (lower.some((value) => ["community", "group", "meetup"].includes(value))) return "community";
  if (lower.some((value) => ["event", "screening", "rsvp"].includes(value))) return "events";
  if (lower.some((value) => ["product", "merch", "apparel", "collectibles", "stationery"].includes(value))) return "merch";
  return "anime";
};

const add = (bucket: Record<string, number>, key: string, value: number) => {
  if (key) bucket[key.toLowerCase()] = (bucket[key.toLowerCase()] ?? 0) + value;
};

const stringValue = (value: unknown) => typeof value === "string" ? value : "";

const recencyMultiplier = (createdAt: Date) => {
  const ageDays = Math.max(0, (Date.now() - createdAt.getTime()) / 86_400_000);
  return Math.max(0.25, Math.exp(-ageDays / 45));
};

const scoreOf = (value: number) => Math.round(value * 10) / 10;

function activityWeight(activity: { interactionType: string; createdAt: Date }) {
  return (weights[activity.interactionType] ?? 1) * recencyMultiplier(activity.createdAt);
}

function metadataText(metadata: Prisma.JsonValue | null) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return "";
  const value = (metadata as Record<string, Prisma.JsonValue>).query;
  return typeof value === "string" ? value : "";
}

export async function getUserInterestProfile(userId: string): Promise<InterestProfile> {
  const [activities, media, groups, events, products] = await Promise.all([
    createActivityRepository(prisma).findByUserId(userId),
    prisma.media.findMany({ select: { id: true, type: true, tags: true } }),
    prisma.group.findMany({ select: { id: true, tags: true, name: true } }),
    prisma.event.findMany({ select: { id: true, tags: true } }),
    prisma.product.findMany({ select: { id: true, category: true, tags: true, brand: true } }),
  ]);
  const mediaById = new Map(media.map((item) => [item.id, item]));
  const groupsById = new Map(groups.map((item) => [item.id, item]));
  const eventsById = new Map(events.map((item) => [item.id, item]));
  const productsById = new Map(products.map((item) => [item.id, item]));
  const profile: InterestProfile = {
    userId, categories: {}, genres: {}, tags: {}, franchises: {}, mediaTypes: {}, groupInterests: {}, activityCount: activities.length,
  };

  for (const activity of activities) {
    const value = activityWeight(activity);
    const entity = activity.entityType.toUpperCase();
    const candidate = entity === "MEDIA" ? mediaById.get(activity.entityId)
      : entity === "GROUP" ? groupsById.get(activity.entityId)
        : entity === "EVENT" ? eventsById.get(activity.entityId)
          : productsById.get(activity.entityId);
    const tags = candidate && "tags" in candidate && Array.isArray(candidate.tags)
      ? candidate.tags.filter((tag): tag is string => typeof tag === "string")
      : [];
    const type = entity === "MEDIA" && candidate && "type" in candidate ? stringValue(candidate.type)
      : entity === "PRODUCT" && candidate && "category" in candidate ? stringValue(candidate.category)
        : entity.toLowerCase();
    add(profile.categories, categoryFor(type, tags), value);
    add(profile.mediaTypes, type, value);
    tags.forEach((tag) => add(profile.tags, tag, value));
    if (entity === "GROUP" && candidate && "name" in candidate) add(profile.groupInterests, stringValue(candidate.name), value);
    if (entity === "PRODUCT" && candidate && "brand" in candidate) add(profile.franchises, stringValue(candidate.brand), value);
    const query = metadataText(activity.metadata);
    query.toLowerCase().split(/\s+/).filter((word) => word.length > 2).forEach((word) => add(profile.tags, word, value * 0.5));
  }
  return profile;
}

type Candidate = { id: string; type: RecommendationEntityType; tags: string[]; category: string; title: string; popularity: number };

async function candidates(): Promise<Candidate[]> {
  const [media, groups, events, products] = await Promise.all([
    prisma.media.findMany({ select: { id: true, title: true, type: true, tags: true, createdAt: true } }),
    prisma.group.findMany({ select: { id: true, name: true, tags: true, memberCount: true, createdAt: true } }),
    prisma.event.findMany({ select: { id: true, title: true, tags: true, startTime: true, createdAt: true } }),
    prisma.product.findMany({ select: { id: true, name: true, category: true, tags: true, createdAt: true } }),
  ]);
  return [
    ...media.map((item) => ({ id: item.id, type: "MEDIA" as const, tags: item.tags, category: categoryFor(item.type, item.tags), title: item.title, popularity: item.createdAt.getTime() / 1e12 })),
    ...groups.map((item) => ({ id: item.id, type: "GROUP" as const, tags: item.tags, category: "community", title: item.name, popularity: item.memberCount + item.createdAt.getTime() / 1e12 })),
    ...events.map((item) => ({ id: item.id, type: "EVENT" as const, tags: item.tags, category: "events", title: item.title, popularity: item.startTime > new Date() ? 2 : 0 })),
    ...products.map((item) => ({ id: item.id, type: "PRODUCT" as const, tags: item.tags, category: "merch", title: item.name, popularity: item.createdAt.getTime() / 1e12 })),
  ];
}

export async function getRecommendations(userId: string, options: { entityTypes?: RecommendationEntityType[]; limit?: number } = {}) {
  const [profile, allCandidates, activities] = await Promise.all([
    getUserInterestProfile(userId),
    candidates(),
    createActivityRepository(prisma).findByUserId(userId),
  ]);
  const interacted = new Set(activities.map((activity) => `${activity.entityType}:${activity.entityId}`));
  const allowed = options.entityTypes ? new Set(options.entityTypes) : undefined;
  const results = allCandidates
    .filter((candidate) => !allowed || allowed.has(candidate.type))
    .filter((candidate) => !interacted.has(`${candidate.type}:${candidate.id}`))
    .map((candidate) => {
      const tagMatches = candidate.tags.filter((tag) => (profile.tags[tag.toLowerCase()] ?? 0) > 0);
      const categoryScore = profile.categories[candidate.category] ?? 0;
      const tagScore = tagMatches.reduce((total, tag) => total + (profile.tags[tag.toLowerCase()] ?? 0), 0);
      const communityScore = candidate.type === "GROUP" ? (profile.groupInterests[candidate.title.toLowerCase()] ?? 0) : 0;
      const score = categoryScore * 0.8 + tagScore * 0.7 + communityScore + Math.min(3, candidate.popularity / 1000);
      const reason = communityScore > 0 ? `Because you joined ${candidate.title}`
        : tagMatches.length ? `Because you explored ${tagMatches[0]} recently`
          : categoryScore > 0 ? `Based on your recent ${candidate.category} activity`
            : candidate.type === "EVENT" ? "Upcoming in Sakura's community"
              : "Popular with Sakura members";
      return {
        entityId: candidate.id, entityType: candidate.type, score: scoreOf(score),
        reason, reasonType: communityScore > 0 ? "community" as const : tagMatches.length ? "similar" as const : candidate.type === "EVENT" ? "event" as const : "trending" as const,
      };
    })
    .sort((a, b) => b.score - a.score || a.entityId.localeCompare(b.entityId));
  return results.slice(0, options.limit ?? 20);
}

export async function getTrending(entityType: RecommendationEntityType, limit = 6) {
  const [allCandidates, activities] = await Promise.all([candidates(), prisma.activity.findMany({ select: { entityType: true, entityId: true, interactionType: true, createdAt: true } })]);
  const counts = new Map<string, number>();
  for (const activity of activities) {
    const key = `${activity.entityType}:${activity.entityId}`;
    counts.set(key, (counts.get(key) ?? 0) + activityWeight(activity));
  }
  return allCandidates.filter((candidate) => candidate.type === entityType).map((candidate) => ({
    entityId: candidate.id, entityType: candidate.type, score: scoreOf((counts.get(`${candidate.type}:${candidate.id}`) ?? 0) + Math.min(3, candidate.popularity / 1000)),
    reason: "Popular with Sakura members", reasonType: "trending" as const,
  })).sort((a, b) => b.score - a.score || a.entityId.localeCompare(b.entityId)).slice(0, limit);
}

export const getTrendingMedia = (limit?: number) => getTrending("MEDIA", limit);
export const getTrendingGroups = (limit?: number) => getTrending("GROUP", limit);
export const getTrendingEvents = (limit?: number) => getTrending("EVENT", limit);
export const getTrendingProducts = (limit?: number) => getTrending("PRODUCT", limit);

export async function getPersonalizedHome(userId: string): Promise<PersonalizedHome> {
  const [recommendations, trending, communityRecommendations, eventRecommendations, merchRecommendations] = await Promise.all([
    getRecommendations(userId, { limit: 12 }),
    getTrendingMedia(6),
    getRecommendations(userId, { entityTypes: ["GROUP"], limit: 4 }),
    getRecommendations(userId, { entityTypes: ["EVENT"], limit: 4 }),
    getRecommendations(userId, { entityTypes: ["PRODUCT"], limit: 4 }),
  ]);
  return {
    pickedForYou: recommendations.filter((item) => item.entityType === "MEDIA").slice(0, 6),
    trending,
    continueExploring: recommendations.filter((item) => item.entityType === "MEDIA").slice(6, 10),
    communityRecommendations,
    eventRecommendations,
    merchRecommendations,
  };
}
