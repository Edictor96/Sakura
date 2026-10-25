"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { KEYS, useLocalSet } from "@/lib/store";
import { eventAttendees, getCity, getGroup, getHost, type EventItem } from "@/lib/data/events/eventsData";
import type { WatchAlongData, WatchAlongPhase } from "@/lib/data/events/watchAlongData";

const phaseOrder: WatchAlongPhase[] = ["Upcoming", "Welcome", "Watching", "Poll Live", "Discussion Break", "Trivia", "Closing", "Ended"];
const phaseClass = (phase: WatchAlongPhase) => phase.toLowerCase().replaceAll(" ", "-");

function CalendarButton({ event }: { event: EventItem }) {
  const addToCalendar = () => {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${event.date.replaceAll("-", "")}T190000\nEND:VEVENT\nEND:VCALENDAR`;
    const href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const link = document.createElement("a");
    link.href = href; link.download = `${event.id}.ics`; link.click(); URL.revokeObjectURL(href);
  };
  return <button type="button" className="btn btn-small btn-ghost" onClick={addToCalendar}>Add to Calendar</button>;
}

export default function WatchAlong({ event, data }: { event: EventItem; data: WatchAlongData }) {
  const host = getHost(event.hostId);
  const group = getGroup(event.groupId);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const [pollChoice, setPollChoice] = useState("");
  const [triviaChoice, setTriviaChoice] = useState("");
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaAnswered, setTriviaAnswered] = useState(false);
  const [discussionSeconds, setDiscussionSeconds] = useState(300);
  const [reaction, setReaction] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const { items: rsvped } = useLocalSet(KEYS.events);
  const phase = phaseOrder[phaseIndex];
  const currentAgenda = data.agenda[phaseIndex] ?? data.agenda[data.agenda.length - 1];
  const poll = data.polls.find((entry) => entry.agendaIndex === phaseIndex) ?? data.polls[0];
  const trivia = data.trivia.find((entry) => entry.agendaIndex === phaseIndex) ?? data.trivia[0];
  const feed = useMemo(() => data.announcements.map((body, index) => ({ id: `announcement-${index}`, type: "announcement", body, agendaIndex: Math.min(index, 7) })).filter((entry) => entry.agendaIndex <= phaseIndex), [data.announcements, phaseIndex]);

  useEffect(() => {
    if (!started || phase === "Ended") return;
    const timer = window.setInterval(() => {
      setCountdown((current) => current > 0 ? current - 1 : 10);
      if (phase === "Discussion Break") setDiscussionSeconds((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, started]);

  const advance = () => {
    setStarted(true);
    setPhaseIndex((current) => Math.min(current + 1, phaseOrder.length - 1));
    setCountdown(10);
    if (phase === "Poll Live" && !milestones.includes("Participated in first poll")) setMilestones((current) => [...current, "Participated in first poll"]);
    if (phase === "Trivia" && triviaAnswered && !milestones.includes("Completed trivia")) setMilestones((current) => [...current, "Completed trivia"]);
    if (phase === "Closing" && !milestones.includes("Stayed until the end")) setMilestones((current) => [...current, "Stayed until the end"]);
  };

  const submitTrivia = () => {
    if (triviaAnswered || !triviaChoice) return;
    setTriviaAnswered(true);
    if (triviaChoice === trivia.answer) setTriviaScore((current) => current + 1);
  };

  const completeDiscussion = () => {
    setDiscussionSeconds(0);
    advance();
  };

  return <div className="watch-along-page">
    <Link href={`/events/${event.id}`} className="back-link">← Back to event</Link>
    <header className={`watch-along-hero card ${event.imageTone}`}>
      <div><span className="sample-note">SAKURA / WATCH-ALONG</span><p className="section-kicker">{phase === "Upcoming" ? "EVENT LOBBY" : `LIVE EVENT · ${phase.toUpperCase()}`}</p><h1 className="h-page">{event.title}</h1><p className="lede">A scheduled, host-led experience. Sakura synchronizes the moments around the content — never the content itself.</p></div>
      <div className="watch-countdown"><span>{phase === "Upcoming" ? "STARTS IN" : "NEXT MOMENT"}</span><strong>{started ? `0:${String(countdown).padStart(2, "0")}` : "10:00"}</strong><small>{currentAgenda?.label}</small></div>
      <div className="watch-host"><span className="detail-avatar">{host?.initials}</span><div><strong>{host?.name}</strong><span className="verified-host">✓ Verified Host</span><small>{event.time} · {event.attendeeIds.length + 8} attendees</small></div></div>
    </header>

    {!started ? <section className="watch-lobby card c-cream"><div><p className="section-kicker">BEFORE WE BEGIN</p><h2 className="h-section">Make a little room for the moment.</h2><p>Bring your own legal subscription, arrive a few minutes early and follow the host-led rhythm. There is no video player here — your watch happens in your own app.</p></div><div className="watch-lobby-actions"><CalendarButton event={event} /><Link href={`/events/${event.id}/pass`} className="btn btn-small btn-mint">Event Pass</Link><button type="button" className="btn btn-pink" onClick={() => { setStarted(true); setMilestones(["Joined early"]); }}>Enter mock lobby</button></div></section> : null}

    <div className="watch-along-layout">
      <main className="watch-along-main">
        <section className="watch-current card c-pink" aria-live="polite"><div className="watch-current-label"><span className={`event-status status-${phaseClass(phase)}`}>{phase}</span><span className="stamp">HOST-LED MOMENT</span></div><h2 className="h-section">{phase === "Upcoming" ? "Doors are opening soon" : phase === "Welcome" ? "Welcome to the room" : phase === "Watching" ? "Start watching now" : phase === "Poll Live" ? poll.question : phase === "Discussion Break" ? "5-minute discussion" : phase === "Trivia" ? "30-second Sakura Trivia" : phase === "Closing" ? "Final round" : "Event Complete"}</h2><p>{phase === "Upcoming" ? "Get your subscription ready. The host will start the shared event state here." : phase === "Watching" ? "You're watching together. Sakura is keeping time for the next shared moment." : phase === "Discussion Break" ? data.discussionPrompts[0] : phase === "Trivia" ? trivia.question : phase === "Poll Live" ? "Cast your vote before the host closes this moment." : phase === "Ended" ? "The live interaction is closed. The highlights and results are saved below." : data.announcements[Math.min(phaseIndex, data.announcements.length - 1)]}</p>{phase === "Watching" ? <div className="start-watching"><strong>Start watching now</strong><span>Watch using your own legal subscription.</span></div> : null}{phase === "Discussion Break" ? <div className="discussion-timer"><strong>{Math.floor(discussionSeconds / 60)}:{String(discussionSeconds % 60).padStart(2, "0")}</strong><span>Discuss, then return when the host calls you back.</span><button type="button" className="btn btn-small btn-ghost" onClick={completeDiscussion}>Done discussing</button></div> : null}</section>

        {phase === "Poll Live" ? <section className="watch-interaction card c-lav"><p className="section-kicker">LIVE POLL · {poll.participants + (pollChoice ? 1 : 0)} PARTICIPANTS</p><h2 className="h-card">{poll.question}</h2><div className="watch-options">{poll.options.map((option, index) => <button type="button" key={option} className={pollChoice === option ? "selected" : ""} onClick={() => setPollChoice(option)}><span>{option}</span><b>{poll.results[index]}%</b></button>)}</div><p className="small muted">Results are mock local data and reflect the room’s current pulse.</p></section> : null}
        {phase === "Trivia" ? <section className="watch-interaction card c-yellow"><p className="section-kicker">TRIVIA · SCORE {triviaScore}/1</p><h2 className="h-card">{trivia.question}</h2><div className="watch-options">{trivia.options.map((option) => <button type="button" key={option} className={triviaChoice === option ? "selected" : ""} disabled={triviaAnswered} onClick={() => setTriviaChoice(option)}><span>{option}</span>{triviaAnswered ? <b>{option === trivia.answer ? "Correct" : option === triviaChoice ? "Not quite" : ""}</b> : null}</button>)}</div><button type="button" className="btn btn-small btn-pink" disabled={!triviaChoice || triviaAnswered} onClick={submitTrivia}>{triviaAnswered ? "Answer recorded" : "Lock answer"}</button></section> : null}
        {phase !== "Ended" ? <section className="watch-reaction-row"><strong>React to this moment</strong>{data.reactions.map((emoji) => <button type="button" className={reaction === emoji ? "is-reacted" : ""} key={emoji} onClick={() => setReaction(reaction === emoji ? null : emoji)} aria-label={`React ${emoji}`}>{emoji}</button>)}{reaction ? <span className="reaction-burst" role="status">{reaction} · room pulse updated</span> : null}</section> : null}

        {phase === "Ended" ? <section className="watch-recap card c-mint"><p className="section-kicker">EVENT RECAP</p><h2 className="h-section">Your Watch-Along Score: {triviaScore}/1</h2><p>{data.recap.attendance} people attended · {pollChoice ? "you participated in the first poll" : "the poll is saved in the recap"}.</p><ul>{data.recap.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul><p><strong>Host summary:</strong> {data.recap.hostSummary}</p><div className="watch-recap-actions">{group ? <Link href={`/community/${group.id}`} className="btn btn-mint">Keep the conversation going</Link> : null}<Link href="/events" className="btn btn-ghost">See next events</Link></div></section> : null}

        <section className="watch-feed" aria-labelledby="feed-heading"><div className="watch-section-head"><div><p className="section-kicker">TEMPORARY EVENT FEED</p><h2 id="feed-heading" className="h-section">What’s happening</h2></div><span className="stamp">{phase === "Ended" ? "CLOSED" : "LIVE SIGNALS"}</span></div>{feed.map((entry) => <article className="watch-feed-entry announcement" key={entry.id}><span className="feed-icon">HOST</span><div><strong>{entry.body}</strong><small>Event announcement · moment {entry.agendaIndex + 1}</small></div></article>)}{phase !== "Upcoming" ? <article className="watch-feed-entry milestone"><span className="feed-icon">✦</span><div><strong>{phase === "Ended" ? "Event milestone · Event complete" : `Event milestone · ${phase}`}</strong><small>Shared state updated for everyone in the room.</small></div></article> : <div className="empty">The event feed will open when the host welcomes everyone.</div>}</section>
      </main>
      <aside className="watch-along-side">
        <section className="watch-agenda card c-cream"><p className="section-kicker">EVENT AGENDA</p><h2 className="h-section">The evening, together</h2>{data.agenda.map((item, index) => <div className={`agenda-row ${index === phaseIndex ? "current" : ""} ${index < phaseIndex ? "done" : ""}`} key={`${item.time}-${item.label}`}><span>{item.time}</span><strong>{item.label}</strong></div>)}{started && phase !== "Ended" ? <button type="button" className="btn btn-small btn-pink" onClick={advance}>Advance mock event →</button> : null}</section>
        <section className="watch-rules card c-blue"><p className="section-kicker">ROOM RULES</p><h2 className="h-card">A good event has edges.</h2><ul>{data.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul><p className="legal-notice">Watch on your own legal subscription. Sakura does not stream, host or rebroadcast the content.</p></section>
        <section className="watch-attendees card c-lav"><p className="section-kicker">WHO’S HERE</p><h2 className="h-card">{event.attendeeIds.length + 8} people in the room</h2><div className="attendee-stack">{event.attendeeIds.slice(0, 6).map((id, index) => <span className={index < 3 ? "friend-avatar" : ""} key={id}>{eventAttendees[id]?.slice(0, 1)}</span>)}</div><p className="small">Friends and people from {group?.name ?? "your groups"} are highlighted.</p><p className="small muted">Meet people after the event — conversation continues in the Community group, not in a permanent chat room.</p></section>
        {group ? <Link href={`/community/${group.id}`} className="continue-group card c-peach"><span className="stamp">AFTER THE EVENT</span><strong>Continue this conversation in {group.name} →</strong></Link> : null}
        <section className="watch-badges card c-yellow"><p className="section-kicker">PARTICIPATION MILESTONES</p>{data.participationBadges.map((badge) => <span className={milestones.includes(badge) ? "earned" : ""} key={badge}>{milestones.includes(badge) ? "✦" : "○"} {badge}</span>)}</section>
      </aside>
    </div>
  </div>;
}
