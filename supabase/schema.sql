-- Run this in Supabase SQL Editor. The anon key is safe to use server-side;
-- RLS is the final access boundary, and no service role key is needed.
create table if not exists public.rsvp (
  id bigint generated always as identity primary key,
  name text not null check (char_length(btrim(name)) between 2 and 80),
  attendance text not null check (attendance in ('Hadir', 'Tidak hadir')),
  created_at timestamptz not null default now()
);

create table if not exists public.guestbook (
  id bigint generated always as identity primary key,
  name text not null check (char_length(btrim(name)) between 2 and 80),
  message text not null check (char_length(btrim(message)) between 2 and 500),
  attendance text check (attendance in ('Hadir', 'Tidak hadir')),
  created_at timestamptz not null default now()
);

alter table public.guestbook add column if not exists attendance text check (attendance in ('Hadir', 'Tidak hadir'));
notify pgrst, 'reload schema';

alter table public.rsvp enable row level security;
alter table public.guestbook enable row level security;

revoke all on public.rsvp from anon, authenticated;
revoke all on public.guestbook from anon, authenticated;
grant insert (name, attendance) on public.rsvp to anon;
grant select (id, name, message, attendance, created_at), insert (name, message) on public.guestbook to anon;

drop policy if exists "Public may submit RSVP" on public.rsvp;
create policy "Public may submit RSVP" on public.rsvp for insert to anon
  with check (char_length(btrim(name)) between 2 and 80 and attendance in ('Hadir', 'Tidak hadir'));

drop policy if exists "Public may read guestbook" on public.guestbook;
create policy "Public may read guestbook" on public.guestbook for select to anon using (true);
drop policy if exists "Public may submit guestbook messages" on public.guestbook;
create policy "Public may submit guestbook messages" on public.guestbook for insert to anon
  with check (char_length(btrim(name)) between 2 and 80 and char_length(btrim(message)) between 2 and 500);

-- Keep RSVP and guestbook writes in one transaction.
create or replace function public.submit_wedding_response(
  guest_name text,
  guest_attendance text,
  guest_message text
) returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.rsvp (name, attendance) values (btrim(guest_name), guest_attendance);
  insert into public.guestbook (name, message, attendance) values (btrim(guest_name), btrim(guest_message), guest_attendance);
end;
$$;
revoke all on function public.submit_wedding_response(text, text, text) from public, authenticated;
grant execute on function public.submit_wedding_response(text, text, text) to anon;
