"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useMerchCartItems } from "@/lib/data/merch/merchStore";
import type { MerchData } from "@/lib/data/merch/merchData";

type Step = "address" | "review" | "payment" | "confirmation";
type Address = { name: string; phone: string; address: string; city: string; state: string; pin: string };
const emptyAddress: Address = { name: "", phone: "", address: "", city: "", state: "", pin: "" };
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function CheckoutPage({ data }: { data: MerchData }) {
  const { items, remove } = useMerchCartItems();
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState(emptyAddress);
  const [errors, setErrors] = useState<Partial<Address>>({});
  const [payment, setPayment] = useState("UPI Demo");
  const [orderNumber, setOrderNumber] = useState("");
  const rows = items.map((item) => ({ item, product: data.products.find((product) => product.id === item.productId) })).filter((row): row is { item: typeof row.item; product: NonNullable<typeof row.product> } => Boolean(row.product));
  const subtotal = rows.reduce((total, row) => total + row.product.price * row.item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 1500 ? 0 : 99;
  const total = subtotal + shipping;
  const validate = () => {
    const next: Partial<Address> = {};
    (Object.keys(emptyAddress) as (keyof Address)[]).forEach((key) => { if (!address[key].trim()) next[key] = "Required"; });
    if (address.phone && !/^[0-9+\-\s]{10,15}$/.test(address.phone)) next.phone = "Enter a valid demo phone number";
    if (address.pin && !/^[0-9]{6}$/.test(address.pin)) next.pin = "Enter a 6-digit PIN code";
    setErrors(next);
    return !Object.keys(next).length;
  };
  const placeOrder = (event: FormEvent) => { event.preventDefault(); setOrderNumber(`SK-${new Date().getFullYear()}-${String(total).padStart(5, "0")}`); rows.forEach((row) => remove(row.product.id)); setStep("confirmation"); };
  const update = (key: keyof Address, value: string) => setAddress((current) => ({ ...current, [key]: value }));
  const steps: Step[] = ["address", "review", "payment", "confirmation"];
  const stepIndex = steps.indexOf(step);
  const confirmationRows = useMemo(() => rows, [rows]);
  if (!rows.length && step !== "confirmation") return <div className="merch-page merch-listing-page"><Link href="/merch/cart" className="back-link">← Cart</Link><div className="merch-empty card c-yellow"><h1 className="h-section">There is nothing to check out yet.</h1><Link href="/merch/products" className="btn btn-pink">Browse merch</Link></div></div>;
  return <div className="merch-page merch-listing-page"><Link href={step === "confirmation" ? "/merch" : "/merch/cart"} className="back-link">← {step === "confirmation" ? "Sakura Mercantile" : "Cart"}</Link><header className="page-head"><span className="stamp">Mock checkout · no payment collected</span><h1 className="h-page">{step === "confirmation" ? "A little parcel is on its way." : "Checkout"}</h1></header>
    <div className="checkout-steps" aria-label="Checkout progress">{steps.map((entry, index) => <span className={index <= stepIndex ? "is-current" : ""} key={entry}>{index + 1}. {entry}</span>)}</div>
    {step === "confirmation" ? <section className="confirmation-card card c-mint"><span className="stamp">Demo order confirmed</span><h2 className="h-section">Thank you, {address.name || "collector"}.</h2><p>Order <strong>{orderNumber}</strong> is placed in the Sakura prototype.</p><div className="confirmation-items">{confirmationRows.map(({ item, product }) => <div key={product.id}><span>{product.name} × {item.quantity}</span><span>{money.format(product.price * item.quantity)}</span></div>)}</div><div className="cart-total"><span>Total</span><strong>{money.format(total)}</strong></div><p className="small muted">Delivery estimate: 3–7 working days · Status: Demo order received</p><Link href="/passport" className="btn btn-pink">View Orders</Link></section> : <div className="checkout-layout"><form className="checkout-form card surface-note" onSubmit={(event) => { if (step === "address") { event.preventDefault(); if (validate()) setStep("review"); } else if (step === "review") { event.preventDefault(); setStep("payment"); } else placeOrder(event); }}>
      {step === "address" ? <fieldset><legend className="h-section">1. Delivery address</legend><p className="small muted">Required fields are marked by validation after you continue.</p>{(["name", "phone", "address", "city", "state", "pin"] as (keyof Address)[]).map((key) => <label key={key}>{key === "pin" ? "PIN code" : key[0].toUpperCase() + key.slice(1)}<input value={address[key]} onChange={(event) => update(key, event.target.value)} aria-invalid={Boolean(errors[key])} />{errors[key] ? <span className="form-error" role="alert">{errors[key]}</span> : null}</label>)}<button type="submit" className="btn btn-pink">Continue to review</button></fieldset> : null}
      {step === "review" ? <fieldset><legend className="h-section">2. Review your parcel</legend>{rows.map(({ item, product }) => <div className="checkout-line" key={product.id}><span>{product.name} × {item.quantity}</span><strong>{money.format(product.price * item.quantity)}</strong></div>)}<div className="checkout-line"><span>Demo shipping</span><strong>{shipping ? money.format(shipping) : "Free"}</strong></div><div className="cart-total"><span>Total</span><strong>{money.format(total)}</strong></div><button type="submit" className="btn btn-pink">Continue to payment</button></fieldset> : null}
      {step === "payment" ? <fieldset><legend className="h-section">3. Payment</legend><div className="mock-payment-note"><strong>MOCK / DEMO ONLY</strong><span>No card or bank details are collected.</span></div>{["UPI Demo", "Card Demo", "Cash on Delivery Demo"].map((option) => <label className="payment-option" key={option}><input type="radio" name="payment" value={option} checked={payment === option} onChange={(event) => setPayment(event.target.value)} />{option}</label>)}<button type="submit" className="btn btn-pink">Place mock order</button></fieldset> : null}
    </form><aside className="cart-summary card c-cream"><h2 className="h-section">Your total</h2><div><span>Subtotal</span><strong>{money.format(subtotal)}</strong></div><div><span>Shipping</span><strong>{shipping ? money.format(shipping) : "Free"}</strong></div><div className="cart-total"><span>Total</span><strong>{money.format(total)}</strong></div><span className="small muted">Payment: {payment}</span></aside></div>}
  </div>;
}
