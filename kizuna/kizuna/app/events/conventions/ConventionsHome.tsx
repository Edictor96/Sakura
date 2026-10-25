"use client";

import Link from "next/link";
import { useState } from "react";
import { EventCard } from "../EventsHome";
import { eventAttendees, getCity, type EventItem } from "@/lib/data/events/eventsData";

export default function ConventionsHome({ conventions }: { conventions: EventItem[] }) {
  const [reminders, setReminders] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const toggleReminder = (id: string) => setReminders((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return <div className="events-page conventions-page"><Link href="/events" className="back-link">← Back to Events</Link><header className="events-hero"><span className="sample-note">SAKURA / PARTNER DISCOVERY</span><h1 className="h-hero">Big days, better when you know someone there.</h1><p className="lede">Sakura helps you discover partner conventions and find your people around them. We do not organize or sell tickets for these events.</p></header>{conventions.length ? <div className="convention-list">{conventions.map((event) => <section className="convention-entry" key={event.id}><EventCard event={event} /><div className="convention-actions"><span className="convention-status">Official partner discovery</span><span>{event.attendeeIds.length + 7} people going from Sakura</span><button type="button" className="btn btn-small btn-pink" onClick={() => setSelected(event.id)} aria-expanded={selected === event.id}>Find people going</button><button type="button" className={`btn btn-small ${reminders.includes(event.id) ? "btn-done" : "btn-ghost"}`} onClick={() => toggleReminder(event.id)} aria-pressed={reminders.includes(event.id)}>{reminders.includes(event.id) ? "Reminder set" : "Remind me"}</button><a className="btn btn-small btn-ghost" href={event.externalUrl} target="_blank" rel="noreferrer">Official website ↗</a></div>{selected === event.id ? <div className="convention-people card c-lav" role="status"><strong>Find people going</strong><p>{event.attendeeIds.slice(0, 4).map((id) => eventAttendees[id]).filter(Boolean).join(", ")} and others are planning around this partner event.</p><Link href={`/community/${event.cityId === "kolkata" ? "anime-fans-india" : "chandigarh-anime-club"}`} className="btn btn-small btn-ghost">Open Community group</Link></div> : null}</section>)}</div> : <div className="empty"><strong>No conventions listed yet.</strong><span>Return to Events to discover smaller gatherings.</span><Link href="/events" className="btn btn-small btn-pink">See Events</Link></div>}</div>;
}
