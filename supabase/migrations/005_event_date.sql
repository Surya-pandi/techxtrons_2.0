-- Event date confirmed as 10 October 2026; midnight IST until a time is specified.
alter table public.settings alter column event_starts_at
set default '2026-10-10T00:00:00+05:30'::timestamptz;
update public.settings
set event_starts_at = '2026-10-10T00:00:00+05:30'::timestamptz
where id = '00000000-0000-0000-0000-000000000001';
