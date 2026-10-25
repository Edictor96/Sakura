"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useMerchCartItems, useMerchWishlist } from "@/lib/data/merch/merchStore";
import type { MerchData } from "@/lib/data/merch/merchData";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function CartPage({ data }: { data: MerchData }) {
  const { items, updateQuantity, remove, moveToWishlist } = useMerchCartItems();
  const { toggle: addWishlist } = useMerchWishlist();
  const rows = items.map((item) => ({ item, product: data.products.find((product) => product.id === item.productId) })).filter((row): row is { item: typeof row.item; product: NonNullable<typeof row.product> } => Boolean(row.product));
  const groups = useMemo(() => rows.reduce<Record<string, typeof rows>>((result, row) => { (result[row.product.partnerBusinessId] ??= []).push(row); return result; }, {}), [rows]);
  const subtotal = rows.reduce((total, row) => total + row.product.price * row.item.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 1500 ? 0 : 99;
  const total = subtotal + shipping;
  const move = (productId: string) => { addWishlist(productId); moveToWishlist(productId); };
  return <div className="merch-page merch-listing-page"><Link href="/merch" className="back-link">← Sakura Mercantile</Link><header className="page-head"><span className="stamp">Your collected pieces</span><h1 className="h-page">Cart</h1><p className="lede">A local demo cart, grouped by the makers who made your shelf interesting.</p></header>
    {!rows.length ? <div className="merch-empty card c-yellow"><h2 className="h-section">Your cart is quiet.</h2><p>Find a piece from an independent Sakura maker and bring it here.</p><Link href="/merch/products" className="btn btn-pink">Browse merch</Link></div> : <div className="cart-layout"><section>{Object.entries(groups).map(([partnerId, partnerRows]) => { const partner = data.partners.find((entry) => entry.id === partnerId); return <section className="cart-partner-group" key={partnerId}><h2 className="h-section">{partner?.name ?? "Sakura maker"}</h2>{partnerRows.map(({ item, product }) => <article className="cart-item card surface-note" key={product.id}><div className="merch-product-visual" role="img" aria-label={`${product.name} — ${product.image}`}><span aria-hidden="true">{product.image.slice(0, 1)}</span></div><div className="cart-item-copy"><Link href={`/merch/product/${product.id}`} className="merch-product-name h-card">{product.name}</Link><span className="small muted">{item.variant} · {product.city}</span><strong>{money.format(product.price)}</strong><label className="small">Quantity<select value={item.quantity} onChange={(event) => updateQuantity(product.id, Number(event.target.value))}>{[1, 2, 3, 4, 5].map((quantity) => <option key={quantity} value={quantity}>{quantity}</option>)}</select></label><div className="cart-item-actions"><button type="button" className="text-button" onClick={() => move(product.id)}>Move to wishlist</button><button type="button" className="text-button" onClick={() => remove(product.id)}>Remove</button></div></div></article>)}</section>})}</section>
      <aside className="cart-summary card c-cream"><h2 className="h-section">Price summary</h2><div><span>Subtotal</span><strong>{money.format(subtotal)}</strong></div><div><span>Shipping</span><strong>{shipping ? money.format(shipping) : "Free"}</strong></div><div className="cart-total"><span>Total</span><strong>{money.format(total)}</strong></div><p className="small muted">Demo shipping: free over ₹1,500, otherwise ₹99. Not a courier quote.</p><Link href="/merch/checkout" className="btn btn-pink">Continue to checkout</Link></aside>
    </div>}
  </div>;
}
