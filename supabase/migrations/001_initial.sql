-- maps table
create table if not exists public.maps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0
);

-- lineups table
create table if not exists public.lineups (
  id uuid primary key default gen_random_uuid(),
  map_id uuid not null references public.maps(id) on delete cascade,
  title text not null,
  grenade_type text not null check (grenade_type in ('smoke', 'flash', 'molotov', 'he')),
  side text not null check (side in ('T', 'CT')),
  throw_method text not null check (throw_method in ('standing', 'jump_throw', 'run_throw', 'lmb', 'rmb', 'lmb_rmb')),
  position_image_url text not null,
  aim_image_url text not null,
  notes text,
  site text,
  created_at timestamptz not null default now()
);

alter table public.maps enable row level security;
alter table public.lineups enable row level security;

create policy "Public read maps" on public.maps for select using (true);
create policy "Public read lineups" on public.lineups for select using (true);

insert into public.maps (name, slug, sort_order) values
  ('Mirage', 'mirage', 1),
  ('Inferno', 'inferno', 2),
  ('Dust 2', 'dust2', 3),
  ('Nuke', 'nuke', 4),
  ('Ancient', 'ancient', 5),
  ('Anubis', 'anubis', 6),
  ('Overpass', 'overpass', 7),
  ('Train', 'train', 8)
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public)
values ('lineups', 'lineups', true)
on conflict (id) do nothing;

create policy "Public read lineup images" on storage.objects
  for select using (bucket_id = 'lineups');
