import type { Metadata } from "next";
import { db } from "@/lib/data";
import { getExploreData } from "@/lib/data/explore/exploreData";
import ExploreClient from "./ExploreClient";

export const metadata: Metadata = { title: "Explore" };

export default async function ExplorePage() {
  const items = await db.getCatalogue();
  return <ExploreClient items={items} data={getExploreData(items)} />;
}
