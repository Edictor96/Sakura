"use client";

import { KEYS, useLocalSet } from "@/lib/store";

interface Props {
  id: string;
  className?: string;
}

export function JoinButton({ id, className = "" }: Props) {
  const { has, toggle, ready } = useLocalSet(KEYS.rooms);
  const joined = ready && has(id);
  return (
    <button
      type="button"
      className={`btn ${joined ? "btn-done" : "btn-pink"} ${className}`}
      aria-pressed={joined}
      onClick={() => toggle(id)}
    >
      {joined ? "Joined" : "Join room"}
    </button>
  );
}

export function RsvpButton({ id, className = "" }: Props) {
  const { has, toggle, ready } = useLocalSet(KEYS.events);
  const going = ready && has(id);
  return (
    <button
      type="button"
      className={`btn ${going ? "btn-done" : "btn-mint"} ${className}`}
      aria-pressed={going}
      onClick={() => toggle(id)}
    >
      {going ? "You're going" : "I'm going"}
    </button>
  );
}

export function SaveButton({ id, className = "" }: Props) {
  const { has, toggle, ready } = useLocalSet(KEYS.saved);
  const saved = ready && has(id);
  return (
    <button
      type="button"
      className={`btn btn-small ${saved ? "btn-done" : "btn-ghost"} ${className}`}
      aria-pressed={saved}
      onClick={() => toggle(id)}
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}
