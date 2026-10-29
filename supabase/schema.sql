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

-- 4. Create the services & specialties table
create table if not exists public.services (
  id text primary key,
  title text not null,
  category text not null default 'Pools & Aquatic Renovations',
  description text not null default '',
  display_order integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "Allow public read access on services"
  on public.services for select
  using (true);

create policy "Allow insert access on services"
  on public.services for insert
  with check (true);

create policy "Allow update access on services"
  on public.services for update
  using (true);

create policy "Allow delete access on services"
  on public.services for delete
  using (true);

-- 5. Seed initial sample projects and all 17 services & specialties
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

insert into public.services (id, title, category, description, display_order)
values
  ('srv-01-new-pools-construction', 'New Pools Construction', 'Pools & Aquatic Renovations', 'Turnkey custom swimming pool design, excavation, steel, shotcrete/gunite, plumbing, and luxury water features.', 1),
  ('srv-02-pool-renovation', 'Pool Renovation', 'Pools & Aquatic Renovations', 'Complete pool remodeling including new interior finishes, waterline tile, coping replacement, decking, and equipment upgrades.', 2),
  ('srv-03-concrete-demolition', 'Concrete Demolition', 'Concrete, Pavers & Masonry', 'Safe, clean removal and haul-away of old pool decks, cracked slabs, patios, and walkways.', 3),
  ('srv-04-concrete-installation', 'Concrete Installation', 'Concrete, Pavers & Masonry', 'Precision-poured architectural, brushed, and stamped concrete for pool decks, slabs, and walkways.', 4),
  ('srv-05-driveways', 'Driveways', 'Concrete, Pavers & Masonry', 'Full driveway replacement, extensions, and decorative finishes engineered for long-term durability.', 5),
  ('srv-06-grading', 'Grading', 'Grading, Drainage, Turf & Exterior Care', 'Precision lot leveling, backyard re-sloping, and site preparation for pools, patios, and lawns.', 6),
  ('srv-07-drainage-installation', 'Drainage Installation', 'Grading, Drainage, Turf & Exterior Care', 'French drains, catch basins, downspout tie-ins, and channel drains to protect your pool and foundation.', 7),
  ('srv-08-rain-gardens', 'Rain Gardens', 'Grading, Drainage, Turf & Exterior Care', 'Eco-friendly landscaped basins designed to capture runoff, filter stormwater, and beautify your yard.', 8),
  ('srv-09-artificial-turf', 'Artificial Turf', 'Grading, Drainage, Turf & Exterior Care', 'Low-maintenance, mud-free synthetic turf for pool surrounds, putting greens, and pet-friendly play areas.', 9),
  ('srv-10-sod-installation', 'Sod Installation', 'Grading, Drainage, Turf & Exterior Care', 'Fresh, professional-grade sod installation (Zoysia, Bermuda, Fescue) for an instant lush green lawn.', 10),
  ('srv-11-retaining-wall-construction', 'Retaining Wall Construction', 'Outdoor Fire, Seating & Structures', 'Engineered stone, block, and timber retaining walls to terrace sloped Georgia yards and prevent erosion.', 11),
  ('srv-12-wooden-fence-construction', 'Wooden Fence Construction', 'Outdoor Fire, Seating & Structures', 'Custom privacy and pool-code compliant wooden fencing built with premium treated lumber and cedar.', 12),
  ('srv-13-fire-pits', 'Fire Pits', 'Outdoor Fire, Seating & Structures', 'Wood-burning or gas-integrated stone fire pits for cozy year-round evenings poolside.', 13),
  ('srv-14-stone-benches', 'Stone Benches', 'Outdoor Fire, Seating & Structures', 'Built-in architectural stone seating walls and custom benches integrated around fire pits and patios.', 14),
  ('srv-15-fireplaces', 'Fireplaces', 'Outdoor Fire, Seating & Structures', 'Custom-built outdoor stone and masonry fireplaces that serve as the centerpiece of your backyard.', 15),
  ('srv-16-pressure-washing', 'Pressure Washing', 'Grading, Drainage, Turf & Exterior Care', 'Deep exterior surface cleaning for pool decks, driveways, stone walls, patios, and siding.', 16),
  ('srv-17-concrete-pavers-patios', 'Concrete Pavers Patios', 'Concrete, Pavers & Masonry', 'Custom interlocking concrete pavers, travertine, and stone patios that elevate your outdoor entertaining space.', 17)
on conflict (id) do nothing;
