import type { Metadata } from "next";
import { db } from "@/lib/data";
import { getExploreData } from "@/lib/data/explore/exploreData";
import { getRecommendations } from "@/lib/server/services/recommendationService";
import { getCurrentUser } from "@/lib/server/auth";
import ExploreClient from "./ExploreClient";

export const metadata: Metadata = { title: "Explore" };

export default async function ExplorePage() {
  const items = await db.getCatalogue();
  const user = await getCurrentUser();
  const personalized = process.env.DATABASE_URL && user
    ? await getRecommendations(user.id, { entityTypes: ["MEDIA"], limit: 4 })
    : [];
  return <ExploreClient items={items} data={getExploreData(items, personalized.map((item) => item.entityId))} />;
}
