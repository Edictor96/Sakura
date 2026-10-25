"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { hostCities, hostEventTypes, type HostProposal } from "@/lib/data/events/hostData";
import type { CommunityGroup } from "@/lib/data/community/communityData";

type SafetyAnswer = { franchise: boolean; venue: boolean; screening: boolean; ageRule: boolean; partner: boolean };
const initialSafety: SafetyAnswer = { franchise: false, venue: true, screening: false, ageRule: false, partner: false };
const PROPOSAL_KEY = "kizuna.host.proposals";

function getStatus(answers: SafetyAnswer, eventType: string) {
  if (answers.screening && eventType !== "Watch-Along") return { label: "Not allowed", tone: "not-allowed", explanation: "Sakura cannot approve or host an unlicensed screening, stream, rebroadcast, or video file. Remove that activity or use a legal watch-along format." };
  if (answers.partner) return { label: "Needs clearance", tone: "needs-clearance", explanation: "Official partner status needs to be confirmed outside Sakura. This prototype cannot grant legal rights." };
  if (answers.franchise && !answers.venue) return { label: "Needs clearance", tone: "needs-clearance", explanation: "Franchise-specific events should use a visible public venue and clear host context before review." };
  return { label: "Allowed", tone: "allowed", explanation: eventType === "Watch-Along" ? "Allowed as a scheduled event experience. Attendees watch using their own legal subscriptions; Sakura does not stream the content." : "A fan meetup or discussion format can proceed to mock review with the safety details shown." };
}

export default function HostEventForm({ groups, initialGroup }: { groups: CommunityGroup[]; initialGroup?: string }) {
  const selectedInitialGroup = groups.some((group) => group.slug === initialGroup) ? initialGroup ?? "" : "";
  const [form, setForm] = useState({ title: "", eventType: "Micro Meet", franchise: "", date: "", time: "", venue: "", city: "Delhi", capacity: "20", description: "", groupSlug: selectedInitialGroup, partnerBusiness: "" });
  const [safety, setSafety] = useState<SafetyAnswer>(initialSafety);
  const [submitted, setSubmitted] = useState<HostProposal | null>(null);
  const status = useMemo(() => getStatus(safety, form.eventType), [form.eventType, safety]);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const check = (key: keyof SafetyAnswer) => setSafety((current) => ({ ...current, [key]: !current[key] }));
  const canSubmit = Boolean(form.title.trim() && form.date && form.time && form.city && form.capacity && form.description.trim() && form.groupSlug && status.label !== "Not allowed");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    const proposal: HostProposal = { ...form, id: `host-proposal-${Date.now()}`, capacity: Number(form.capacity), status: "Pending Review", submittedAt: new Date().toISOString() };
    try {
      const existing = JSON.parse(window.localStorage.getItem(PROPOSAL_KEY) ?? "[]");
      window.localStorage.setItem(PROPOSAL_KEY, JSON.stringify([proposal, ...(Array.isArray(existing) ? existing : [])]));
    } catch {
      // The confirmation still represents the local prototype state for this view.
    }
    setSubmitted(proposal);
  };

  if (submitted) return <div className="host-page"><Link href="/events" className="back-link">← Back to Events</Link><section className="host-confirmation card c-mint"><span className="sample-note">MOCK SUBMISSION</span><h1 className="h-page">Pending Review</h1><p className="lede">Your proposal is with the Sakura community team for a safety and rights check.</p><div className="host-submission-summary"><strong>{submitted.title}</strong><span>{submitted.eventType} · {submitted.city} · {submitted.date}</span><span>Linked to {groups.find((group) => group.slug === submitted.groupSlug)?.name}</span></div><p className="small muted">Prototype only. Pending Review does not mean Sakura has granted legal clearance or venue approval.</p><div className="host-confirmation-actions"><Link href="/events/host/me" className="btn btn-pink">Open host page</Link><Link href={`/events/host?group=${submitted.groupSlug}`} className="btn btn-ghost">Propose another</Link></div></section></div>;

  return <div className="host-page"><Link href="/events" className="back-link">← Back to Events</Link><header className="host-page-header"><span className="sample-note">SAKURA / HOST TOOLS</span><h1 className="h-page">Host an event</h1><p className="lede">Give your community a reason to step out, log on or stay a little longer.</p><p className="small muted">A lightweight proposal flow for Verified Hosts — no tickets, payments or payouts.</p></header><form className="host-form" onSubmit={submit}><section className="host-form-section card c-cream"><p className="section-kicker">01 · THE PLAN</p><h2 className="h-section">Tell us about it</h2><div className="host-form-grid"><label className="full"><span>Title</span><input value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="e.g. Manga and chai in the park" required /></label><label><span>Event type</span><select value={form.eventType} onChange={(event) => update("eventType", event.target.value)}>{hostEventTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label><span>Franchise or interest <small>(optional)</small></span><input value={form.franchise} onChange={(event) => update("franchise", event.target.value)} placeholder="e.g. Frieren, J-music" /></label><label><span>Date</span><input type="date" value={form.date} onChange={(event) => update("date", event.target.value)} required /></label><label><span>Time</span><input type="time" value={form.time} onChange={(event) => update("time", event.target.value)} required /></label><label><span>City</span><select value={form.city} onChange={(event) => update("city", event.target.value)}>{hostCities.map((city) => <option key={city}>{city}</option>)}</select></label><label><span>Capacity</span><input type="number" min="2" max="200" value={form.capacity} onChange={(event) => update("capacity", event.target.value)} required /></label><label className="full"><span>Venue or general area <small>(no private address)</small></span><input value={form.venue} onChange={(event) => update("venue", event.target.value)} placeholder="e.g. Hauz Khas public café" /></label><label className="full"><span>Description</span><textarea value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="What will happen, who is it for, and what should people bring?" rows={5} required /></label><label><span>Community group</span><select value={form.groupSlug} onChange={(event) => update("groupSlug", event.target.value)} required><option value="">Choose a group</option>{groups.map((group) => <option key={group.slug} value={group.slug}>{group.name}</option>)}</select></label><label><span>Partner business <small>(optional)</small></span><input value={form.partnerBusiness} onChange={(event) => update("partnerBusiness", event.target.value)} placeholder="Only if already relevant" /></label></div>{selectedInitialGroup ? <p className="host-prefilled" role="status">Community pre-selected from {groups.find((group) => group.slug === selectedInitialGroup)?.name}. You can keep it or choose another group.</p> : null}</section>
      <section className="host-form-section card c-blue"><p className="section-kicker">02 · SAFETY + RIGHTS CHECK</p><h2 className="h-section">Make the edges clear</h2><p className="muted">This check is a prototype guardrail. It cannot grant rights, approve venues or replace legal advice.</p><div className="host-checks"><label><input type="checkbox" checked={safety.franchise} onChange={() => check("franchise")} /> Is this franchise-specific?</label><label><input type="checkbox" checked={safety.venue} onChange={() => check("venue")} /> Is this a public venue?</label><label><input type="checkbox" checked={safety.screening} onChange={() => check("screening")} /> Does it involve screening/streaming copyrighted content?</label><label><input type="checkbox" checked={safety.ageRule} onChange={() => check("ageRule")} /> Is an age rule required?</label><label><input type="checkbox" checked={safety.partner} onChange={() => check("partner")} /> Is this an official partner event?</label></div><div className={`safety-result ${status.tone}`} role="status"><strong>{status.label}</strong><p>{status.explanation}</p></div>{form.eventType === "Watch-Along" ? <p className="legal-notice">Attendees watch using their own legal subscriptions. Sakura does not stream, rebroadcast or host the content.</p> : null}<div className="public-venue-note"><strong>First-time offline host?</strong><span>Choose a public venue, use a clear age rule, keep the host visible and offer a broad-area group arrival option.</span></div></section>
      <button type="submit" className="btn btn-pink host-submit" disabled={!canSubmit}>Submit for Review</button><p className="small muted host-submit-note">No ticket price, payment or payout fields exist in this flow.</p></form></div>;
}
