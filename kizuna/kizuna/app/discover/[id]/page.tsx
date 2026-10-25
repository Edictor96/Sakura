import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SaveButton } from "@/components/ToggleButtons";
import { db } from "@/lib/data";
import { officialSearchUrl } from "@/lib/format";
import { roomsForItem, similarItems } from "@/lib/recommend";
import { getCurrentUser } from "@/lib/server/auth";
import { recordCurrentUserActivity } from "@/lib/server/services/activityService";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const item = await db.getCatalogueItem(id);
  return { title: item?.title ?? "Discover" };
}

export default async function ItemPage({ params }: Params) {
  const { id } = await params;
  const item = await db.getCatalogueItem(id);
  if (!item) notFound();
  if (process.env.DATABASE_URL && await getCurrentUser()) {
    await recordCurrentUserActivity({ interactionType: "VIEW", entityType: "MEDIA", entityId: item.id, metadata: { source: "discover" } });
  }

  const [all, rooms] = await Promise.all([db.getCatalogue(), db.getRooms()]);
  const similar = similarItems(all, item);
  const talk = roomsForItem(rooms, item);
  const official = officialSearchUrl(item);

  return (
    <div className="detail" style={{ display: 'grid', gap: '32px' }}>
      <p><Link href="/discover">Back to Discover</Link></p>

      {item.images?.find((image) => image.type === "backdrop" || image.type === "banner")?.url ?? item.imageUrl ? (
        <img
          src={item.images?.find((image) => image.type === "backdrop" || image.type === "banner")?.url ?? item.imageUrl}
          alt={`${item.title} artwork`}
          style={{ width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: 16 }}
        />
      ) : null}
      <article className="card detail-card surface-note c-pink wob3" style={{ padding: '40px' }}>
        <h1 className="h-page">{item.title}</h1>
        <p className="muted">
          {[item.maker, item.year].filter(Boolean).join(", ")}
        </p>
        <p>{item.blurb}</p>
        <ul className="chips" aria-label="Tags">
          {[...(item.genres ?? []), ...(item.themes ?? []), ...item.tags].filter((tag, index, all) => all.indexOf(tag) === index).map((t) => <li key={t} className="chip">{t}</li>)}
        </ul>
        {item.originalTitle && item.originalTitle !== item.title ? <p className="muted">Original title: {item.originalTitle}</p> : null}
        {item.score || item.status || item.episodeCount || item.runtimeMinutes ? (
          <p className="muted">
            {[item.score ? `Score ${item.score}/10` : null, item.status, item.episodeCount ? `${item.episodeCount} episodes` : null, item.runtimeMinutes ? `${item.runtimeMinutes} min` : null].filter(Boolean).join(" · ")}
          </p>
        ) : null}
        <div className="item-actions" style={{ marginTop: 16 }}>
          <SaveButton id={item.id} />
          <a href={official.url} target="_blank" rel="noopener noreferrer" className="btn btn-small btn-mint">
            {official.label}
          </a>
        </div>
        <p className="officialnote">We link to official services. We don't host or stream this title.</p>
      </article>

      {talk.length > 0 && (
        <section aria-labelledby="talk">
          <h2 id="talk" className="h-section">Talk about it</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {talk.map((r, i) => (
              <Link key={r.slug} href={`/rooms/${r.slug}`} className={`surface-sticker wob${(i % 3) + 1} c-lav`}>
                {r.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section aria-labelledby="similar">
          <h2 id="similar" className="h-section">If you like this</h2>
          <ul className="grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
            gap: '16px', 
            listStyle: 'none', 
            padding: 0 
          }}>
            {similar.map((s, i) => (
              <li key={s.id}>
                <Link href={`/discover/${s.id}`} className={`card surface-manga wob${(i % 3) + 1} c-blue`}>
                  <span className="h-card">{s.title}</span>
                  <p style={{ margin: "6px 0 0", fontSize: '0.9rem' }}>{s.blurb}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
