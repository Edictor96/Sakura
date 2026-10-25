"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SaveButton } from "@/components/ToggleButtons";
import { matchesMood, type ExploreData, type ExploreMood } from "@/lib/data/explore/exploreData";
import type { CatalogueItem } from "@/lib/types";
import { events } from "@/lib/data/events/eventsData";
import { recordClientActivity } from "@/lib/activityClient";
import { mediaImage } from "@/lib/format";

const kindLabel: Record<CatalogueItem["kind"], string> = {
  anime: "ANIME",
  manga: "MANGA",
  film: "FILM",
  music: "MUSIC",
  game: "GAME",
};

function MediaCard({ item }: { item: CatalogueItem }) {
  const relatedEvents = events.filter((event) => event.relatedExploreIds?.includes(item.id) || (item.id === "yoasobi" && event.franchiseId === "yoasobi") || (item.id === "animal-crossing" && event.franchiseId === "animal-crossing")).slice(0, 2);
  return (
    <article className="explore-media-card card c-cream wob2">
      <Link href={`/discover/${item.id}`} className="explore-media-link">
        {mediaImage(item) ? <img src={mediaImage(item)} alt="" loading="lazy" className="explore-media-image" /> : <div className="explore-media-image explore-media-image-fallback" aria-hidden="true">{item.kind.slice(0, 1).toUpperCase()}</div>}
        <span className="explore-kind">{kindLabel[item.kind]}</span>
        <h3 className="h-card">{item.title}</h3>
        {item.maker ? <p className="small muted">{item.maker}</p> : null}
        <p>{item.blurb}</p>
        <div className="chips" aria-label="Tags">
          {[...(item.genres ?? []), ...item.tags].slice(0, 3).map((tag) => <span className="chip" key={tag}>{tag}</span>)}
        </div>
      </Link>
      {relatedEvents.length ? <div className="explore-related-events"><span className="stamp">Meet around this</span>{relatedEvents.map((event) => <Link href={`/events/${event.id}`} key={event.id}>{event.title} →</Link>)}</div> : null}
      <SaveButton id={item.id} />
    </article>
  );
}

export default function ExploreClient({ items, data }: { items: CatalogueItem[]; data: ExploreData }) {
  const [query, setQuery] = useState("");
  const [remoteResults, setRemoteResults] = useState<Array<{ id: string; title: string; type: string; description?: string | null; imageUrl?: string | null }>>([]);
  const [searchError, setSearchError] = useState(false);
  const [mood, setMood] = useState<ExploreMood | null>(null);
  const [category, setCategory] = useState<"all" | "anime" | "music" | "films">("all");

  useEffect(() => {
    const normalized = query.trim();
    if (normalized.length < 3) {
      setRemoteResults([]);
      setSearchError(false);
      return;
    }
    const timer = window.setTimeout(() => {
      void fetch(`/api/search?q=${encodeURIComponent(normalized)}&type=MEDIA`)
        .then(async (response) => {
          if (!response.ok) {
            setSearchError(true);
            return;
          }
          const payload = await response.json() as { results?: Array<{ id: string; title: string; type: string; description?: string | null; imageUrl?: string | null }> };
          setRemoteResults(payload.results ?? []);
          setSearchError(false);
        })
        .catch(() => {
          setSearchError(true);
          setRemoteResults([]);
        });
      void recordClientActivity("SEARCH", "MEDIA", normalized, { query: normalized });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [query]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => {
      const inCategory = category === "all" || (category === "films" ? item.kind === "film" : item.kind === category);
      const inMood = !mood || matchesMood(item, mood);
      const searchable = [item.title, item.maker, item.blurb, ...item.tags].filter(Boolean).join(" ").toLowerCase();
      return inCategory && inMood && (!normalized || searchable.includes(normalized));
    });
  }, [category, items, mood, query]);

  const byIds = (ids: string[]) => ids.map((id) => items.find((item) => item.id === id)).filter((item): item is CatalogueItem => Boolean(item));
  const section = (title: string, ids: string[], tint: string) => {
    const sectionItems = byIds(ids).filter((item) => filtered.some((match) => match.id === item.id));
    return (
      <section className="explore-section" aria-labelledby={`${title}-heading`}>
        <div className="explore-section-head">
          <h2 id={`${title}-heading`} className="h-section">{title}</h2>
          <span className="stamp">{sectionItems.length} picks</span>
        </div>
        {sectionItems.length ? <div className={`explore-media-row ${tint}`}>{sectionItems.map((item) => <MediaCard key={item.id} item={item} />)}</div> : <p className="empty">Nothing here yet. Try another mood or search.</p>}
      </section>
    );
  };

  return (
    <div className="explore-page">
      <header className="explore-hero">
        <p className="sample-note">A curated shelf of Japanese pop culture</p>
        <h1 className="h-hero">Find your next obsession.</h1>
        <p className="lede">Anime, music, films and the moods that connect them — gathered with a little human taste.</p>
        <label className="explore-search">
          <span className="sr-only">Search anime, music and films</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search anime, music, films..." />
          {query ? <button type="button" className="btn btn-small btn-ghost" onClick={() => setQuery("")}>Clear</button> : null}
        </label>
      </header>

      <section className="explore-shortcuts" aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="h-section">Start somewhere</h2>
        <div className="explore-category-grid">
          <button type="button" className={`explore-category c-pink ${category === "anime" ? "is-active" : ""}`} onClick={() => setCategory(category === "anime" ? "all" : "anime")}><b>ア</b>Anime</button>
          <button type="button" className={`explore-category c-lav ${category === "music" ? "is-active" : ""}`} onClick={() => setCategory(category === "music" ? "all" : "music")}><b>音</b>Japanese Music</button>
          <button type="button" className={`explore-category c-blue ${category === "films" ? "is-active" : ""}`} onClick={() => setCategory(category === "films" ? "all" : "films")}><b>映</b>Japanese Films</button>
        </div>
      </section>

      <section className="explore-moods" aria-labelledby="moods-heading">
        <h2 id="moods-heading" className="h-section">What are you in the mood for?</h2>
        <div className="chips">
          {data.moods.map((entry) => <button type="button" className={`chip chip-link ${mood === entry.id ? "on" : ""}`} key={entry.id} onClick={() => setMood(mood === entry.id ? null : entry.id)}>{entry.label}</button>)}
        </div>
      </section>

      {query || mood || category !== "all" ? (
        <section className="explore-results" aria-live="polite">
          <div className="explore-section-head"><h2 className="h-section">Your finds</h2><span className="stamp">{filtered.length} results</span></div>
          {searchError ? <p className="error" role="alert">Search is temporarily unavailable. Showing the curated shelf instead.</p> : null}
          {remoteResults.length ? <div className="explore-media-row c-mint">{remoteResults.map((item) => <article className="explore-media-card card c-cream" key={item.id}><Link href={`/discover/${item.id}`} className="explore-media-link">{item.imageUrl ? <img src={item.imageUrl} alt="" loading="lazy" className="explore-media-image" /> : <div className="explore-media-image explore-media-image-fallback" aria-hidden="true">{item.type.slice(0, 1)}</div>}<span className="explore-kind">{item.type}</span><h3 className="h-card">{item.title}</h3><p>{item.description ?? "Open this cultural pick to learn more."}</p></Link><SaveButton id={item.id} /></article>)}</div> : filtered.length ? <div className="explore-media-row c-mint">{filtered.map((item) => <MediaCard key={item.id} item={item} />)}</div> : <p className="empty">Nothing found yet. Try another title, artist or film.</p>}
        </section>
      ) : null}

      {section("Trending Anime", data.trendingAnime, "c-pink")}
      {section("Japanese Music", data.music, "c-lav")}
      {section("Japanese Films", data.films, "c-blue")}
      {section("New & Upcoming", data.newAndUpcoming, "c-yellow")}
      <section className="explore-section" aria-labelledby="collections-heading">
        <div className="explore-section-head"><h2 id="collections-heading" className="h-section">Curated collections</h2></div>
        <div className="explore-collection-grid">{data.collections.map((collection) => <button type="button" className="card collection-card c-peach" key={collection.id} onClick={() => setQuery(collection.itemIds.map((id) => items.find((item) => item.id === id)?.title).filter(Boolean).join(" "))}><span className="stamp">EDITORIAL SHELF</span><h3 className="h-card">{collection.title}</h3><p>{collection.description}</p></button>)}</div>
      </section>
      {section("Community Picks", data.communityPicks, "c-mint")}
    </div>
  );
}
