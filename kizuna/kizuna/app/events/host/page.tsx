import type { Metadata } from "next";
import { getCommunityData } from "@/lib/data/community/communityData";
import HostEventForm from "./HostEventForm";

export const metadata: Metadata = { title: "Host an event" };

export default async function HostEventPage({ searchParams }: { searchParams: Promise<{ group?: string }> }) {
  const { group } = await searchParams;
  const groups = getCommunityData().groups;
  return <HostEventForm groups={groups} initialGroup={group} />;
}
