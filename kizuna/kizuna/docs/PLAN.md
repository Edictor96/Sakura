# KIZUNA: 15-hour build plan

Team of 5. One rule above all: **community stays in the centre.** Every screen, every task and the demo itself should answer "how does this connect people?" If a task doesn't, cut it.

## What we are building (the refined crux)

KIZUNA is where Indian fans *take part in* Japanese culture, not just consume it. The prototype proves one loop end to end:

> Discover a title → find the room talking about it → join and post → see a meetup in your city → say you're going → it appears on your Passport.

That is the pitch's Discover → Discuss → Join → Attend → Belong, working in a browser.

### Refinements (none change the idea, all make it demoable and defensible)

1. **Wedge, not everything.** Rooms + city events + Passport are the product. Watch/Listen/Play is the *entry point* (discovery), not the destination. Anime leads, other worlds are present from day one so we're never "anime-only".
2. **We link, we don't host.** Every title links to an official service. No streams, no lyrics, no clips. Say this line out loud in the demo; it answers the IP question before it's asked.
3. **Passport is the visible identity.** Six sides (Anime, Manga, Music, Gaming, Cinema, Fashion) fill from rooms joined. Stamps come from events. It shows *who you are in this culture*, not what you clicked.
4. **Merch = partner links, everyday items first.** Apparel, pins, stationery, bags. No inventory, no checkout, nothing "verified" until a real partner exists.
5. **AI stays backstage and small.** Two real, working pieces: spam/scam filter on posts and "more like this" on titles. Translation is a stub on the roadmap, not in the demo.
6. **Honest data.** Everything is labelled *sample* until real. No invented users, partners or traction anywhere in the UI or pitch.

## Roles

Your deck lists four names and you're five, so roles are lettered. Put names against them in the first 10 minutes.

| Role | Owns | Main files |
|---|---|---|
| **A. Frontend lead** | Design system, shell, home, mobile polish, PWA, final demo path | `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `components/Doodles.tsx`, `components/NavLinks.tsx` |
| **B. Frontend, community** | Rooms, room page, feed, Passport | `app/rooms/**`, `components/RoomFeed.tsx`, `components/PassportView.tsx`, `lib/store.ts` |
| **C. Backend and deploy** | Supabase project, schema, seed, auth-lite, API routes, Vercel deploy | `supabase/schema.sql`, `scripts/seed.ts`, `lib/data/supabase.ts`, `app/api/**` |
| **D. Discovery, live, collect, AI** | Discover + detail, Live, Collect, recommender, moderation | `app/discover/**`, `app/live/**`, `app/collect/**`, `lib/recommend.ts`, `lib/moderation.ts` |
| **E. Product, content, pitch** | Real content, copy, QA, deck alignment, demo script, backup video | `lib/data/mock.ts` (content only), `docs/`, the deck |

Shared contract: `lib/types.ts`. Anyone changing a type tells C (schema) and A (so nothing breaks). Everything reads data through `lib/data` so frontend never waits for the backend.

## Hour by hour

### Stage 0: Setup and lock (H0 to H1)
- **All:** clone, `npm install`, `npm run dev`, click through every page together (10 min). Agree roles and the demo loop above.
- **C:** create the Supabase project, run `supabase/schema.sql`, share the URL and anon key privately.
- **A:** create the repo, push this scaffold, protect `main`, everyone works on a branch per role and merges small and often.
- **E:** write the one-sentence pitch and the demo script draft (see below).
- **Exit check:** everyone can run the app and has a branch.

### Stage 1: Parallel build (H1 to H5)
- **A:** replace fallback look with the real fonts and doodles; add 2 to 3 more hand-drawn touches (stickers, pixel accents); tighten spacing at 390px and 1200px.
- **B:** room page polish (empty states, long posts, scroll), Passport polish, "Create a room" is *not* in scope.
- **C:** Supabase live: run seed, switch env vars on, confirm pages read real rows; build `/api/posts` insert path and test it.
- **D:** Discover filters and detail page polish; Live city filter; Collect cards; add 8 to 10 more titles and 3 to 4 more events with E.
- **E:** gather real content: accurate titles, artists, real official links, realistic event ideas for Delhi and Mumbai. Finish the pitch narrative from the finals prep.
- **Exit check (H5):** every page works on sample data AND on Supabase data. Anything half-finished gets cut now.

### Stage 2: Integration (H5 to H9)
- **C:** Supabase Auth with magic link or anonymous sign-in, so "Join" and "I'm going" can persist across devices. Move `memberships` and `rsvps` into tables (schema additions only). If this slips, the browser-storage version already demos fine. **Do not let auth block the demo.**
- **B + C:** real posts: write to Supabase, read back, refresh shows them.
- **D:** hook flagged posts to a simple "held for review" list (a table and a plain page is enough).
- **A:** full pass on keyboard focus, contrast, reduced motion; PWA install test on a phone.
- **E:** run the demo loop cold on a phone, log every snag in a shared list.
- **Exit check (H9):** the demo loop works on a phone, on Supabase data, without anyone touching code.

### Stage 3: Polish and stretch (H9 to H12)
Pick from this list in order, stop at H12:
1. Host-a-meetup form (creates an event for a city).
2. Passport share card (a screenshot-friendly view).
3. JP to EN translation on one sample post using an AI API, labelled as a helper.
4. "New in your city" nudge on the home page.
5. Basic report button on posts.

- **E:** update deck screenshots with the real app; make sure every number in the deck is sourced (see finals prep).

### Feature freeze at H12. No new features after this.

### Stage 4: Ship and rehearse (H12 to H14)
- **C:** production deploy on Vercel; set env vars; test the live URL on mobile data; keep a local build running as a backup.
- **A + B + D:** bug fixes only. Fix from E's snag list, highest impact first.
- **E:** record a 90-second screen recording of the whole loop as a fallback. Rehearse the pitch twice with the live demo.
- **All:** one full run-through with a timer and a judge-style Q&A round.

### Stage 5: Buffer (H14 to H15)
Sleep, food, charge laptops. Final deploy check at H14:30. Do not push to `main` after that unless something is broken.

## Demo script (90 seconds)

1. **Home:** "Community is in the centre. Watch, listen, play, live and collect all connect through it."
2. **Discover:** open one title. "We link to official sources. We don't host anything." Point at *If you like this* and *Talk about it*.
3. **Room:** join the room, post a message. Try a scam message to show the filter: "AI works quietly in the background."
4. **Live:** switch to Delhi, tap *I'm going*.
5. **Passport:** "That room and that event are now part of who this person is in the culture."
6. **Collect:** "Merch is partner links, everyday items first. No inventory."

## Cut list (say no to these)
Payments and checkout, real ticketing, streaming or clips, lyrics, short-form video, regional languages, creator dashboards, B2B dashboard, gaming events, recommendation models beyond tag similarity. All are real roadmap items. None belong in 15 hours.

## Risks and fallbacks
| Risk | Fallback |
|---|---|
| Supabase setup eats time | App already runs on sample data. Ship that, add Supabase after. |
| Auth breaks | Keep browser-storage membership; say "accounts are next". |
| Wi-Fi fails at the venue | Local `npm run build && npm start` plus the screen recording. |
| Merge conflicts | Roles own separate files (table above). Merge every hour. |
| Fonts blocked offline | Fallbacks are set; the layout holds without them. |
