import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { events } from "@/lib/data/events/eventsData";
import EventPass from "./EventPass";

export const metadata: Metadata = { title: "Event Pass" };

export default async function EventPassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = events.find((entry) => entry.id === id);
  if (!event) notFound();
  return <EventPass event={event} />;
}
