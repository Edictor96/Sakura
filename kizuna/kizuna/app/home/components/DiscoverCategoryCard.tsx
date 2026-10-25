import Link from "next/link";
import type { DiscoverCategory } from "@/lib/data/home/homeData";

export function DiscoverCategoryCard({ cat }: { cat: DiscoverCategory }) {
  return (
    <Link href={cat.href} className={`card discover-card ${cat.colorClass} wob2`}>
      <div className="discover-head"><span className="discover-label">{cat.label}</span></div>
      <ul className="discover-list">{cat.items.map((item) => <li key={item}>{item}</li>)}</ul>
    </Link>
  );
}
