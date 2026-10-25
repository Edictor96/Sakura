"use client";

import Link from "next/link";
import { CatalogueItem } from "@/lib/types";
import { mediaImage } from "@/lib/format";

interface RecentItemProps {
  media: CatalogueItem | undefined;
  lastVisited: string;
}

export function RecentItemCard({ media, lastVisited }: RecentItemProps) {
  if (!media) return null;

  return (
    <Link href={`/discover/${media.id}`} className="card recent-card wob1 c-mint">
      {mediaImage(media) ? <img className="recent-img" src={mediaImage(media)} alt="" loading="lazy" /> : <div className="recent-img rec-img-fallback" aria-hidden="true">{media.kind.slice(0, 1).toUpperCase()}</div>}
      <div className="recent-info">
        <h3 className="h-card-sm">{media.title}</h3>
        <span className="recent-time">{lastVisited}</span>
      </div>
    </Link>
  );
}
