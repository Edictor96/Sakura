# 🌸 Sakura

**A community-first platform where Indian fans discover, discuss and experience Japanese pop culture, all in one place.**

Built by **Team Nekomata** for the Japan Hackathon.

> Sakura was previously called Kizuna. Some older files or slides may still use the old name.

---

## The Problem

Japanese pop culture is growing fast in India, but it is scattered. Fans use different platforms for content, communities, merchandise and events (OTT apps, Discord, Instagram, marketplaces). These experiences are disconnected. The fandom exists, but the infrastructure connecting it is missing.

## The Solution

Sakura brings it together in one mobile-first app, built around people rather than algorithms. The core loop:

**Discover → React → Discuss → Join → Attend → Collect → Belong**

---

## Features

### 🔎 Explore
- Curated shelf of anime, J-music and Japanese films
- Mood-based browsing (Feel-good, Emotional, High-energy and more)
- Trending picks, new and upcoming releases, and curated collections
- "Meet around this" links connecting a title to related events and groups
- Sakura links to official sources and does not host anime, manga or music

### 💬 Community
- Fandom groups for anime, manga, music, film and games
- "Find Your Niche" paths that lead fans from mainstream groups to smaller ones
- For You, Nearby and My Groups tabs, plus city communities
- Posts with replies, polls and spoiler tags
- Watch parties with live chat and reactions
- Member profiles with taste tags and badges
- Report and block tools

### 🎟 Events
- Year-round local and online events, found by city and franchise
- Tabs: For You, Offline, Online, Conventions
- One-tap RSVP, "Who's going," "Arrive together," waitlists and QR RSVP passes
- Online watch-alongs with synced chat and polls (fans watch on their own legal subscriptions)
- Host flow with a built-in rights and safety checklist
- Partner convention discovery, event recaps and badges
- Guardrails: verified hosts, public venues for first meetups, age rules, no unlicensed screenings

### 🛍 Merch
- A marketplace built around partnerships with **small businesses**, not large franchises
- Highlights **Indo-Japanese fusion** products
- Exclusive drops with limited quantities and "Notify me"
- Product pages with a Fusion story, partner business cards and buyer reviews
- Wishlist, cart and orders
- Sakura Partner badge and report-a-listing option

### How the sections connect
- Community groups link to their events, and events link back to groups
- Explore cards link to related events and groups
- Pop-up events feature partner shops from Merch
- Groups can share product picks

---

## Tech Stack

**Prototype (this repo)**

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) and React |
| Styling | Tailwind CSS |
| Data | Mock data in local constants (no backend, auth or payments) |
| Design | Mobile-first, PWA-ready |

**Planned architecture**

| Layer | Technology |
|---|---|
| Backend | FastAPI or Node.js |
| Database | PostgreSQL |
| Real-time | Redis (live chat, watch-alongs) |
| AI services | Recommendations, moderation, trend detection |

---

## Getting Started

> Update the commands below to match your repo (npm, yarn or pnpm).

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). For the best view, use your browser's mobile device mode.

---

## Project Structure

> Edit this to match your actual folders.

```
.
├── app/          # Pages and routes (Explore, Community, Events, Merch, Profile)
├── components/   # Reusable UI components
├── data/         # Mock data (groups, posts, events, products, partners)
├── public/       # Images and static assets
└── README.md
```

---

## Roadmap

| Phase | Timeline | Focus |
|---|---|---|
| 01 Build | 0 to 3 months | Basic catalogue, fan communities, fan events (MVP) |
| 02 Connect | 3 to 9 months | Partner small businesses, media collaborations |
| 03 Expand | 9 to 18 months | More Indian cities, regional events, local languages |
| 04 Scale | 18 to 36 months | Studio and publisher partnerships, global launches |

---

## Content and Rights

- Sakura links to official sources and does not host or rebroadcast anime, manga or music.
- Events follow a rights status per franchise. Unlicensed screenings are not allowed.
- Merch comes from verified partner businesses, and listings can be reported.

---

## Team Nekomata

- Shashwat Singh
- Kanika Mahendru
- Shaksham Garg
- Aryan

---
