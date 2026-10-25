import { NextResponse } from "next/server";
import { ingestAnime } from "@/lib/server/ingestion/ingestionService";

export async function POST(request: Request) {
  const expected = process.env.INGESTION_ADMIN_TOKEN;
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !provided || provided !== expected) return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  try {
    return NextResponse.json(await ingestAnime());
  } catch (error) {
    console.error("anime ingestion failed", error);
    return NextResponse.json({ error: "Anime ingestion failed." }, { status: 502 });
  }
}
