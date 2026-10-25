import type { Metadata } from "next";
import { getCommunityData } from "@/lib/data/community/communityData";
import CommunityHome from "./CommunityHome";

export const metadata: Metadata = { title: "Community" };

export default function CommunityPage() {
  return <CommunityHome data={getCommunityData()} />;
}
