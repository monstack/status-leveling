# Status Leveling — Tech Stack

> Built as a personal productivity tool in a single session. The entire stack — from database schema to production deployment — runs at zero cost with no servers to manage.

---

## Frontend

### Next.js 15 (App Router)
Full-stack React framework. Handles both the UI and API routes in a single codebase. Uses React Server Components for fast initial page loads.

### Tailwind CSS + shadcn/ui
Utility-first CSS with a component library. Full source code ownership — every component is customizable. Dark RPG theme built on top with custom animations (XP bar fill, glow pulse, level-up flash).

### TanStack Query v5
Server state management. Handles data fetching, caching, and optimistic updates — so the XP bars update instantly when you save a log without waiting for the network response.

### Recharts
Chart library for the stats page. Weekly bar charts and cumulative area charts. Chosen specifically because it works inside Cloudflare Workers (no canvas dependency).

---

## Backend

### Next.js API Routes (running on Cloudflare Workers)
Serverless API endpoints for reading and writing daily logs. No dedicated backend server — each API call spins up a Worker on Cloudflare's edge network.

### Supabase (PostgreSQL)
Hosted database with built-in authentication. Handles magic link emails, user sessions, and stores all daily log data. Row Level Security (RLS) policies ensure each user can only access their own data — enforced at the database level.

---

## Infrastructure

### Cloudflare Workers
Serverless compute platform. The Next.js app is deployed globally across 300+ edge locations using the `@opennextjs/cloudflare` adapter. Auto-deploys on every `git push` via GitHub integration.

### Cloudflare Pages
Static asset delivery (CSS, JS, images) served from Cloudflare's CDN.

### Custom Domain via Cloudflare DNS
Deployed to `lvl.monstack.dev` — since the domain was already managed on Cloudflare, the DNS configuration was a single click.

---

## Auth

### Supabase Magic Link
Passwordless authentication via email. No passwords to store or leak. One-click login from any device — critical for a daily mobile habit tracker.

---

## Developer Experience

| Tool | Purpose |
|---|---|
| **TypeScript** | End-to-end type safety from database schema to UI components |
| **GitHub** | Version control, source of truth for auto-deployments |
| **`@opennextjs/cloudflare`** | Adapter that transforms Next.js build output into a Cloudflare Worker |

---

## Cost

| Service | Plan | Cost |
|---|---|---|
| Cloudflare Workers | Free | $0 |
| Supabase | Free | $0 |
| Cloudflare DNS | Free | $0 |
| **Total** | | **$0/month** |
