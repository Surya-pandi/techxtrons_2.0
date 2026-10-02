-- Advance the default event edition while preserving unrelated custom content.
alter table public.settings alter column event_name set default 'TECHXTRONS 3.0';
update public.settings set event_name = 'TECHXTRONS 3.0'
where event_name = 'TECHXTRONS 2.0';
update public.about
set description = replace(description, 'TECHXTRONS 2.0', 'TECHXTRONS 3.0')
where description like '%TECHXTRONS 2.0%';
