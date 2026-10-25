import type { CatalogueItem } from "../../types";

export type ExploreCategory = "anime" | "music" | "films";
export type ExploreMood =
  | "feel-good"
  | "emotional"
  | "high-energy"
  | "mind-bending"
  | "relaxing"
  | "romantic";

export interface ExploreCollection {
  id: string;
  title: string;
  description: string;
  itemIds: string[];
}

export interface ExploreData {
  categories: { id: ExploreCategory; label: string; icon: string }[];
  moods: { id: ExploreMood; label: string }[];
  trendingAnime: string[];
  music: string[];
  films: string[];
  newAndUpcoming: string[];
  collections: ExploreCollection[];
  communityPicks: string[];
}

const categoryItems = (items: CatalogueItem[], kind: CatalogueItem["kind"]) =>
  items.filter((item) => item.kind === kind).map((item) => item.id);

export function getExploreData(items: CatalogueItem[], personalizedIds: string[] = []): ExploreData {
  const anime = categoryItems(items, "anime");
  const music = categoryItems(items, "music");
  const films = categoryItems(items, "film");
  const recent = items
    .filter((item) => item.year !== undefined && item.year >= 2020)
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    .map((item) => item.id);

  return {
    categories: [
      { id: "anime", label: "Anime", icon: "ア" },
      { id: "music", label: "Japanese Music", icon: "音" },
      { id: "films", label: "Japanese Films", icon: "映" },
    ],
    moods: [
      { id: "feel-good", label: "Feel-good" },
      { id: "emotional", label: "Emotional" },
      { id: "high-energy", label: "High-energy" },
      { id: "mind-bending", label: "Mind-bending" },
      { id: "relaxing", label: "Relaxing" },
      { id: "romantic", label: "Romantic" },
    ],
    trendingAnime: [...personalizedIds, ...anime.filter((id) => !personalizedIds.includes(id))],
    music: [...personalizedIds.filter((id) => music.includes(id)), ...music.filter((id) => !personalizedIds.includes(id))],
    films: [...personalizedIds.filter((id) => films.includes(id)), ...films.filter((id) => !personalizedIds.includes(id))],
    newAndUpcoming: recent,
    collections: [
      { id: "beginner-anime", title: "Anime for beginners", description: "A gentle first step into a bigger world.", itemIds: anime.slice(0, 3) },
      { id: "soundtracks", title: "Great soundtracks", description: "Stories that stay with you through the music.", itemIds: [...anime, ...music].filter((id) => items.find((item) => item.id === id)?.tags.includes("ost")) },
      { id: "hidden-gems", title: "Hidden gems", description: "A few less-obvious doors worth opening.", itemIds: items.filter((item) => item.tags.includes("drama") || item.tags.includes("fantasy")).map((item) => item.id).slice(0, 4) },
    ],
    communityPicks: ["your-name", "yoasobi", "frieren"].filter((id) => items.some((item) => item.id === id)),
  };
}

export function matchesMood(item: CatalogueItem, mood: ExploreMood): boolean {
  const moodTags: Record<ExploreMood, string[]> = {
    "feel-good": ["cozy", "nintendo", "adventure"],
    emotional: ["drama"],
    "high-energy": ["action", "shonen", "rock"],
    "mind-bending": ["fantasy", "rpg"],
    relaxing: ["cozy", "ghibli"],
    romantic: ["romance"],
  };
  return moodTags[mood].some((tag) => item.tags.includes(tag));
}
