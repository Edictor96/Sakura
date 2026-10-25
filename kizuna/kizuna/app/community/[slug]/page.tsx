import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCommunityData } from "@/lib/data/community/communityData";
import GroupPage from "./GroupPage";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const group = getCommunityData().groups.find((entry) => entry.slug === slug);
  return { title: group?.name ?? "Community" };
}

export default async function CommunityGroupPage({ params }: Params) {
  const { slug } = await params;
  const data = getCommunityData();
  const group = data.groups.find((entry) => entry.slug === slug);
  if (!group) notFound();
  return <GroupPage data={data} group={group} />;
}
