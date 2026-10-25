import type { Prisma } from "@prisma/client";

export interface NormalizedMedia {
  title: string;
  type: string;
  world: string;
  description?: string;
  imageUrl?: string;
  originalTitle?: string;
  alternateTitles: string[];
  images: NormalizedMediaImage[];
  source: string;
  externalId: string;
  sourceUrl?: string;
  externalMetadata?: Prisma.InputJsonValue;
  year?: number;
  releaseDate?: string;
  status?: string;
  runtimeMinutes?: number;
  episodeCount?: number;
  season?: string;
  language?: string;
  country?: string;
  score?: number;
  popularity?: number;
  ageRating?: string;
  genres: string[];
  themes: string[];
  creators?: Prisma.InputJsonValue;
  cast?: Prisma.InputJsonValue;
  relatedMedia?: Prisma.InputJsonValue;
  externalLinks?: Prisma.InputJsonValue;
  tags: string[];
}

export interface NormalizedMediaImage {
  type: string;
  url: string;
  provider: string;
  sourceUrl?: string;
  width?: number;
  height?: number;
}

export interface IngestionResult {
  provider: string;
  entityType: string;
  fetched: number;
  upserted: number;
  skipped: number;
  errors: string[];
}
