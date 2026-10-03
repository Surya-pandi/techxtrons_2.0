begin;

-- Existing settings RLS already permits only administrators to change this row.
alter table public.settings
  add column if not exists website_content jsonb not null default '{}'::jsonb
  check (jsonb_typeof(website_content) = 'object');

grant delete on public.messages to authenticated;
drop policy if exists "Admin message deletion" on public.messages;
create policy "Admin message deletion" on public.messages
  for delete to authenticated using (public.is_admin());

notify pgrst, 'reload schema';
commit;
