import Link from "next/link";
import { Sparkle, Squiggle } from "@/components/Doodles";
import { SampleNote } from "@/components/Bits";
import { getHomeData, getMediaById } from "@/lib/data/home/homeData";
import { events, getCity } from "@/lib/data/events/eventsData";

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

      <section className="block" aria-labelledby="picked-title">
        <h2 id="picked-title" className="h-section">Picked for you</h2>
        <div className="horizontal-scroll">
          {data.recommendations.map((rec) => {
            const media = getMediaById(rec.mediaId);
            return (
              <Link key={rec.mediaId} href={`/discover/${rec.mediaId}`} className="card rec-card wob2 c-lav">
                <div className="rec-img" style={{ backgroundImage: `url(/api/placeholder/150/200)` }} />
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
                <div className="trend-img" style={{ backgroundImage: `url(/api/placeholder/100/100)` }} />
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
