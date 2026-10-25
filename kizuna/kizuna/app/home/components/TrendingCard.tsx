"use client";

import Link from "next/link";
import { CatalogueItem } from "@/lib/types";

interface TrendingCardProps {
  media: CatalogueItem | undefined;
  metric: string;
  indicator: "up" | "stable";
}

export function TrendingCard({ media, metric, indicator }: TrendingCardProps) {
  if (!media) return null;

  return (
    <div className="card trend-card wob3 c-blue">
      <div className="trend-img" style={{ backgroundImage: `url(/api/placeholder/100/100)` }} />
      <div className="trend-info">
        <div className="trend-metric-box">
          <span className="trend-metric">{metric}</span>
          <span className={`trend-indicator ${indicator}`}>
            {indicator === "up" ? "↑" : "→"}
          </span>
        </div>
        <h3 className="h-card">{media.title}</h3>
        <span className="trend-category">{media.kind}</span>
      </div>
    </div>
  );
}
