"use client";

import Link from "next/link";
import { useState } from "react";
import { useMerchCart, useMerchWishlist } from "@/lib/data/merch/merchStore";
import type { MerchData } from "@/lib/data/merch/merchData";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function WishlistPage({ data }: { data: MerchData }) {
  const { ids, toggle } = useMerchWishlist();
  const { toggle: addToCart } = useMerchCart();
  const [alerts, setAlerts] = useState<Record<string, string>>({});
  const products = data.products.filter((product) => ids.includes(product.id));
  return <div className="merch-page merch-listing-page"><Link href="/merch" className="back-link">← Sakura Mercantile</Link><header className="page-head"><span className="stamp">Things worth keeping an eye on</span><h1 className="h-page">Wishlist</h1><p className="lede">Your saved pieces, waiting patiently.</p></header>{products.length ? <div className="wishlist-grid">{products.map((product) => <article className="wishlist-item card surface-note" key={product.id}><div className="merch-product-visual" role="img" aria-label={`${product.name} — ${product.image}`}><span aria-hidden="true">{product.image.slice(0, 1)}</span></div><div className="wishlist-copy"><Link href={`/merch/product/${product.id}`} className="merch-product-name h-card">{product.name}</Link><p className="small muted"><Link href={`/merch/partner/${product.partnerBusinessId}`} className="merch-partner-link">{product.partnerBusinessName}</Link> · {product.city}</p><div className="merch-badges">{product.isFusion ? <span className="chip">Fusion</span> : null}<span className="small merch-stock">{product.stockStatus}</span></div><strong>{money.format(product.price)}</strong><div className="wishlist-actions"><button type="button" className="btn btn-small btn-pink" onClick={() => addToCart(product.id)} disabled={product.stockStatus !== "In stock"}>{product.stockStatus === "In stock" ? "Add to cart" : "Notify me"}</button><button type="button" className="text-button" onClick={() => toggle(product.id)}>Remove</button></div><div className="wishlist-alerts"><button type="button" className="chip chip-link" onClick={() => setAlerts((current) => ({ ...current, [product.id]: "Restock alert set for this demo" }))}>Restocked</button><button type="button" className="chip chip-link" onClick={() => setAlerts((current) => ({ ...current, [product.id]: "Price-drop alert set for this demo" }))}>Price dropped</button>{alerts[product.id] ? <span className="small" role="status">{alerts[product.id]}</span> : null}</div></div></article>)}</div> : <div className="merch-empty card c-yellow"><h2 className="h-section">Nothing saved yet. Find something worth keeping.</h2><Link href="/merch/products" className="btn btn-pink">Browse merch</Link></div>}</div>;
}
