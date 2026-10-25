import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCommunityData } from "@/lib/data/community/communityData";
import WatchPartyPage from "./WatchPartyPage";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const party = getCommunityData().watchParties.find((entry) => entry.id === id);
  return { title: party?.title ?? "Watch Party" };
}

export default async function WatchPartyRoute({ params }: Params) {
  const { id } = await params;
  const data = getCommunityData();
  const party = data.watchParties.find((entry) => entry.id === id);
  if (!party) notFound();
  const group = data.groups.find((entry) => entry.slug === party.groupSlug);
  if (!group) notFound();
  return <WatchPartyPage data={data} party={party} group={group} />;
}
