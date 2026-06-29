# CS2 Lineups

Personal CS2 grenade lineup library — save stand position and aim reference screenshots with throw instructions.

## Stack

- Next.js 16 + Tailwind CSS
- Supabase (Postgres + Storage)
- Password-protected admin

## Setup

1. Copy env file and fill in your Supabase keys:

```powershell
copy .env.local.example .env.local
```

2. Get your **Publishable key** and **Secret key** from Supabase dashboard:
   [Project Settings → API Keys](https://supabase.com/dashboard/project/zjlmrvwpykbuophaujbw/settings/api)

   Paste them as `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY` in `.env.local`.

3. Install and run:

```powershell
npm install
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

5. Admin login at `/admin/login` — password is set in `ADMIN_PASSWORD` in `.env.local`

## Usage

- **Browse** maps on the home page
- **View lineups** per map with stand + aim screenshots
- **Admin** → Add lineup → upload 2 screenshots, set throw method and metadata

## Import from tweet

Semi-automated import from X/Twitter lineup videos. Uses npm packages (`twitter-downloader`, `ffmpeg-static`, `ffmpeg-extract-frames`) — no separate yt-dlp or ffmpeg install needed. Run `npm install` as usual.

Workflow:

1. Admin → **Import from tweet**
2. Paste a tweet URL (e.g. from @NadesOutHere) and click **Fetch preview**
3. Review pre-filled metadata, pick **Position** and **Aim** frames from the filmstrip
4. Click **Publish lineup**

The tweet URL is appended to notes as attribution.

**Note:** `ffmpeg-static` bundles a large binary (~70MB). Serverless deploys may hit size limits; local `npm run dev` is the most reliable environment for imports.

## Supabase project

- **Name:** cs2-lineups
- **Region:** eu-west-3
- **URL:** https://zjlmrvwpykbuophaujbw.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/zjlmrvwpykbuophaujbw
