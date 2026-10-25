"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { HostProposal } from "@/lib/data/events/hostData";

const PROPOSAL_KEY = "kizuna.host.proposals";

export default function LocalProposalDetail({ id }: { id: string }) {
  const [proposal, setProposal] = useState<HostProposal>();
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(PROPOSAL_KEY) ?? "[]");
      setProposal(Array.isArray(saved) ? saved.find((entry) => entry.id === id) : undefined);
    } catch {
      setProposal(undefined);
    }
  }, [id]);
  if (!proposal) return <div className="event-detail-page"><Link href="/events/host/me" className="back-link">← Back to host page</Link><p className="empty">This local proposal is only available on the device where it was submitted.</p></div>;
  return <div className="event-detail-page"><Link href="/events" className="back-link">← Back to Events</Link><header className="event-detail-hero card c-blue"><div className="event-detail-art" aria-hidden="true"><span>✿</span><small>{proposal.eventType.toUpperCase()}</small></div><div className="event-detail-heading"><div className="event-card-top"><span className={`event-status status-${proposal.status === "Listed" ? "upcoming" : "waitlist"}`}>{proposal.status}</span></div><p className="section-kicker">COMMUNITY PROPOSAL · {proposal.city}</p><h1 className="h-page">{proposal.title}</h1><div className="detail-meta"><span>◷ {proposal.date}</span><span>◌ {proposal.time}</span><span>⌖ {proposal.venue || "General area"}</span></div><p className="event-host"><span className="host-avatar">MK</span> Hosted by <strong>Mira Kapoor</strong> <span className="verified-host">✓ Verified Host</span></p></div></header><div className="event-detail-layout"><main className="event-detail-main"><section className="detail-section"><p className="section-kicker">THE PLAN</p><h2 className="h-section">What to expect</h2><p>{proposal.description}</p><p className="small muted">Capacity: {proposal.capacity} · Linked Community group: {proposal.groupSlug}</p></section><section className="rights-note"><strong>Prototype listing</strong><p>This event is locally stored for the prototype. Listing status does not grant legal rights or venue approval.</p></section></main><aside className="event-detail-side"><section className="rsvp-panel card c-pink"><p className="section-kicker">EVENT STATUS</p><h2 className="h-section">{proposal.status}</h2><p>RSVP controls become available when a backend listing is connected.</p><Link href="/events/host/me" className="btn btn-pink">Back to host page</Link></section><section className="safety-detail"><p className="section-kicker">SAFETY + RIGHTS</p><p>Keep the host visible, use a public venue and do not screen, stream or rebroadcast copyrighted content without appropriate clearance.</p></section></aside></div></div>;
}
