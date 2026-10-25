import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCommunityData } from "@/lib/data/community/communityData";
import ThreadPage from "./ThreadPage";

type Params = { params: Promise<{ slug: string; postId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug, postId } = await params;
  const data = getCommunityData();
  const post = data.posts.find((entry) => entry.id === postId);
  const group = data.groups.find((entry) => entry.slug === slug);
  return { title: post ? `${group?.name ?? "Community"} post` : "Post Thread" };
}

export default async function PostThreadRoute({ params }: Params) {
  const { slug, postId } = await params;
  const data = getCommunityData();
  const group = data.groups.find((entry) => entry.slug === slug);
  if (!group) notFound();
  return <ThreadPage data={data} group={group} postId={postId} />;
}
