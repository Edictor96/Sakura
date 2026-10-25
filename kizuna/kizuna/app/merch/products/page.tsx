import type { Metadata } from "next";
import { getMerchData } from "@/lib/data/merch/merchData";
import ProductListing from "./ProductListing";

export const metadata: Metadata = { title: "Browse Merch" };

export default async function MerchProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const value = (key: string) => {
    const entry = params[key];
    return Array.isArray(entry) ? entry[0] : entry;
  };
  return <ProductListing data={getMerchData()} initialFilters={{ category: value("category"), query: value("q"), partner: value("partner"), city: value("city"), filter: value("filter") }} />;
}
