import { promises as fs } from "fs";
import path from "path";
import { getSupabaseClient } from "./supabase";
import { ensureSupabaseSchema } from "./supabase-schema";
import {
  ServiceItem,
  DEFAULT_SEED_SERVICES,
} from "./services-constants";

export type { ServiceItem };
export { DEFAULT_SEED_SERVICES };

interface SupabaseServiceRow {
  id: string;
  title: string;
  category: string;
  description: string;
  display_order: number;
  created_at?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const SERVICES_FILE = path.join(DATA_DIR, "services.json");

function mapRowToService(row: SupabaseServiceRow): ServiceItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    displayOrder: Number(row.display_order) || 1,
  };
}

async function ensureLocalServicesFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(SERVICES_FILE);
    } catch {
      await fs.writeFile(
        SERVICES_FILE,
        JSON.stringify(DEFAULT_SEED_SERVICES, null, 2),
        "utf-8"
      );
    }
  } catch {
    // Read-only filesystem fallback
  }
}

export async function getServices(): Promise<ServiceItem[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await ensureSupabaseSchema();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      return (data as SupabaseServiceRow[]).map(mapRowToService);
    }
    console.warn("Supabase services select warning:", error?.message);
  }

  await ensureLocalServicesFile();
  try {
    const raw = await fs.readFile(SERVICES_FILE, "utf-8");
    const parsed = JSON.parse(raw) as ServiceItem[];
    return Array.isArray(parsed)
      ? parsed.sort((a, b) => a.displayOrder - b.displayOrder)
      : DEFAULT_SEED_SERVICES;
  } catch {
    return DEFAULT_SEED_SERVICES;
  }
}

export async function createServiceRecord(
  newService: ServiceItem
): Promise<ServiceItem[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await ensureSupabaseSchema();
    const { error } = await supabase.from("services").insert({
      id: newService.id,
      title: newService.title,
      category: newService.category,
      description: newService.description,
      display_order: newService.displayOrder,
    });

    if (!error) {
      return getServices();
    }
    console.warn("Supabase service insert warning:", error.message);
  }

  const current = await getServices();
  const updated = [...current, newService].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  await saveLocalServices(updated);
  return updated;
}

export async function updateServiceRecord(
  updatedService: ServiceItem
): Promise<ServiceItem[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await ensureSupabaseSchema();
    const { error } = await supabase
      .from("services")
      .update({
        title: updatedService.title,
        category: updatedService.category,
        description: updatedService.description,
        display_order: updatedService.displayOrder,
      })
      .eq("id", updatedService.id);

    if (!error) {
      return getServices();
    }
    console.warn("Supabase service update warning:", error.message);
  }

  const current = await getServices();
  const idx = current.findIndex((s) => s.id === updatedService.id);
  if (idx !== -1) {
    current[idx] = updatedService;
    current.sort((a, b) => a.displayOrder - b.displayOrder);
    await saveLocalServices(current);
  }
  return current;
}

export async function deleteServiceRecord(
  id: string
): Promise<{ found: boolean; services: ServiceItem[] }> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await ensureSupabaseSchema();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (!error) {
      const remaining = await getServices();
      return { found: true, services: remaining };
    }
    console.warn("Supabase service delete warning:", error.message);
  }

  const current = await getServices();
  const filtered = current.filter((s) => s.id !== id);
  if (filtered.length === current.length) {
    return { found: false, services: current };
  }
  await saveLocalServices(filtered);
  return { found: true, services: filtered };
}

async function saveLocalServices(services: ServiceItem[]): Promise<void> {
  await ensureLocalServicesFile();
  await fs.writeFile(SERVICES_FILE, JSON.stringify(services, null, 2), "utf-8");
}
