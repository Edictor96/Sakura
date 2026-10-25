# KIZUNA

Where Japanese culture meets Indian community. Prototype for the finals.

Next.js App Router + TypeScript. The application uses Prisma 6.19 with PostgreSQL/Supabase as
the canonical store when `DATABASE_URL` is configured, while mock data remains available for
unauthenticated local demos.

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
| `POST /api/posts` | Authenticated, moderated post creation |
`/api/search?q=...` | Database-backed search across media, groups, events and products |
`/api/community/actions` | Authenticated comments, reactions, reports and blocks |
`/api/events/:id/check-in` | Authenticated RSVP check-in |
`POST /api/ingest/anime` | Admin-token-protected AniList synchronization |

Authenticated memberships, RSVPs, saved titles, wishlist items, activities and moderation actions
are stored in PostgreSQL. Browser storage is retained only for presentation-only demo flows that
do not have a server contract yet.

## Configure PostgreSQL and Supabase Auth

Set these server-side variables in `.env` or the deployment environment:

```text
DATABASE_URL=...
DIRECT_URL=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
INGESTION_ADMIN_TOKEN=...
```

Apply schema changes with `npx prisma migrate deploy`, generate the client with
`npx prisma generate`, and seed with `npm run seed`. `INGESTION_ADMIN_TOKEN` is required for
manual provider sync; provider credentials are never sent to the browser.

### Scheduled ingestion

The protected `POST /api/ingest/anime` endpoint is cron-ready, but no scheduler is enabled by
this repository. Configure the deployment platform's scheduled job or an external scheduler to
run the following daily, storing `INGESTION_ADMIN_TOKEN` as a secret:

```bash
curl -X POST https://your-sakura-host.example/api/ingest/anime \
  -H "Authorization: Bearer $INGESTION_ADMIN_TOKEN"
```

The endpoint returns `401` unless the bearer token matches the server-side secret. A failed
provider request is recorded in `IngestionRun` and does not expose credentials to the client.

## Where things live

```
app/            pages and API route handlers
components/     shared UI (nav, doodles, buttons, feed, passport)
lib/types.ts    the contract everyone shares
lib/data/       mock adapter and Prisma DTO adapter
lib/server/     auth, repositories, services, search and ingestion
lib/moderation  spam/scam filter (rules today, swap for a model later)
lib/recommend   "more like this" (tag overlap today)
supabase/       schema.sql
scripts/        seed.ts and recommendation verification
docs/PLAN.md    the 15-hour plan and who owns what
```

## Ground rules

- All seed content is sample. No real users, partners, venues or sales are claimed.
- We link to official sources. We don't host anime, manga, music, lyrics or clips.
- Fonts (Klee One, Zen Maru Gothic, DotGothic16) load from Google Fonts. Fallbacks keep the layout intact offline.
