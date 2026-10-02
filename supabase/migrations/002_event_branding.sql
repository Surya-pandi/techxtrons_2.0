-- Replace original placeholders while preserving any customized content.
alter table public.settings alter column event_name set default 'TECHXTRONS 2.0';
alter table public.settings alter column association_name set default 'Department of Information Technology';
update public.settings set event_name = 'TECHXTRONS 2.0' where event_name = 'EVENT NAME';
update public.settings set association_name = 'Department of Information Technology' where association_name = 'DEPARTMENT ASSOCIATION';
update public.contact set department_name = 'Department of Information Technology' where department_name = 'DEPARTMENT NAME';
update public.about set description = 'TECHXTRONS 2.0 brings together the Department of Information Technology for a celebration of ideas, creativity, and shared ambition. A space for curious minds to meet and turn ideas into something extraordinary.' where description = '[ASSOCIATION INTRODUCTION]';
