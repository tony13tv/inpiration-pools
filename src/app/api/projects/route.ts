import { NextRequest, NextResponse } from "next/server";
import {
  getProjects,
  createProjectRecord,
  saveUploadedFile,
  ProjectItem,
} from "@/lib/projects-store";
import { isSupabaseConfigured } from "@/lib/supabase";
import { isRequestAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json({
    projects,
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
    const formData = await request.formData();

    const title = String(formData.get("title") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const specialty = String(
      formData.get("specialty") || "New Pools Construction"
    ).trim();
    const description = String(formData.get("description") || "").trim();
    const featured = formData.get("featured") === "true";

    if (!title) {
      return NextResponse.json(
        { error: "Project title is required." },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];
    const files = formData.getAll("images");

    for (const entry of files) {
      if (entry instanceof File && entry.size > 0) {
        const url = await saveUploadedFile(entry);
        uploadedUrls.push(url);
      }
    }

    const existingImagesRaw = formData.get("existingImages");
    if (typeof existingImagesRaw === "string" && existingImagesRaw.trim()) {
      try {
        const parsed = JSON.parse(existingImagesRaw);
        if (Array.isArray(parsed)) {
          for (const img of parsed) {
            if (typeof img === "string" && img.trim()) {
              uploadedUrls.push(img.trim());
            }
          }
        }
      } catch {
        // ignore invalid json
      }
    }

    if (uploadedUrls.length === 0) {
      uploadedUrls.push("/uploads/sample-pool-oasis.svg");
    }

    const newProject: ProjectItem = {
      id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title,
      location: location || "Metro Atlanta, GA",
      specialty,
      description,
      images: uploadedUrls,
      featured,
      createdAt: new Date().toISOString(),
    };

    const updated = await createProjectRecord(newProject);

    return NextResponse.json(
      { project: newProject, projects: updated },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { error: "Failed to save project and images." },
      { status: 500 }
    );
  }
}
