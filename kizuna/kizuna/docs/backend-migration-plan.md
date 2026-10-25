# SAKURA Backend Migration Plan

The plan is intentionally incremental. Each phase preserves the existing UI and keeps the mock
adapter available for local demos until the replacement path is verified.

## Phase 0: Baseline and contracts

1. Freeze the current UI data shapes and record the domain/entity map.
2. Decide whether `Room` and `CommunityGroup` are one domain entity with projections or two
   intentionally different entities.
3. Decide the future identity/auth provider before creating user-owned tables.
4. Add server-only configuration parsing and a Prisma singleton without wiring pages yet.
5. Add repository and service interfaces with tests against in-memory fixtures.

Exit criteria: no UI behavior change; a documented contract for every existing direct data import.

## Phase 1: Prisma read foundation

1. Create `prisma/schema.prisma` for cities, rooms/groups, posts/replies, events, catalogue items,
   partners, products, drops, and the compatibility relations.
2. Import the current Supabase schema and mock content into a staging database.
3. Add Prisma repositories and service methods for the existing `DataApi` operations.
4. Add DTO mappers so the current pages can consume domain-safe results.
5. Keep `lib/data/mock.ts` as the explicit development fallback; remove silent production fallback.

Exit criteria: `db.getCities/getRooms/getRoom/getPosts/getEvents/getCatalogue/getProducts` can be
served through Prisma in a staging environment with the same observable page data.

## Phase 2: Route and page read migration

Migrate one vertical slice at a time:

1. Rooms and room detail.
2. Catalogue/discover and title detail.
3. Events list and event detail.
4. Community groups and posts.
5. Merch catalogue, partner, product, and drops.
6. Passport read model.

Server pages may call services directly. Browser interactions should use route handlers. Remove
direct imports of `communityData`, `eventsData`, and `merchData` from page components only after
their service-backed replacements are verified.

Exit criteria: all six existing UI surfaces render from the service/repository path, with no
presentation redesign and no direct Prisma/Supabase calls in components.

## Phase 3: Write-path migration

1. Move post creation from `app/api/posts/route.ts` to `PostService` and a post repository.
2. Preserve moderation as a service dependency behind the intelligence interface.
3. Add explicit validation and error responses; do not report failed writes as successful.
4. Move community replies, reactions, reports, and host proposals behind services when their
   product behavior is approved.
5. Add database transactions for multi-record writes.

Exit criteria: every enabled write has an explicit service, repository, validation, and failure
path.

## Phase 4: User state

This phase is blocked on authentication. After identity is selected:

1. Add users and profiles.
2. Migrate memberships, RSVPs, saved titles, wishlist, follows, reviews, and cart state from
   browser storage when a user is signed in.
3. Keep local state as an offline/anonymous draft only if the UX explicitly supports it.
4. Build the Passport read model from persisted user state.

Exit criteria: user-owned state is scoped by user id and can be revoked or deleted.

## Phase 5: Operational hardening

- Add request IDs, structured logs, metrics, health checks, and database connection monitoring.
- Add migration CI, seed separation, backup/restore verification, and staging smoke tests.
- Add rate limits and abuse controls after authentication and product policy are defined.
- Introduce a Python/FastAPI intelligence service only through the existing adapter boundary.

## Data migration rules

- Back up Supabase before any destructive schema change.
- Load legacy rows into staging and compare counts, identifiers, and representative page queries.
- Keep stable public slugs; add aliases if a rename is required.
- Map legacy `events` and `catalogue_items` fields explicitly instead of relying on column order.
- Record unresolved community/event/merch relationships in a migration report rather than dropping
  them silently.
- Use expand-and-contract migrations: add new columns/tables, dual-read or backfill, switch
  consumers, then remove legacy structures in a later release.

## Verification gates

Every phase must pass:

- `npm run typecheck`
- `npm run build`
- route smoke checks for Home, Explore, Community, Events, Merch, and Passport
- read/write integration checks for the changed vertical slice
- a comparison against the mock adapter for unchanged UI output

