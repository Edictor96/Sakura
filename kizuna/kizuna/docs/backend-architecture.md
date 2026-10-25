# SAKURA Backend Architecture

## Scope

This document describes the production backend target for SAKURA and the current prototype
implementation. Prisma 6.19 and PostgreSQL/Supabase are the canonical persistence layer.
Recommendations remain deterministic and provider ingestion is optional.

### Rich media ingestion

Media uses one provider-neutral record for anime, films, series, music, artists, and other
catalogue entities. Type-specific values are stored in the shared metadata fields and JSON
extension fields on `Media`; provider artwork is normalized into `MediaImage` rows with an
artwork type (`poster`, `backdrop`, `banner`, `thumbnail`, `logo`, or `album`), provider, URL,
dimensions, and source URL. Artwork remains provider-hosted rather than being copied into SAKURA
storage.

Provider adapters return `NormalizedMedia` records. The ingestion service upserts by
`source + externalId`, refreshes that provider's image rows, and preserves the SAKURA media ID
across resyncs. Consumers receive the normalized image collection and structured metadata, so
the frontend does not need provider-specific API calls. Missing optional artwork is skipped; the
existing primary URL remains available as a fallback.

The existing UI remains the source of the current interaction contract. Backend work must replace
data access behind that contract, not redesign the Home, Explore, Community, Events, Merch, or
Profile/Passport surfaces.

## Current-state audit

The implemented baseline now includes Prisma repositories/services, Supabase-to-Prisma user
provisioning, persisted memberships/saves/RSVPs/wishlists/activities, community comments and
replies, reactions, reports, blocks, event check-ins, watch-party persistence models, profile
updates, database-backed search, and an admin-token-protected AniList ingestion route. The mock
adapter remains available when content tables are unavailable during local/demo builds.

### Runtime shape

- Next.js 15 App Router and TypeScript are the only application runtime.
- `lib/data/index.ts` selects either `lib/data/mock.ts` or `lib/data/supabase.ts` based on public
  Supabase environment variables.
- Server-rendered pages use `db` for the original rooms, posts, events, catalogue, and product
  contract.
- Some presentation-only host proposal drafts, city preferences, and legacy merch social
  interactions still use browser storage; authenticated memberships, RSVPs, saved titles,
  wishlist, cart, posts, comments, reactions, reports, blocks, check-ins, and watch-party
  participation use the server persistence layer.
- API routes use the shared auth, repository, and service boundaries. Provider ingestion and
  moderation administration are protected by server-only bearer tokens.
- Orders, payments, reviews, and live chat remain prototype UI surfaces without a corresponding
  transactional backend contract.

### Target dependency flow

```text
Next.js pages and route handlers
        |
        v
Server/API layer: transport, parsing, auth boundary later, response mapping
        |
        v
Service layer: use cases, validation, orchestration, transaction boundaries
        |
        v
Repository/data-access layer: interfaces and Prisma implementations
        |
        v
Prisma Client
        |
        v
PostgreSQL (Supabase-hosted)
```

Intelligence is deliberately outside this flow:

```text
Service layer -- explicit adapter/interface --> Intelligence service boundary
                                                   |
                                                   v
                                           Python/FastAPI later
```

The initial adapter can be a deterministic TypeScript implementation for moderation and
tag-based similarity. No Python service or ML provider is part of this migration.

## Proposed boundaries

### Next.js server/API layer

Route handlers under `app/api/**` are thin transport adapters. They should:

1. Parse the request and validate input.
2. Call one application service.
3. Map domain results to a stable response DTO.
4. Return explicit HTTP errors.

They must not contain Prisma calls, Supabase calls, business scoring, or fallback-to-success
behavior. Existing UI-facing response shapes should be preserved while endpoints are migrated.

Initial resource groups:

- `/api/rooms` and `/api/rooms/[slug]/posts`
- `/api/events` and `/api/events/[id]`
- `/api/catalogue` and `/api/catalogue/[id]`
- `/api/products`, `/api/products/[id]`, and `/api/partners`
- `/api/community/groups`, `/api/community/posts`, and `/api/community/posts/[id]/replies`
- `/api/me/memberships`, `/api/me/rsvps`, and `/api/me/saved`

The last group is a future authenticated surface. It must not be enabled until an auth decision is
made.

### Service layer

Services represent use cases rather than tables. The first set should be:

- `RoomService`: list rooms, read a room, list room posts, create a moderated post.
- `EventService`: list/filter events, read event details, manage RSVP after auth exists.
- `CatalogueService`: list/filter titles and read a title.
- `MerchService`: list products, partners, drops, and read detail data.
- `CommunityService`: groups, posts, replies, reactions, reports, and moderation state.
- `PassportService`: compose a user's rooms, RSVPs, saves, and earned stamps.

Services own cross-entity rules, such as relating an event to a room or ensuring a post belongs to
an existing group. They should depend on repository interfaces and intelligence interfaces, never
on Prisma directly.

### Repository/data-access layer

Repositories expose typed query methods and hide persistence details. Prisma implementations
belong under `lib/server/repositories/**`. A repository should return domain records or explicit
absence, not raw Prisma objects or database column names.

Recommended server-only layout:

```text
lib/
  server/
    db/
      prisma.ts
    repositories/
      city-repository.ts
      room-repository.ts
      post-repository.ts
      event-repository.ts
      catalogue-repository.ts
      merch-repository.ts
      community-repository.ts
      user-state-repository.ts
    services/
      room-service.ts
      event-service.ts
      catalogue-service.ts
      merch-service.ts
      community-service.ts
      passport-service.ts
    intelligence/
      moderation.ts
      recommendations.ts
      types.ts
    http/
      errors.ts
      validation.ts
```

All modules in this tree are server-only. The browser must receive DTOs, never Prisma Client or
service/repository instances.

### Prisma and PostgreSQL/Supabase

Prisma is the single application data-access mechanism after migration. Supabase remains the
managed PostgreSQL host and may continue to provide database operations and storage infrastructure,
but application reads and writes should not mix Prisma and `@supabase/supabase-js`.

The database should use UUID primary keys for new user-owned entities, stable slugs for public
catalogue/group/room identifiers, UTC timestamps, foreign keys, and indexes matching the list
queries. Existing string identifiers can be retained during the compatibility phase and converted
only in a dedicated migration.

Row-level security remains a database defense-in-depth option. If enabled, policies must be
designed alongside the eventual auth model; the service layer still validates ownership and
authorization.

## Error and observability policy

- Invalid input returns a structured 4xx response.
- Missing records return an explicit 404.
- Persistence failures return a 5xx response and are logged with a request/correlation id.
- A failed database write must never return `{ ok: true, persisted: false }` as if the use case
  succeeded.
- Repository errors are not silently converted to mock data in production.
- Mock data remains an explicit development/demo adapter selected by configuration.

## Non-goals for this phase

- Authentication and user identity.
- Recommendations beyond the existing deterministic tag similarity.
- External APIs, payments, seller integrations, ticketing, or email.
- Python/FastAPI implementation.
- UI redesign or behavior changes.
