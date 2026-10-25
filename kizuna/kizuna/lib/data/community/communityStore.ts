"use client";

import { useCallback, useEffect, useState } from "react";
import type { CommunityPost, CommunityReply } from "./communityData";

const POSTS_KEY = "kizuna.community.posts";
const LIKES_KEY = "kizuna.community.likes";
const REPLIES_KEY = "kizuna.community.replies";
const REPORTS_KEY = "kizuna.community.reports";
const BLOCKS_KEY = "kizuna.community.blocks";
const SYNC = "kizuna-community-store";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The in-memory state still makes the interaction useful for this visit.
  }
}

export function useCommunityPosts(initial: CommunityPost[]) {
  const [posts, setPosts] = useState<CommunityPost[]>(initial);

  useEffect(() => {
    const stored = readJson<CommunityPost[]>(POSTS_KEY, []);
    setPosts([...stored, ...initial.filter((post) => !stored.some((saved) => saved.id === post.id))]);
    const refresh = () => {
      const next = readJson<CommunityPost[]>(POSTS_KEY, []);
      setPosts([...next, ...initial.filter((post) => !next.some((saved) => saved.id === post.id))]);
    };
    window.addEventListener(SYNC, refresh);
    return () => window.removeEventListener(SYNC, refresh);
  }, [initial]);

  const addPost = useCallback((post: CommunityPost) => {
    setPosts((current) => {
      const stored = readJson<CommunityPost[]>(POSTS_KEY, []);
      const next = [post, ...stored];
      writeJson(POSTS_KEY, next);
      window.dispatchEvent(new Event(SYNC));
      return [post, ...current];
    });
  }, []);

  const updatePost = useCallback((postId: string, update: (post: CommunityPost) => CommunityPost) => {
    setPosts((current) => {
      const next = current.map((post) => post.id === postId ? update(post) : post);
      const stored = readJson<CommunityPost[]>(POSTS_KEY, []);
      writeJson(POSTS_KEY, stored.map((post) => post.id === postId ? update(post) : post));
      window.dispatchEvent(new Event(SYNC));
      return next;
    });
  }, []);

  return { posts, addPost, updatePost };
}

export function useCommunityPostActions(postId: string) {
  const [liked, setLiked] = useState(false);
  const [replyList, setReplyList] = useState<CommunityReply[]>([]);
  const [reported, setReported] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    setLiked(readJson<string[]>(LIKES_KEY, []).includes(postId));
    setReplyList(readJson<CommunityReply[]>(REPLIES_KEY, []).filter((reply) => reply.postId === postId));
    setReported(readJson<string[]>(REPORTS_KEY, []).includes(postId));
    setBlocked(readJson<string[]>(BLOCKS_KEY, []).includes(postId));
  }, [postId]);

  const toggleLike = () => {
    const current = readJson<string[]>(LIKES_KEY, []);
    const next = current.includes(postId) ? current.filter((id) => id !== postId) : [...current, postId];
    writeJson(LIKES_KEY, next);
    setLiked(next.includes(postId));
    window.dispatchEvent(new Event(SYNC));
  };

  const addReply = (body: string, parentId?: string) => {
    const reply: CommunityReply = {
      id: `reply-${Date.now()}`,
      postId,
      parentId,
      authorId: "local-you",
      body,
      createdAt: new Date().toISOString(),
      reactions: 0,
    };
    const next = [...readJson<CommunityReply[]>(REPLIES_KEY, []), reply];
    writeJson(REPLIES_KEY, next);
    setReplyList(next.filter((item) => item.postId === postId));
    window.dispatchEvent(new Event(SYNC));
  };

  const markReported = () => {
    const next = [...new Set([...readJson<string[]>(REPORTS_KEY, []), postId])];
    writeJson(REPORTS_KEY, next);
    setReported(true);
  };

  const markBlocked = () => {
    const next = [...new Set([...readJson<string[]>(BLOCKS_KEY, []), postId])];
    writeJson(BLOCKS_KEY, next);
    setBlocked(true);
  };

  return { liked, toggleLike, replyList, addReply, reported, markReported, blocked, markBlocked };
}
