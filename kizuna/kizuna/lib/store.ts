"use client";

import { useCallback, useEffect, useState } from "react";

// Prototype "account": joined rooms, RSVPs and saved titles live in this browser.
// Replace with Supabase Auth + tables (memberships, rsvps) when sign-in lands.

export const KEYS = {
  rooms: "kizuna.rooms",
  events: "kizuna.events",
  saved: "kizuna.saved",
} as const;

const SYNC = "kizuna-store";

function read(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function useLocalSet(key: string) {
  const [items, setItems] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(read(key));
    setReady(true);
    const refresh = () => setItems(read(key));
    window.addEventListener("storage", refresh);
    window.addEventListener(SYNC, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(SYNC, refresh);
    };
  }, [key]);

  const toggle = useCallback(
    (id: string) => {
      const current = read(key);
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* storage blocked: state still updates for this visit */
      }
      setItems(next);
      window.dispatchEvent(new Event(SYNC));
    },
    [key],
  );

  return { items, ready, toggle, has: (id: string) => items.includes(id) };
}
