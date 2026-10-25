"use client";

import Link from "next/link";
import { useState } from "react";
import { JoinButton, RsvpButton } from "@/components/ToggleButtons";
import { KEYS, useLocalSet } from "@/lib/store";
import { getMerchData } from "@/lib/data/merch/merchData";
import {
  eventAttendees, eventGroups, eventRecaps, getCity, getFranchise, getGroup, getHost,
  type EventItem,
} from "@/lib/data/events/eventsData";

const arrivalAreas = ["Connaught Place", "Hauz Khas", "Chandigarh Sector 17", "Bandra", "Koregaon Park"];
const joinedGroups = ["anime-ost-lovers", "manga-sunday", "cozy-gamers"];

function dateLabel(event: EventItem) {
  const start = new Intl.DateTimeFormat("en-IN", { weekday: "long", month: "long", day: "numeric" }).format(new Date(`${event.date}T12:00:00`));
  return event.endDate ? `${start} – ${new Intl.DateTimeFormat("en-IN", { month: "long", day: "numeric" }).format(new Date(`${event.endDate}T12:00:00`))}` : start;
}

function MockQr() {
  return <div className="mock-qr" aria-label="Mock QR code placeholder">{Array.from({ length: 49 }, (_, index) => <i key={index} className={(index * 7 + index % 3) % 5 < 2 ? "on" : ""} />)}</div>;
}

export default function EventDetail({ event }: { event: EventItem }) {
  const host = getHost(event.hostId);
  const city = getCity(event.cityId);
  const group = getGroup(event.groupId);
  const franchise = getFranchise(event.franchiseId);
  const recap = eventRecaps.find((entry) => entry.id === event.recapId);
  const partner = event.partnerBusinessId || event.partnerBusiness ? getMerchData().partners.find((entry) => entry.id === event.partnerBusinessId || entry.name === event.partnerBusiness) : undefined;
  const { items: rsvped, toggle: toggleRsvp } = useLocalSet(KEYS.events);
  const { items: joined, toggle: toggleArrival } = useLocalSet("kizuna.arrivals");
  const { items: waitlisted, toggle: toggleWaitlist } = useLocalSet("kizuna.events.waitlist");
  const { items: checkedIn, toggle: toggleCheckIn } = useLocalSet("kizuna.events.checkins");
  const [reported, setReported] = useState(false);
  const [shared, setShared] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [arrivalArea, setArrivalArea] = useState(arrivalAreas[0]);
  const going = rsvped.includes(event.id);
  const waiting = waitlisted.includes(`waitlist:${event.id}`);
  const arrivalKey = `${event.id}:${arrivalArea}`;
  const inArrival = joined.includes(arrivalKey);
  const isCheckedIn = checkedIn.includes(event.id);
  const groupMembers = event.attendeeIds.filter((id) => id === "mira-01" || id === "dev-02" || id === "isha-03").length;
  const communityPost = group ? "Which opening theme never gets skipped? I am making a long train-ride playlist." : "";
  const isFull = event.status === "Full" || event.spotsLeft === 0;
  const capacityLabel = event.capacity ? `${event.capacity - (event.spotsLeft ?? 0)} of ${event.capacity} spots filled` : "RSVP based";

  const cancel = () => {
    if (going) {
      toggleRsvp(event.id);
      setCancelled(true);
    }
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: event.title, url });
    else {
      await navigator.clipboard?.writeText(url);
      setShared(true);
    }
  };

  const addToCalendar = () => {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${event.date.replaceAll("-", "")}T120000\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: "text/calendar" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${event.id}.ics`;
    link.click();
    URL.revokeObjectURL(href);
  };

  return <div className="event-detail-page">
    <Link href="/events" className="back-link">← Back to Events</Link>
    <header className={`event-detail-hero card ${event.imageTone}`}>
      <div className="event-detail-art" aria-hidden="true"><span>{event.mode === "online" ? "◌" : event.type === "Convention" ? "祭" : "✿"}</span><small>{event.mode === "online" ? "ONLINE" : event.type.toUpperCase()}</small></div>
      <div className="event-detail-heading"><div className="event-card-top"><span className="event-status status-upcoming">{event.status}</span>{event.mode === "online" ? <span className="event-online">Online</span> : null}</div><p className="section-kicker">{event.type}{franchise ? ` · ${franchise.name}` : ""}</p><h1 className="h-page">{event.title}</h1><div className="detail-meta"><span>◷ {dateLabel(event)}</span><span>◌ {event.time}</span><span>⌖ {event.area}</span></div><p className="event-host"><span className="host-avatar">{host?.initials}</span> Hosted by <strong>{host?.name}</strong> <span className="verified-host">✓ Verified Host</span></p></div>
    </header>

    <div className="event-detail-layout">
      <main className="event-detail-main">
        <section className="detail-section"><p className="section-kicker">THE PLAN</p><h2 className="h-section">What to expect</h2><p>{event.description} It is made for curious fans who want a low-pressure way to meet, talk and make the next plan together.</p><p>Bring your favourite recommendation, a comfortable layer and the willingness to say hello. This is a community gathering, not a ticketed production.</p></section>
        <section className="detail-section host-detail card c-cream"><div className="detail-avatar">{host?.initials}</div><div><p className="section-kicker">YOUR HOST</p><h2 className="h-card">{host?.name}</h2><span className="verified-host">✓ Verified Host · Sakura Host Level {event.hostId === "host-tara" ? "3" : "2"}</span><p>{host?.bio}</p><p className="small muted">Has hosted {event.hostId === "host-aiko" ? 8 : event.hostId === "host-meera" ? 6 : 4} community events · demo profile</p></div></section>
        {group ? <section className="detail-section"><p className="section-kicker">THE PEOPLE AROUND IT</p><h2 className="h-section">Community behind this event</h2><div className="linked-group card c-lav"><span className="group-glyph">{group.glyph}</span><div><h3 className="h-card">{group.name}</h3><p className="small muted">A circle for shared discoveries, recommendations and the next meetup.</p><p className="small"><strong>{eventGroups.find((entry) => entry.id === group.id)?.id === group.id ? (group.id === "anime-ost-lovers" ? 316 : 274) : 120} members</strong> · Discussion is already warming up</p></div><Link href={`/community/${group.id}`} className="btn btn-small btn-ghost">View Group</Link><JoinButton id={group.id} className="btn-small" /></div><div className="discussion-preview"><span className="chip">Discussion preview</span><p>“{communityPost || "What are you bringing to the next gathering?"}”</p><Link href={`/community/${group.id}`} className="back-link">Join the conversation →</Link></div></section> : null}
        <section className="detail-section"><p className="section-kicker">ARRIVE TOGETHER</p><h2 className="h-section">Start the day with familiar faces</h2><p className="muted">Choose a broad area, never a precise address. Meet in the public venue area and walk in together.</p><div className="arrival-card card c-mint"><label><span>I'm arriving from</span><select value={arrivalArea} onChange={(entry) => setArrivalArea(entry.target.value)}>{arrivalAreas.map((area) => <option key={area}>{area}</option>)}</select></label><p><strong>{inArrival ? "You and 2 Sakura fans" : "3 Sakura fans"}</strong> are arriving from {arrivalArea}.</p><button type="button" className="btn btn-small btn-pink" onClick={() => toggleArrival(arrivalKey)}>{inArrival ? "Joined arrival group" : "Join arrival group"}</button></div></section>
        {partner ? <section className="detail-section"><p className="section-kicker">LOCAL GOODS, SAME COMMUNITY</p><h2 className="h-section">Partners joining us</h2><div className="partner-event-card card c-peach"><span className="partner-glyph">{partner.glyph}</span><div><h3 className="h-card">{partner.name}</h3><span className="stamp">Sakura Partner · {partner.city}</span><p>{partner.description}</p></div><Link href={`/merch/partner/${partner.id}`} className="btn btn-small btn-ghost">Visit Shop</Link></div></section> : null}
        {recap ? <section className="detail-section recap-detail card c-yellow"><span className="stamp">FROM THE LAST GATHERING</span><h2 className="h-section">{recap.title}</h2><p>{recap.note}</p></section> : null}
      </main>
      <aside className="event-detail-side">
        <section className="rsvp-panel card c-pink"><p className="section-kicker">YOUR PLACE IN THE CIRCLE</p><h2 className="h-section">{isFull && !going ? "This one is full" : going ? "You're going" : "Come along?"}</h2><p className="event-capacity"><strong>{event.spotsLeft ?? "Open"}</strong> spots left · {capacityLabel}</p>{cancelled && !going ? <p className="rsvp-confirmation" role="status">Your spot has been released.</p> : null}{going ? <div className="rsvp-actions"><Link href={`/events/${event.id}/pass`} className="btn btn-mint">View Pass</Link>{event.type === "Watch-along" ? <Link href={`/events/${event.id}/live`} className="btn btn-pink">Open watch-along lobby</Link> : null}<button type="button" className="btn btn-ghost" onClick={addToCalendar}>Add to Calendar</button><button type="button" className="btn btn-ghost" onClick={share}>Share</button><button type="button" className="text-button" onClick={cancel}>Cancel RSVP</button></div> : isFull ? <><button type="button" className="btn btn-pink" onClick={() => toggleWaitlist(`waitlist:${event.id}`)} disabled={waiting}>{waiting ? "On the waitlist" : "Join Waitlist"}</button>{waiting ? <p className="small">We’ll keep your place in this mock queue.</p> : null}</> : <><RsvpButton id={event.id} className="rsvp-large" />{event.type === "Watch-along" ? <p className="small muted">After RSVP, your host-led event lobby will unlock here.</p> : null}</>}</section>
        <section className="detail-section attendees-detail"><p className="section-kicker">PEOPLE YOU MAY KNOW</p><h2 className="h-section">Who’s going</h2><div className="attendee-stack">{event.attendeeIds.slice(0, 6).map((id, index) => <span className={index < groupMembers ? "friend-avatar" : ""} key={id} title={eventAttendees[id]}>{eventAttendees[id]?.slice(0, 1)}</span>)}</div><p><strong>{event.attendeeIds.length} people</strong> are going{group ? ` · ${groupMembers + 9} from ${group.name}` : ""}</p>{going && event.status !== "Past" ? <button type="button" className="btn btn-small btn-mint" onClick={() => toggleCheckIn(event.id)} aria-pressed={isCheckedIn}>{isCheckedIn ? "Checked in" : "Check in when you arrive"}</button> : null}</section>
        <section className="detail-section safety-detail"><p className="section-kicker">LOOKING OUT FOR EACH OTHER</p><h2 className="h-section">Safety first</h2><ul><li>{event.mode === "offline" ? "Public venue area" : "Community-hosted online room"}</li><li>Verified Host</li><li>General-area arrival group</li>{event.ageRule ? <li>Age rule: {event.ageRule}</li> : null}</ul>{event.mode === "online" ? <p className="small muted">Sakura does not stream the content. Watch using your own legal subscription.</p> : null}</section>
        <section className="rights-note"><strong>{event.type === "Convention" ? "Official partner event" : event.franchiseId ? "Fan-run event" : "Community gathering"}</strong><p>Rights belong to their respective creators. Sakura is a discovery and community layer.</p></section>
        <section className="report-detail"><h2 className="h-card">Something off?</h2>{reported ? <p role="status">Thanks — your mock report was recorded for review.</p> : <><label><span className="sr-only">Report reason</span><select value={reportReason} onChange={(entry) => setReportReason(entry.target.value)}><option value="">Report event</option><option>Misleading information</option><option>Unsafe venue</option><option>Incorrect details</option><option>Inappropriate content</option><option>Other</option></select></label><button type="button" className="text-button" disabled={!reportReason} onClick={() => setReported(true)}>Send report</button></>}<button type="button" className="text-button" onClick={() => setBlocked(true)}>{blocked ? "Host blocked on this device" : "Block host"}</button></section>
        <section className="share-detail"><h2 className="h-card">Share to Group</h2><label><span className="sr-only">Choose a group</span><select defaultValue={joinedGroups[0]}><option value="anime-ost-lovers">Anime OST Lovers</option><option value="manga-sunday">Manga Sunday Club</option><option value="cozy-gamers">Cozy Gamers India</option></select></label><button type="button" className="btn btn-small btn-ghost" onClick={() => setShared(true)}>{shared ? "Shared to Group" : "Share event"}</button></section>
      </aside>
    </div>
  </div>;
}
