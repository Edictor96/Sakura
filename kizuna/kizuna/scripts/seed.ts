// Loads the sample data in lib/data/mock.ts into Supabase, so there is one source of truth.
// Run once after schema.sql:   npm run seed
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your shell or .env.local.

import { createClient } from "@supabase/supabase-js";
import { catalogue, cities, events, products, rooms } from "../lib/data/mock";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.");
  process.exit(1);
}

const sb = createClient(url, serviceKey);

async function upsert(table: string, rows: Record<string, unknown>[], onConflict: string) {
  const { error } = await sb.from(table).upsert(rows, { onConflict });
  if (error) {
    console.error(`${table}: ${error.message}`);
    process.exit(1);
  }
  console.log(`${table}: ${rows.length} rows`);
}

async function main() {
  await upsert("cities", cities.map((c) => ({ slug: c.slug, name: c.name, pilot: c.pilot })), "slug");

  await upsert(
    "rooms",
    rooms.map((r) => ({
      slug: r.slug, name: r.name, blurb: r.blurb, kind: r.kind, glyph: r.glyph,
      tags: r.tags, dimension: r.dimension ?? null, city_slug: r.citySlug ?? null,
    })),
    "slug",
  );

  await upsert(
    "events",
    events.map((e) => ({
      id: e.id, title: e.title, city_slug: e.citySlug, starts_at: e.date, venue: e.venue,
      blurb: e.blurb, tags: e.tags, room_slug: e.roomSlug ?? null,
    })),
    "id",
  );

  await upsert(
    "catalogue_items",
    catalogue.map((c) => ({
      id: c.id, title: c.title, kind: c.kind, world: c.world, year: c.year ?? null,
      maker: c.maker ?? null, blurb: c.blurb, tags: c.tags,
    })),
    "id",
  );

  await upsert(
    "products",
    products.map((p) => ({
      id: p.id, title: p.title, category: p.category, brand: p.brand, partner: p.partner,
      partner_url: p.partnerUrl ?? null, verified: p.verified, blurb: p.blurb,
    })),
    "id",
  );

  console.log("Done. Seed posts are not loaded: real posts will come from users.");
}

main();
