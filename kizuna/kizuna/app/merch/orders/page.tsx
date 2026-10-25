import type { Metadata } from "next";
import { getMerchData, merchOrders } from "@/lib/data/merch/merchData";
import OrdersPage from "./OrdersPage";

export const metadata: Metadata = { title: "Merch orders" };
export default function MerchOrdersPage() { return <OrdersPage data={getMerchData()} />; }
