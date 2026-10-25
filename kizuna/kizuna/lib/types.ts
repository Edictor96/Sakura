// Shared contracts. Frontend, backend and the Supabase schema all follow these shapes.
// If you change a field here, change supabase/schema.sql and lib/data/supabase.ts too.

export type World = "watch" | "listen" | "play";
export type CatalogueKind = "anime" | "manga" | "film" | "music" | "game";

/** The six sides of a KIZUNA Passport. */
export type Dimension = "Anime" | "Manga" | "Music" | "Gaming" | "Cinema" | "Fashion";

export interface CatalogueItem {
  id: string;
  title: string;
  kind: CatalogueKind;
  world: World;
  year?: number;
  /** Studio, author, artist or developer. */
  maker?: string;
  blurb: string;
  tags: string[];
  imageUrl?: string;
  originalTitle?: string;
  genres?: string[];
  themes?: string[];
  status?: string;
  score?: number;
  episodeCount?: number;
  runtimeMinutes?: number;
  images?: MediaImage[];
}

export interface MediaImage {
  type: string;
  url: string;
  provider: string;
  sourceUrl?: string;
  width?: number;
  height?: number;
}

export interface Room {
  slug: string;
  name: string;
  blurb: string;
  kind: "interest" | "city";
  /** One kanji shown on the room badge. */
  glyph: string;
  tags: string[];
  /** Which Passport side this room feeds. City rooms have none. */
  dimension?: Dimension;
  citySlug?: string;
}

export interface Post {
  id: string;
  roomSlug: string;
  author: string;
  body: string;
  createdAt: string; // ISO
  /** True for posts written on this device, not yet confirmed by a backend. */
  local?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  citySlug: string;
  date: string; // ISO
  venue: string;
  blurb: string;
  tags: string[];
  roomSlug?: string;
}

export type ProductCategory = "apparel" | "accessories" | "stationery" | "bags" | "collectibles";

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  /** The Japanese IP or brand the product belongs to. */
  brand: string;
  /** The licensed seller KIZUNA would link out to. */
  partner: string;
  /** Empty until a real partner link exists. */
  partnerUrl?: string;
  verified: boolean;
  blurb: string;
}

export interface City {
  slug: string;
  name: string;
  pilot: boolean;
}

/** Everything the UI needs from a backend. mock.ts and supabase.ts both implement it. */
export interface DataApi {
  getCities(): Promise<City[]>;
  getRooms(): Promise<Room[]>;
  getRoom(slug: string): Promise<Room | undefined>;
  getPosts(roomSlug: string): Promise<Post[]>;
  getEvents(citySlug?: string): Promise<EventItem[]>;
  getCatalogue(world?: World): Promise<CatalogueItem[]>;
  getCatalogueItem(id: string): Promise<CatalogueItem | undefined>;
  getProducts(): Promise<Product[]>;
}
