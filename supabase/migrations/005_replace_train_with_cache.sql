-- Swap Active Duty map: Train -> Cache (keeps map_id for existing lineups)
update public.maps
set name = 'Cache', slug = 'cache', sort_order = 8
where slug = 'train';

insert into public.maps (name, slug, sort_order)
select 'Cache', 'cache', 8
where not exists (select 1 from public.maps where slug = 'cache');
