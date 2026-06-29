-- One tweet can contain multiple lineups; source_url is not unique
drop index if exists public.lineups_twitter_source_url_unique;
