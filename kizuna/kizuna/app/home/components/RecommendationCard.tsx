"use client";

import Link from "next/link";
import { useLocalSet } from "@/lib/store";
import { KEYS } from "@/lib/store";
import { CatalogueItem } from "@/lib/types";

interface RecommendationCardProps {
  media: CatalogueItem | undefined;
  reason: string;
}

export function RecommendationCard({ media, reason }: RecommendationCardProps) {
  const { toggle, has } = useLocalSet(KEYS.saved);
  const mediaId = media?.id || "unknown";
  const isSaved = has(mediaId);

  if (!media) return null;

  return (
    <div className="card rec-card wob2 c-lav">
      <Link href={`/discover/${mediaId}`} className="rec-link">
        <div 
          className="rec-img" 
          style={{ backgroundImage: `url(/api/placeholder/150/200)` }} 
        />
        <div className="rec-info">
          <span className="rec-type">{media.kind}</span>
          <h3 className="h-card">{media.title}</h3>
          <p className="rec-reason">{reason}</p>
        </div>
      </Link>
      <button 
        onClick={(e) => {
          e.preventDefault();
          toggle(mediaId);
        }}
        className={`btn-save ${isSaved ? "saved" : ""}`}
        aria-label={isSaved ? "Remove from saved" : "Save to passport"}
      >
        {isSaved ? "🌸" : "🤍"}
      </button>
    </div>
  );
}
