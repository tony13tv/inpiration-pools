import { NextRequest, NextResponse } from "next/server";
import {
  getServices,
  updateServiceRecord,
  deleteServiceRecord,
} from "@/lib/services-store";
import { isRequestAuthenticated } from "@/lib/admin-auth";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to the Admin Portal." },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const result = await deleteServiceRecord(id);

  if (!result.found) {
    return NextResponse.json({ error: "Service not found." }, { status: 404 });
  }

  return NextResponse.json({ services: result.services });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to the Admin Portal." },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    const services = await getServices();
    const index = services.findIndex((s) => s.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Service not found." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const target = { ...services[index] };

    if (typeof body.title === "string" && body.title.trim()) {
      target.title = body.title.trim();
    }
    if (typeof body.category === "string" && body.category.trim()) {
      target.category = body.category.trim();
    }
    if (typeof body.description === "string") {
      target.description = body.description.trim();
    }
    if (
      typeof body.displayOrder === "number" &&
      !Number.isNaN(body.displayOrder)
    ) {
      target.displayOrder = body.displayOrder;
    }

    const updatedServices = await updateServiceRecord(target);

    return NextResponse.json({ service: target, services: updatedServices });
  } catch (error) {
    console.error("Failed to update service:", error);
    return NextResponse.json(
      { error: "Failed to update service." },
      { status: 500 }
    );
  }
}
