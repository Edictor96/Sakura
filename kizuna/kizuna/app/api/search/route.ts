import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/auth";
import { searchContent, type SearchType } from "@/lib/server/services/searchService";
import { recordActivity } from "@/lib/server/services/activityService";

const types = new Set<SearchType>(["MEDIA", "GROUP", "EVENT", "PRODUCT"]);

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = params.get("q")?.trim() ?? "";
  if (!query || query.length > 200) return NextResponse.json({ error: "q must be 1-200 characters." }, { status: 400 });
  const selected = params.getAll("type").filter((value): value is SearchType => types.has(value as SearchType));
  try {
    const results = await searchContent(query, selected.length ? selected : undefined);
    const user = await getCurrentUser();
    if (user) {
      try {
        await recordActivity({ userId: user.id, interactionType: "SEARCH", entityType: "SEARCH", entityId: query.toLowerCase(), metadata: { query } });
      } catch (error) {
        console.error("search activity recording failed", error);
      }
    }
    return NextResponse.json({ query, results });
  } catch (error) {
    console.error("search failed", error);
    return NextResponse.json({ error: "Search is temporarily unavailable." }, { status: 503 });
  }
}
