import { NextRequest, NextResponse } from "next/server";
import {
  getServices,
  createServiceRecord,
  reorderServicesRecord,
  ServiceItem,
} from "@/lib/services-store";
import { isSupabaseConfigured } from "@/lib/supabase";
import { isRequestAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  const services = await getServices();
  return NextResponse.json({
    services,
    storageMode: isSupabaseConfigured() ? "supabase" : "local",
  });
}

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to the Admin Portal." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    const category = String(
      body.category || "Pools & Aquatic Renovations"
    ).trim();
    const description = String(body.description || "").trim();

    if (!title) {
      return NextResponse.json(
        { error: "Service / Specialty title is required." },
        { status: 400 }
      );
    }

    const existing = await getServices();
    const nextOrder =
      typeof body.displayOrder === "number" && !Number.isNaN(body.displayOrder)
        ? body.displayOrder
        : existing.length + 1;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 35);

    const newService: ServiceItem = {
      id: `srv-${Date.now()}-${slug}`,
      title,
      category,
      description,
      displayOrder: nextOrder,
    };

    const updated = await createServiceRecord(newService);

    return NextResponse.json(
      { service: newService, services: updated },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create service:", error);
    return NextResponse.json(
      { error: "Failed to create service." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to the Admin Portal." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    if (!Array.isArray(body.orderedIds)) {
      return NextResponse.json(
        { error: "orderedIds array is required." },
        { status: 400 }
      );
    }

    const orderedIds = body.orderedIds.filter(
      (id: unknown): id is string => typeof id === "string"
    );
    const updated = await reorderServicesRecord(orderedIds);

    return NextResponse.json({ services: updated });
  } catch (error) {
    console.error("Failed to reorder services:", error);
    return NextResponse.json(
      { error: "Failed to save new display order." },
      { status: 500 }
    );
  }
}
