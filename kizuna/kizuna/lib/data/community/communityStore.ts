"use client";

import { useCallback, useEffect, useState } from "react";
import type { CommunityPost, CommunityReply } from "./communityData";

export function useCommunityPosts(initial: CommunityPost[]) {
  const [posts, setPosts] = useState<CommunityPost[]>(initial);

  const addPost = useCallback((post: CommunityPost) => {
    setPosts((current) => [post, ...current]);
    void fetch("/api/posts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ roomSlug: post.groupSlug, body: post.body }),
    }).then(async (response) => {
      if (!response.ok) console.error("community post could not be persisted", await response.text());
    }).catch((error) => console.error("community post could not be persisted", error));
  }, []);

  return { posts, addPost, updatePost: () => undefined };
}

export function useCommunityPostActions(postId: string) {
  const [liked, setLiked] = useState(false);
  const [replyList, setReplyList] = useState<CommunityReply[]>([]);
  const [reported, setReported] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    void fetch(`/api/community/actions?postId=${encodeURIComponent(postId)}`)
      .then(async (response) => {
        if (!response.ok) return;
        const payload = await response.json() as { comments?: CommunityReply[] };
        setReplyList(payload.comments ?? []);
      })
      .catch((error) => console.error("community comments could not be loaded", error));
  }, [postId]);

  const toggleLike = () => {
    const next = !liked;
    setLiked(next);
    void fetch("/api/community/actions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "reaction", entityType: "POST", entityId: postId, reactionType: "LIKE" }),
    }).then(async (response) => {
      if (!response.ok) {
        console.error("reaction could not be persisted", await response.text());
        setLiked(!next);
      }
    }).catch((error) => { console.error("reaction could not be persisted", error); setLiked(!next); });
  };

  const addReply = (body: string, parentId?: string) => {
    const optimistic: CommunityReply = {
      id: `pending-${Date.now()}`,
      postId,
      parentId,
      authorId: "current-user",
      body,
      createdAt: new Date().toISOString(),
      reactions: 0,
    };
    setReplyList((current) => [...current, optimistic]);
    void fetch("/api/community/actions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "comment", postId, content: body, parentId }),
    }).then(async (response) => {
      if (!response.ok) console.error("comment could not be persisted", await response.text());
    }).catch((error) => console.error("comment could not be persisted", error));
  };

  const markReported = () => {
    setReported(true);
    void fetch("/api/community/actions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "report", entityType: "POST", entityId: postId, reason: "User report" }),
    }).then(async (response) => { if (!response.ok) console.error("report could not be persisted", await response.text()); })
      .catch((error) => console.error("report could not be persisted", error));
  };

  const markBlocked = () => {
    setBlocked(true);
    void fetch("/api/community/actions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "block", blockedId: postId }),
    }).then(async (response) => { if (!response.ok) console.error("block could not be persisted", await response.text()); })
      .catch((error) => console.error("block could not be persisted", error));
  };

  return { liked, toggleLike, replyList, addReply, reported, markReported, blocked, markBlocked };
}
