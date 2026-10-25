import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, SampleNote } from "@/components/Bits";
import { SaveButton } from "@/components/ToggleButtons";
import { db } from "@/lib/data";
import { officialSearchUrl } from "@/lib/format";
import type { World } from "@/lib/types";

export const metadata: Metadata = { title: "Discover" };

const TABS: { key: World | "all"; label: string }[] = [
  { key: "all", label: "Everything" },
  { key: "watch", label: "Watch" },
  { key: "listen", label: "Listen" },
  { key: "play", label: "Play" },
];

const KIND_LABEL: Record<string, string> = {
  anime: "Anime", manga: "Manga", film: "Film", music: "Artist", game: "Game",
};

const WORLD_TINT: Record<string, string> = {
  watch: "c-pink",
  listen: "c-lav",
  play: "c-blue",
  all: "c-mint",
};

const KIND_TO_WORLD: Record<string, string> = {
  anime: "watch",
  film: "watch",
  manga: "watch",
  music: "listen",
  game: "play",
};

export default async function Discover({ searchParams }: { searchParams: Promise<{ w?: string }> }) {
  const { w } = await searchParams;
  const active: World | "all" = w === "watch" || w === "listen" || w === "play" ? w : "all";
  const items = await db.getCatalogue(active === "all" ? undefined : active);

  return (
    <>
      <PageHead title="Discover">
        Pick something that looks good, then find the room where people are talking about it.
      </PageHead>
      <SampleNote what="titles" />

      <ul className="tabs" aria-label="Filter by world" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', listStyle: 'none', padding: 0, marginBottom: '24px' }}>
        {TABS.map((t) => (
          <li key={t.key}>
            <Link
              className={`surface-sticker ${active === t.key ? "on" : ""}`}
              href={t.key === "all" ? "/discover" : `/discover?w=${t.key}`}
              aria-current={active === t.key ? "page" : undefined}
            >
              {t.label}
            </Link>
          </li>
        ))}
      </ul>

      {items.length === 0 ? (
        <p className="empty">We couldn't find anything in this world yet. Try exploring another tab!</p>
      ) : (
        <ul className="grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gridAutoFlow: 'dense', 
          gap: '20px', 
          listStyle: 'none', 
          padding: 0 
        }}>
          {items.map((it, i) => {
            const official = officialSearchUrl(it);
            const tint = WORLD_TINT[KIND_TO_WORLD[it.kind] || 'all'];
            return (
              <li key={it.id} style={{ gridColumn: i % 7 === 0 ? 'span 2' : 'span 1' }}>
                <article className={`card item-card surface-manga ${tint} wob${(i % 3) + 1}`}>
                  <span className="kind">{KIND_LABEL[it.kind]}{it.year ? ` from ${it.year}` : ""}</span>
                  <h2 className="h-card"><Link href={`/discover/${it.id}`}>{it.title}</Link></h2>
                  {it.maker ? <span className="small muted">{it.maker}</span> : null}
                  <p>{it.blurb}</p>
                  <div className="item-actions">
                    <Link href={`/discover/${it.id}`} className="btn btn-small btn-ghost">See more</Link>
                    <SaveButton id={it.id} />
                    <a href={official.url} target="_blank" rel="noopener noreferrer" className="small">
                      {official.label}
                    </a>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
