import { NextResponse } from "next/server";
import { supabase } from "@/lib/data/supabase";
import { moderate } from "@/lib/moderation";

// POST /api/posts  { roomSlug, author, body }
// Prototype: runs the same moderation as the browser, then saves to Supabase if it is connected.
// Before launch: require a signed-in user and send flagged posts to a review queue.

export async function POST(req: Request) {
  let payload: { roomSlug?: string; author?: string; body?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Send JSON." }, { status: 400 });
  }

  const roomSlug = String(payload.roomSlug ?? "").slice(0, 80);
  const author = String(payload.author ?? "Guest").slice(0, 40);
  const body = String(payload.body ?? "");

  if (!roomSlug) return NextResponse.json({ ok: false, error: "roomSlug is required." }, { status: 400 });

  const verdict = moderate(body);
  if (!verdict.ok) {
    return NextResponse.json({ ok: false, error: `This post ${verdict.reason}.` }, { status: 422 });
  }

  if (!supabase) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  const { error } = await supabase
    .from("posts")
    .insert({ room_slug: roomSlug, author, body: body.trim() });
  if (error) {
    return NextResponse.json({ ok: true, persisted: false });
  }
  return NextResponse.json({ ok: true, persisted: true });
}
