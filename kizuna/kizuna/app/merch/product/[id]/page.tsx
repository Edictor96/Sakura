import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMerchData } from "@/lib/data/merch/merchData";
import ProductDetail from "./ProductDetail";

export const metadata: Metadata = { title: "Merch product" };

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getMerchData();
  const product = data.products.find((entry) => entry.id === id);
  if (!product) notFound();
  const partner = data.partners.find((entry) => entry.id === product.partnerBusinessId);
  if (!partner) notFound();
  return <ProductDetail data={data} product={product} partner={partner} />;
}
