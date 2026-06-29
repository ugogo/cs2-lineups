# CS2 Lineups

Personal CS2 grenade lineup library — save stand position and aim reference screenshots with throw instructions.

## Stack

- Next.js 16 + Tailwind CSS
- Supabase (Postgres + Storage)
- Password-protected admin

## Setup

1. Copy env file and fill in the service role key:

```powershell
copy .env.local.example .env.local
```

2. Get your **service role key** from Supabase dashboard:
   [Project Settings → API](https://supabase.com/dashboard/project/zjlmrvwpykbuophaujbw/settings/api)

   Paste it as `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

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

## Supabase project

- **Name:** cs2-lineups
- **Region:** eu-west-3
- **URL:** https://zjlmrvwpykbuophaujbw.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/zjlmrvwpykbuophaujbw
