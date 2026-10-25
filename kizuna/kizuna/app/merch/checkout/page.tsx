import type { Metadata } from "next";
import { getMerchData } from "@/lib/data/merch/merchData";
import CheckoutPage from "./CheckoutPage";

export const metadata: Metadata = { title: "Mock checkout" };

export default function MerchCheckoutPage() {
  return <CheckoutPage data={getMerchData()} />;
}
