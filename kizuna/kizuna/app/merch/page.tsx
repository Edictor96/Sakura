import type { Metadata } from "next";
import { getMerchData } from "@/lib/data/merch/merchData";
import MerchHome from "./MerchHome";

export const metadata: Metadata = { title: "Merch" };

export default function MerchPage() {
  return <MerchHome data={getMerchData()} />;
}
