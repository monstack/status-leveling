# ⚔️ Status Leveling — Life RPG

> *"It's not just about doing the work; it's about finessing the character build of your life."*

A personal productivity web app that gamifies daily time allocation. Track hours spent on life categories, earn XP, and level up your stats like an RPG character.

---

## Concept

Every hour you spend on a meaningful activity earns **+1 Point** toward that stat. You have **24 Points per day** (1 point = 1 hour). The goal is to make discipline visible and identify lazy days by treating your life like a character build.

### Stats (Phase 1)

| Stat | Color | Focus |
|---|---|---|
| ⚔️ **Physical** | Emerald | Fitness, exercise, health |
| 📚 **Reading** | Amber | Books, literature, knowledge |
| 💻 **Technical** | Blue | Coding, AWS/Cloud, DevOps |

### XP Formula

```
1 hour = 10 XP
Level N requires N × (N+1) / 2 × 100 cumulative XP

Level 1:  100 XP  (~10h)
Level 5:  1500 XP (~150h)
Level 10: 5500 XP (~550h)
```

---

## Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Hosting** | Cloudflare Pages + Workers |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Magic Link |
| **UI** | shadcn/ui + Tailwind CSS |
| **Data fetching** | TanStack Query v5 |
| **Charts** | Recharts |
| **Domain** | monstack.dev |

---

## Features (Phase 1)

- 🔐 **Magic link auth** — passwordless, mobile-friendly
- 📊 **Daily log form** — log hours per stat with +/- stepper (0.25h increments)
- ⚡ **XP bars** — animated progress bars per stat, level badge
- 🎯 **Budget meter** — 24-point daily gauge turns red when over limit
- 🎉 **Level-up toast** — confetti animation when you cross a level threshold
- 📅 **History calendar** — color-coded month grid by hours logged
- 📈 **Stats charts** — weekly bar chart + cumulative area chart (Recharts)
- 📱 **PWA** — installable on iOS/Android via "Add to Home Screen"
- 🌙 **Dark RPG theme** — scan-line overlays, glow effects, pixel font headers

---

## Roadmap (Phase 2)

- [ ] **Deep Work multiplier** — x1.5 XP for focused sessions, x0.5 for shallow
- [ ] **Milestone bonuses** — extra XP for finishing a book, deploying a project
- [ ] **Skill Trees** — Technical → Cloud Architect / DevOps / FinOps sub-classes
- [ ] **Streaks** — consecutive day tracking
- [ ] **Export** — CSV/JSON data export

---

## Local Development

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/monstack/status-leveling.git
cd status-leveling

# 2. Install dependencies
npm install

# 3. Set environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Run database migrations (paste into Supabase SQL Editor)
# supabase/migrations/001_initial_schema.sql
# supabase/migrations/002_rls_policies.sql
# supabase/seed.sql

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Schema

```
stat_categories   — Physical / Reading / Technical (seeded)
profiles          — Extends auth.users (auto-created on signup)
daily_logs        — One row per user per category per day
milestones        — Phase 2: bonus XP events (table exists, empty)
```

All tables protected by Row Level Security — users can only read/write their own data.

---

## Deployment

```bash
# Build + deploy to Cloudflare Pages
npm run deploy
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your Cloudflare Pages dashboard under **Settings → Environment Variables**.

---

## Security Notes

- The Supabase **anon key** is public by design — Row Level Security policies protect all data
- The **service_role key** is never used in this app
- Never commit `.env.local` — it is gitignored
- Magic link auth means no passwords to leak
