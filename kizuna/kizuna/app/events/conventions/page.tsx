import type { Metadata } from "next";
import { events } from "@/lib/data/events/eventsData";
import ConventionsHome from "./ConventionsHome";

export const metadata: Metadata = { title: "Conventions" };

export default function ConventionsPage() {
  return <ConventionsHome conventions={events.filter((event) => event.type === "Convention")} />;
}
