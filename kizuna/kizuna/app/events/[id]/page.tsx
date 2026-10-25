import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { events } from "@/lib/data/events/eventsData";
import EventDetail from "./EventDetail";
import LocalProposalDetail from "./LocalProposalDetail";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const event = events.find((entry) => entry.id === id);
  return { title: event?.title ?? "Event" };
}

export default async function EventDetailPage({ params }: Params) {
  const { id } = await params;
  const event = events.find((entry) => entry.id === id);
  if (!event && id.startsWith("host-proposal-")) return <LocalProposalDetail id={id} />;
  if (!event) notFound();
  return <EventDetail event={event} />;
}
