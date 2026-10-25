# KIZUNA

Where Japanese culture meets Indian community. Prototype for the finals.

Next.js 15 (App Router) + TypeScript. Runs on built-in sample data with **no backend needed**, and switches to Supabase when you add two environment variables.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Production check: `npm run build && npm start`. Type check: `npm run typecheck`.

## What's in it

| Route | What it does |
|---|---|
| `/` | Home: community in the centre, five worlds around it, the journey, rooms, events |
| `/discover`, `/discover/[id]` | Titles by world, save, "talk about it" rooms, "if you like this" (tag similarity) |
| `/rooms`, `/rooms/[slug]` | Interest and city rooms, join, post with spam/scam filter, related events |
| `/live` | Events by city, "I'm going" |
| `/collect` | Official merch from partners. Everyday items first. No seller is signed yet |
| `/passport` | Six sides, event stamps, rooms and saved titles, built from what you do |
| `POST /api/posts` | Validates a post and saves it to Supabase when connected |

Joined rooms, RSVPs and saved titles live in the browser (`lib/store.ts`) until sign-in is added.

## Switch to Supabase

1. Create a Supabase project. In **SQL Editor**, run `supabase/schema.sql`.
2. Copy `.env.example` to `.env.local` and fill in the project URL and anon key.
3. Load the sample content: set `SUPABASE_SERVICE_ROLE_KEY` in your shell, then `npm run seed`.
4. Restart `npm run dev`. The "Sample ..." notes disappear and pages read from the database.

If a Supabase call fails, the app falls back to sample data instead of showing an error. The service role key is only for `npm run seed`. Never commit it or ship it to the browser.

The schema allows anyone to insert posts. That is a prototype shortcut, flagged in the SQL. Replace it with signed-in checks before real use.

## Where things live

```
app/            pages and the one API route
components/     shared UI (nav, doodles, buttons, feed, passport)
lib/types.ts    the contract everyone shares
lib/data/       mock.ts (sample content), supabase.ts (real data), index.ts (the switch)
lib/moderation  spam/scam filter (rules today, swap for a model later)
lib/recommend   "more like this" (tag overlap today)
supabase/       schema.sql
scripts/        seed.ts (loads mock content into Supabase)
docs/PLAN.md    the 15-hour plan and who owns what
```

## Ground rules

- All content is sample until replaced. No real users, partners, venues or sales are claimed.
- We link to official sources. We don't host anime, manga, music, lyrics or clips.
- Fonts (Klee One, Zen Maru Gothic, DotGothic16) load from Google Fonts. Fallbacks keep the layout intact offline.
