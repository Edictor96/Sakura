import type { CatalogueItem } from "../../types";
import { catalogue } from "../mock";
import { getPersonalizedHome } from "@/lib/server/services/recommendationService";
import { getCurrentUser } from "@/lib/server/auth";

export interface HomeFeatured {
  id: string;
  title: string;
  type: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaHref: string;
}

export interface Recommendation {
  mediaId: string;
  reason: string;
}

export interface Trend {
  mediaId: string;
  metric: string;
  indicator: "up" | "stable";
}

export interface UserSummary {
  communitiesJoined: number;
  titlesSaved: number;
  eventsComingUp: number;
  interestsActive: number;
}

export interface DiscoverCategory {
  id: string;
  label: string;
  items: string[];
  href: string;
  colorClass: string;
}

export interface HomeData {
  featured: HomeFeatured;
  recommendations: Recommendation[];
  trends: Trend[];
  userSummary: UserSummary;
  discoverCategories: DiscoverCategory[];
}

export async function getHomeData(userId?: string): Promise<HomeData> {
  const user = userId ? { id: userId } : await getCurrentUser();
  const personalized = process.env.DATABASE_URL && user ? await getPersonalizedHome(user.id) : undefined;
  const mediaRecommendations = personalized?.pickedForYou.filter((item) => item.entityType === "MEDIA") ?? [];
  const mediaTrending = personalized?.trending.filter((item) => item.entityType === "MEDIA") ?? [];
  return {
    featured: {
      id: "featured-1",
      title: "Spirited Away: 25th Anniversary",
      type: "Cinema",
      description: "Revisit the magical bathhouse in a special anniversary screening event across India.",
      imageUrl: "https://images.unsplash.com/photo-1578632292335-df370B450637?q=80&w=1000", // Placeholder
      ctaText: "Find a Screening",
      ctaHref: "/events",
    },
    recommendations: mediaRecommendations.length
      ? mediaRecommendations.map((item) => ({ mediaId: item.entityId, reason: item.reason }))
      : [
          { mediaId: "your-name", reason: "Because you liked Your Name" },
          { mediaId: "jujutsu-kaisen", reason: "Popular in your communities" },
          { mediaId: "yoasobi", reason: "Because you're exploring J-Music" },
          { mediaId: "persona-5-royal", reason: "Trending among Sakura users" },
        ],
    trends: mediaTrending.length
      ? mediaTrending.map((item) => ({ mediaId: item.entityId, metric: `${item.score} Sakura activity`, indicator: "up" as const }))
      : [
          { mediaId: "elden-ring", metric: "1.2k talking", indicator: "up" },
          { mediaId: "vagabond", metric: "850 reading", indicator: "up" },
          { mediaId: "ado", metric: "2k listening", indicator: "stable" },
        ],
    userSummary: {
      communitiesJoined: 3,
      titlesSaved: 5,
      eventsComingUp: 1,
      interestsActive: 2,
    },
    discoverCategories: [
      {
        id: "watch",
        label: "WATCH",
        items: ["Anime", "Manga", "Cinema", "TV"],
        href: "/discover?w=watch",
        colorClass: "c-pink",
      },
      {
        id: "listen",
        label: "LISTEN",
        items: ["J-Music", "Artists", "OSTs"],
        href: "/discover?w=listen",
        colorClass: "c-lav",
      },
      {
        id: "play",
        label: "PLAY",
        items: ["Japanese Games"],
        href: "/discover?w=play",
        colorClass: "c-blue",
      },
      {
        id: "live",
        label: "LIVE",
        items: ["Events", "Communities", "Culture"],
        href: "/events",
        colorClass: "c-mint",
      },
      {
        id: "collect",
        label: "COLLECT",
        items: ["Merchandise", "Collectibles"],
        href: "/collect",
        colorClass: "c-peach",
      },
    ],
  };
}

/** Helper to get media metadata for the home page */
export function getMediaById(id: string): CatalogueItem | undefined {
  return catalogue.find((item) => item.id === id);
}
