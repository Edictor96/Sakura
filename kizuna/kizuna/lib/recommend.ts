import type { CatalogueItem, Room } from "./types";

// AI stays backstage: "more like this" from shared tags, then same kind, then same maker.
// Later this can blend in community activity and behaviour. The signature can stay the same.

export function similarItems(all: CatalogueItem[], target: CatalogueItem, limit = 3): CatalogueItem[] {
  return all
    .filter((c) => c.id !== target.id)
    .map((c) => {
      const shared = c.tags.filter((t) => target.tags.includes(t)).length;
      const score =
        shared * 3 + (c.kind === target.kind ? 1 : 0) + (c.maker && c.maker === target.maker ? 2 : 0);
      return { c, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.c);
}

/** Interest rooms whose tags overlap with an item, best match first. */
export function roomsForItem(rooms: Room[], item: CatalogueItem, limit = 3): Room[] {
  return rooms
    .filter((r) => r.kind === "interest")
    .map((r) => ({ r, score: r.tags.filter((t) => item.tags.includes(t)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.r);
}
