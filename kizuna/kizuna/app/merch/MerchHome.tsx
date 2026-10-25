"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useMerchCart, useMerchWishlist } from "@/lib/data/merch/merchStore";
import type { MerchData, MerchProduct, PartnerBusiness } from "@/lib/data/merch/merchData";

type Filter = "Fusion" | "Handmade" | "Made in India" | "New Sellers";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function ProductVisual({ product }: { product: MerchProduct }) {
  return <div className="merch-product-visual" role="img" aria-label={`${product.name} — ${product.image}`}><span aria-hidden="true">{product.image.slice(0, 1)}</span></div>;
}

export function ProductCard({ product, wishlist, toggleWishlist, addToCart }: { product: MerchProduct; wishlist: string[]; toggleWishlist: (id: string) => void; addToCart: (id: string) => void }) {
  const saved = wishlist.includes(product.id);
  return <article className="merch-product-card card surface-note">
    <Link href={`/merch/product/${product.id}`} className="merch-product-link"><ProductVisual product={product} /></Link>
    <div className="merch-product-copy">
      <div className="merch-card-top"><span className="stamp">{product.category}</span><button type="button" className={`merch-heart ${saved ? "is-saved" : ""}`} onClick={() => toggleWishlist(product.id)} aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} aria-pressed={saved}>{saved ? "♥" : "♡"}</button></div>
      <h3 className="h-card"><Link href={`/merch/product/${product.id}`} className="merch-product-name">{product.name}</Link></h3>
      <p className="small muted"><Link href={`/merch/partner/${product.partnerBusinessId}`} className="merch-partner-link">{product.partnerBusinessName}</Link> · {product.city}</p>
      <div className="merch-badges">{product.isFusion ? <span className="chip">Fusion</span> : null}{product.isHandmade ? <span className="chip">Handmade</span> : null}</div>
      <span className="small merch-stock">{product.stockStatus}</span>
      <div className="merch-card-bottom"><strong>{money.format(product.price)}</strong><button type="button" className="btn btn-small btn-ghost" onClick={() => addToCart(product.id)} aria-label={`Add ${product.name} to cart`}>Add</button></div>
    </div>
  </article>;
}

function PartnerCard({ partner }: { partner: PartnerBusiness }) {
  return <article className="merch-partner-card card c-cream"><span className="partner-glyph" aria-hidden="true">{partner.glyph}</span><span className="stamp">Sakura Partner</span><h3 className="h-card">{partner.name}</h3><p className="small muted">{partner.city} · {partner.state}</p><p>{partner.description}</p><strong className="small">Makes: {partner.makes}</strong><Link href={`/merch/partner/${partner.id}`} className="btn btn-small btn-mint">Visit shop</Link></article>;
}

function DropCard({ drop, partner, product }: { drop: MerchData["drops"][number]; partner?: PartnerBusiness; product?: MerchProduct }) {
  const [timeLeft, setTimeLeft] = useState("countdown preview");
  useEffect(() => {
    const update = () => {
      const distance = new Date(drop.endsAt).getTime() - Date.now();
      if (distance <= 0) { setTimeLeft("drop preview ended"); return; }
      const hours = Math.floor(distance / 3600000);
      const minutes = Math.floor((distance % 3600000) / 60000);
      setTimeLeft(`${hours}h ${minutes}m left`);
    };
    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  }, [drop.endsAt]);
  return <article className="merch-drop-card card c-pink"><div className="merch-drop-visual" role="img" aria-label={`${drop.name} — ${drop.image}`}><span aria-hidden="true">✦</span></div><div className="merch-drop-copy"><span className="stamp">Limited run · {drop.quantity} pieces</span><h3 className="h-card">{drop.name}</h3><p className="small muted">{partner?.name}</p><div className="drop-countdown" aria-live="polite">{timeLeft}</div><div className="merch-card-bottom"><strong>{money.format(product?.price ?? drop.price)}</strong><button type="button" className="btn btn-small btn-ghost">Notify me</button></div></div></article>;
}

export default function MerchHome({ data }: { data: MerchData }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [loading, setLoading] = useState(true);
  const { ids: wishlist, toggle: toggleWishlist } = useMerchWishlist();
  const { ids: cart, toggle: addToCart } = useMerchCart();
  useEffect(() => { const timer = window.setTimeout(() => setLoading(false), 180); return () => window.clearTimeout(timer); }, []);
  const filtered = useMemo(() => data.products.filter((product) => {
    const text = [product.name, product.partnerBusinessName, product.city, product.category, ...product.tags].join(" ").toLowerCase();
    const matchesQuery = !query.trim() || text.includes(query.trim().toLowerCase());
    const matchesFilters = filters.every((filter) => filter === "Fusion" ? product.isFusion : filter === "Handmade" ? product.isHandmade : filter === "Made in India" ? product.isMadeInIndia : product.isNewSeller);
    return matchesQuery && matchesFilters;
  }), [data.products, filters, query]);
  const trending = [...data.products].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  const partnerMap = new Map(data.partners.map((partner) => [partner.id, partner]));
  const productsById = new Map(data.products.map((product) => [product.id, product]));
  const toggleFilter = (filter: Filter) => setFilters((current) => current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]);
  const handleWishlist = (id: string) => {
    toggleWishlist(id);
    void fetch("/api/relationships", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ entityType: "PRODUCT", entityId: id }) });
  };

  const listingHref = `/merch/products${filters.length ? `?filter=${encodeURIComponent(filters[0])}` : ""}`;
  return <div className="merch-page">
    <header className="merch-header"><div><span className="stamp">Sakura Mercantile</span><h1 className="h-page">Made by people who love the same things.</h1></div><div className="merch-header-actions"><button type="button" className="merch-icon-button" aria-label={`${wishlist.length} items in wishlist`}>♡ <span>{wishlist.length}</span></button><Link href="/merch/cart" className="merch-icon-button" aria-label={`${cart.length} items in cart`}>集 <span>{cart.length}</span></Link></div><label className="merch-search"><span className="sr-only">Search Sakura merch</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search makers, textiles, prints..." /></label></header>
    <section className="merch-section" aria-labelledby="categories-heading"><div className="merch-section-heading"><h2 id="categories-heading" className="h-section">Find your kind of thing</h2><Link href="/merch/products" className="small back-link">Browse all</Link></div><div className="merch-category-row">{data.categories.map((entry) => <Link href={`/merch/products?category=${encodeURIComponent(entry)}`} className="merch-category-chip" key={entry}>{entry}</Link>)}</div></section>
    <section className="merch-section merch-drops-section" aria-labelledby="drops-heading"><div className="merch-section-heading"><div><span className="stamp">Small runs, big feeling</span><h2 id="drops-heading" className="h-section">Exclusive Drops</h2></div><Link href="/merch/drops" className="small back-link">See all drops</Link></div><div className="merch-drop-row">{data.drops.slice(0, 2).map((drop) => <DropCard key={drop.id} drop={drop} partner={partnerMap.get(drop.partnerBusinessId)} product={productsById.get(drop.productId)} />)}</div></section>
    <section className="merch-section" aria-labelledby="new-heading"><div className="merch-section-heading"><h2 id="new-heading" className="h-section">New Arrivals</h2><Link href={listingHref} className="stamp">See all {filtered.length} finds</Link></div><div className="merch-filter-row">{(["Fusion", "Handmade", "Made in India", "New Sellers"] as Filter[]).map((filter) => <button type="button" className={`chip chip-link ${filters.includes(filter) ? "on" : ""}`} key={filter} onClick={() => toggleFilter(filter)} aria-pressed={filters.includes(filter)}>{filter}</button>)}</div>{loading ? <div className="merch-product-grid">{[1, 2, 3].map((item) => <div className="merch-skeleton card" key={item} aria-label="Loading product" />)}</div> : filtered.length ? <div className="merch-product-grid">{filtered.slice(0, 6).map((product) => <ProductCard key={product.id} product={product} wishlist={wishlist} toggleWishlist={handleWishlist} addToCart={addToCart} />)}</div> : <p className="empty">Nothing on this shelf yet. Try another maker, category or filter.</p>}</section>
    <section className="merch-section" aria-labelledby="trending-heading"><div className="merch-section-heading"><h2 id="trending-heading" className="h-section">Trending in India</h2><span className="small muted">Sakura demo picks, not market statistics</span></div><div className="merch-product-grid">{trending.map((product) => <ProductCard key={product.id} product={product} wishlist={wishlist} toggleWishlist={handleWishlist} addToCart={addToCart} />)}</div></section>
    <section className="merch-section" aria-labelledby="group-picks-heading"><div className="merch-section-heading"><div><span className="stamp">From your circles</span><h2 id="group-picks-heading" className="h-section">Group Picks</h2></div><Link href="/community" className="small back-link">Visit Community →</Link></div><div className="group-picks-row">{data.groupPicks.slice(0, 3).map((pick) => { const product = data.products.find((entry) => entry.id === pick.productId); return product ? <Link href={`/merch/product/${product.id}`} className="group-pick-card card c-mint" key={pick.productId}><span className="stamp">Community pick</span><strong>{product.name}</strong><span className="small">{pick.signal}</span><span className="small back-link">See piece →</span></Link> : null; })}</div></section>
    <section className="merch-section" aria-labelledby="partners-heading"><h2 id="partners-heading" className="h-section">Featured Partner Businesses</h2><div className="merch-partner-row">{data.partners.map((partner) => <PartnerCard key={partner.id} partner={partner} />)}</div></section>
    <section className="merch-section" aria-labelledby="cities-heading"><div className="merch-section-heading"><h2 id="cities-heading" className="h-section">Shop by City / State</h2><span className="small muted">Your fandom is made here.</span></div><div className="merch-city-grid">{data.cities.map((city) => <button type="button" className={`merch-city-card card ${city.tint}`} key={city.name} onClick={() => setQuery(city.name)}><span className="stamp">Made in</span><strong>{city.name}</strong><span>{city.state} · {city.productCount} demo pieces</span></button>)}</div></section>
    <aside className="merch-cart-note" aria-live="polite">{cart.length ? `${cart.length} piece${cart.length === 1 ? "" : "s"} held in your local cart` : "Local demo cart is empty"}<Link href="/merch/cart">Open cart →</Link></aside>
  </div>;
}
