"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCommunityPostActions, useCommunityPosts } from "@/lib/data/community/communityStore";
import type { CommunityData, CommunityGroup, CommunityPost, CommunityReply } from "@/lib/data/community/communityData";

function time(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function ReplyTree({ replies, parentId, onReply }: { replies: CommunityReply[]; parentId?: string; onReply: (body: string, parentId?: string) => void }) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const children = replies.filter((reply) => reply.parentId === parentId);
  return <div className={parentId ? "nested-replies" : "reply-list"}>{children.map((reply) => <article className="reply-card" key={reply.id}><strong>{reply.authorId === "local-you" ? "You" : "Sakura fan"}</strong><span className="small muted"> · {time(reply.createdAt)}</span><p>{reply.body}</p><button type="button" className="small reply-action" onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}>Reply</button>{replyingTo === reply.id ? <form className="inline-reply" onSubmit={(event) => { event.preventDefault(); if (!body.trim()) return; onReply(body.trim(), reply.id); setBody(""); setReplyingTo(null); }}><input value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write a reply..." aria-label="Reply text" /><button className="btn btn-small btn-mint" type="submit">Send</button></form> : null}<ReplyTree replies={replies} parentId={reply.id} onReply={onReply} /></article>)}</div>;
}

export default function ThreadPage({ data, group, postId }: { data: CommunityData; group: CommunityGroup; postId: string }) {
  const { posts } = useCommunityPosts(data.posts);
  const post = useMemo(() => posts.find((entry) => entry.id === postId), [posts, postId]);
  const { liked, toggleLike, replyList, addReply, reported, markReported, blocked, markBlocked } = useCommunityPostActions(postId);
  const [revealed, setRevealed] = useState(false);
  const [reply, setReply] = useState("");
  const [action, setAction] = useState<"report" | "block" | null>(null);

  if (!post) return <p className="empty">This conversation could not be found. <Link href={`/community/${group.slug}`}>Return to the group</Link>.</p>;
  const author = data.users.find((user) => user.id === post.authorId);
  const hidden = Boolean(post.spoiler && !revealed);
  const submitReply = (event: React.FormEvent) => { event.preventDefault(); if (!reply.trim()) return; addReply(reply.trim()); setReply(""); };

  return (
    <div className="thread-page">
      <Link href={`/community/${group.slug}`} className="small">← Back to {group.name}</Link>
      <article className="thread-original card surface-note">
        <div className="post-head"><div className="group-post-author"><span className="post-avatar" aria-hidden="true">{author?.glyph ?? "友"}</span><span><strong>{author?.displayName ?? "Sakura fan"}</strong><br /><span className="small muted">{group.name} · {time(post.createdAt)}</span></span></div><span className="stamp">{post.type}</span></div>
        {post.pinned ? <span className="pinned-label">Pinned for the room</span> : null}
        {hidden ? <button type="button" className="spoiler-reveal" onClick={() => setRevealed(true)}>Spoiler — tap to reveal</button> : <><p className="thread-body">{post.body}</p>{post.imageLabel ? <div className="post-image-placeholder" role="img" aria-label={post.imageLabel}>{post.imageLabel}</div> : null}{post.poll ? <div className="post-poll"><strong>{post.poll.question}</strong>{post.poll.options.map((option) => <button type="button" className="poll-option" key={option}>{option}</button>)}</div> : null}</>}
        <div className="thread-actions"><button type="button" className={`btn btn-small ${liked ? "btn-done" : "btn-ghost"}`} onClick={toggleLike} aria-label={liked ? "Unlike post" : "Like post"}>{liked ? "Liked" : "Like"} · {post.reactions + (liked ? 1 : 0)}</button><span>{post.replies + replyList.length} replies</span><button type="button" className="small" onClick={() => setAction("report")} disabled={reported}>{reported ? "Reported" : "Report"}</button><button type="button" className="small" onClick={() => setAction("block")} disabled={blocked}>{blocked ? "Blocked" : "Block"}</button></div>
        {action ? <div className="thread-confirm" role="alertdialog" aria-label={`${action} confirmation`}><span>{action === "report" ? "Report this post to keep the room comfortable?" : "Block this post from your local view?"}</span><button type="button" className="btn btn-small btn-pink" onClick={() => { action === "report" ? markReported() : markBlocked(); setAction(null); }}>Confirm</button><button type="button" className="small" onClick={() => setAction(null)}>Cancel</button></div> : null}
      </article>
      <section className="thread-replies" aria-labelledby="replies-heading"><h2 id="replies-heading" className="h-section">Replies</h2><form className="thread-reply-form" onSubmit={submitReply}><input value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Add something kind to the conversation..." aria-label="Reply text" /><button className="btn btn-mint" type="submit" disabled={!reply.trim()}>Reply</button></form><ReplyTree replies={replyList} onReply={addReply} /></section>
    </div>
  );
}
