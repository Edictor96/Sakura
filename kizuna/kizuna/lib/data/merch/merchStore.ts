"use client";

import { useCallback, useEffect, useState } from "react";

export interface MerchCartItem {
  productId: string;
  quantity: number;
  variant: string;
}

interface MePayload {
  sets?: { wishlist?: string[] };
}

export function useMerchWishlist() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    void fetch("/api/me")
      .then(async (response) => {
        if (!response.ok) return;
        const payload = await response.json() as MePayload;
        setIds(payload.sets?.wishlist ?? []);
      })
      .catch((error) => console.error("wishlist state could not be loaded", error));
  }, []);
  const toggle = useCallback((id: string) => {
    const previous = ids;
    setIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    void fetch("/api/relationships", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ entityType: "PRODUCT", entityId: id }),
    }).then(async (response) => {
      if (!response.ok) {
        console.error("wishlist update failed", await response.text());
        setIds(previous);
      }
    }).catch((error) => {
      console.error("wishlist update failed", error);
      setIds(previous);
    });
  }, [ids]);
  return { ids, toggle };
}

export function useMerchCart() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    void fetch("/api/cart")
      .then(async (response) => {
        if (!response.ok) return;
        const payload = await response.json() as { items?: MerchCartItem[] };
        setIds((payload.items ?? []).map((item) => item.productId));
      })
      .catch((error) => console.error("cart state could not be loaded", error));
  }, []);
  const toggle = useCallback((id: string) => {
    const exists = ids.includes(id);
    setIds((current) => exists ? current.filter((item) => item !== id) : [...current, id]);
    void (exists
      ? fetch(`/api/cart?productId=${encodeURIComponent(id)}`, { method: "DELETE" })
      : fetch("/api/cart", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId: id }) }))
      .then(async (response) => {
        if (!response.ok) {
          console.error("cart update failed", await response.text());
          setIds((current) => exists ? [...current, id] : current.filter((item) => item !== id));
        }
      })
      .catch((error) => {
        console.error("cart update failed", error);
        setIds((current) => exists ? [...current, id] : current.filter((item) => item !== id));
      });
  }, [ids]);
  return { ids, toggle };
}

export function useMerchCartItems() {
  const [items, setItems] = useState<MerchCartItem[]>([]);
  useEffect(() => {
    void fetch("/api/cart")
      .then(async (response) => {
        if (!response.ok) return;
        const payload = await response.json() as { items?: Array<{ productId: string; quantity: number; variant: string }> };
        setItems(payload.items ?? []);
      })
      .catch((error) => console.error("cart items could not be loaded", error));
  }, []);
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const next = items.map((item) => item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item);
    setItems(next);
    void fetch("/api/cart", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId, quantity: Math.max(1, quantity), variant: "Standard" }) })
      .then(async (response) => { if (!response.ok) console.error("cart quantity update failed", await response.text()); })
      .catch((error) => console.error("cart quantity update failed", error));
  }, [items]);
  const remove = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
    void fetch(`/api/cart?productId=${encodeURIComponent(productId)}`, { method: "DELETE" })
      .then(async (response) => { if (!response.ok) console.error("cart removal failed", await response.text()); })
      .catch((error) => console.error("cart removal failed", error));
  }, []);
  const moveToWishlist = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
    void fetch(`/api/cart?productId=${encodeURIComponent(productId)}`, { method: "DELETE" })
      .then(async (response) => { if (!response.ok) console.error("cart removal failed", await response.text()); })
      .catch((error) => console.error("cart removal failed", error));
  }, []);
  return { items, updateQuantity, remove, moveToWishlist };
}
