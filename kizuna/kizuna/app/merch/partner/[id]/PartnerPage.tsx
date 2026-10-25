"use client";

import Link from "next/link";
import { ProductCard } from "../../MerchHome";
import { useMerchCart, useMerchWishlist } from "@/lib/data/merch/merchStore";
import type { MerchData, PartnerBusiness } from "@/lib/data/merch/merchData";
import ShareToGroup from "@/components/merch/ShareToGroup";
import { useMerchFollow } from "@/lib/data/merch/merchSocial";
import { getEventsForPartner } from "@/lib/data/events/eventsData";

type Story = { story: string; inspiration: string; followers: number };

export default function PartnerPage({ data, partner, story }: { data: MerchData; partner: PartnerBusiness; story: Story }) {
  const { following, toggle: toggleFollow } = useMerchFollow(partner.id);
  const { ids: wishlist, toggle: toggleWishlist } = useMerchWishlist();
  const { toggle: addToCart } = useMerchCart();
  const products = data.products.filter((product) => product.partnerBusinessId === partner.id);
  const otherPartners = data.partners.filter((candidate) => candidate.id !== partner.id && (candidate.city === partner.city || candidate.state === partner.state)).slice(0, 3);
  const fallbackPartners = otherPartners.length ? otherPartners : data.partners.filter((candidate) => candidate.id !== partner.id).slice(0, 3);
  const reviewCount = products.reduce((total, product) => total + product.reviewCount, 0);
  const average = products.length ? (products.reduce((total, product) => total + product.rating, 0) / products.length).toFixed(1) : "—";
  const partnerEvents = getEventsForPartner(partner.id);

  return <div className="merch-page merch-partner-page">
    <Link href="/merch" className="back-link">← Sakura Mercantile</Link>
    <header className="merch-partner-hero card c-cream"><span className="partner-glyph partner-glyph-large" aria-hidden="true">{partner.glyph}</span><div><span className="stamp">Sakura Partner · {partner.city}</span><h1 className="h-page">{partner.name}</h1><p className="lede">{partner.description}</p><p className="small muted">{partner.city}, {partner.state} · {story.followers} demo followers</p></div><button type="button" className={`btn ${following ? "btn-done" : "btn-pink"}`} onClick={toggleFollow} aria-pressed={following}>{following ? "Following" : "Follow maker"}</button></header>
    <section className="merch-maker-story card c-peach"><span className="stamp">Their Story</span><h2 className="h-section">Made slowly, kept closely.</h2><p>{story.story}</p><p>{story.inspiration}</p><strong className="small">They make: {partner.makes}</strong><div className="partner-story-actions"><ShareToGroup />{partner.eventId ? <Link href={`/events/${partner.eventId}`} className="btn btn-ghost">See Event</Link> : null}</div></section>
    <section className="merch-detail-section" aria-labelledby="partner-products-heading"><div className="merch-section-heading"><h2 id="partner-products-heading" className="h-section">Pieces by {partner.name}</h2><span className="small muted">{products.length} demo pieces</span></div>{products.length ? <div className="merch-product-grid">{products.map((product) => <ProductCard key={product.id} product={product} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />)}</div> : <p className="empty">This maker is preparing their first shelf.</p>}</section>
    <section className="merch-detail-section" aria-labelledby="partner-events-heading"><div className="merch-section-heading"><h2 id="partner-events-heading" className="h-section">Upcoming Events</h2><span className="small muted">{partnerEvents.length} linked</span></div>{partnerEvents.length ? <div className="merch-partner-row">{partnerEvents.map((event) => <Link href={`/events/${event.id}`} className="merch-partner-card card c-yellow" key={event.id}><span className="stamp">{event.type}</span><h3 className="h-card">{event.title}</h3><p>{event.date} · {event.cityId === "online" ? "Online" : event.area}</p><span className="back-link">See event →</span></Link>)}</div> : <p className="empty">No upcoming events linked to this partner yet. <Link href="/events">Discover Events</Link>.</p>}</section>
    <section className="merch-partner-stats card surface-note"><div><strong>★ {average}</strong><span>Demo rating</span></div><div><strong>{reviewCount}</strong><span>Mock reviews</span></div><div><strong>{partner.city}</strong><span>Studio city</span></div></section>
    <section className="merch-detail-section"><h2 className="h-section">More makers you may like</h2><div className="merch-partner-row">{fallbackPartners.map((candidate) => <Link href={`/merch/partner/${candidate.id}`} className="merch-partner-card card c-mint" key={candidate.id}><span className="partner-glyph" aria-hidden="true">{candidate.glyph}</span><span className="stamp">Sakura Partner</span><h3 className="h-card">{candidate.name}</h3><p className="small muted">{candidate.city} · {candidate.makes}</p><span className="back-link">Meet the maker →</span></Link>)}</div></section>
  </div>;
}
