"use client";

import { FormEvent, useEffect, useState } from "react";
import { moderate } from "@/lib/moderation";
import { timeAgo } from "@/lib/format";
import { KEYS, useLocalSet } from "@/lib/store";
import type { Post } from "@/lib/types";

interface Props {
  roomSlug: string;
  roomName: string;
  initial: Post[];
}

const storageKey = (slug: string) => `kizuna.posts.${slug}`;

function readLocal(slug: string): Post[] {
  try {
    const raw = localStorage.getItem(storageKey(slug));
    return raw ? (JSON.parse(raw) as Post[]) : [];
  } catch {
    return [];
  }
}

const getTilt = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (hash % 5) - 2; // -2 to 2 degrees
};

export default function RoomFeed({ roomSlug, roomName, initial }: Props) {
  const [mine, setMine] = useState<Post[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [now, setNow] = useState<number | null>(null);
  const rooms = useLocalSet(KEYS.rooms);
  const joined = rooms.ready && rooms.has(roomSlug);

  useEffect(() => {
    setMine(readLocal(roomSlug));
    setNow(Date.now());
  }, [roomSlug]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const verdict = moderate(text);
    if (!verdict.ok) {
      setError(`This post ${verdict.reason}. Edit it and try again.`);
      return;
    }
    setError("");
    const post: Post = {
      id: `local-${Date.now()}`,
      roomSlug,
      author: "You",
      body: text.trim(),
      createdAt: new Date().toISOString(),
      local: true,
    };
    const next = [post, ...mine];
    setMine(next);
    setText("");
    setNow(Date.now());
    try {
      localStorage.setItem(storageKey(roomSlug), JSON.stringify(next));
    } catch {
      /* ignore */
    }
    fetch("/api/posts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ roomSlug, author: "Guest", body: post.body }),
    }).catch(() => undefined);
  }

  const all = [...mine, ...initial];

  return (
    <section aria-labelledby="feed-title">
      <h2 id="feed-title" className="h-section">Talk in {roomName}</h2>

      <form onSubmit={submit} className="composer card surface-note c-blue wob2" style={{ padding: '20px' }}>
        <label htmlFor="post-body" className="sr-only">Write a post</label>
        <textarea
          id="post-body"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={joined ? "Share something with the room" : "Join the room first, then say hi"}
          disabled={!joined}
          aria-describedby={error ? "post-error" : undefined}
          style={{ 
            width: '100%', 
            fontFamily: 'var(--font-body)', 
            background: 'var(--cream)', 
            border: '2px solid var(--ink)', 
            borderRadius: '12px', 
            padding: '12px',
            marginBottom: '10px'
          }}
        />
        <div className="composer-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="muted small">{text.length}/600</span>
          <button type="submit" className="btn btn-pink" disabled={!joined || text.trim().length === 0}>
            Post
          </button>
        </div>
        {error ? (
          <p id="post-error" role="alert" className="error" style={{ color: 'var(--chihiro-pink)', fontSize: '0.9rem', marginTop: '8px' }}>{error}</p>
        ) : null}
      </form>

      {all.length === 0 ? (
        <p className="empty">No posts yet. Start the conversation.</p>
      ) : (
        <ul className="feed" style={{ listStyle: 'none', padding: 0, marginTop: '20px', display: 'grid', gap: '16px' }}>
          {all.map((p) => (
            <li key={p.id} className="card surface-note c-cream wob1 post" style={{ 
              transform: `rotate(${getTilt(p.id)}deg)`,
              boxShadow: '3px 3px 0 var(--ink)',
              border: '2px solid var(--ink)',
              padding: '16px'
            }}>
              <div className="post-head" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ fontFamily: 'var(--font-body)' }}>{p.author}</strong>
                <span className="muted small" style={{ fontFamily: 'var(--font-pixel)' }}>{now ? timeAgo(p.createdAt, now) : ""}</span>
              </div>
              <p style={{ margin: 0, fontFamily: 'var(--font-body)' }}>{p.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
