"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { events } from "@/lib/data/events/eventsData";
import { hostProfile, type HostProposal } from "@/lib/data/events/hostData";

const PROPOSAL_KEY = "kizuna.host.proposals";

export default function HostProfile() {
  const [proposals, setProposals] = useState<HostProposal[]>([]);
  useEffect(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(PROPOSAL_KEY) ?? "[]");
      if (Array.isArray(parsed)) setProposals(parsed);
    } catch {
      setProposals([]);
    }
  }, []);
  const transition = (id: string) => {
    const next = proposals.map((proposal) => proposal.id === id ? { ...proposal, status: "Listed" as const } : proposal);
    setProposals(next);
    window.localStorage.setItem(PROPOSAL_KEY, JSON.stringify(next));
  };
  return <div className="host-page"><Link href="/events" className="back-link">← Back to Events</Link><header className="host-profile-header card c-pink"><div className="detail-avatar">{hostProfile.initials}</div><div><span className="stamp">MY HOST PAGE</span><h1 className="h-page">{hostProfile.name}</h1><p className="verified-host">✓ Verified Host · {hostProfile.level}</p><p className="small muted">{hostProfile.note}</p></div><Link href="/events/host" className="btn btn-pink">Host an event</Link></header><div className="host-profile-sections"><section><div className="events-section-head"><h2 className="h-section">My upcoming events</h2><span className="stamp">{events.filter((event) => event.hostId === "host-meera").length} events</span></div><div className="host-mini-list">{events.filter((event) => event.hostId === "host-meera").map((event) => <article className="card c-cream" key={event.id}><span className="event-status status-upcoming">{event.status}</span><h3 className="h-card"><Link href={`/events/${event.id}`}>{event.title}</Link></h3><p>{event.date} · {event.attendeeIds.length} RSVP</p><span className="small muted">Event status · {event.status}</span></article>)}</div></section><section><div className="events-section-head"><h2 className="h-section">My proposals</h2><span className="stamp">Prototype state</span></div>{proposals.length ? <div className="host-mini-list">{proposals.map((proposal) => <article className="card c-blue" key={proposal.id}><span className={`event-status status-${proposal.status === "Listed" ? "upcoming" : "waitlist"}`}>{proposal.status}</span><h3 className="h-card">{proposal.title}</h3><p>{proposal.eventType} · {proposal.city} · {proposal.date}</p><p className="small muted">Linked to {proposal.groupSlug}</p>{proposal.status === "Pending Review" ? <button type="button" className="btn btn-small btn-pink" onClick={() => transition(proposal.id)}>Mock move to Listed</button> : <Link href={`/events/${proposal.id}`} className="btn btn-small btn-mint">Open Event Detail</Link>}</article>)}</div> : <p className="empty">Your proposed events will appear here after submission.</p>}</section><section className="host-light-stats card c-mint"><strong>{hostProfile.hostedCount}</strong><span>mock events hosted</span><strong>{events.filter((event) => event.hostId === "host-meera").reduce((sum, event) => sum + event.attendeeIds.length, 0)}</strong><span>RSVPs on current events</span></section></div></div>;
}
