# SAKURA Domain and Entity Map

This map records the current models, their ownership, and the target canonical entities. The
important migration concern is not missing UI data; it is duplicated models with different IDs,
fields, and persistence paths.

## Canonical entities

| Entity | Identity | Core relationships | Current source |
|---|---|---|---|
| City | `slug` | has rooms and events | `lib/types.ts`, `lib/data/mock.ts`, `supabase/schema.sql` |
| Room | `slug` | belongs optionally to a city; has posts and events; may feed a Passport dimension | `lib/types.ts`, `lib/data/mock.ts`, Community models |
| Post | database id | belongs to a room/community group; has replies, reactions, reports | `lib/types.ts`, `communityData.ts`, browser storage |
| Community group | `slug` | parent group, category, city, members, posts, watch parties | `communityData.ts` |
| Catalogue item | `id` | has world, kind, tags; can relate to rooms/events/products | `lib/types.ts`, `mock.ts` |
| Event | `id` | city, host, group/room, optional franchise, attendees, badges, recap | `lib/types.ts`, `eventsData.ts` |
| User | future auth id | owns memberships, RSVPs, saves, cart, reviews, reports | not implemented |
| Membership | `(userId, room/groupId)` | joins a user to a room or community | localStorage only |
| RSVP | `(userId, eventId)` | records attendance intent | localStorage only |
| Saved item | `(userId, catalogueItemId)` | records a saved title | localStorage only |
| Partner | `id` | owns products and drops; may be linked to events | `merchData.ts` |
| Product | `id` | belongs to a partner; has category, tags, stock state, reviews | `lib/types.ts`, `merchData.ts` |
| Drop | `id` | belongs to a partner/product; optional group restriction | `merchData.ts` |
| Order | `id` | future user-owned purchase record; no payment implementation | `merchData.ts` mock only |
| Review | `id` | future user-owned product review | `merchData.ts`, browser storage |
| Watch party | `id` | belongs to a group/event and has agenda, polls, trivia, recap | `watchAlongData.ts`, `communityData.ts` |
| Event host/proposal | `id` | future user/partner-submitted event workflow | `eventsData.ts`, `hostData.ts` |
| Passport stamp | `id` | derived from RSVP/participation and event state | UI/local state only |

## Target relationship graph

```text
City 1 ---- * Room
City 1 ---- * Event
Room 1 ---- * Post
CommunityGroup 1 ---- * Post
CommunityGroup 1 ---- * CommunityGroup (parent)
Room 0..1 -- 1 CommunityGroup (compatibility link during migration)
Event 0..1 -- 1 Room
Event 0..1 -- 1 CommunityGroup
Event 0..1 -- 1 CatalogueItem (franchise/title)
User 1 ----- * Membership * ----- 1 Room or CommunityGroup
User 1 ----- * RSVP * ----------- 1 Event
User 1 ----- * SavedItem * ------ 1 CatalogueItem
Partner 1 -- * Product
Product 1 -- * Review
Product 1 -- * Drop
Event 0..1 -- 1 WatchParty
```

## Current duplicate contracts

### Rooms and posts

`lib/types.ts` models `Room` and `Post` with `roomSlug`, while `communityData.ts` models
`CommunityGroup`, `CommunityPost`, and `CommunityReply` with `groupSlug`, `authorId`, reactions,
spoilers, polls, and replies. `RoomFeed` uses the former; Community uses the latter. These should
be separate concepts only if the product intentionally distinguishes a simple room from a rich
community group. Otherwise, introduce one canonical community/room model with a compatibility
projection for the existing UI.

### Events

`lib/types.ts` has a minimal `EventItem` (`citySlug`, `date`, `venue`, `roomSlug`). The Events
surface uses a richer `EventItem` with `hostId`, `groupId`, `franchiseId`, status, capacity,
badges, and recap. The richer event model is the target; the minimal model should become a DTO
projection or be retired after all consumers move to the service.

### Merch

`lib/types.ts`/`supabase/schema.sql` represent a simple product catalogue with `title`, `brand`,
`partner`, and verification. `merchData.ts` represents partner businesses, priced products,
inventory-like status, drops, orders, reviews, and social relations. The latter is the target
domain model, while checkout/payment and inventory writes remain out of scope.

### Home and Explore

`homeData.ts` contains editorial recommendations, trends, user summary, and categories as
hardcoded view data. `exploreData.ts` derives collections and moods from catalogue tags. These
should remain presentation/query models; they should not become duplicated persistence entities.
Home should eventually consume read models from services, while deterministic similarity remains
behind the intelligence interface.

## Identifier and naming rules

- Preserve public slugs used in links and local state during the first migration.
- Use `createdAt`/`updatedAt` in domain DTOs and map to snake_case only inside repositories.
- Use `cityId`/`citySlug` consistently at the service boundary; do not expose both for one entity.
- Treat `roomSlug` and `groupSlug` as compatibility fields until the room/group decision is made.
- Do not infer user identity from `author: "Guest"` once authentication is introduced.
