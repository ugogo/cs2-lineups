-- Lineup tags (execute, retake, one-way, pop, default)
alter table public.lineups
  add column if not exists tags text[] not null default '{}';

-- Collections / practice packs
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.collection_lineups (
  collection_id uuid not null references public.collections(id) on delete cascade,
  lineup_id uuid not null references public.lineups(id) on delete cascade,
  sort_order int not null default 0,
  primary key (collection_id, lineup_id)
);

create index if not exists collection_lineups_collection_id_idx
  on public.collection_lineups (collection_id, sort_order);

alter table public.collections enable row level security;
alter table public.collection_lineups enable row level security;

create policy "Public read collections" on public.collections
  for select using (true);

create policy "Public read collection lineups" on public.collection_lineups
  for select using (true);
