"use client";

import { useCallback, useEffect, useState } from "react";

const WISHLIST_KEY = "kizuna.merch.wishlist";
const CART_KEY = "kizuna.merch.cart";
const CART_ITEMS_KEY = "kizuna.merch.cart.items";

export interface MerchCartItem {
  productId: string;
  quantity: number;
  variant: string;
}

function read(key: string): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function useLocalIds(key: string) {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => setIds(read(key)), [key]);
  const toggle = useCallback((id: string) => {
    const next = read(key).includes(id) ? read(key).filter((item) => item !== id) : [...read(key), id];
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* local prototype state remains usable */ }
    setIds(next);
  }, [key]);
  return { ids, toggle };
}

export function useMerchWishlist() {
  return useLocalIds(WISHLIST_KEY);
}

export function useMerchCart() {
  const base = useLocalIds(CART_KEY);
  const toggle = useCallback((id: string) => {
    const currentlyPresent = read(CART_KEY).includes(id);
    const nextItems = currentlyPresent
      ? readCartItems().filter((item) => item.productId !== id)
      : [...readCartItems(), { productId: id, quantity: 1, variant: "Standard" }];
    writeCartItems(nextItems);
    base.toggle(id);
  }, [base.toggle]);
  return { ...base, toggle };
}

function readCartItems(): MerchCartItem[] {
  try {
    const value = JSON.parse(localStorage.getItem(CART_ITEMS_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is MerchCartItem => item && typeof item.productId === "string" && typeof item.quantity === "number" && typeof item.variant === "string") : [];
  } catch {
    return [];
  }
}

function writeCartItems(items: MerchCartItem[]) {
  try { localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items)); } catch { /* local state remains usable */ }
}

export function useMerchCartItems() {
  const [items, setItems] = useState<MerchCartItem[]>([]);
  useEffect(() => {
    const ids = read(CART_KEY);
    const stored = readCartItems();
    const migrated = stored.length ? stored : ids.map((productId) => ({ productId, quantity: 1, variant: "Standard" }));
    setItems(migrated);
    if (!stored.length && migrated.length) writeCartItems(migrated);
  }, []);
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const next = readCartItems().map((item) => item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item);
    writeCartItems(next); setItems(next);
  }, []);
  const remove = useCallback((productId: string) => {
    const next = readCartItems().filter((item) => item.productId !== productId);
    writeCartItems(next);
    try { localStorage.setItem(CART_KEY, JSON.stringify(next.map((item) => item.productId))); } catch { /* local state remains usable */ }
    setItems(next);
  }, []);
  const moveToWishlist = useCallback((productId: string) => {
    const next = readCartItems().filter((item) => item.productId !== productId);
    writeCartItems(next);
    try { localStorage.setItem(CART_KEY, JSON.stringify(next.map((item) => item.productId))); } catch { /* local state remains usable */ }
    setItems(next);
  }, []);
  return { items, updateQuantity, remove, moveToWishlist };
}
