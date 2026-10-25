"use client";

import Link from "next/link";
import { CatalogueItem } from "@/lib/types";

interface RecentItemProps {
  media: CatalogueItem | undefined;
  lastVisited: string;
}

export function RecentItemCard({ media, lastVisited }: RecentItemProps) {
  if (!media) return null;

  return (
    <Link href={`/discover/${media.id}`} className="card recent-card wob1 c-mint">
      <div className="recent-img" style={{ backgroundImage: `url(/api/placeholder/60/60)` }} />
      <div className="recent-info">
        <h3 className="h-card-sm">{media.title}</h3>
        <span className="recent-time">{lastVisited}</span>
      </div>
    </Link>
  );
}
