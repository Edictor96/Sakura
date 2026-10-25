"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCommunityPosts } from "@/lib/data/community/communityStore";
import type { CommunityData } from "@/lib/data/community/communityData";
import { KEYS, useLocalSet } from "@/lib/store";

export default function CreatePost({ data, initialGroup }: { data: CommunityData; initialGroup?: string }) {
  const router = useRouter();
  const { items: joined } = useLocalSet(KEYS.rooms);
  const { addPost } = useCommunityPosts(data.posts);
  const joinedGroups = data.groups.filter((group) => joined.includes(group.slug));
  const [groupSlug, setGroupSlug] = useState(initialGroup ?? "");
  const [body, setBody] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [imageLabel, setImageLabel] = useState("");
  const [pollEnabled, setPollEnabled] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [preview, setPreview] = useState(false);

  const selectedGroup = joinedGroups.find((group) => group.slug === groupSlug);
  const validPoll = !pollEnabled || (pollQuestion.trim() && pollOptions.filter((option) => option.trim()).length >= 2);
  const canSubmit = Boolean(groupSlug && body.trim() && validPoll);

  const updateOption = (index: number, value: string) => setPollOptions((options) => options.map((option, optionIndex) => optionIndex === index ? value : option));
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    const postId = `local-post-${Date.now()}`;
    addPost({
      id: postId,
      groupSlug,
      authorId: "local-you",
      body: body.trim(),
      type: pollEnabled ? "Question" : "Discussion",
      createdAt: new Date().toISOString(),
      reactions: 0,
      replies: 0,
      spoiler,
      imageLabel: imageLabel || undefined,
      poll: pollEnabled ? { question: pollQuestion.trim(), options: pollOptions.filter((option) => option.trim()).map((option) => option.trim()) } : undefined,
    });
    router.push(`/community/${groupSlug}/posts/${postId}`);
  };

  if (!joinedGroups.length) {
    return <section className="create-post-page"><Link href="/community" className="small">← Back to Community</Link><h1 className="h-page">Create Post</h1><p className="empty">Join a community before starting a conversation.</p><Link href="/community" className="btn btn-pink">Find a community</Link></section>;
  }

  return (
    <section className="create-post-page">
      <Link href="/community" className="small">← Back to Community</Link>
      <header className="page-head"><h1 className="h-page">Create Post</h1><p className="lede">Bring a thought, question or tiny discovery into the room.</p></header>
      <form className="create-post-form" onSubmit={submit}>
        <label>Choose Community<select value={groupSlug} onChange={(event) => setGroupSlug(event.target.value)}><option value="">Choose a joined community</option>{joinedGroups.map((group) => <option value={group.slug} key={group.slug}>{group.name}</option>)}</select></label>
        <label>Content<textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="What are you watching, listening to or reading?" rows={6} /></label>
        <div className="create-post-actions">
          <button type="button" className={`btn btn-small ${imageLabel ? "btn-done" : "btn-ghost"}`} onClick={() => setImageLabel(imageLabel ? "" : "Mock image placeholder")}>{imageLabel ? "Image added" : "Add Image"}</button>
          <label className="check-row"><input type="checkbox" checked={spoiler} onChange={(event) => setSpoiler(event.target.checked)} /> Spoiler</label>
          <label className="check-row"><input type="checkbox" checked={pollEnabled} onChange={(event) => setPollEnabled(event.target.checked)} /> Add poll</label>
        </div>
        {pollEnabled ? <div className="poll-editor surface-note"><label>Poll question<input value={pollQuestion} onChange={(event) => setPollQuestion(event.target.value)} placeholder="Ask the room..." /></label>{pollOptions.map((option, index) => <input key={index} value={option} onChange={(event) => updateOption(index, event.target.value)} placeholder={`Option ${index + 1}`} />)}{pollOptions.length < 4 ? <button type="button" className="small" onClick={() => setPollOptions((options) => [...options, ""])}>+ Add option</button> : null}</div> : null}
        {preview ? <div className="post-preview card c-yellow"><span className="stamp">Preview · {selectedGroup?.name}</span><p>{body || "Your post will appear here."}</p>{spoiler ? <span className="spoiler-note">Spoiler marked</span> : null}{imageLabel ? <div className="post-image-placeholder">{imageLabel}</div> : null}{pollEnabled ? <strong>{pollQuestion || "Poll question"}</strong> : null}</div> : null}
        <div className="composer-row"><button type="button" className="btn btn-ghost" onClick={() => setPreview((value) => !value)}>{preview ? "Hide preview" : "Preview"}</button><button type="submit" className="btn btn-pink" disabled={!canSubmit}>Publish Post</button></div>
      </form>
    </section>
  );
}
