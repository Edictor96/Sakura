"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocalSet, KEYS } from "@/lib/store";
import { getCity, getHost, type EventItem } from "@/lib/data/events/eventsData";

export default function EventPass({ event }: { event: EventItem }) {
  const router = useRouter();
  const { has, toggle, ready } = useLocalSet(KEYS.events);
  const going = ready && has(event.id);
  const addToCalendar = () => {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${event.date.replaceAll("-", "")}T120000\nEND:VEVENT\nEND:VCALENDAR`;
    const href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const link = document.createElement("a");
    link.href = href; link.download = `${event.id}.ics`; link.click(); URL.revokeObjectURL(href);
  };
  const cancel = () => {
    if (going) toggle(event.id);
    router.push(`/events/${event.id}`);
  };
  return <div className="event-pass-page"><Link href={`/events/${event.id}`} className="back-link">← Back to event</Link><div className="event-pass card c-pink"><header><span className="sample-note">SAKURA / EVENT PASS</span><div className="brand-name">SAKURA <span aria-hidden="true">桜</span></div><p className="stamp">Mock RSVP · not a ticket or entry verification</p></header><div className="pass-mark" aria-hidden="true">輪</div><h1 className="h-page">{event.title}</h1><div className="pass-details"><p><strong>Attendee</strong><span>Mira Kapoor · demo profile</span></p><p><strong>Date & time</strong><span>{event.date} · {event.time}</span></p><p><strong>Place</strong><span>{event.mode === "online" ? "Online" : `${getCity(event.cityId)?.name} · ${event.area}`}</span></p><p><strong>Host</strong><span>{getHost(event.hostId)?.name} · Verified Host</span></p></div><div className="pass-qr"><div className="mock-qr" aria-label="Visual mock QR placeholder">{Array.from({ length: 49 }, (_, index) => <i key={index} className={(index * 7 + index % 3) % 5 < 2 ? "on" : ""} />)}</div><p>Visual mock only · RSVP status is stored on this device.</p></div><div className="pass-actions"><button type="button" className="btn btn-mint" onClick={addToCalendar}>Add to Calendar</button><button type="button" className="btn btn-ghost" onClick={cancel}>Cancel RSVP</button></div>{!going ? <p className="small error">This pass is not active because the RSVP was cancelled.</p> : null}</div></div>;
}
