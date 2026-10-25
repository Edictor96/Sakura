import type { Metadata } from "next";
import { getMerchData } from "@/lib/data/merch/merchData";
import DropsPage from "./DropsPage";

export const metadata: Metadata = { title: "Merch drops" };

export default function MerchDropsPage() {
  return <DropsPage data={getMerchData()} />;
}
