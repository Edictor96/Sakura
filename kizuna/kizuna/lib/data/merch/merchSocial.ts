"use client";

import { useCallback, useEffect, useState } from "react";
import { communityData } from "@/lib/data/community/communityData";

const SHARES_KEY = "kizuna.merch.group-shares";
const REVIEWS_KEY = "kizuna.merch.reviews";
const FOLLOW_KEY = "kizuna.merch.followed";

function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch { return fallback; }
}

function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* local prototype remains useful */ }
}

export interface SubmittedMerchReview {
  orderId: string;
  productId: string;
  rating: number;
  text: string;
  imageAdded: boolean;
}

export function useMerchFollow(partnerId: string) {
  const [following, setFollowing] = useState(false);
  useEffect(() => setFollowing(read<string[]>(FOLLOW_KEY, []).includes(partnerId)), [partnerId]);
  const toggle = useCallback(() => {
    const current = read<string[]>(FOLLOW_KEY, []);
    const next = current.includes(partnerId) ? current.filter((id) => id !== partnerId) : [...current, partnerId];
    write(FOLLOW_KEY, next); setFollowing(next.includes(partnerId));
  }, [partnerId]);
  return { following, toggle };
}

export function useMerchReviews() {
  const [reviews, setReviews] = useState<SubmittedMerchReview[]>([]);
  useEffect(() => setReviews(read<SubmittedMerchReview[]>(REVIEWS_KEY, [])), []);
  const submit = useCallback((review: SubmittedMerchReview) => {
    const next = [...read<SubmittedMerchReview[]>(REVIEWS_KEY, []), review];
    write(REVIEWS_KEY, next); setReviews(next);
  }, []);
  return { reviews, submit };
}

export function getJoinedMerchGroups() {
  return communityData.groups.filter((group) => ["anime-fans-india", "anime-ost-lovers", "japanese-gaming-india"].includes(group.slug));
}

export function useMerchGroupShare() {
  const [sharedTo, setSharedTo] = useState<string | null>(null);
  const share = useCallback((groupSlug: string) => {
    const current = read<string[]>(SHARES_KEY, []);
    write(SHARES_KEY, [...current, groupSlug]);
    setSharedTo(groupSlug);
  }, []);
  return { sharedTo, share };
}
