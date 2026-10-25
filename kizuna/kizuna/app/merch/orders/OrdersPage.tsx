"use client";

import Link from "next/link";
import { useState } from "react";
import { merchOrders, type MerchData, type MerchOrder } from "@/lib/data/merch/merchData";
import { useMerchReviews } from "@/lib/data/merch/merchSocial";

const statuses: MerchOrder["status"][] = ["Placed", "Packed", "Shipped", "Delivered"];

function ReviewPrompt({ order, productId }: { order: MerchOrder; productId: string }) {
  const { reviews, submit } = useMerchReviews();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [image, setImage] = useState(false);
  const existing = reviews.some((review) => review.orderId === order.id && review.productId === productId);
  if (existing) return <span className="small" role="status">Thank you for sharing your note.</span>;
  return <form className="order-review" onSubmit={(event) => { event.preventDefault(); if (rating && text.trim()) submit({ orderId: order.id, productId, rating, text: text.trim(), imageAdded: image }); }}><strong>How was your piece?</strong><div className="review-stars" role="radiogroup" aria-label="Rating">{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} role="radio" aria-checked={rating === value} onClick={() => setRating(value)}>{value <= rating ? "★" : "☆"}</button>)}</div><label className="small">Review<textarea value={text} onChange={(event) => setText(event.target.value)} required placeholder="A few words for the maker..." /></label><label className="small review-image"><input type="checkbox" checked={image} onChange={(event) => setImage(event.target.checked)} /> Add a demo image placeholder</label><button type="submit" className="btn btn-small btn-pink" disabled={!rating || !text.trim()}>Submit review</button></form>;
}

function OrderCard({ order, data }: { order: MerchOrder; data: MerchData }) {
  const products = order.productIds.map((id) => data.products.find((product) => product.id === id)).filter((product): product is MerchData["products"][number] => Boolean(product));
  const partners = order.partnerIds.map((id) => data.partners.find((partner) => partner.id === id)?.name).filter(Boolean);
  const current = statuses.indexOf(order.status);
  return <article className="order-card card surface-note"><div className="merch-section-heading"><div><span className="stamp">{order.status}</span><h2 className="h-card">{order.id}</h2></div><span className="small muted">{new Date(order.date).toLocaleDateString("en-IN")}</span></div><p className="small muted">{partners.join(" · ")}</p><div className="order-products">{products.map((product) => <Link href={`/merch/product/${product.id}`} key={product.id}>{product.name}</Link>)}</div><div className="order-timeline" aria-label={`Order status ${order.status}`}>{statuses.map((status, index) => <span className={index <= current ? "is-done" : ""} key={status}><i aria-hidden="true" />{status}</span>)}</div><p className="small">{order.deliveryEstimate} · <strong>₹{order.total.toLocaleString("en-IN")}</strong></p>{order.status === "Delivered" ? products.map((product) => <ReviewPrompt order={order} productId={product.id} key={product.id} />) : null}</article>;
}

export default function OrdersPage({ data }: { data: MerchData }) {
  return <div className="merch-page merch-listing-page"><Link href="/passport" className="back-link">← Profile</Link><header className="page-head"><span className="stamp">Your maker trail</span><h1 className="h-page">Orders</h1><p className="lede">A small history of pieces finding their way from makers to you.</p></header><div className="orders-list">{merchOrders.map((order) => <OrderCard key={order.id} order={order} data={data} />)}</div>{!merchOrders.length ? <div className="merch-empty card c-yellow"><h2 className="h-section">Your Sakura shelf is still waiting.</h2><Link href="/merch/products" className="btn btn-pink">Browse merch</Link></div> : null}</div>;
}
