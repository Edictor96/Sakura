import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SampleNote } from "@/components/Bits";
import RoomFeed from "@/components/RoomFeed";
import { JoinButton, RsvpButton } from "@/components/ToggleButtons";
import { db } from "@/lib/data";
import { formatDate } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const room = await db.getRoom(slug);
  return { title: room?.name ?? "Rooms" };
}

export default async function RoomPage({ params }: Params) {
  const { slug } = await params;
  const room = await db.getRoom(slug);
  if (!room) notFound();

  const [posts, events] = await Promise.all([db.getPosts(slug), db.getEvents(room.citySlug)]);
  const related = events.filter((e) => e.roomSlug === slug || (room.citySlug && e.citySlug === room.citySlug));

  return (
    <>
      <p><Link href="/rooms">Back to Rooms</Link></p>
      <header className="page-head room-head" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
        <span className="badge" style={{ 
          fontFamily: 'var(--font-pixel)', 
          width: '80px', height: '80px', 
          borderRadius: '50% 40% 60% 45%',
          border: '4px solid var(--ink)',
          display: 'grid', placeItems: 'center',
          fontSize: '2rem',
          background: 'var(--cream)'
        }} aria-hidden="true">{room.glyph}</span>
        <div>
          <h1 className="h-page">{room.name}</h1>
          <p className="lede">{room.blurb}</p>
        </div>
      </header>
      <div style={{ marginBottom: 22 }}><JoinButton id={room.slug} /></div>
      <SampleNote what="posts" />

      <div className="cols" style={{ display: 'grid', gap: '30px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <RoomFeed roomSlug={room.slug} roomName={room.name} initial={posts} />

        <aside className="side" aria-label="Events for this room" style={{ display: 'grid', gap: '16px' }}>
          <h2 className="h-section">Meet up</h2>
          {related.length === 0 ? (
            <p className="empty">No events yet. <Link href="/events">Browse all events</Link>.</p>
          ) : (
            related.slice(0, 3).map((e, i) => (
              <div key={e.id} className={`card surface-ticket wob${(i % 3) + 1} c-mint`}>
                <span className="when" style={{ fontFamily: 'var(--font-pixel)' }}>{formatDate(e.date)}</span>
                <strong>{e.title}</strong>
                <RsvpButton id={e.id} />
              </div>
            ))
          )}
        </aside>
      </div>
    </>
  );
}
