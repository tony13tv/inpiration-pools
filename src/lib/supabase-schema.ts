import { Pool } from "pg";
import { getSupabaseClient } from "./supabase";

let schemaInitialized = false;

const INIT_SQL = `
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

alter table public.projects enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'projects' and policyname = 'Allow public read access on projects'
  ) then
    create policy "Allow public read access on projects" on public.projects for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'projects' and policyname = 'Allow insert access on projects'
  ) then
    create policy "Allow insert access on projects" on public.projects for insert with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'projects' and policyname = 'Allow update access on projects'
  ) then
    create policy "Allow update access on projects" on public.projects for update using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'projects' and policyname = 'Allow delete access on projects'
  ) then
    create policy "Allow delete access on projects" on public.projects for delete using (true);
  end if;
end
$$;

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read access for project-images'
  ) then
    create policy "Public read access for project-images" on storage.objects for select using (bucket_id = 'project-images');
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Allow uploads to project-images'
  ) then
    create policy "Allow uploads to project-images" on storage.objects for insert with check (bucket_id = 'project-images');
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Allow updates to project-images'
  ) then
    create policy "Allow updates to project-images" on storage.objects for update using (bucket_id = 'project-images');
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Allow deletes from project-images'
  ) then
    create policy "Allow deletes from project-images" on storage.objects for delete using (bucket_id = 'project-images');
  end if;
end
$$;

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

notify pgrst, 'reload schema';
`;

export async function ensureSupabaseSchema(): Promise<{
  initialized: boolean;
  error?: string;
}> {
  if (schemaInitialized) {
    return { initialized: true };
  }

  const rawConnectionString =
    process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || "";

  if (!rawConnectionString) {
    return {
      initialized: false,
      error: "No POSTGRES_URL environment variable found.",
    };
  }

  // Strip sslmode from URL so pg Pool honors ssl: { rejectUnauthorized: false }
  const cleanedUrl = rawConnectionString
    .replace(/[?&]sslmode=[^&]+/g, "")
    .replace(/[?&]supa=[^&]+/g, "");

  const pool = new Pool({
    connectionString: cleanedUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await pool.query(INIT_SQL);

    // Also ensure storage bucket via Supabase Storage API if available
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.storage
        .createBucket("project-images", { public: true })
        .catch(() => {});
    }

    schemaInitialized = true;
    return { initialized: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Failed to initialize Supabase schema:", message);
    return { initialized: false, error: message };
  } finally {
    await pool.end().catch(() => {});
  }
}
