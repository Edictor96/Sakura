"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { JoinButton, RsvpButton } from "@/components/ToggleButtons";
import { KEYS, useLocalSet } from "@/lib/store";
import { useCommunityPosts } from "@/lib/data/community/communityStore";
import type { CommunityData, CommunityGroup, CommunityPost } from "@/lib/data/community/communityData";

type Tab = "for-you" | "nearby" | "my-groups";

function GroupCard({ group }: { group: CommunityGroup }) {
  return (
    <article className={`community-group card ${group.tint} wob2`}>
      <Link href={`/community/${group.slug}`} className="community-group-link">
        <span className="community-glyph" aria-hidden="true">{group.glyph}</span>
        <span className="stamp">{group.category}{group.city ? ` · ${group.city}` : ""}</span>
        <h3 className="h-card">{group.name}</h3>
        <p>{group.description}</p>
        <span className="community-meta">{group.members.toLocaleString()} members</span>
        {group.activity ? <span className="community-signal">{group.activity}</span> : null}
      </Link>
      <JoinButton id={group.slug} className="community-join" />
    </article>
  );
}

function PostCard({ post, group, author }: { post: CommunityPost; group?: CommunityGroup; author?: string }) {
  return (
    <article className="community-post card surface-note">
      <div className="post-head">
        <div>
          <Link href={`/community/${post.groupSlug}`} className="community-post-group">{group?.name ?? "Community"}</Link>
          <span className="small muted"> · {author ?? "Sakura fan"}</span>
        </div>
        <span className="stamp">{post.type}</span>
      </div>
      <p>{post.body}</p>
      {post.spoiler ? <span className="spoiler-note">Spoiler marked</span> : null}
      <div className="community-post-footer">
        <span>{post.reactions} reactions</span><span>{post.replies} replies</span>
      </div>
    </article>
  );
}

function citySlug(city: string) {
  return city.toLowerCase().replaceAll(" ", "-");
}

function NearbyExperience({ data, groupBySlug }: { data: CommunityData; groupBySlug: Map<string, CommunityGroup> }) {
  const [city, setCity] = useState("Delhi");
  const cityGroups = data.groups.filter((group) => group.city === city);
  const cityEvents = data.nearbyEvents.filter((event) => event.city === city);

  return (
    <div className="nearby-experience">
      <section className="nearby-city-picker" aria-labelledby="nearby-heading">
        <div className="nearby-city-heading">
          <div><span className="stamp">A gentle starting point</span><h2 id="nearby-heading" className="h-section">Communities near you</h2></div>
          <div className="nearby-current"><span className="small muted">Your city</span><strong>{city}</strong><button type="button" className="small" onClick={() => document.getElementById("nearby-city-options")?.focus()}>Change</button></div>
        </div>
        <p className="muted">Choose a city to find local circles. Sakura never asks for precise location.</p>
        <div id="nearby-city-options" className="nearby-city-options" tabIndex={-1} aria-label="Choose a mock city">
          {data.cities.map((entry) => <button type="button" className={`nearby-city-option ${entry === city ? "is-selected" : ""}`} key={entry} onClick={() => setCity(entry)} aria-pressed={entry === city}>{entry}</button>)}
        </div>
      </section>

      <section className="community-section" aria-labelledby="city-groups-heading">
        <div className="community-section-head"><h2 id="city-groups-heading" className="h-section">{city} circles</h2><span className="stamp">{cityGroups.length} spaces</span></div>
        {cityGroups.length ? <div className="community-group-grid">{cityGroups.map((group) => <GroupCard key={group.slug} group={group} />)}</div> : <div className="empty nearby-empty">Your people haven't gathered here yet.<br /><button type="button" className="btn btn-small btn-pink" onClick={() => setCity("Delhi")}>Explore all communities</button></div>}
      </section>

      <section className="community-section" aria-labelledby="happening-heading">
        <div className="community-section-head"><h2 id="happening-heading" className="h-section">Happening near you</h2><Link href={`/events?city=${citySlug(city)}`} className="small">See all Events</Link></div>
        {cityEvents.length ? <div className="nearby-event-grid">{cityEvents.map((event) => {
          const group = groupBySlug.get(event.groupSlug);
          return <article className="nearby-event-card card surface-ticket c-mint" key={event.id}><span className="stamp">{event.date}</span><h3 className="h-card">{event.title}</h3><p className="small muted">{group?.name ?? "Local community"}</p><p>{event.location}</p><span className="community-meta">{event.attendees} people are considering it</span><div className="nearby-event-actions"><RsvpButton id={event.id} /><Link href={`/events?city=${citySlug(city)}`} className="small">See Event →</Link></div></article>;
        })}</div> : <p className="empty">Nothing scheduled in {city} yet. Join a local circle and start the idea.</p>}
      </section>
    </div>
  );
}

export default function CommunityHome({ data }: { data: CommunityData }) {
  const [tab, setTab] = useState<Tab>("for-you");
  const [nichePath, setNichePath] = useState(0);
  const [nicheLevel, setNicheLevel] = useState(0);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const { items: joined } = useLocalSet(KEYS.rooms);
  const { posts, addPost } = useCommunityPosts(data.posts);
  const groupBySlug = useMemo(() => new Map(data.groups.map((group) => [group.slug, group])), [data.groups]);
  const userById = useMemo(() => new Map(data.users.map((user) => [user.id, user])), [data.users]);
  const joinedGroups = data.groups.filter((group) => joined.includes(group.slug));
  const visiblePosts = posts.filter((post) => tab !== "my-groups" || joined.includes(post.groupSlug)).slice(0, 5);
  const currentPath = data.nichePaths[nichePath];
  const currentStep = currentPath[nicheLevel];
  const nicheGroup = currentStep?.groupSlug ? groupBySlug.get(currentStep.groupSlug) : undefined;

  return (
    <div className="community-page">
      <header className="community-hero">
        <span className="sample-note">Sample community spaces</span>
        <h1 className="h-page">Community</h1>
        <p className="lede">Find your people. Talk about what you love.</p>
        <button type="button" className="btn btn-pink community-create" onClick={() => setComposerOpen((open) => !open)}>
          {composerOpen ? "Close composer" : "Create Post"}
        </button>
        <Link href="/community/create" className="small community-create-link">Open full create flow →</Link>
        {composerOpen ? (
          <form className="community-composer surface-note" onSubmit={(event) => {
            event.preventDefault();
            addPost({
              id: `local-${Date.now()}`,
              groupSlug: "anime-fans-india",
              authorId: "local-you",
              body: draft.trim(),
              type: "Discussion",
              createdAt: new Date().toISOString(),
              reactions: 0,
              replies: 0,
            });
            setDraft("");
            setComposerOpen(false);
          }}>
            <label htmlFor="community-draft">Start a conversation</label>
            <textarea id="community-draft" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="What are you watching, listening to or reading?" />
            <div className="composer-row"><span className="small muted">Saved locally for this prototype.</span><button className="btn btn-small btn-mint" type="submit" disabled={!draft.trim()}>Post locally</button></div>
          </form>
        ) : null}
      </header>

      <nav className="community-tabs" aria-label="Community views">
        {([["for-you", "For You"], ["nearby", "Nearby"], ["my-groups", "My Groups"]] as const).map(([key, label]) => (
          <button type="button" className={`surface-sticker ${tab === key ? "on" : ""}`} key={key} onClick={() => setTab(key)} aria-pressed={tab === key}>{label}</button>
        ))}
      </nav>

      {tab === "nearby" ? (
        <NearbyExperience data={data} groupBySlug={groupBySlug} />
      ) : tab === "my-groups" ? (
        <section className="community-section" aria-labelledby="my-groups-heading">
          <h2 id="my-groups-heading" className="h-section">My Groups</h2>
          {joinedGroups.length ? <div className="community-group-grid">{joinedGroups.map((group) => <GroupCard key={group.slug} group={group} />)}</div> : <div className="empty community-empty">You haven't joined a community yet. Start with something you're obsessed with.<br /><button type="button" className="btn btn-small btn-pink" onClick={() => setTab("for-you")}>Find a group</button></div>}
        </section>
      ) : (
        <>
          <section className="community-section" aria-labelledby="trending-heading">
            <div className="community-section-head"><h2 id="trending-heading" className="h-section">Trending Communities</h2><span className="stamp">A little doorway in</span></div>
            <div className="community-group-grid">{data.groups.filter((group) => !group.city).slice(0, 8).map((group) => <GroupCard key={group.slug} group={group} />)}</div>
          </section>

          <section className="community-section niche-discovery" aria-labelledby="niche-heading">
            <div className="community-section-head"><h2 id="niche-heading" className="h-section">Find Your Niche</h2><button type="button" className="small" onClick={() => { setNichePath((nichePath + 1) % data.nichePaths.length); setNicheLevel(0); }}>Try another path</button></div>
            <p className="lede">Start broad, then follow the thread to a smaller room that feels more like yours.</p>
            <div className="niche-path" aria-label="Community path">
                {currentPath.map((step, index) => <button type="button" key={step.label} className={`niche-step ${index === nicheLevel ? "is-current" : ""}`} onClick={() => setNicheLevel(index)}>{step.label}</button>)}
            </div>
            {nicheGroup ? <div className={`niche-result card ${nicheGroup.tint}`}><span className="community-glyph" aria-hidden="true">{nicheGroup.glyph}</span><div><span className="stamp">Your next room</span><h3 className="h-card">{nicheGroup.name}</h3><p>{nicheGroup.description}</p><Link href={`/community/${nicheGroup.slug}`} className="btn btn-small btn-ghost">Visit group</Link></div></div> : <p className="small muted">Choose a path to discover a more specific room.</p>}
          </section>

          <section className="community-section" aria-labelledby="talking-heading">
            <h2 id="talking-heading" className="h-section">What are fans talking about?</h2>
            <div className="prompt-grid">{data.prompts.map((prompt) => <Link key={prompt.question} href={`/community/${prompt.groupSlug}`} className="prompt-card card c-yellow"><span className="stamp">Conversation starter</span><strong>{prompt.question}</strong><span className="small">Open the room →</span></Link>)}</div>
          </section>

          <section className="community-section" aria-labelledby="posts-heading">
            <div className="community-section-head"><h2 id="posts-heading" className="h-section">Recent Community Posts</h2><span className="stamp">Sample activity</span></div>
            <div className="community-post-list">{visiblePosts.map((post) => <PostCard key={post.id} post={post} group={groupBySlug.get(post.groupSlug)} author={userById.get(post.authorId)?.displayName} />)}</div>
          </section>
        </>
      )}

      <section className="community-section" aria-labelledby="parties-heading">
        <div className="community-section-head"><h2 id="parties-heading" className="h-section">Meet up together</h2><Link href="/events" className="small">All events</Link></div>
        <div className="party-grid">{data.watchParties.map((party) => <div className="card surface-ticket c-mint" key={party.id}><span className="stamp">{party.status}</span><h3 className="h-card">{party.title}</h3><p>{party.dateTime}</p><p>{party.attendees} attending · {party.host}</p><Link href={`/community/watch-parties/${party.id}`} className="btn btn-small btn-ghost">Open watch party</Link><Link href="/events" className="small">See in Events →</Link></div>)}</div>
      </section>
    </div>
  );
}
