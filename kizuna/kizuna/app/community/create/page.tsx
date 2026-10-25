import type { Metadata } from "next";
import { getCommunityData } from "@/lib/data/community/communityData";
import CreatePost from "./CreatePost";

export const metadata: Metadata = { title: "Create Post" };

export default async function CreatePostPage({ searchParams }: { searchParams: Promise<{ group?: string }> }) {
  const { group } = await searchParams;
  return <CreatePost data={getCommunityData()} initialGroup={group} />;
}
