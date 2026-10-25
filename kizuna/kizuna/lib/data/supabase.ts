import { createClient } from "@supabase/supabase-js";
import type {
  CatalogueItem,
  City,
  DataApi,
  EventItem,
  Post,
  Product,
  Room,
  World,
} from "../types";
import { api as mock } from "./mock";

// Reads from Supabase and falls back to sample data if a call fails,
// so a flaky network never blanks the demo.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const supabase = url && key ? createClient(url, key) : null;

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

const toCity = (r: Row): City => ({ slug: r.slug, name: r.name, pilot: !!r.pilot });
const toRoom = (r: Row): Room => ({
  slug: r.slug,
  name: r.name,
  blurb: r.blurb,
  kind: r.kind,
  glyph: r.glyph,
  tags: r.tags ?? [],
  dimension: r.dimension ?? undefined,
  citySlug: r.city_slug ?? undefined,
});
const toPost = (r: Row): Post => ({
  id: String(r.id),
  roomSlug: r.room_slug,
  author: r.author,
  body: r.body,
  createdAt: r.created_at,
});
const toEvent = (r: Row): EventItem => ({
  id: r.id,
  title: r.title,
  citySlug: r.city_slug,
  date: r.starts_at,
  venue: r.venue,
  blurb: r.blurb,
  tags: r.tags ?? [],
  roomSlug: r.room_slug ?? undefined,
});
const toItem = (r: Row): CatalogueItem => ({
  id: r.id,
  title: r.title,
  kind: r.kind,
  world: r.world,
  year: r.year ?? undefined,
  maker: r.maker ?? undefined,
  blurb: r.blurb,
  tags: r.tags ?? [],
});
const toProduct = (r: Row): Product => ({
  id: r.id,
  title: r.title,
  category: r.category,
  brand: r.brand,
  partner: r.partner,
  partnerUrl: r.partner_url ?? undefined,
  verified: !!r.verified,
  blurb: r.blurb,
});

async function safe<T>(run: () => Promise<T | null>, fallback: () => Promise<T>): Promise<T> {
  try {
    const out = await run();
    return out ?? (await fallback());
  } catch {
    return fallback();
  }
}

async function list<T>(
  table: string,
  map: (r: Row) => T,
  tweak?: (q: any) => any,
): Promise<T[] | null> {
  if (!supabase) return null;
  let q: any = supabase.from(table).select("*");
  if (tweak) q = tweak(q);
  const { data, error } = await q;
  if (error || !data || data.length === 0) return null;
  return (data as Row[]).map(map);
}

export const api: DataApi = {
  getCities: () => safe(() => list("cities", toCity), mock.getCities),
  getRooms: () => safe(() => list("rooms", toRoom), mock.getRooms),
  async getRoom(slug) {
    const all = await this.getRooms();
    return all.find((r) => r.slug === slug);
  },
  getPosts: (roomSlug) =>
    safe(
      () =>
        list("posts", toPost, (q) =>
          q.eq("room_slug", roomSlug).order("created_at", { ascending: false }),
        ),
      () => mock.getPosts(roomSlug),
    ),
  getEvents: (citySlug) =>
    safe(
      () =>
        list("events", toEvent, (q) => {
          const ordered = q.order("starts_at", { ascending: true });
          return citySlug ? ordered.eq("city_slug", citySlug) : ordered;
        }),
      () => mock.getEvents(citySlug),
    ),
  getCatalogue: (world?: World) =>
    safe(
      () => list("catalogue_items", toItem, (q) => (world ? q.eq("world", world) : q)),
      () => mock.getCatalogue(world),
    ),
  async getCatalogueItem(id) {
    const all = await this.getCatalogue();
    return all.find((c) => c.id === id);
  },
  getProducts: () => safe(() => list("products", toProduct), mock.getProducts),
};
