-- Run this in your Supabase SQL Editor (or via the Vercel Supabase Integration dashboard)

-- 1. Create the projects table
create table if not exists public.projects (
  id text primary key,
  title text not null,
  location text not null default 'Metro Atlanta, GA',
  specialty text not null default 'New Pools Construction',
  description text not null default '',
  images jsonb not null default '[]'::jsonb,
  featured boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. Enable Row Level Security (RLS) with public read and write policies
alter table public.projects enable row level security;

create policy "Allow public read access on projects"
  on public.projects for select
  using (true);

create policy "Allow insert access on projects"
  on public.projects for insert
  with check (true);

create policy "Allow update access on projects"
  on public.projects for update
  using (true);

create policy "Allow delete access on projects"
  on public.projects for delete
  using (true);

-- 3. Create the public storage bucket for project images
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "Public read access for project-images"
  on storage.objects for select
  using (bucket_id = 'project-images');

create policy "Allow uploads to project-images"
  on storage.objects for insert
  with check (bucket_id = 'project-images');

create policy "Allow updates to project-images"
  on storage.objects for update
  using (bucket_id = 'project-images');

create policy "Allow deletes from project-images"
  on storage.objects for delete
  using (bucket_id = 'project-images');

-- 4. Seed initial sample projects
insert into public.projects (id, title, location, specialty, description, images, featured)
values
  (
    'proj-buckhead-pool',
    'Buckhead Custom Pool & Travertine Paver Retreat',
    'Buckhead, Atlanta, GA',
    'New Pools Construction',
    'Custom family swimming pool with raised spillover spa, stone retaining wall, drainage installation, and concrete paver patio decking.',
    '["/uploads/sample-pool-oasis.svg", "/uploads/1793295448721-g0ni0z-whatsapp-image-2026-10-28-at-16-45-39.jpeg"]'::jsonb,
    true
  ),
  (
    'proj-alpharetta-firepit',
    'Alpharetta Stone Fire Pit, Bench & Artificial Turf',
    'Alpharetta, GA',
    'Fire Pits',
    'Backyard gathering space featuring a custom masonry fire pit, curved stone benches, interlocking concrete pavers patio, and artificial turf surround.',
    '["/uploads/sample-firepit-patio.svg"]'::jsonb,
    true
  )
on conflict (id) do nothing;
