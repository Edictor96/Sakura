"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RsvpButton } from "@/components/ToggleButtons";
import { KEYS, useLocalSet } from "@/lib/store";
import { useCommunityPosts } from "@/lib/data/community/communityStore";
import type { CommunityData, CommunityGroup, CommunityPost } from "@/lib/data/community/communityData";
import { events } from "@/lib/data/events/eventsData";

type GroupTab = "posts" | "watch-parties" | "about";

function formatPostTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(value));
}

function GroupPost({ post, data, group }: { post: CommunityPost; data: CommunityData; group: CommunityGroup }) {
  const [revealed, setRevealed] = useState(!post.spoiler);
  const author = data.users.find((user) => user.id === post.authorId);
  return (
    <article className={`group-post card ${post.pinned ? "group-post-pinned" : "surface-note"}`}>
      <div className="post-head">
        <div className="group-post-author">
          <span className="post-avatar" aria-hidden="true">{author?.glyph ?? "友"}</span>
          <span><strong>{author?.displayName ?? "Sakura fan"}</strong><br /><span className="small muted">{group.name} · {formatPostTime(post.createdAt)}</span></span>
        </div>
        <span className="stamp">{post.type}</span>
      </div>
      {post.pinned ? <span className="pinned-label">Pinned for the room</span> : null}
      {post.spoiler && !revealed ? (
        <button type="button" className="spoiler-reveal" onClick={() => setRevealed(true)}>Spoiler — tap to reveal</button>
      ) : (
        <>
          <Link href={`/community/${group.slug}/posts/${post.id}`} className="group-post-open"><p>{post.body}</p></Link>
          {post.imageLabel ? <div className="post-image-placeholder" role="img" aria-label={post.imageLabel}>{post.imageLabel}</div> : null}
          {post.poll ? <div className="post-poll"><strong>{post.poll.question}</strong>{post.poll.options.map((option) => <span className="poll-option" key={option}>{option}</span>)}</div> : null}
        </>
      )}
      <div className="community-post-footer"><span>{post.reactions} reactions</span><span>{post.replies} replies</span>{post.spoiler ? <span className="spoiler-note">Spoiler</span> : null}</div>
    </article>
  );
}

export default function GroupPage({ data, group }: { data: CommunityData; group: CommunityGroup }) {
  const [tab, setTab] = useState<GroupTab>("posts");
  const { items: joined, toggle } = useLocalSet(KEYS.rooms);
  const { posts } = useCommunityPosts(data.posts);
  const isJoined = joined.includes(group.slug);
  const groupPosts = useMemo(() => posts.filter((post) => post.groupSlug === group.slug).sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))), [posts, group.slug]);
  const related = data.groups.filter((candidate) => candidate.slug !== group.slug && (candidate.parentSlug === group.slug || candidate.parentSlug === group.parentSlug || candidate.category === group.category)).slice(0, 4);
  const rules = data.rules[group.slug] ?? ["Be kind and assume good intent.", "Use spoiler labels when needed.", "Keep the room welcoming."];
  const moderatorIds = data.moderators[group.slug] ?? [];
  const parties = data.watchParties.filter((party) => party.groupSlug === group.slug);
  const upcomingEvents = events.filter((event) => event.groupId === group.slug && event.status !== "Past");

  return (
    <div className="group-page">
      <Link href="/community" className="small">← Back to Community</Link>
      <header className={`group-hero card ${group.tint}`}>
        <div className="group-cover" aria-hidden="true"><span>{group.glyph}</span></div>
        <div className="group-identity">
          <span className="stamp">{group.category}{group.city ? ` · ${group.city}` : ""}</span>
          <h1 className="h-page">{group.name}</h1>
          <p className="lede">{group.description}</p>
          <div className="group-stats"><span>{(group.members + (isJoined ? 1 : 0)).toLocaleString()} members</span><span>{group.activity ?? "A calm corner to return to"}</span>{group.city ? <span>{group.city}</span> : null}</div>
          <button type="button" className={`btn ${isJoined ? "btn-done" : "btn-pink"}`} onClick={() => toggle(group.slug)}>{isJoined ? "Leave group" : "Join group"}</button>
        </div>
      </header>

      <nav className="group-tabs" aria-label={`${group.name} sections`}>
        {([["posts", "Posts"], ["watch-parties", "Watch Parties"], ["about", "About"]] as const).map(([key, label]) => <button type="button" key={key} className={`surface-sticker ${tab === key ? "on" : ""}`} onClick={() => setTab(key)} aria-pressed={tab === key}>{label}</button>)}
      </nav>

      {tab === "posts" ? (
        <section className="group-section" aria-labelledby="group-posts-heading">
          <div className="group-section-head"><h2 id="group-posts-heading" className="h-section">The room, today</h2><span className="stamp">{groupPosts.length} posts</span></div>
          <div className="group-action-row"><Link href={`/community/create?group=${group.slug}`} className="btn btn-small btn-pink group-create-post">Create Post</Link><Link href={`/events/host?group=${group.slug}`} className="btn btn-small btn-ghost">Propose a Meetup</Link></div>
          {groupPosts.length ? <div className="group-post-list">{groupPosts.map((post) => <GroupPost key={post.id} post={post} data={data} group={group} />)}</div> : <p className="empty">This room is just opening. Start the first conversation from Community Home.</p>}
        </section>
      ) : null}

      <section className="group-section" aria-labelledby="upcoming-events-heading">
        <div className="group-section-head"><h2 id="upcoming-events-heading" className="h-section">Upcoming Events</h2><Link href="/events" className="small">Browse all Events →</Link></div>
        {upcomingEvents.length ? <div className="group-event-list">{upcomingEvents.slice(0, 3).map((event) => <Link href={`/events/${event.id}`} className="card group-event-card c-mint" key={event.id}><strong>{event.title}</strong><span>{event.date} · {event.cityId === "online" ? "Online" : event.cityId}</span><span>RSVP status: discover event →</span></Link>)}</div> : <div className="empty">No upcoming events for this group yet. <Link href={`/events/host?group=${group.slug}`}>Propose a Meetup</Link>.</div>}
      </section>

      {tab === "watch-parties" ? (
        <section className="group-section" aria-labelledby="group-parties-heading">
          <div className="group-section-head"><h2 id="group-parties-heading" className="h-section">Watch Parties</h2><Link href="/events" className="small">Browse all events</Link></div>
          {parties.length ? <div className="group-party-list">{parties.map((party) => <article className="card surface-ticket c-mint" key={party.id}><span className="stamp">{party.status}</span><h3 className="h-card">{party.title}</h3><p>{party.dateTime}</p><p>{party.attendees} attending · hosted by {party.host}</p><p>{party.place}</p><div className="group-party-actions"><RsvpButton id={party.id} /><Link href={`/community/watch-parties/${party.id}`} className="small">Open watch party →</Link><Link href="/events" className="small">See in Events</Link></div></article>)}</div> : <p className="empty">No watch parties yet. Check back when this room has a plan.</p>}
        </section>
      ) : null}

      {tab === "about" ? (
        <section className="group-section group-about" aria-labelledby="group-about-heading">
          <h2 id="group-about-heading" className="h-section">About this community</h2>
          <div className="group-about-grid">
            <div className="card surface-note"><h3 className="h-card">Rules</h3><ol>{rules.map((rule) => <li key={rule}>{rule}</li>)}</ol></div>
            <div className="card surface-note"><h3 className="h-card">Moderators</h3>{moderatorIds.length ? <ul className="plain-list">{moderatorIds.map((id) => <li key={id}>{data.users.find((user) => user.id === id)?.displayName ?? "Sakura moderator"}</li>)}</ul> : <p className="muted">The room is community-led for now.</p>}<h3 className="h-card group-created-heading">Community created</h3><p>{data.createdAt[group.slug] ?? "Recently"}</p></div>
          </div>
        </section>
      ) : null}

      <section className="group-section" aria-labelledby="related-heading">
        <h2 id="related-heading" className="h-section">Fans of this group also hang out in...</h2>
        {related.length ? <div className="related-group-grid">{related.map((candidate) => <Link href={`/community/${candidate.slug}`} className={`card related-group ${candidate.tint}`} key={candidate.slug}><span className="community-glyph" aria-hidden="true">{candidate.glyph}</span><strong>{candidate.name}</strong><span className="small">{candidate.members.toLocaleString()} members →</span></Link>)}</div> : <p className="empty">Your next smaller circle is still taking shape.</p>}
      </section>
      <section className="group-section" aria-labelledby="people-like-heading">
        <h2 id="people-like-heading" className="h-section">People like you are into...</h2>
        <p className="muted">A few nearby threads and watch-together moments chosen from this room&apos;s mock connections.</p>
        <div className="related-group-grid">{related.slice(0, 2).map((candidate) => <Link href={`/community/${candidate.slug}`} className={`card related-group ${candidate.tint}`} key={`people-${candidate.slug}`}><span className="stamp">Related circle</span><strong>{candidate.name}</strong><span className="small">{candidate.category} · {candidate.members.toLocaleString()} members</span></Link>)}{parties.slice(0, 2).map((party) => <Link href={`/community/watch-parties/${party.id}`} className="card related-group c-yellow" key={`people-${party.id}`}><span className="stamp">Watch together</span><strong>{party.title}</strong><span className="small">{party.attendees} attending →</span></Link>)}</div>
      </section>
    </div>
  );
}
