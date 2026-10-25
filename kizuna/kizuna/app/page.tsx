import Link from "next/link";
import { Sparkle, Squiggle } from "@/components/Doodles";
import { SampleNote } from "@/components/Bits";
import { getHomeData, getMediaById } from "@/lib/data/home/homeData";
import { events, getCity } from "@/lib/data/events/eventsData";
import { mediaImage } from "@/lib/format";

export default async function Home() {
  const data = await getHomeData();

  return (
    <>
      <section className="hero-moment" aria-labelledby="moment-title">
        <SampleNote what="cultural moments" />
        <div className="moment-card c-pink wob1">
          <div className="moment-img" style={{ backgroundImage: `url(${data.featured.imageUrl})` }} />
          <div className="moment-content">
            <span className="moment-type">{data.featured.type}</span>
            <h1 id="moment-title" className="h-hero">{data.featured.title}</h1>
            <p className="lede">{data.featured.description}</p>
            <Link href={data.featured.ctaHref} className="btn btn-pink">
              {data.featured.ctaText}
            </Link>
          </div>
        </div>
      </section>

      <section className="world-gateway block" aria-labelledby="worlds-title">
        <div className="explore-section-head">
          <div>
            <span className="stamp">Four ways in</span>
            <h2 id="worlds-title" className="h-section">Explore SAKURA</h2>
          </div>
          <span className="small muted">Find your next circle</span>
        </div>
        <div className="world-gateway-grid">
          <Link href="/explore" className="world-gateway-card world-explore">
            <span className="world-gateway-mark" aria-hidden="true">見</span>
            <span className="stamp">01 / Discover</span>
            <h3 className="h-card">Explore</h3>
            <p>Anime, music, films and the cultural threads between them.</p>
            <span className="small">Browse the shelves →</span>
          </Link>
          <Link href="/community" className="world-gateway-card world-community">
            <span className="world-gateway-mark" aria-hidden="true">輪</span>
            <span className="stamp">02 / Belong</span>
            <h3 className="h-card">Community</h3>
            <p>Groups, conversations and a place for your particular niche.</p>
            <span className="small">Meet your people →</span>
          </Link>
          <Link href="/events" className="world-gateway-card world-events">
            <span className="world-gateway-mark" aria-hidden="true">生</span>
            <span className="stamp">03 / Gather</span>
            <h3 className="h-card">Events</h3>
            <p>Watch parties, conventions and small plans worth showing up for.</p>
            <span className="small">See what is happening →</span>
          </Link>
          <Link href="/merch" className="world-gateway-card world-merch">
            <span className="world-gateway-mark" aria-hidden="true">集</span>
            <span className="stamp">04 / Collect</span>
            <h3 className="h-card">Merch</h3>
            <p>Independent makers, thoughtful objects and stories to keep.</p>
            <span className="small">Meet the makers →</span>
          </Link>
        </div>
      </section>

      <section className="block" aria-labelledby="picked-title">
        <h2 id="picked-title" className="h-section">Picked for you</h2>
        <div className="horizontal-scroll">
          {data.recommendations.map((rec) => {
            const media = getMediaById(rec.mediaId);
            return (
              <Link key={rec.mediaId} href={`/discover/${rec.mediaId}`} className="card rec-card wob2 c-lav">
                {media && mediaImage(media) ? <img className="rec-img" src={mediaImage(media)} alt="" loading="lazy" /> : <div className="rec-img rec-img-fallback" aria-hidden="true">{media?.kind.slice(0, 1).toUpperCase()}</div>}
                <div className="rec-info">
                  <span className="rec-type">{media?.kind}</span>
                  <h3 className="h-card">{media?.title}</h3>
                  <p className="rec-reason">{rec.reason}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="block" aria-labelledby="trends-title">
        <h2 id="trends-title" className="h-section">What's trending</h2>
        <ul className="trends-grid">
          {data.trends.map((trend) => {
            const media = getMediaById(trend.mediaId);
            return (
              <li key={trend.mediaId} className="card trend-card wob3 c-blue">
                {media && mediaImage(media) ? <img className="trend-img" src={mediaImage(media)} alt="" loading="lazy" /> : <div className="trend-img trend-img-fallback" aria-hidden="true">{media?.kind.slice(0, 1).toUpperCase()}</div>}
                <div className="trend-info">
                  <span className="trend-metric">{trend.metric}</span>
                  <h3 className="h-card">{media?.title}</h3>
                  <span className="trend-category">{media?.kind}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="block" aria-labelledby="events-title">
        <div className="explore-section-head"><h2 id="events-title" className="h-section">What's happening around Sakura</h2><Link href="/events" className="small">See all Events →</Link></div>
        <div className="home-event-row">{events.filter((event) => event.status !== "Past" && event.type !== "Convention").slice(0, 3).map((event) => <Link href={`/events/${event.id}`} className={`card home-event-card ${event.imageTone}`} key={event.id}><span className="stamp">{event.type}</span><h3 className="h-card">{event.title}</h3><p>{event.date} · {getCity(event.cityId)?.name ?? "Online"}</p><span className="small">Meet people around this →</span></Link>)}</div>
      </section>

      <section className="block" aria-labelledby="sakura-title">
        <h2 id="sakura-title" className="h-section">Your Sakura</h2>
        <div className="user-summary-card card c-mint wob1">
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-val">{data.userSummary.communitiesJoined}</span>
              <span className="summary-lbl">Communities</span>
            </div>
            <div className="summary-item">
              <span className="summary-val">{data.userSummary.titlesSaved}</span>
              <span className="summary-lbl">Titles Saved</span>
            </div>
            <div className="summary-item">
              <span className="summary-val">{data.userSummary.eventsComingUp}</span>
              <span className="summary-lbl">Events</span>
            </div>
            <div className="summary-item">
              <span className="summary-val">{data.userSummary.interestsActive}</span>
              <span className="summary-lbl">Interests</span>
            </div>
          </div>
        </div>
      </section>

      <section className="block" aria-labelledby="discover-title">
        <h2 id="discover-title" className="h-section">Discover</h2>
        <div className="discover-grid">
          {data.discoverCategories.map((cat) => (
            <Link key={cat.id} href={cat.href} className={`card discover-card ${cat.colorClass} wob2`}>
              <div className="discover-head">
                <span className="discover-label">{cat.label}</span>
              </div>
              <ul className="discover-list">
                {cat.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <p>Explore more of the world <Squiggle width={40} /> <Sparkle size={20} /></p>
      </footer>
    </>
  );
}
