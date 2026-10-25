"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMerchCart, useMerchWishlist } from "@/lib/data/merch/merchStore";
import type { MerchCategory, MerchData } from "@/lib/data/merch/merchData";
import { ProductCard } from "../MerchHome";

type DiscoveryFilter = "Fusion" | "Handmade" | "Made in India" | "New Sellers";
type Sort = "popularity" | "price-asc" | "price-desc" | "newest";
type InitialFilters = { category?: string; query?: string; partner?: string; city?: string; filter?: string };

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const filters: DiscoveryFilter[] = ["Fusion", "Handmade", "Made in India", "New Sellers"];

function matchesFilter(filter: DiscoveryFilter, product: MerchData["products"][number]) {
  return filter === "Fusion" ? product.isFusion : filter === "Handmade" ? product.isHandmade : filter === "Made in India" ? product.isMadeInIndia : product.isNewSeller;
}

export default function ProductListing({ data, initialFilters }: { data: MerchData; initialFilters: InitialFilters }) {
  const [query, setQuery] = useState(initialFilters.query ?? "");
  const [category, setCategory] = useState(initialFilters.category ?? "");
  const [partner, setPartner] = useState(initialFilters.partner ?? "");
  const [city, setCity] = useState(initialFilters.city ?? "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);
  const [activeFilters, setActiveFilters] = useState<DiscoveryFilter[]>(initialFilters.filter && filters.includes(initialFilters.filter as DiscoveryFilter) ? [initialFilters.filter as DiscoveryFilter] : []);
  const [sort, setSort] = useState<Sort>("popularity");
  const [loading, setLoading] = useState(false);
  const { ids: wishlist, toggle: toggleWishlist } = useMerchWishlist();
  const { toggle: addToCart } = useMerchCart();

  const toggleDiscoveryFilter = (filter: DiscoveryFilter) => setActiveFilters((current) => current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]);
  const clearFilters = () => {
    setQuery(""); setCategory(""); setPartner(""); setCity(""); setMinPrice(""); setMaxPrice(""); setInStock(false); setActiveFilters([]);
  };
  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = data.products.filter((product) => {
      const haystack = [product.name, product.partnerBusinessName, product.category, product.city, product.state, ...product.tags].join(" ").toLowerCase();
      return (!normalizedQuery || haystack.includes(normalizedQuery))
        && (!category || product.category === category)
        && (!partner || product.partnerBusinessId === partner)
        && (!city || product.city === city)
        && (!minPrice || product.price >= Number(minPrice))
        && (!maxPrice || product.price <= Number(maxPrice))
        && (!inStock || product.stockStatus === "In stock")
        && activeFilters.every((filter) => matchesFilter(filter, product));
    });
    return [...filtered].sort((a, b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : sort === "newest" ? b.publishedAt.localeCompare(a.publishedAt) : b.popularity - a.popularity);
  }, [activeFilters, category, city, data.products, inStock, maxPrice, minPrice, partner, query, sort]);

  const resetAndLoad = (callback: () => void) => {
    setLoading(true);
    callback();
    window.setTimeout(() => setLoading(false), 160);
  };

  return <div className="merch-page merch-listing-page">
    <header className="merch-listing-header">
      <div><Link href="/merch" className="back-link">← Sakura Mercantile</Link><span className="stamp">A considered shelf</span><h1 className="h-page">Browse the whole collection.</h1><p className="lede">Find something made by a person who loves the same stories, sounds and worlds.</p></div>
      <label className="merch-search merch-listing-search"><span className="sr-only">Search merch</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search makers, textiles, prints..." /></label>
    </header>
    <div className="merch-listing-toolbar"><strong>{results.length} {results.length === 1 ? "piece" : "pieces"}</strong><div className="merch-toolbar-actions"><label className="small">Sort <select value={sort} onChange={(event) => setSort(event.target.value as Sort)}><option value="popularity">Demo popularity</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="newest">Newest</option></select></label><button type="button" className="btn btn-small btn-pink merch-mobile-filter" onClick={() => document.getElementById("merch-filters")?.scrollIntoView({ behavior: "smooth" })}>Filters</button></div></div>
    <div className="merch-listing-layout">
      <aside id="merch-filters" className="merch-filter-panel card surface-note" aria-label="Product filters">
        <div className="merch-filter-heading"><h2 className="h-card">Refine the shelf</h2><button type="button" className="text-button" onClick={clearFilters}>Clear</button></div>
        <fieldset><legend>Discovery chips</legend><div className="merch-filter-chips">{filters.map((filter) => <button type="button" className={`chip chip-link ${activeFilters.includes(filter) ? "on" : ""}`} key={filter} onClick={() => toggleDiscoveryFilter(filter)} aria-pressed={activeFilters.includes(filter)}>{filter}</button>)}</div></fieldset>
        <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{data.categories.map((entry: MerchCategory) => <option key={entry} value={entry}>{entry}</option>)}</select></label>
        <label>Partner business<select value={partner} onChange={(event) => setPartner(event.target.value)}><option value="">All partners</option>{data.partners.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label>
        <label>City / state<select value={city} onChange={(event) => setCity(event.target.value)}><option value="">All cities</option>{data.cities.map((entry) => <option key={entry.name} value={entry.name}>{entry.name}, {entry.state}</option>)}</select></label>
        <div className="merch-price-fields"><label>Min price<input type="number" min="0" step="100" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder={money.format(0)} /></label><label>Max price<input type="number" min="0" step="100" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder={money.format(3000)} /></label></div>
        <label className="merch-checkbox"><input type="checkbox" checked={inStock} onChange={(event) => setInStock(event.target.checked)} /> Only show in stock</label>
      </aside>
      <section aria-live="polite" aria-label="Product results">{loading ? <div className="merch-product-grid">{[1, 2, 3, 4].map((item) => <div className="merch-skeleton card" key={item} aria-label="Loading product" />)}</div> : results.length ? <div className="merch-product-grid">{results.map((product) => <ProductCard key={product.id} product={product} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />)}</div> : <div className="merch-empty card c-yellow"><span className="stamp">A quiet shelf</span><h2 className="h-section">No pieces found.</h2><p>Try loosening a filter or searching for another maker, city or texture.</p><div className="merch-empty-actions"><button type="button" className="btn btn-pink" onClick={() => resetAndLoad(clearFilters)}>Clear filters</button><Link href="/merch" className="btn btn-ghost">Browse all merch</Link></div></div>}</section>
    </div>
  </div>;
}
