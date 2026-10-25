"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RsvpButton } from "@/components/ToggleButtons";
import { KEYS, useLocalSet } from "@/lib/store";
import {
  eventCities, eventFranchises, getCity, getFranchise, getGroup, getHost,
  type EventItem, type EventStatus, type EventType,
} from "@/lib/data/events/eventsData";

type Tab = "For You" | "Offline" | "Online" | "Conventions";
type DateFilter = "all" | "week" | "month";
const CITY_KEY = "kizuna.events.city";
const tabs: Tab[] = ["For You", "Offline", "Online", "Conventions"];
const types: Array<"all" | EventType> = ["all", "Micro Meet", "City Event", "Pop-up", "Cosplay Walk", "Manga Circle", "Watch-along", "In-game Companion", "Convention"];

function formatEventDate(date: string, endDate?: string) {
  const start = new Date(`${date}T12:00:00`);
  const formatter = new Intl.DateTimeFormat("en-IN", { weekday: "short", month: "short", day: "numeric" });
  return endDate ? `${formatter.format(start)} – ${formatter.format(new Date(`${endDate}T12:00:00`))}` : formatter.format(start);
}

function statusClass(status: EventStatus) {
  return status.toLowerCase().replaceAll(" ", "-");
}

export function EventCard({ event }: { event: EventItem }) {
  const host = getHost(event.hostId);
  const city = getCity(event.cityId);
  const franchise = getFranchise(event.franchiseId);
  const group = getGroup(event.groupId);
  return (
    <article className={`event-card card ${event.imageTone} wob2`}>
      <div className="event-visual" aria-hidden="true"><span>{event.mode === "online" ? "◌" : event.type === "Convention" ? "祭" : "✿"}</span><i>{event.mode === "online" ? "ONLINE" : event.type.toUpperCase()}</i></div>
      <div className="event-card-body">
        <div className="event-card-top"><span className={`event-status status-${statusClass(event.status)}`}>{event.status}</span>{event.mode === "online" ? <span className="event-online">Online</span> : null}</div>
        <h3 className="h-card"><Link href={`/events/${event.id}`}>{event.title}</Link></h3>
        <div className="event-meta">
          <span>{formatEventDate(event.date, event.endDate)}</span>
          <span>{event.time}</span>
          <span>{city?.name === "Online" ? "Online" : `${city?.name ?? "India"} · ${event.area}`}</span>
        </div>
        <p className="event-host"><span className="host-avatar" aria-hidden="true">{host?.initials}</span> Hosted by <strong>{host?.name}</strong> <span className="verified-host" title="Verified Host">✓ Verified Host</span></p>
        <div className="chips event-badges">
          {franchise ? <span className="chip">{franchise.name}</span> : null}
          {group ? <span className="chip">{group.name}</span> : null}
          {event.venueLabel && event.mode !== "online" ? <span className="chip">{event.venueLabel}</span> : null}
        </div>
        <div className="event-card-bottom">
          <div className="event-capacity"><strong>{event.attendeeIds.length}</strong> going <span aria-hidden="true">·</span> <strong>{event.spotsLeft === 0 ? "Waitlist" : `${event.spotsLeft} spots`}</strong></div>
          {event.type === "Convention" ? <a className="btn btn-small btn-ghost" href={event.externalUrl} target="_blank" rel="noreferrer">Visit site ↗</a> : <RsvpButton id={event.id} className="btn-small" />}
        </div>
      </div>
    </article>
  );
}

function EventSkeleton() {
  return <div className="event-skeleton-grid" aria-label="Loading events">{[1, 2, 3].map((item) => <div className="event-skeleton card" key={item}><span /><span /><span /></div>)}</div>;
}

function EmptyEvents() {
  return <div className="empty event-empty"><strong>No events match this.</strong><span>Try another city or remove a filter.</span></div>;
}

export default function EventsHome({ events }: { events: EventItem[] }) {
  const [city, setCity] = useState("delhi");
  const [tab, setTab] = useState<Tab>("For You");
  const [query, setQuery] = useState("");
  const [franchise, setFranchise] = useState("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [type, setType] = useState<"all" | EventType>("all");
  const [loading, setLoading] = useState(true);
  const [showMine, setShowMine] = useState(false);
  const { items: rsvpedEvents } = useLocalSet(KEYS.events);

  useEffect(() => {
    const stored = window.localStorage.getItem(CITY_KEY);
    if (stored && eventCities.some((entry) => entry.id === stored)) setCity(stored);
    const timer = window.setTimeout(() => setLoading(false), 280);
    return () => window.clearTimeout(timer);
  }, []);

  const selectCity = (value: string) => {
    setCity(value);
    window.localStorage.setItem(CITY_KEY, value);
  };

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesCity = city === "all" || event.cityId === city;
      const matchesTab = tab === "For You" ? matchesCity || event.groupId === "anime-ost-lovers" || event.groupId === "manga-sunday" : tab === "Offline" ? event.mode === "offline" && matchesCity : tab === "Online" ? event.mode === "online" : event.mode === "convention";
      const matchesSearch = !normalized || [event.title, event.description, event.area, getHost(event.hostId)?.name, getFranchise(event.franchiseId)?.name, getGroup(event.groupId)?.name].filter(Boolean).join(" ").toLowerCase().includes(normalized);
      const matchesFranchise = franchise === "all" || event.franchiseId === franchise;
      const eventDate = new Date(`${event.date}T12:00:00`).getTime();
      const now = new Date("2026-10-25T12:00:00").getTime();
      const matchesDate = dateFilter === "all" || (dateFilter === "week" ? eventDate <= now + 7 * 86400000 : eventDate <= now + 31 * 86400000);
      const matchesType = type === "all" || event.type === type;
      return matchesTab && matchesSearch && matchesFranchise && matchesDate && matchesType && (!showMine || rsvpedEvents.includes(event.id));
    });
  }, [city, dateFilter, events, franchise, query, rsvpedEvents, showMine, tab, type]);

  const weekEvents = filtered.filter((event) => {
    const start = new Date("2026-10-25T12:00:00").getTime();
    const date = new Date(`${event.date}T12:00:00`).getTime();
    return date >= start && date <= start + 7 * 86400000;
  });
  const nearby = filtered.filter((event) => city === "all" || event.cityId === city).slice(0, 4);
  const groupEvents = filtered.filter((event) => event.groupId).slice(0, 4);
  const conventions = filtered.filter((event) => event.mode === "convention");
  const section = (id: string, title: string, note: string, items: EventItem[]) => <section className="events-section" aria-labelledby={id}><div className="events-section-head"><div><p className="section-kicker">{note}</p><h2 id={id} className="h-section">{title}</h2></div><span className="stamp">{items.length} {items.length === 1 ? "event" : "events"}</span></div>{items.length ? <div className="event-grid">{items.map((event) => <EventCard key={event.id} event={event} />)}</div> : <EmptyEvents />}</section>;

  return (
    <div className="events-page">
      <header className="events-hero">
        <div className="events-hero-copy"><span className="sample-note">SAKURA / EVENTS</span><h1 className="h-hero">Find your people.<br /><em>Meet them in real life.</em></h1><p className="lede">Small rooms, shared obsessions, and plans worth leaving the house for.</p></div>
        <div className="events-hero-orbit" aria-hidden="true"><span>輪</span><small>ARRIVE<br />TOGETHER</small></div>
        <div className="events-header-actions"><label className="events-search"><span className="sr-only">Search events</span><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setShowMine(false); }} placeholder="Search a vibe, title or host..." /></label><button type="button" className={`btn btn-ghost my-events ${showMine ? "is-active" : ""}`} onClick={() => setShowMine((current) => !current)} aria-pressed={showMine}>♡ My Events</button><Link href="/events/conventions" className="btn btn-ghost">Conventions</Link><Link href="/events/host" className="btn btn-pink">Host an event</Link></div>
      </header>

      <section className="events-toolbar" aria-label="Event discovery controls">
        <label className="city-select"><span>I'm looking around</span><select value={city} onChange={(event) => selectCity(event.target.value)} aria-label="Choose a city"><option value="all">All cities</option>{eventCities.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}{entry.kind === "online" ? " · join from anywhere" : ""}</option>)}</select></label>
        <div className="event-tabs" role="tablist" aria-label="Event collection">{tabs.map((entry) => <button type="button" role="tab" aria-selected={tab === entry} className={tab === entry ? "is-active" : ""} key={entry} onClick={() => setTab(entry)}>{entry}</button>)}</div>
      </section>

      <section className="events-filters" aria-label="Filter events"><label><span>Franchise</span><select value={franchise} onChange={(event) => setFranchise(event.target.value)}><option value="all">Any franchise</option>{eventFranchises.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label><label><span>Date</span><select value={dateFilter} onChange={(event) => setDateFilter(event.target.value as DateFilter)}><option value="all">Any date</option><option value="week">This week</option><option value="month">Next 30 days</option></select></label><label><span>Event type</span><select value={type} onChange={(event) => setType(event.target.value as "all" | EventType)}>{types.map((entry) => <option key={entry} value={entry}>{entry === "all" ? "Any type" : entry}</option>)}</select></label></section>

      {loading ? <EventSkeleton /> : <div className="events-content">{section("week-heading", "Happening this week", "RIGHT NOW", weekEvents)}{section("near-heading", "Near you", getCity(city)?.name ?? "Your city", nearby)}{section("groups-heading", "Popular with your groups", "FROM YOUR COMMUNITIES", groupEvents)}<section className="events-section convention-section" aria-labelledby="conventions-heading"><div className="events-section-head"><div><p className="section-kicker">PARTNER DISCOVERY</p><h2 id="conventions-heading" className="h-section">Upcoming conventions</h2></div><span className="convention-note">Sakura is your layer around the big day</span></div>{conventions.length ? <div className="event-grid">{conventions.map((event) => <EventCard key={event.id} event={event} />)}</div> : <EmptyEvents />}</section></div>}
    </div>
  );
}
