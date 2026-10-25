"use client";

import Link from "next/link";
import { formatDate } from "@/lib/format";
import { KEYS, useLocalSet } from "@/lib/store";
import type { CatalogueItem, Dimension, EventItem, Room } from "@/lib/types";
import { CatFace, PixelHeart } from "./Doodles";
import { events as eventCatalogue } from "@/lib/data/events/eventsData";

const DIMENSIONS: { key: Dimension; label: string; color: string }[] = [
  { key: "Anime", label: "Anime", color: "var(--pink)" },
  { key: "Manga", label: "Manga", color: "var(--peach)" },
  { key: "Music", label: "Music", color: "var(--lav)" },
  { key: "Gaming", label: "Gaming", color: "var(--blue)" },
  { key: "Cinema", label: "Cinema", color: "var(--mint)" },
  { key: "Fashion", label: "Fashion and lifestyle", color: "var(--yellow)" },
];

interface Props {
  rooms: Room[];
  events: EventItem[];
  items: CatalogueItem[];
}

export default function PassportView({ rooms, events, items }: Props) {
  const joined = useLocalSet(KEYS.rooms);
  const going = useLocalSet(KEYS.events);
  const saved = useLocalSet(KEYS.saved);

  const myRooms = rooms.filter((r) => joined.items.includes(r.slug));
  const myEvents = events.filter((e) => going.items.includes(e.id));
  const mySaved = items.filter((i) => saved.items.includes(i.id));
  const savedEvents = eventCatalogue.filter((event) => going.items.includes(event.id));
  const upcomingEvents = savedEvents.filter((event) => event.status !== "Past");
  const pastEvents = savedEvents.filter((event) => event.status === "Past");
  const cityRooms = myRooms.filter((r) => r.kind === "city");

  const tally = (d: Dimension) => myRooms.filter((r) => r.dimension === d).length;
  const max = Math.max(1, ...DIMENSIONS.map((d) => tally(d.key)));
  const empty = myRooms.length + myEvents.length + mySaved.length === 0;

  return (
    <div>
      <div className="passport-head card c-lav wob3">
        <CatFace size={72} />
        <div>
          <h2 className="h-card">Who you are here</h2>
          <p className="muted">
            Not what you clicked. Who you are in this culture. It fills up as you join rooms, go to
            events and save titles.
          </p>
        </div>
      </div>

      {empty ? (
        <p className="empty">
          Nothing stamped yet. <Link href="/rooms">Join a room</Link> or{" "}
          <Link href="/events">pick an event</Link> to start.
        </p>
      ) : null}

      <section aria-labelledby="sides" className="block">
        <h2 id="sides" className="h-section">Your six sides</h2>
        <ul className="bars">
          {DIMENSIONS.map((d) => {
            const n = tally(d.key);
            return (
              <li key={d.key}>
                <span className="bar-label">{d.label}</span>
                <span className="bar-track" role="img" aria-label={`${d.label}: ${n} ${n === 1 ? "room" : "rooms"}`}>
                  <span className="bar-fill" style={{ width: `${(n / max) * 100}%`, background: d.color }} />
                </span>
                <span className="bar-n">{n}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="event-journey" className="block">
        <div className="explore-section-head"><h2 id="event-journey" className="h-section">Events in your Sakura</h2><Link href="/events" className="small">Open My Events →</Link></div>
        {upcomingEvents.length ? <div className="chips">{upcomingEvents.map((event) => <Link href={`/events/${event.id}`} className="chip chip-link" key={event.id}>{event.title}</Link>)}</div> : <p className="muted">Upcoming events you RSVP to will appear here.</p>}
        {pastEvents.length ? <p className="small muted">Past Events: {pastEvents.map((event) => <span key={event.id}> <Link href={`/events/${event.id}`}>{event.title}</Link> ·</span>)}</p> : null}
        <p className="small muted">Participation badges are earned by showing up, joining discussions and completing watch-along moments.</p>
      </section>

      <section aria-labelledby="stamps" className="block">
        <h2 id="stamps" className="h-section">Event stamps</h2>
        {myEvents.length === 0 ? (
          <p className="muted">Events you say you're going to appear here as stamps.</p>
        ) : (
          <ul className="stamps">
            {myEvents.map((e, i) => (
              <li key={e.id} className="stamp" style={{ transform: `rotate(${(i % 3) * 3 - 3}deg)` }}>
                <PixelHeart size={18} />
                <strong>{e.title}</strong>
                <span className="small">{formatDate(e.date)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="my-rooms" className="block">
        <h2 id="my-rooms" className="h-section">Rooms you're in</h2>
        {myRooms.length === 0 ? (
          <p className="muted">No rooms yet.</p>
        ) : (
          <ul className="chips">
            {myRooms.map((r) => (
              <li key={r.slug}>
                <Link href={`/rooms/${r.slug}`} className="chip chip-link">{r.name}</Link>
              </li>
            ))}
          </ul>
        )}
        {cityRooms.length > 0 ? (
          <p className="small muted">Home city: {cityRooms.map((r) => r.name.replace("KIZUNA ", "")).join(", ")}</p>
        ) : null}
      </section>

      <section aria-labelledby="my-saved" className="block">
        <h2 id="my-saved" className="h-section">Saved titles</h2>
        {mySaved.length === 0 ? (
          <p className="muted">Save anime, music or games from Discover.</p>
        ) : (
          <ul className="chips">
            {mySaved.map((i) => (
              <li key={i.id}>
                <Link href={`/discover/${i.id}`} className="chip chip-link">{i.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="merch-shelf" className="block">
        <h2 id="merch-shelf" className="h-section">Your Merch shelf</h2>
        <p className="muted">Keep your saved pieces, maker follows and order trail close.</p>
        <div className="chips">
          <Link href="/merch/wishlist" className="chip chip-link">Wishlist</Link>
          <Link href="/merch/orders" className="chip chip-link">Orders</Link>
          <Link href="/merch" className="chip chip-link">Meet makers</Link>
        </div>
      </section>
    </div>
  );
}
