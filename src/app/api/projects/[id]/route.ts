import { NextRequest, NextResponse } from "next/server";
import {
  getProjects,
  updateProjectRecord,
  deleteProjectRecord,
  saveUploadedFile,
} from "@/lib/projects-store";

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const result = await deleteProjectRecord(id);

  if (!result.found) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ projects: result.projects });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const projects = await getProjects();
    const index = projects.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const contentType = request.headers.get("content-type") || "";
    const target = { ...projects[index] };

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      if (formData.has("title")) {
        target.title =
          String(formData.get("title") || "").trim() || target.title;
      }
      if (formData.has("location")) {
        target.location = String(formData.get("location") || "").trim();
      }
      if (formData.has("specialty")) {
        target.specialty = String(formData.get("specialty") || "").trim();
      }
      if (formData.has("description")) {
        target.description = String(formData.get("description") || "").trim();
      }
      if (formData.has("featured")) {
        target.featured = formData.get("featured") === "true";
      }

      let keptImages = target.images;
      const keptImagesRaw = formData.get("keptImages");
      if (typeof keptImagesRaw === "string") {
        try {
          const parsed = JSON.parse(keptImagesRaw);
          if (Array.isArray(parsed)) {
            keptImages = parsed.filter(
              (u): u is string => typeof u === "string"
            );
          }
        } catch {
          // ignore
        }
      }

      const files = formData.getAll("images");
      const newUploaded: string[] = [];
      for (const entry of files) {
        if (entry instanceof File && entry.size > 0) {
          const url = await saveUploadedFile(entry);
          newUploaded.push(url);
        }
      }

      target.images = [...keptImages, ...newUploaded];
      if (target.images.length === 0) {
        target.images = ["/uploads/sample-pool-oasis.svg"];
      }
    } else {
      const body = await request.json();
      if (typeof body.title === "string" && body.title.trim()) {
        target.title = body.title.trim();
      }
      if (typeof body.location === "string") {
        target.location = body.location.trim();
      }
      if (typeof body.specialty === "string") {
        target.specialty = body.specialty.trim();
      }
      if (typeof body.description === "string") {
        target.description = body.description.trim();
      }
      if (typeof body.featured === "boolean") {
        target.featured = body.featured;
      }
      if (Array.isArray(body.images)) {
        target.images = body.images;
      }
    }

    const updatedProjects = await updateProjectRecord(target);

    return NextResponse.json({ project: target, projects: updatedProjects });
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json(
      { error: "Failed to update project." },
      { status: 500 }
    );
  }
}
