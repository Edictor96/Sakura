import type { Metadata } from "next";
import EventsHome from "./EventsHome";
import { events } from "@/lib/data/events/eventsData";

export const metadata: Metadata = { title: "Events" };

export default function EventsPage() {
  return <EventsHome events={events} />;
}
