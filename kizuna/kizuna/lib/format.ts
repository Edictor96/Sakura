import type { CatalogueItem } from "./types";

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

export function timeAgo(iso: string, now = Date.now()): string {
  const mins = Math.max(1, Math.round((now - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  return `${Math.round(hrs / 24)} d ago`;
}

/**
 * We link, we don't host. These are search links to official services,
 * not a claim that a title is available there.
 */
export function officialSearchUrl(item: CatalogueItem): { label: string; url: string } {
  const q = encodeURIComponent(item.title);
  if (item.world === "listen") return { label: "Find it on a music service", url: `https://open.spotify.com/search/${q}` };
  if (item.world === "play") return { label: "Find an official store page", url: `https://www.google.com/search?q=${q}+official+store` };
  return { label: "Find where to watch or read", url: `https://www.justwatch.com/in/search?q=${q}` };
}

export function mediaImage(item: CatalogueItem, preferred: string[] = ["poster", "cover", "thumbnail"]): string | undefined {
  return preferred
    .map((type) => item.images?.find((image) => image.type === type)?.url)
    .find((url): url is string => Boolean(url)) ?? item.imageUrl;
}
