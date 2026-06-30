<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# CS2 Lineups

Personal Counter-Strike 2 grenade lineup library. Each lineup stores a stand-position screenshot, an aim/crosshair screenshot, and metadata (map, grenade type, side, throw method, optional site).

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, Turbopack) |
| Styling | Tailwind CSS v4 |
| Database & storage | Supabase (Postgres + public Storage bucket `lineups`) |
| Auth | Simple password cookie for `/admin` (not Supabase Auth) |
| Tweet import | `twitter-downloader`, `ffmpeg-static`, `ffmpeg-extract-frames` |

Caching uses Next.js **Cache Components** (`cacheComponents: true`, `'use cache'`, `cacheTag` / `revalidateTag`). Public lineup and map queries live in `src/lib/cached-queries.ts`; mutations revalidate via `src/lib/cache-tags.ts`.

## Project layout

```
src/app/              Routes (public browse + admin + API route handlers)
src/components/       UI (MapLineupsView, LineupDetail, lightboxes, admin forms)
src/lib/
  queries.ts          Re-exports cached reads + admin-only queries
  cached-queries.ts   Cached Supabase reads for maps/lineups
  import/             Tweet download, frame extraction, import session cache
  supabase/           Server and admin Supabase clients
supabase/migrations/  SQL schema (maps, lineups, source_type/source_url)
.agents/skills/       Agent skills for this repo (see below)
```

## Data model

- **maps** — Active Duty maps (`slug`, `sort_order`)
- **lineups** — Grenade lineups linked to a map; images in Supabase Storage
- **source_type** / **source_url** — `"none"` for manual entry, `"twitter"` + URL for tweet imports (same tweet can map to multiple lineups)

Public RLS allows read on maps/lineups/images. Writes use the Supabase **secret** key from API routes behind admin auth.

## Environment

Copy `.env.local.example` → `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — client-safe Supabase
- `SUPABASE_SECRET_KEY` — server-only writes and storage uploads
- `ADMIN_PASSWORD` — `/admin/login`

## Conventions

- Prefer existing patterns in surrounding code; keep diffs focused.
- Imports at the top of files; exhaustive `switch` with `never` on unions.
- Conventional Commits; do not commit unless asked.
- Tweet import is heavy (ffmpeg binaries) — local dev is most reliable; serverless deploys may hit size limits.

## Agent skills

Project-specific skills are in [`.agents/skills/`](.agents/skills/). Load the relevant `SKILL.md` before non-trivial work:

| Skill | Use when |
| --- | --- |
| `frontend-design` | Distinctive visual direction, typography, avoiding templated UI |
| `ui-ux-designer` | UX flows, wireframes, accessibility-first interface design |
| `design-system` | Token architecture (primitive → semantic → component), component specs |
| `tailwind-design-system` | Tailwind theme tokens, spacing/typography scales, component variants |
| `tailwindcss-accessibility` | WCAG compliance, focus states, screen reader patterns with Tailwind |
| `next-cache-components-adoption` / `next-cache-components-optimizer` | Caching, PPR, Suspense, `use cache` |
| `next-dev-loop` | Local Next.js dev workflow |
| `supabase` / `supabase-postgres-best-practices` | Schema, queries, RLS, migrations |
| `nextjs-supabase-auth` | If migrating admin auth to Supabase Auth |
| `vercel-react-best-practices` / `nextjs-best-practices` | React/Next patterns and performance |
| `tailwind-v4` | Tailwind v4 theming and CSS-first config |
| `deploy-to-vercel` | Deploying or preview deployments |

Locked versions: `skills-lock.json`.
