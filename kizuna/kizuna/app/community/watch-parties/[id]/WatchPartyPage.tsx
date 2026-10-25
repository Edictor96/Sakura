"use client";

import Link from "next/link";
import { useState } from "react";
import { RsvpButton } from "@/components/ToggleButtons";
import type { CommunityData, CommunityGroup, WatchParty } from "@/lib/data/community/communityData";

export default function WatchPartyPage({ data, party, group }: { data: CommunityData; party: WatchParty; group: CommunityGroup }) {
  const [messages, setMessages] = useState(party.chat);
  const [draft, setDraft] = useState("");
  const [reaction, setReaction] = useState<string | null>(null);
  const discussion = party.discussionPostId ? data.posts.find((post) => post.id === party.discussionPostId) : undefined;

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setMessages((current) => [...current, { id: `local-chat-${Date.now()}`, author: "You", body: draft.trim() }]);
    setDraft("");
  };

  return (
    <div className="watch-party-page">
      <Link href={`/community/${group.slug}`} className="small">← Back to {group.name}</Link>
      <header className="watch-party-hero card c-pink">
        <span className="stamp">Watch Party · {party.status}</span>
        <h1 className="h-page">{party.title}</h1>
        <p className="lede">Hosted by {party.host} in <Link href={`/community/${group.slug}`}>{group.name}</Link></p>
        <div className="watch-party-stats"><span>{party.dateTime}</span><span>{party.attendees} attending</span><span>{party.place}</span></div>
        <RsvpButton id={party.id} />
        <Link href="/events" className="small watch-events-link">See this community event in Events →</Link>
      </header>

      <section className="watch-party-section" aria-labelledby="party-about-heading">
        <h2 id="party-about-heading" className="h-section">Before we watch</h2>
        <div className="card surface-note"><p>{party.description}</p><strong>Discussion prompt</strong><p>{party.prompt}</p></div>
      </section>

      <section className="watch-party-section" aria-labelledby="stream-heading">
        <div className="watch-party-section-head"><h2 id="stream-heading" className="h-section">{party.status === "live" ? "Watching together" : "Watch-along space"}</h2><span className="stamp">{party.status === "upcoming" ? "Starts soon" : party.status}</span></div>
        <div className="stream-placeholder" role="img" aria-label="Community watch-along coordination space"><span>◌</span><strong>Watch using your own subscription</strong><small>Sakura does not stream, host or rebroadcast the content. This room is for coordination and conversation.</small></div>
      </section>

      <section className="watch-party-section" aria-labelledby="chat-heading">
        <div className="watch-party-section-head"><h2 id="chat-heading" className="h-section">Live Chat</h2><span className="stamp">Mock room</span></div>
        <div className="watch-chat card surface-note">{messages.map((message) => <p className="watch-chat-message" key={message.id}><strong>{message.author}</strong><span>{message.body}</span></p>)}</div>
        <div className="watch-reactions" aria-label="Quick reactions">{["🌸", "👏", "✨"].map((emoji) => <button type="button" key={emoji} className={`reaction-button ${reaction === emoji ? "is-reacted" : ""}`} onClick={() => setReaction(reaction === emoji ? null : emoji)} aria-label={`React ${emoji}`}>{emoji}</button>)}</div>
        <form className="watch-chat-form" onSubmit={sendMessage}><label className="sr-only" htmlFor="watch-chat-input">Chat message</label><input id="watch-chat-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Say something kind..." /><button className="btn btn-mint" type="submit" disabled={!draft.trim()}>Send</button></form>
      </section>

      <section className="watch-party-section" aria-labelledby="discussion-heading">
        <h2 id="discussion-heading" className="h-section">Discussion</h2>
        {party.status === "ended" && discussion ? <div className="card c-yellow"><p>The watch party has ended. Keep the conversation going.</p><Link href={`/community/${group.slug}/posts/${discussion.id}`} className="btn btn-small btn-ghost">Open discussion thread</Link></div> : <div className="empty">After the watch party, this space will become a discussion thread for the room.</div>}
      </section>
    </div>
  );
}
