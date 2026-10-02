-- INITIAL SETUP ONLY: run once in the Supabase SQL editor on a project without these tables.
-- Bundles migrations 001-004. Do not run this and the same migrations separately.
-- After success set SITE_PREVIEW_MODE=false in .env.local.

begin;

-- 001_initial.sql
-- Run once in the Supabase SQL editor. No service-role key is used by this app.
create extension if not exists pgcrypto;
create table public.admins (id uuid primary key references auth.users(id) on delete cascade, email text unique not null, created_at timestamptz not null default now());
alter table public.admins enable row level security;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$ select exists(select 1 from public.admins where id = auth.uid()); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
create policy "Admins may read their membership" on public.admins for select to authenticated using (id = auth.uid());
create table public.events (
 id uuid primary key default gen_random_uuid(), title text not null, slug text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), category text not null check (category in ('technical','non_technical')),
 description text not null default '', poster_url text not null default '', event_date date, event_time time, venue text not null default '', rules text not null default '', coordinators text not null default '', prize_details text not null default '', registration_url text not null default '', is_featured boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.gallery (
 id uuid primary key default gen_random_uuid(), image_url text not null, storage_path text, caption text not null default '', category text not null default 'others' check (category in ('technical','non_technical','cultural','moments','others')), event_id uuid references public.events(id) on delete set null, is_featured boolean not null default false, created_at timestamptz not null default now()
);
create table public.about (id uuid primary key default '00000000-0000-0000-0000-000000000001' check (id = '00000000-0000-0000-0000-000000000001'), title text not null default '', description text not null default '', vision text not null default '', mission text not null default '', objectives text not null default '', image_url text not null default '', updated_at timestamptz not null default now());
create table public.contact (id uuid primary key default '00000000-0000-0000-0000-000000000001' check (id = '00000000-0000-0000-0000-000000000001'), department_name text not null default '', college_name text not null default '', email text not null default '', phone text not null default '', address text not null default '', map_url text not null default '', instagram_url text not null default '', linkedin_url text not null default '', youtube_url text not null default '', updated_at timestamptz not null default now());
create table public.settings (id uuid primary key default '00000000-0000-0000-0000-000000000001' check (id = '00000000-0000-0000-0000-000000000001'), event_name text not null default 'EVENT NAME', association_name text not null default 'DEPARTMENT ASSOCIATION', year text not null default '2026', event_starts_at timestamptz, venue text not null default 'EVENT VENUE', logo_url text not null default '/images/logo.png', intro_enabled boolean not null default true, updated_at timestamptz not null default now());
create table public.messages (id uuid primary key default gen_random_uuid(), name text not null, email text not null, subject text not null, message text not null, created_at timestamptz not null default now());
create table public.contact_rate_limits (fingerprint text primary key, window_start timestamptz not null, requests int not null default 1);
alter table public.contact_rate_limits enable row level security;
alter table public.messages enable row level security;
create policy "Admin message access" on public.messages for select to authenticated using (public.is_admin());
-- Public submissions go through a bounded SECURITY DEFINER RPC; direct inserts are denied.
create or replace function public.submit_contact(p_name text, p_email text, p_subject text, p_message text) returns void language plpgsql security definer set search_path = '' as $$
declare v_count int; v_key text;
begin
 if length(trim(p_name)) < 2 or length(p_name) > 100 or length(p_email) > 254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or length(trim(p_subject)) < 3 or length(p_subject) > 150 or length(trim(p_message)) < 10 or length(p_message) > 5000 then raise exception 'Invalid contact form'; end if;
 v_key := md5(lower(trim(p_email)));
 insert into public.contact_rate_limits(fingerprint, window_start, requests) values(v_key, now(), 1)
 on conflict(fingerprint) do update set requests = case when contact_rate_limits.window_start < now() - interval '1 hour' then 1 else contact_rate_limits.requests + 1 end, window_start = case when contact_rate_limits.window_start < now() - interval '1 hour' then now() else contact_rate_limits.window_start end returning requests into v_count;
 if v_count > 3 then raise exception 'Please wait before sending another message.'; end if;
 insert into public.messages(name,email,subject,message) values(trim(p_name),trim(p_email),trim(p_subject),trim(p_message));
end; $$;
revoke all on function public.submit_contact(text,text,text,text) from public;
grant execute on function public.submit_contact(text,text,text,text) to anon, authenticated;
create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end; $$;
do $$ declare t text; begin
 foreach t in array array['events','gallery','about','contact','settings'] loop
 execute format('alter table public.%I enable row level security', t);
 execute format('create policy "Public read" on public.%I for select to anon, authenticated using (true)', t);
 execute format('create policy "Admin insert" on public.%I for insert to authenticated with check (public.is_admin())', t);
 execute format('create policy "Admin update" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
 execute format('create policy "Admin delete" on public.%I for delete to authenticated using (public.is_admin())', t);
 end loop;
 foreach t in array array['events','about','contact','settings'] loop
 execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
 end loop;
end $$;
create index events_category_idx on public.events(category);
create index gallery_event_idx on public.gallery(event_id);
create index gallery_category_idx on public.gallery(category);
revoke all on public.admins, public.messages, public.contact_rate_limits from anon, authenticated;
grant select on public.admins, public.messages to authenticated;
revoke all on public.events, public.gallery, public.about, public.contact, public.settings from anon, authenticated;
grant select on public.events, public.gallery, public.about, public.contact, public.settings to anon, authenticated;
grant insert, update, delete on public.events, public.gallery, public.about, public.contact, public.settings to authenticated;
insert into public.settings(id) values('00000000-0000-0000-0000-000000000001');
insert into public.about(title,description,vision,mission,objectives,image_url) values ('ASSOCIATION TITLE','[ASSOCIATION INTRODUCTION]','[VISION]','[MISSION]','[OBJECTIVES]','/images/placeholders/department-logo.png');
insert into public.contact(department_name,college_name,address) values ('DEPARTMENT NAME','COLLEGE NAME','EVENT VENUE');
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('gallery','gallery',true,10485760,array['image/jpeg','image/png','image/webp']),
 ('event-posters','event-posters',true,10485760,array['image/jpeg','image/png','image/webp']),
 ('site-assets','site-assets',true,10485760,array['image/jpeg','image/png','image/webp']);
create policy "Public site image read" on storage.objects for select to anon,authenticated using (bucket_id in ('gallery','event-posters','site-assets'));
create policy "Admin site image upload" on storage.objects for insert to authenticated with check (bucket_id in ('gallery','event-posters','site-assets') and public.is_admin());
create policy "Admin site image update" on storage.objects for update to authenticated using (bucket_id in ('gallery','event-posters','site-assets') and public.is_admin()) with check (bucket_id in ('gallery','event-posters','site-assets') and public.is_admin());
create policy "Admin site image delete" on storage.objects for delete to authenticated using (bucket_id in ('gallery','event-posters','site-assets') and public.is_admin());


-- 002_event_branding.sql
-- Replace original placeholders while preserving any customized content.
alter table public.settings alter column event_name set default 'TECHXTRONS 2.0';
alter table public.settings alter column association_name set default 'Department of Information Technology';
update public.settings set event_name = 'TECHXTRONS 2.0' where event_name = 'EVENT NAME';
update public.settings set association_name = 'Department of Information Technology' where association_name = 'DEPARTMENT ASSOCIATION';
update public.contact set department_name = 'Department of Information Technology' where department_name = 'DEPARTMENT NAME';
update public.about set description = 'TECHXTRONS 2.0 brings together the Department of Information Technology for a celebration of ideas, creativity, and shared ambition. A space for curious minds to meet and turn ideas into something extraordinary.' where description = '[ASSOCIATION INTRODUCTION]';


-- 003_event_content.sql
-- Replace only the original draft values; preserve content edited by the team.
update public.about set title = 'Great minds. Greater possibilities.'
where title = 'ASSOCIATION TITLE';
update public.about set vision = 'To build a community where curiosity becomes confidence, and students feel empowered to shape what comes next in technology.'
where vision = '[VISION]';
update public.about set mission = 'Bring students together to learn by doing, exchange perspectives, and explore technology through creativity and collaboration.'
where mission = '[MISSION]';
update public.about set objectives = 'Encourage problem-solving, give ideas a platform, celebrate talent, and create connections that continue beyond the event.'
where objectives = '[OBJECTIVES]';
alter table public.settings alter column venue set default 'Venue to be announced';
update public.settings set venue = 'Venue to be announced' where venue = 'EVENT VENUE';
update public.contact set college_name = 'College details to be announced' where college_name = 'COLLEGE NAME';
update public.contact set address = 'Venue and address to be announced' where address = 'EVENT VENUE';


-- 004_event_edition.sql
-- Advance the default event edition while preserving unrelated custom content.
alter table public.settings alter column event_name set default 'TECHXTRONS 3.0';
update public.settings set event_name = 'TECHXTRONS 3.0'
where event_name = 'TECHXTRONS 2.0';
update public.about
set description = replace(description, 'TECHXTRONS 2.0', 'TECHXTRONS 3.0')
where description like '%TECHXTRONS 2.0%';


NOTIFY pgrst, 'reload schema';
commit;
