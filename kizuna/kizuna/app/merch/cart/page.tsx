import type { Metadata } from "next";
import { getMerchData } from "@/lib/data/merch/merchData";
import CartPage from "./CartPage";

export const metadata: Metadata = { title: "Your merch cart" };

export default function MerchCartPage() {
  return <CartPage data={getMerchData()} />;
}
