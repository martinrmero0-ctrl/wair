-- Run in Supabase SQL Editor after enabling Email auth

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  location text default 'New York City',
  sizes jsonb default '{"top":"M","waist":"32","shoe":"10"}'::jsonb,
  aesthetic_tags text[] default '{}',
  created_at timestamptz default now()
);

alter table public.users enable row level security;

create policy "Public profiles are viewable"
  on public.users for select
  using (true);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);
