import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMerchData, getPartnerStory } from "@/lib/data/merch/merchData";
import PartnerPage from "./PartnerPage";

export const metadata: Metadata = { title: "Sakura partner" };

export default async function MerchPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getMerchData();
  const partner = data.partners.find((entry) => entry.id === id);
  if (!partner) notFound();
  return <PartnerPage data={data} partner={partner} story={getPartnerStory(partner)} />;
}
