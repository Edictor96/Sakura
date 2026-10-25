import type { Metadata } from "next";
import { getMerchData } from "@/lib/data/merch/merchData";
import WishlistPage from "./WishlistPage";

export const metadata: Metadata = { title: "Merch wishlist" };
export default function MerchWishlistPage() { return <WishlistPage data={getMerchData()} />; }
