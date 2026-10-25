import Link from "next/link";
import { HomeFeatured } from "@/lib/data/home/homeData";

export function HeroMoment({ featured }: { featured: HomeFeatured }) {
  return (
    <section className="hero-moment" aria-labelledby="moment-title">
      <div className="moment-card c-pink wob1">
        <div 
          className="moment-img" 
          style={{ backgroundImage: `url(${featured.imageUrl})` }} 
        />
        <div className="moment-content">
          <span className="moment-type">{featured.type}</span>
          <h1 id="moment-title" className="h-hero">{featured.title}</h1>
          <p className="lede">{featured.description}</p>
          <Link href={featured.ctaHref} className="btn btn-pink">
            {featured.ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
