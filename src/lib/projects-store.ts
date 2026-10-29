import { promises as fs } from "fs";
import path from "path";
import { getSupabaseClient } from "./supabase";
import { ensureSupabaseSchema } from "./supabase-schema";

export interface ProjectItem {
  id: string;
  title: string;
  location: string;
  specialty: string;
  description: string;
  images: string[];
  featured: boolean;
  createdAt: string;
}

interface SupabaseProjectRow {
  id: string;
  title: string;
  location: string;
  specialty: string;
  description: string;
  images: string[];
  featured: boolean;
  created_at: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const SUPABASE_BUCKET = "project-images";

const DEFAULT_SEED_PROJECTS: ProjectItem[] = [
  {
    id: "proj-buckhead-pool",
    title: "Buckhead Custom Pool & Travertine Paver Retreat",
    location: "Buckhead, Atlanta, GA",
    specialty: "New Pools Construction",
    description:
      "Custom family swimming pool with raised spillover spa, stone retaining wall, drainage installation, and concrete paver patio decking.",
    images: [
      "/uploads/sample-pool-oasis.svg",
      "/uploads/1793295448721-g0ni0z-whatsapp-image-2026-10-28-at-16-45-39.jpeg",
    ],
    featured: true,
    createdAt: "2026-10-15T14:00:00.000Z",
  },
  {
    id: "proj-alpharetta-firepit",
    title: "Alpharetta Stone Fire Pit, Bench & Artificial Turf",
    location: "Alpharetta, GA",
    specialty: "Fire Pits",
    description:
      "Backyard gathering space featuring a custom masonry fire pit, curved stone benches, interlocking concrete pavers patio, and artificial turf surround.",
    images: ["/uploads/sample-firepit-patio.svg"],
    featured: true,
    createdAt: "2026-10-20T16:30:00.000Z",
  },
];

function mapRowToItem(row: SupabaseProjectRow): ProjectItem {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    specialty: row.specialty,
    description: row.description,
    images: Array.isArray(row.images) ? row.images : [],
    featured: Boolean(row.featured),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

async function ensureLocalStorage(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    try {
      await fs.access(PROJECTS_FILE);
    } catch {
      await fs.writeFile(
        PROJECTS_FILE,
        JSON.stringify(DEFAULT_SEED_PROJECTS, null, 2),
        "utf-8"
      );
    }
  } catch {
    // Read-only filesystem on Vercel serverless when Supabase is not yet connected
  }
}

export async function getProjects(): Promise<ProjectItem[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await ensureSupabaseSchema();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return (data as SupabaseProjectRow[]).map(mapRowToItem);
    }
    console.warn("Supabase select warning (falling back to local):", error?.message);
  }

  await ensureLocalStorage();
  try {
    const raw = await fs.readFile(PROJECTS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as ProjectItem[];
    return Array.isArray(parsed)
      ? parsed.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      : DEFAULT_SEED_PROJECTS;
  } catch {
    return DEFAULT_SEED_PROJECTS;
  }
}

export async function createProjectRecord(
  newProject: ProjectItem
): Promise<ProjectItem[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await ensureSupabaseSchema();
    const { error } = await supabase.from("projects").insert({
      id: newProject.id,
      title: newProject.title,
      location: newProject.location,
      specialty: newProject.specialty,
      description: newProject.description,
      images: newProject.images,
      featured: newProject.featured,
      created_at: newProject.createdAt,
    });

    if (!error) {
      return getProjects();
    }
    console.warn("Supabase insert warning (falling back to local):", error.message);
  }

  const current = await getProjects();
  const updated = [newProject, ...current];
  await saveLocalProjects(updated);
  return updated;
}

export async function updateProjectRecord(
  updatedProject: ProjectItem
): Promise<ProjectItem[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase
      .from("projects")
      .update({
        title: updatedProject.title,
        location: updatedProject.location,
        specialty: updatedProject.specialty,
        description: updatedProject.description,
        images: updatedProject.images,
        featured: updatedProject.featured,
      })
      .eq("id", updatedProject.id);

    if (!error) {
      return getProjects();
    }
    console.warn("Supabase update warning (falling back to local):", error.message);
  }

  const current = await getProjects();
  const idx = current.findIndex((p) => p.id === updatedProject.id);
  if (idx !== -1) {
    current[idx] = updatedProject;
    await saveLocalProjects(current);
  }
  return current;
}

export async function deleteProjectRecord(
  id: string
): Promise<{ found: boolean; projects: ProjectItem[] }> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) {
      const remaining = await getProjects();
      return { found: true, projects: remaining };
    }
    console.warn("Supabase delete warning (falling back to local):", error.message);
  }

  const current = await getProjects();
  const filtered = current.filter((p) => p.id !== id);
  if (filtered.length === current.length) {
    return { found: false, projects: current };
  }
  await saveLocalProjects(filtered);
  return { found: true, projects: filtered };
}

async function saveLocalProjects(projects: ProjectItem[]): Promise<void> {
  await ensureLocalStorage();
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");
}

export async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const safeBase = path
    .basename(file.name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);

  const uniqueName = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}-${safeBase || "image"}${ext}`;

  const supabase = getSupabaseClient();
  if (supabase) {
    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(uniqueName, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (!uploadError) {
      const { data } = supabase.storage
        .from(SUPABASE_BUCKET)
        .getPublicUrl(uniqueName);
      if (data?.publicUrl) {
        return data.publicUrl;
      }
    } else {
      console.warn(
        "Supabase Storage upload warning (falling back to local):",
        uploadError.message
      );
    }
  }

  await ensureLocalStorage();
  const filePath = path.join(UPLOADS_DIR, uniqueName);
  await fs.writeFile(filePath, buffer);

  return `/uploads/${uniqueName}`;
}
