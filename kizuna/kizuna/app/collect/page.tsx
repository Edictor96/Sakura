import type { Metadata } from "next";
import { PageHead, SampleNote } from "@/components/Bits";
import { db } from "@/lib/data";

export const metadata: Metadata = { title: "Collect" };

const TINT = ["c-peach", "c-pink", "c-mint", "c-lav", "c-blue", "c-yellow"];

export default async function Collect() {
  const products = await db.getProducts();
  return (
    <>
      <PageHead title="Collect">
        Official merchandise from licensed sellers. Everyday items first: clothes, pins, notebooks
        and bags.
      </PageHead>
      <SampleNote what="products. No seller has been signed yet" />

      <ul className="grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px', 
        listStyle: 'none', 
        padding: 0 
      }}>
        {products.map((p, i) => (
          <li key={p.id}>
            <article className={`card surface-sticker wob${(i % 3) + 1} ${TINT[i % TINT.length]}`} style={{ 
              borderRadius: 'var(--radius-sm)', 
              padding: '20px',
              border: '2px solid var(--ink)' 
            }}>
              <span className="chip" style={{ justifySelf: "start", marginBottom: '8px' }}>{p.category}</span>
              <h2 className="h-card">{p.title}</h2>
              <p style={{ margin: '8px 0' }}>{p.blurb}</p>
              <p className="small muted">Seller: {p.partner}</p>
              <p className="verify" style={{ fontSize: '0.85rem', margin: '8px 0' }}>
                {p.verified ? "Verified official partner" : "Not yet verified. Only licensed partners will be listed."}
              </p>
              <div style={{ marginTop: '16px' }}>
                {p.partnerUrl ? (
                  <a href={p.partnerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-mint">
                    Open the seller's page
                  </a>
                ) : (
                  <button type="button" className="btn btn-ghost" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                    Seller link coming
                  </button>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
