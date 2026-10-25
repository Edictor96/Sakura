-- KIZUNA prototype schema. Paste into Supabase: SQL Editor > New query > Run.
-- Column names mirror lib/types.ts (snake_case here, camelCase there).
-- Mapping lives in lib/data/supabase.ts. Change both together.

create table if not exists cities (
  slug  text primary key,
  name  text not null,
  pilot boolean not null default false
);

create table if not exists rooms (
  slug      text primary key,
  name      text not null,
  blurb     text not null,
  kind      text not null check (kind in ('interest', 'city')),
  glyph     text not null,
  tags      text[] not null default '{}',
  dimension text check (dimension in ('Anime','Manga','Music','Gaming','Cinema','Fashion')),
  city_slug text references cities(slug)
);

create table if not exists posts (
  id         bigint generated always as identity primary key,
  room_slug  text not null references rooms(slug) on delete cascade,
  author     text not null default 'Guest',
  body       text not null check (char_length(body) between 2 and 600),
  created_at timestamptz not null default now()
);
create index if not exists posts_room_created on posts (room_slug, created_at desc);

create table if not exists events (
  id        text primary key,
  title     text not null,
  city_slug text not null references cities(slug),
  starts_at timestamptz not null,
  venue     text not null,
  blurb     text not null,
  tags      text[] not null default '{}',
  room_slug text references rooms(slug)
);

create table if not exists catalogue_items (
  id    text primary key,
  title text not null,
  kind  text not null check (kind in ('anime','manga','film','music','game')),
  world text not null check (world in ('watch','listen','play')),
  year  int,
  maker text,
  blurb text not null,
  tags  text[] not null default '{}'
);

create table if not exists products (
  id          text primary key,
  title       text not null,
  category    text not null check (category in ('apparel','accessories','stationery','bags','collectibles')),
  brand       text not null,
  partner     text not null,
  partner_url text,
  verified    boolean not null default false,
  blurb       text not null
);

-- Row level security: everyone can read. Only posting is open, and only for now.
alter table cities           enable row level security;
alter table rooms            enable row level security;
alter table posts            enable row level security;
alter table events           enable row level security;
alter table catalogue_items  enable row level security;
alter table products         enable row level security;

create policy "read cities"    on cities          for select using (true);
create policy "read rooms"     on rooms           for select using (true);
create policy "read posts"     on posts           for select using (true);
create policy "read events"    on events          for select using (true);
create policy "read catalogue" on catalogue_items for select using (true);
create policy "read products"  on products        for select using (true);

-- PROTOTYPE ONLY: lets anyone post. Replace with auth.uid() checks once sign-in exists.
create policy "anyone can post (prototype)" on posts for insert with check (true);

-- Later (not needed for the demo): profiles, memberships, rsvps, reports.
-- Membership and RSVP state currently lives in the browser (lib/store.ts).
