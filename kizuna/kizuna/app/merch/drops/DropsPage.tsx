"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useMerchCart } from "@/lib/data/merch/merchStore";
import type { MerchData, MerchDrop } from "@/lib/data/merch/merchData";

type Tab = "upcoming" | "live" | "past";
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function statusFor(drop: MerchDrop): Tab {
  const now = Date.now();
  if (now < new Date(drop.releaseAt).getTime()) return "upcoming";
  if (now <= new Date(drop.endsAt).getTime() && drop.remainingQuantity > 0) return "live";
  return "past";
}

function DropCard({ drop, data }: { drop: MerchDrop; data: MerchData }) {
  const partner = data.partners.find((entry) => entry.id === drop.partnerBusinessId);
  const product = data.products.find((entry) => entry.id === drop.productId);
  const status = statusFor(drop);
  const { toggle: addToCart } = useMerchCart();
  const [notified, setNotified] = useState(false);
  const [countdown, setCountdown] = useState("demo countdown");
  useEffect(() => {
    const update = () => {
      const distance = new Date(drop.releaseAt).getTime() - Date.now();
      if (status === "live") { setCountdown("Live now · demo inventory"); return; }
      if (status === "past") { setCountdown("Ended"); return; }
      setCountdown(`${Math.max(0, Math.floor(distance / 86400000))}d ${Math.max(0, Math.floor(distance / 3600000) % 24)}h until release`);
    };
    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  }, [drop.endsAt, drop.releaseAt, status]);
  return <article className="merch-drop-list-card card surface-note">
    <div className="merch-drop-visual" role="img" aria-label={`${drop.name} — ${drop.image}`}><span aria-hidden="true">✦</span></div>
    <div className="merch-drop-list-copy"><div className="merch-card-top"><span className="stamp">{status === "upcoming" ? "Upcoming" : status === "live" ? "Live drop" : "Past drop"}</span>{drop.groupExclusive ? <span className="chip">Group Exclusive</span> : null}</div>
      <h2 className="h-card">{drop.name}</h2><p className="small muted">{partner?.name} · {partner?.city}</p><div className="drop-countdown" aria-live="polite">{countdown}</div>
      <p className="small">₹{drop.price.toLocaleString("en-IN")} · {drop.quantity} total · {drop.remainingQuantity} remaining · limit {drop.purchaseLimit}/person</p>
      <p className="small muted">Release: {new Date(drop.releaseAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
      <div className="merch-card-bottom">{status === "live" ? <button type="button" className="btn btn-pink" onClick={() => product && addToCart(product.id)}>Shop now</button> : status === "upcoming" ? <button type="button" className="btn btn-ghost" onClick={() => setNotified(true)} disabled={notified}>{notified ? "You're on the demo list" : "Notify me"}</button> : <div className="merch-drop-ended">Sold out / ended</div>}{drop.groupExclusive && drop.groupId ? <Link href={`/community/${drop.groupId}`} className="back-link small">See the community →</Link> : null}{status === "past" && drop.discussionSlug ? <Link href={`/community/${drop.discussionSlug}`} className="back-link small">Discuss →</Link> : null}</div>
    </div>
  </article>;
}

export default function DropsPage({ data }: { data: MerchData }) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const drops = useMemo(() => data.drops.filter((drop) => statusFor(drop) === tab), [data.drops, tab]);
  return <div className="merch-page merch-listing-page"><Link href="/merch" className="back-link">← Sakura Mercantile</Link><header className="page-head"><span className="stamp">Small runs, made with care</span><h1 className="h-page">Exclusive Drops</h1><p className="lede">A slower shelf for limited pieces from Sakura makers. Dates and inventory are mock previews, not live availability.</p></header>
    <section className="plus-banner card c-lav"><div><span className="stamp">Sakura Plus prototype</span><h2 className="h-section">Early access for people who collect slowly.</h2><p className="small">₹99/month · Demo-only membership, no subscription is active.</p></div><button type="button" className="btn btn-ghost">See early access</button></section>
    <div className="merch-tabs" role="tablist" aria-label="Drop status">{(["upcoming", "live", "past"] as Tab[]).map((entry) => <button type="button" role="tab" aria-selected={tab === entry} className={tab === entry ? "is-selected" : ""} key={entry} onClick={() => setTab(entry)}>{entry[0].toUpperCase() + entry.slice(1)}</button>)}</div>
    <section aria-live="polite" className="merch-drop-list">{drops.length ? drops.map((drop) => <DropCard key={drop.id} drop={drop} data={data} />) : <div className="merch-empty card c-yellow"><h2 className="h-section">No {tab} drops in the demo shelf.</h2><p>Try another tab; new maker stories are always taking shape.</p></div>}</section>
  </div>;
}
