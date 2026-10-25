import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, SampleNote } from "@/components/Bits";
import { JoinButton } from "@/components/ToggleButtons";
import { db } from "@/lib/data";
import type { Room } from "@/lib/types";

export const metadata: Metadata = { title: "Rooms" };

const TINT = ["c-pink", "c-lav", "c-mint", "c-peach", "c-blue"];

function RoomGrid({ rooms, kind }: { rooms: Room[], kind: string }) {
  return (
    <ul className="grid" style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
      gap: '20px', 
      listStyle: 'none', 
      padding: 0 
    }}>
      {rooms.map((r, i) => (
        <li key={r.slug}>
          <div className={`card surface-note wob${(i % 3) + 1} ${TINT[i % TINT.length]}`} style={{ padding: '20px', border: '2px solid var(--ink)' }}>
            <span className="top" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className={`badge ${kind === 'city' ? 'surface-sticker' : ''}`} 
                    style={{ 
                      fontFamily: 'var(--font-pixel)', 
                      width: '50px', height: '50px', 
                      borderRadius: '50% 40% 60% 45%',
                      border: '3px solid var(--ink)',
                      display: 'grid', placeItems: 'center',
                      fontSize: '1.5rem',
                      background: 'var(--cream)'
                    }} 
                    aria-hidden="true"
              >
                {r.glyph}
              </span>
              <h3 className="h-card"><Link href={`/rooms/${r.slug}`}>{r.name}</Link></h3>
            </span>
            <p>{r.blurb}</p>
            <div style={{ marginTop: '12px' }}><JoinButton id={r.slug} /></div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function Rooms() {
  const rooms = await db.getRooms();
  return (
    <>
      <PageHead title="Rooms">
        Rooms are where fans talk. Join by interest, then join the one for your city.
      </PageHead>
      <SampleNote what="rooms and posts" />

      <section aria-labelledby="interest">
        <h2 id="interest" className="h-section">By interest</h2>
        <RoomGrid rooms={rooms.filter((r) => r.kind === "interest")} kind="interest" />
      </section>

      <section className="block" aria-labelledby="city">
        <h2 id="city" className="h-section">By city</h2>
        <RoomGrid rooms={rooms.filter((r) => r.kind === "city")} kind="city" />
      </section>
    </>
  );
}
