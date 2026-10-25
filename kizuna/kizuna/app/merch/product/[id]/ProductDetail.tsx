"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMerchCart, useMerchWishlist } from "@/lib/data/merch/merchStore";
import { getPartnerStory, merchReviews, type MerchData, type MerchProduct, type PartnerBusiness } from "@/lib/data/merch/merchData";
import ShareToGroup from "@/components/merch/ShareToGroup";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const detailCopy: Record<string, { description: string; materials: string; shipping: string; returns: string; care: string; fusion?: string }> = {
  "m-01": { description: "A relaxed haori silhouette cut for layering over everyday clothes, with a block-printed indigo story from Jaipur.", materials: "Hand-block printed cotton", shipping: "Ships in 3–5 working days", returns: "Returns accepted within 7 days if unworn", care: "Cold wash separately; line dry in shade", fusion: "Indigo Matsuri pairs the open shape of a Japanese haori with the patient rhythm of Rajasthan block printing. Each repeat is hand-stamped, so the small shifts are proof that a person made it." },
  "m-02": { description: "A night-train scene in a small risograph run, printed with layered inks on warm recycled stock.", materials: "Recycled archival paper and soy inks", shipping: "Ships in 2–4 working days", returns: "Returns accepted if the print arrives damaged", care: "Keep away from direct sun and moisture" },
  "m-03": { description: "A soft-cover notebook for lists, sketches and the little observations that follow a good song.", materials: "FSC paper and recycled card", shipping: "Ships in 2–3 working days", returns: "Returns accepted within 7 days unused", care: "Store flat and keep dry", fusion: "Paper Kitsune Studio borrows the quiet restraint of Japanese stationery and gives it a warmer Kolkata desk-life: coral covers, Indian paper textures and room for unfinished thoughts." },
  "m-04": { description: "A moon-soft cup thrown in small batches for tea, cocoa and slow evening rituals.", materials: "Stoneware clay and food-safe glaze", shipping: "Made to order; ships in 10–14 working days", returns: "Returns accepted for transit damage", care: "Dishwasher safe; handle with care", },
};

function copyFor(product: MerchProduct) {
  return detailCopy[product.id] ?? { description: `A small-batch piece from ${product.partnerBusinessName}, made for everyday fandom rituals.`, materials: "Materials vary by maker; see the partner story.", shipping: "Ships in 3–7 working days", returns: "Returns depend on the maker and item condition.", care: "Follow the maker's care note included with your order." };
}

function ProductGallery({ product }: { product: MerchProduct }) {
  const images = [product.image, `${product.image} close detail`, `${product.image} in a Sakura workspace`];
  const [selected, setSelected] = useState(0);
  return <div className="merch-detail-gallery"><div className="merch-detail-hero" role="img" aria-label={`${product.name} — ${images[selected]}`}><span aria-hidden="true">{selected === 0 ? product.image.slice(0, 1) : "✦"}</span></div><div className="merch-gallery-thumbs" role="tablist" aria-label="Product images">{images.map((image, index) => <button type="button" key={image} role="tab" aria-selected={selected === index} aria-label={`Show image ${index + 1}: ${image}`} className={selected === index ? "is-selected" : ""} onClick={() => setSelected(index)}><span aria-hidden="true">{index + 1}</span></button>)}</div></div>;
}

function VariantSelector({ label, options }: { label: string; options: string[] }) {
  const [selected, setSelected] = useState(options[0]);
  return <fieldset className="merch-variant"><legend>{label}</legend><div>{options.map((option) => <button type="button" key={option} className={selected === option ? "is-selected" : ""} onClick={() => setSelected(option)} aria-pressed={selected === option}>{option}</button>)}</div></fieldset>;
}

export default function ProductDetail({ data, product, partner }: { data: MerchData; product: MerchProduct; partner: PartnerBusiness }) {
  const copy = copyFor(product);
  const [reportOpen, setReportOpen] = useState(false);
  const [reported, setReported] = useState(false);
  const [notified, setNotified] = useState(false);
  const { ids: wishlist, toggle: toggleWishlist } = useMerchWishlist();
  const { ids: cart, toggle: addToCart } = useMerchCart();
  const saved = wishlist.includes(product.id);
  const inCart = cart.includes(product.id);
  const reviews = merchReviews.filter((review) => review.productId === product.id);
  const relatedProducts = data.products.filter((entry) => entry.id !== product.id && (entry.relatedExploreIds.some((id) => product.relatedExploreIds.includes(id)) || entry.relatedCommunitySlugs.some((slug) => product.relatedCommunitySlugs.includes(slug)))).slice(0, 3);
  const story = getPartnerStory(partner);
  const detailFields = useMemo(() => [["Materials", copy.materials], ["Shipping", copy.shipping], ["Returns", copy.returns], ["Care", copy.care]], [copy]);
  const add = () => { if (product.stockStatus !== "In stock" || inCart) return; addToCart(product.id); };

  return <div className="merch-page merch-detail-page">
    <Link href="/merch/products" className="back-link">← Back to the collection</Link>
    <main className="merch-detail-layout">
      <ProductGallery product={product} />
      <section className="merch-detail-info" aria-labelledby="product-title">
        <span className="stamp">{product.category}</span><h1 id="product-title" className="h-page">{product.name}</h1><p className="small muted">{product.city}, {product.state}</p>
        <div className="merch-badges">{product.isFusion ? <span className="chip">Fusion</span> : null}{product.isHandmade ? <span className="chip">Handmade</span> : null}<span className="small merch-stock">{product.stockStatus}</span></div>
        <div className="merch-detail-price-row"><strong className="merch-detail-price">{money.format(product.price)}</strong><span aria-label={`${product.rating} out of 5 stars, ${product.reviewCount} reviews`}>★ {product.rating} · {product.reviewCount} reviews</span></div>
        <p className="lede">{copy.description}</p>
        {product.stockStatus === "Made to order" ? <div className="merch-notice"><strong>Made to order</strong><span>Your piece is prepared especially for you and ships in 10–14 working days.</span></div> : null}
        <div className="merch-variants">{product.category === "Apparel" ? <VariantSelector label="Size" options={["S", "M", "L", "XL"]} /> : null}{product.category === "Apparel" || product.isFusion ? <VariantSelector label="Colour" options={["Indigo", "Rosewood", "Moss"]} /> : null}{product.stockStatus === "Small batch" ? <VariantSelector label="Edition" options={["Standard", "Signed maker card"]} /> : null}</div>
        <div className="merch-detail-actions"><button type="button" className="btn btn-pink" onClick={add} disabled={product.stockStatus !== "In stock"}>{product.stockStatus !== "In stock" ? "Made in small batch" : inCart ? "In cart" : "Add to cart"}</button><button type="button" className="btn btn-mint" onClick={add} disabled={product.stockStatus !== "In stock"}>Buy now</button><button type="button" className={`merch-heart ${saved ? "is-saved" : ""}`} onClick={() => toggleWishlist(product.id)} aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} aria-pressed={saved}>{saved ? "♥" : "♡"}</button></div>
        {inCart ? <Link href="/merch/cart" className="back-link small">View your cart →</Link> : null}
        {product.stockStatus !== "In stock" ? <button type="button" className="btn btn-ghost" onClick={() => setNotified(true)} disabled={notified}>{notified ? "We'll let you know" : "Notify me when available"}</button> : null}
        <Link href={`/merch/partner/${partner.id}`} className="merch-detail-partner card c-cream"><span className="partner-glyph" aria-hidden="true">{partner.glyph}</span><span><span className="stamp">Sakura Partner</span><strong>{partner.name}</strong><small>{partner.city} · {partner.description}</small></span><span aria-hidden="true">→</span></Link>
      </section>
    </main>
    {copy.fusion ? <section className="merch-story card c-peach"><span className="stamp">Made between worlds</span><h2 className="h-section">Fusion Story</h2><p>{copy.fusion}</p></section> : null}
    <div className="merch-detail-section"><ShareToGroup /></div>
    <section className="merch-detail-section"><h2 className="h-section">Details</h2><p>{copy.description}</p><dl className="merch-detail-list">{detailFields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
    <section className="merch-detail-section"><div className="merch-section-heading"><div><span className="stamp">Sakura demo reviews</span><h2 className="h-section">Notes from the shelf</h2></div><span className="small muted">{reviews.length} mock reviews</span></div>{reviews.length ? <div className="merch-review-grid">{reviews.map((review) => <article className="merch-review card surface-note" key={review.id}><strong>{"★".repeat(review.rating)}</strong><p>{review.text}</p><span className="small muted">{review.reviewer} · {review.verified ? "Verified demo purchase" : "Demo review"}</span>{review.imageLabel ? <span className="small stamp">Image: {review.imageLabel}</span> : null}</article>)}</div> : <p className="empty">No demo reviews yet.</p>}</section>
    <section className="merch-detail-section"><h2 className="h-section">This piece belongs with...</h2><div className="merch-discovery-links">{product.relatedExploreIds.map((id) => <Link href={`/explore?item=${encodeURIComponent(id)}`} className="card c-blue" key={id}>Explore inspiration <strong>{id.replaceAll("-", " ")}</strong></Link>)}{product.relatedCommunitySlugs.map((slug) => <Link href={`/community/${slug}`} className="card c-mint" key={slug}>Find your people <strong>{slug.replaceAll("-", " ")}</strong></Link>)}{relatedProducts.map((entry) => <Link href={`/merch/product/${entry.id}`} className="card c-yellow" key={entry.id}>You may also like <strong>{entry.name}</strong></Link>)}</div></section>
    <div className="merch-report-row">{reported ? <span className="small muted">Thanks — this demo report was recorded locally.</span> : <button type="button" className="text-button" onClick={() => setReportOpen(true)}>Report listing</button>}</div>
    {reportOpen ? <div className="merch-report card" role="dialog" aria-modal="true" aria-labelledby="report-title"><h2 id="report-title" className="h-card">Report listing</h2><p className="small muted">This is a local prototype action. What seems wrong?</p><div className="merch-report-actions">{["Misleading information", "Copied design", "Incorrect product", "Other"].map((reason) => <button type="button" className="btn btn-ghost" key={reason} onClick={() => { setReported(true); setReportOpen(false); }}>{reason}</button>)}</div><button type="button" className="text-button" onClick={() => setReportOpen(false)}>Cancel</button></div> : null}
  </div>;
}
