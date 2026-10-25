"use client";

import { useCallback, useEffect, useState } from "react";

export const KEYS = {
  rooms: "kizuna.rooms",
  events: "kizuna.events",
  saved: "kizuna.saved",
} as const;

const SET_NAMES = {
  [KEYS.rooms]: "rooms",
  [KEYS.events]: "events",
  [KEYS.saved]: "saved",
} as const;

type SetName = (typeof SET_NAMES)[keyof typeof SET_NAMES];

export function useLocalSet(key: string) {
  const [items, setItems] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const setName = SET_NAMES[key as keyof typeof SET_NAMES] as SetName | undefined;
    if (!setName) {
      setReady(true);
      return () => { active = false; };
    }
    void fetch("/api/me")
      .then(async (response) => {
        if (!response.ok) return;
        const payload = await response.json() as { sets?: Partial<Record<SetName, string[]>> };
        if (active) setItems(payload.sets?.[setName] ?? []);
      })
      .catch((error) => console.error("relationship state could not be loaded", error))
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, [key]);

  const toggle = useCallback(
    (id: string) => {
      const next = items.includes(id) ? items.filter((x) => x !== id) : [...items, id];
      setItems(next);
      const entityType = key === KEYS.rooms ? "GROUP" : key === KEYS.events ? "EVENT" : "MEDIA";
      void fetch("/api/relationships", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ entityType, entityId: id }),
      }).then(async (response) => {
        if (!response.ok) {
          console.error("relationship update failed", await response.text());
          setItems(items);
        }
      }).catch((error) => {
        console.error("relationship update failed", error);
        setItems(items);
      });
    },
    [items, key],
  );

  return { items, ready, toggle, has: (id: string) => items.includes(id) };
}
