import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { events } from "@/lib/data/events/eventsData";
import { getWatchAlong } from "@/lib/data/events/watchAlongData";
import WatchAlong from "./WatchAlong";

export const metadata: Metadata = { title: "Watch-Along" };

export default async function WatchAlongPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = events.find((entry) => entry.id === id);
  if (!event || event.type !== "Watch-along" || !getWatchAlong(event)) notFound();
  return <WatchAlong event={event} data={getWatchAlong(event)!} />;
}
