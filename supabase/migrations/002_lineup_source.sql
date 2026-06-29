-- Lineup attribution: manual imports use source_type = 'none'
alter table public.lineups
  add column if not exists source_type text not null default 'none'
    check (source_type in ('none', 'twitter')),
  add column if not exists source_url text;

alter table public.lineups
  add constraint lineups_source_url_required
  check (
    (source_type = 'none' and source_url is null)
    or (source_type = 'twitter' and source_url is not null)
  );

-- Backfill tweet imports that stored the URL in notes
update public.lineups
set
  source_type = 'twitter',
  source_url = (regexp_match(notes, 'Source: (https?://[^\s\n]+)'))[1]
where source_type = 'none'
  and notes ~ 'Source: https?://(x\.com|twitter\.com)/';
