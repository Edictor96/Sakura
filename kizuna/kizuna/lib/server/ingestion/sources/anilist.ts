import type { NormalizedMedia } from "../types";

const endpoint = "https://graphql.anilist.co";

export async function fetchAniListAnime(signal: AbortSignal): Promise<NormalizedMedia[]> {
  const response = await fetch(endpoint, {
    method: "POST",
    signal,
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      query: `query { Page(page: 1, perPage: 25) { media(type: ANIME, sort: TRENDING_DESC) { id title { romaji english native } description startDate { year month day } genres tags { name } season seasonYear episodes duration status averageScore popularity countryOfOrigin studios { nodes { name } } bannerImage coverImage { medium large extraLarge } siteUrl } } }`,
    }),
  });
  if (!response.ok) throw new Error(`AniList returned ${response.status}.`);
  const body = await response.json() as { data?: { Page?: { media?: Array<{ id: number; title: { romaji?: string; english?: string; native?: string }; description?: string; startDate?: { year?: number; month?: number; day?: number }; genres?: string[]; tags?: Array<{ name: string }>; season?: string; episodes?: number; duration?: number; status?: string; averageScore?: number; popularity?: number; countryOfOrigin?: string; studios?: { nodes?: Array<{ name: string }> }; bannerImage?: string; coverImage?: { medium?: string; large?: string; extraLarge?: string }; siteUrl?: string }> } } };
  return (body.data?.Page?.media ?? []).map((item) => ({
    title: item.title.english ?? item.title.romaji ?? item.title.native ?? `Anime ${item.id}`,
    type: "anime",
    world: "watch",
    description: item.description?.replace(/<[^>]+>/g, "").slice(0, 2000),
    imageUrl: item.coverImage?.extraLarge ?? item.coverImage?.large ?? item.coverImage?.medium,
    originalTitle: item.title.native,
    alternateTitles: [item.title.english, item.title.romaji, item.title.native].filter((title): title is string => Boolean(title)),
    images: [
      item.coverImage?.extraLarge ? { type: "poster", url: item.coverImage.extraLarge, provider: "anilist", width: 460 } : undefined,
      item.bannerImage ? { type: "backdrop", url: item.bannerImage, provider: "anilist" } : undefined,
      item.coverImage?.large ? { type: "thumbnail", url: item.coverImage.large, provider: "anilist" } : undefined,
    ].filter((image): image is { type: string; url: string; provider: string; width?: number } => Boolean(image)),
    source: "anilist",
    externalId: String(item.id),
    sourceUrl: item.siteUrl,
    externalMetadata: {
      id: item.id,
      title: item.title,
      genres: item.genres ?? [],
      tags: item.tags ?? [],
      siteUrl: item.siteUrl ?? null,
      studios: item.studios?.nodes ?? [],
    },
    year: item.startDate?.year,
    releaseDate: item.startDate?.year && item.startDate.month && item.startDate.day
      ? `${item.startDate.year}-${String(item.startDate.month).padStart(2, "0")}-${String(item.startDate.day).padStart(2, "0")}`
      : undefined,
    status: item.status,
    runtimeMinutes: item.duration,
    episodeCount: item.episodes,
    season: item.season,
    score: item.averageScore ? item.averageScore / 10 : undefined,
    popularity: item.popularity,
    country: item.countryOfOrigin,
    genres: item.genres ?? [],
    themes: (item.tags ?? []).map((tag) => tag.name),
    tags: [...(item.genres ?? []), ...(item.tags ?? []).map((tag) => tag.name)].slice(0, 40),
  }));
}
