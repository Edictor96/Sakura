import { prisma } from "../db/prisma";
import { fetchAniListAnime } from "./sources/anilist";
import type { IngestionResult } from "./types";

export async function ingestAnime() {
  const run = await prisma.ingestionRun.create({ data: { provider: "anilist", entityType: "MEDIA", status: "running" } });
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    let records;
    try { records = await fetchAniListAnime(controller.signal); } finally { clearTimeout(timeout); }
    let upserted = 0;
    for (const record of records) {
      const media = await prisma.media.upsert({
        where: { source_externalId: { source: record.source, externalId: record.externalId } },
        update: {
          title: record.title, type: record.type, world: record.world, description: record.description, blurb: record.description,
          imageUrl: record.imageUrl, originalTitle: record.originalTitle, alternateTitles: record.alternateTitles,
          sourceUrl: record.sourceUrl, externalMetadata: record.externalMetadata, year: record.year,
          releaseDate: record.releaseDate ? new Date(record.releaseDate) : undefined, status: record.status,
          runtimeMinutes: record.runtimeMinutes, episodeCount: record.episodeCount, season: record.season,
          language: record.language, country: record.country, score: record.score, popularity: record.popularity,
          ageRating: record.ageRating, genres: record.genres, themes: record.themes, creators: record.creators,
          cast: record.cast, relatedMedia: record.relatedMedia, externalLinks: record.externalLinks,
          tags: record.tags, lastSyncedAt: new Date(),
        },
        create: {
          title: record.title, type: record.type, world: record.world, description: record.description, blurb: record.description,
          imageUrl: record.imageUrl, originalTitle: record.originalTitle, alternateTitles: record.alternateTitles,
          source: record.source, externalId: record.externalId, sourceUrl: record.sourceUrl, externalMetadata: record.externalMetadata,
          year: record.year, releaseDate: record.releaseDate ? new Date(record.releaseDate) : undefined, status: record.status,
          runtimeMinutes: record.runtimeMinutes, episodeCount: record.episodeCount, season: record.season,
          language: record.language, country: record.country, score: record.score, popularity: record.popularity,
          ageRating: record.ageRating, genres: record.genres, themes: record.themes, creators: record.creators,
          cast: record.cast, relatedMedia: record.relatedMedia, externalLinks: record.externalLinks,
          tags: record.tags, lastSyncedAt: new Date(),
        },
      });
      await prisma.mediaImage.deleteMany({ where: { mediaId: media.id, provider: record.source } });
      if (record.images.length) {
        await prisma.mediaImage.createMany({ data: record.images.map((image) => ({ ...image, mediaId: media.id, sourceUrl: record.sourceUrl })) });
      }
      upserted++;
    }
    await prisma.ingestionRun.update({ where: { id: run.id }, data: { status: "succeeded", fetched: records.length, upserted, completedAt: new Date() } });
    return { provider: "anilist", entityType: "MEDIA", fetched: records.length, upserted, skipped: 0, errors: [] } satisfies IngestionResult;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown provider error.";
    await prisma.ingestionRun.update({ where: { id: run.id }, data: { status: "failed", error: message, completedAt: new Date() } });
    throw error;
  }
}
