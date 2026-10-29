"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import type { ProjectItem } from "@/lib/projects-store";
import type { ServiceItem } from "@/lib/services-constants";
import {
  DEFAULT_SEED_SERVICES,
  SERVICE_CATEGORY_META,
} from "@/lib/services-constants";

const DEFAULT_CATEGORIES = Object.keys(SERVICE_CATEGORY_META);

function reorderArray<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length
  ) {
    return list;
  }
  const clone = [...list];
  const [moved] = clone.splice(fromIndex, 1);
  clone.splice(toIndex, 0, moved);
  return clone;
}

export default function AdminProjectsPage() {
  // Authentication state
  const [authChecking, setAuthChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<"projects" | "services">(
    "projects"
  );

  // Projects & Services state
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>(
    DEFAULT_SEED_SERVICES
  );
  const [loading, setLoading] = useState(true);

  // Create Project form state
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState(
    DEFAULT_SEED_SERVICES[0]?.title || "New Pools Construction"
  );
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Drag state for Create Project Photo Previews
  const [dragCreatePhotoIdx, setDragCreatePhotoIdx] = useState<number | null>(
    null
  );
  const [dragOverCreatePhotoIdx, setDragOverCreatePhotoIdx] = useState<
    number | null
  >(null);

  // Drag state for Published Project Photo Strips (View mode)
  const [dragProjectPhoto, setDragProjectPhoto] = useState<{
    projectId: string;
    index: number;
  } | null>(null);
  const [dragOverProjectPhoto, setDragOverProjectPhoto] = useState<{
    projectId: string;
    index: number;
  } | null>(null);

  // Editing existing project state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSpecialty, setEditSpecialty] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFeatured, setEditFeatured] = useState(false);
  const [editKeptImages, setEditKeptImages] = useState<string[]>([]);
  const [editNewFiles, setEditNewFiles] = useState<File[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);

  // Drag state for Edit Project Kept Photos
  const [dragEditPhotoIdx, setDragEditPhotoIdx] = useState<number | null>(null);
  const [dragOverEditPhotoIdx, setDragOverEditPhotoIdx] = useState<
    number | null
  >(null);

  // Create Service form state
  const [srvTitle, setSrvTitle] = useState("");
  const [srvCategory, setSrvCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [srvDescription, setSrvDescription] = useState("");
  const [submittingService, setSubmittingService] = useState(false);

  // Editing existing service state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editSrvTitle, setEditSrvTitle] = useState("");
  const [editSrvCategory, setEditSrvCategory] = useState("");
  const [editSrvDescription, setEditSrvDescription] = useState("");
  const [savingServiceEdit, setSavingServiceEdit] = useState(false);

  // Drag state for Services & Specialties
  const [dragServiceIdx, setDragServiceIdx] = useState<number | null>(null);
  const [dragOverServiceIdx, setDragOverServiceIdx] = useState<number | null>(
    null
  );
  const [savingServiceOrder, setSavingServiceOrder] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function checkSession() {
    setAuthChecking(true);
    try {
      const res = await fetch("/api/admin/session", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAuthenticated(Boolean(data.authenticated));
        if (data.authenticated) {
          await fetchAllData();
        }
      }
    } catch {
      setAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  }

  async function fetchAllData() {
    setLoading(true);
    try {
      const [projRes, srvRes] = await Promise.all([
        fetch("/api/projects", { cache: "no-store" }),
        fetch("/api/services", { cache: "no-store" }),
      ]);

      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(Array.isArray(projData.projects) ? projData.projects : []);
      }

      if (srvRes.ok) {
        const srvData = await srvRes.json();
        if (Array.isArray(srvData.services) && srvData.services.length > 0) {
          setServices(srvData.services);
          setSpecialty((prev) => prev || srvData.services[0].title);
        }
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Could not load data from server.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate local object URLs for file previews
  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUser,
          password: loginPass,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Invalid credentials.");
        return;
      }

      setAuthenticated(true);
      setLoginPass("");
      await fetchAllData();
    } catch {
      setLoginError("Failed to sign in. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setLoginUser("");
    setLoginPass("");
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...incoming]);
  }

  function removeSelectedFile(idx: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleDropCreatePhoto(targetIdx: number) {
    if (dragCreatePhotoIdx === null || dragCreatePhotoIdx === targetIdx) {
      setDragCreatePhotoIdx(null);
      setDragOverCreatePhotoIdx(null);
      return;
    }
    setSelectedFiles((prev) =>
      reorderArray(prev, dragCreatePhotoIdx, targetIdx)
    );
    setDragCreatePhotoIdx(null);
    setDragOverCreatePhotoIdx(null);
  }

  function handleDropEditPhoto(targetIdx: number) {
    if (dragEditPhotoIdx === null || dragEditPhotoIdx === targetIdx) {
      setDragEditPhotoIdx(null);
      setDragOverEditPhotoIdx(null);
      return;
    }
    setEditKeptImages((prev) =>
      reorderArray(prev, dragEditPhotoIdx, targetIdx)
    );
    setDragEditPhotoIdx(null);
    setDragOverEditPhotoIdx(null);
  }

  async function handleDropPublishedProjectPhoto(
    project: ProjectItem,
    targetIdx: number
  ) {
    if (
      !dragProjectPhoto ||
      dragProjectPhoto.projectId !== project.id ||
      dragProjectPhoto.index === targetIdx
    ) {
      setDragProjectPhoto(null);
      setDragOverProjectPhoto(null);
      return;
    }

    const fromIdx = dragProjectPhoto.index;
    const reorderedImages = reorderArray(project.images, fromIdx, targetIdx);

    setDragProjectPhoto(null);
    setDragOverProjectPhoto(null);

    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id ? { ...p, images: reorderedImages } : p
      )
    );

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: reorderedImages }),
      });

      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
        setStatusMessage({
          type: "success",
          text: `Saved new photo order for "${project.title}".`,
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Failed to save photo order.",
      });
    }
  }

  // --- PROJECT HANDLERS ---
  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please enter a project title.",
      });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("location", location.trim() || "Metro Atlanta, GA");
      formData.append("specialty", specialty);
      formData.append("description", description.trim());
      formData.append("featured", String(featured));

      for (const file of selectedFiles) {
        formData.append("images", file);
      }

      const res = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create project.");
      }

      setProjects(data.projects);
      setTitle("");
      setLocation("");
      setSpecialty(services[0]?.title || "New Pools Construction");
      setDescription("");
      setFeatured(true);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setStatusMessage({
        type: "success",
        text: `Project "${data.project.title}" created with ${data.project.images.length} image(s)!`,
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Error creating project. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteProject(id: string, projectTitle: string) {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
        setStatusMessage({
          type: "success",
          text: `Removed project "${projectTitle}".`,
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Failed to delete project.",
      });
    }
  }

  function startEditing(project: ProjectItem) {
    setEditingId(project.id);
    setEditTitle(project.title);
    setEditLocation(project.location);
    setEditSpecialty(project.specialty);
    setEditDescription(project.description);
    setEditFeatured(project.featured);
    setEditKeptImages([...project.images]);
    setEditNewFiles([]);
  }

  async function handleSaveEdit(e: React.FormEvent, id: string) {
    e.preventDefault();
    setSavingEdit(true);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      formData.append("title", editTitle.trim());
      formData.append("location", editLocation.trim());
      formData.append("specialty", editSpecialty);
      formData.append("description", editDescription.trim());
      formData.append("featured", String(editFeatured));
      formData.append("keptImages", JSON.stringify(editKeptImages));

      for (const file of editNewFiles) {
        formData.append("images", file);
      }

      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update project.");
      }

      setProjects(data.projects);
      setEditingId(null);
      setStatusMessage({
        type: "success",
        text: `Updated project "${data.project.title}" successfully!`,
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Failed to save project changes.",
      });
    } finally {
      setSavingEdit(false);
    }
  }

  // --- SERVICE / SPECIALTY HANDLERS ---
  async function handleDropService(targetIdx: number) {
    if (dragServiceIdx === null || dragServiceIdx === targetIdx) {
      setDragServiceIdx(null);
      setDragOverServiceIdx(null);
      return;
    }

    const reordered = reorderArray(services, dragServiceIdx, targetIdx).map(
      (item, idx) => ({
        ...item,
        displayOrder: idx + 1,
      })
    );

    setDragServiceIdx(null);
    setDragOverServiceIdx(null);
    setServices(reordered);
    setSavingServiceOrder(true);

    try {
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderedIds: reordered.map((s) => s.id),
        }),
      });

      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setServices(data.services);
        setStatusMessage({
          type: "success",
          text: "Display order updated and saved to Supabase!",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Failed to save new specialty order.",
      });
    } finally {
      setSavingServiceOrder(false);
    }
  }

  async function handleCreateService(e: React.FormEvent) {
    e.preventDefault();
    if (!srvTitle.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please enter a service / specialty name.",
      });
      return;
    }

    setSubmittingService(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: srvTitle.trim(),
          category: srvCategory,
          description: srvDescription.trim(),
          displayOrder: services.length + 1,
        }),
      });

      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add service.");
      }

      setServices(data.services);
      setSrvTitle("");
      setSrvDescription("");

      setStatusMessage({
        type: "success",
        text: `Added specialty "${data.service.title}" to the database!`,
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Failed to create specialty.",
      });
    } finally {
      setSubmittingService(false);
    }
  }

  function startEditingService(srv: ServiceItem) {
    setEditingServiceId(srv.id);
    setEditSrvTitle(srv.title);
    setEditSrvCategory(srv.category);
    setEditSrvDescription(srv.description);
  }

  async function handleSaveServiceEdit(
    e: React.FormEvent,
    srv: ServiceItem
  ) {
    e.preventDefault();
    setSavingServiceEdit(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/services/${srv.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editSrvTitle.trim(),
          category: editSrvCategory.trim(),
          description: editSrvDescription.trim(),
          displayOrder: srv.displayOrder,
        }),
      });

      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update specialty.");
      }

      setServices(data.services);
      setEditingServiceId(null);
      setStatusMessage({
        type: "success",
        text: `Updated specialty "${data.service.title}"!`,
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Failed to update specialty.",
      });
    } finally {
      setSavingServiceEdit(false);
    }
  }

  async function handleDeleteService(id: string, srvName: string) {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setServices(data.services);
        setStatusMessage({
          type: "success",
          text: `Removed specialty "${srvName}".`,
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Failed to delete specialty.",
      });
    }
  }

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="mt-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Verifying Session...
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen flex-col justify-between bg-slate-950 px-6 py-12 text-slate-100">
        <div className="mx-auto w-full max-w-md pt-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <BrandLogo variant="compact" />
            </Link>
            <h1 className="mt-8 text-2xl font-extrabold tracking-tight text-white">
              Admin Portal Sign In
            </h1>
            <p className="mt-2 text-xs text-slate-400">
              Authorized access for ATL Inspiration Pools &amp; Construction
              Inc.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="mt-8 rounded-3xl border border-white/15 bg-slate-900/70 p-8 shadow-2xl"
          >
            {loginError && (
              <div className="mb-6 rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-200">
                {loginError}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="admin-username"
                  className="block text-xs font-bold tracking-wider text-slate-300 uppercase"
                >
                  Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="admin"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-bold tracking-wider text-slate-300 uppercase"
                >
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:opacity-50"
              >
                {loggingIn ? "Signing In..." : "Sign In to Admin Portal"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-cyan-300"
            >
              &larr; Return to Public Website
            </Link>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-600">
          &copy; 2026 ATL Inspiration Pools &amp; Construction Inc.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <BrandLogo variant="compact" />
            </Link>
            <span className="hidden rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold tracking-wider text-cyan-300 uppercase sm:inline-block">
              Administration Module
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:border-cyan-400/50 hover:bg-white/10"
            >
              &larr; View Live Website
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
              Database Management
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Admin Control Center
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage your portfolio projects, job-site photos, and company
              services &amp; specialties stored in Supabase.
            </p>

            {/* Module Switcher Tabs */}
            <div className="mt-6 inline-flex rounded-2xl border border-white/10 bg-slate-900/90 p-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("projects")}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition ${
                  activeTab === "projects"
                    ? "bg-cyan-400 text-slate-950 shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Portfolio Projects ({projects.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("services")}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition ${
                  activeTab === "services"
                    ? "bg-cyan-400 text-slate-950 shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Services &amp; Specialties ({services.length})
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-3 text-right">
              <span className="block text-[11px] tracking-wider text-slate-400 uppercase">
                Projects
              </span>
              <span className="font-mono text-2xl font-extrabold text-cyan-400">
                {projects.length}
              </span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-3 text-right">
              <span className="block text-[11px] tracking-wider text-slate-400 uppercase">
                Specialties
              </span>
              <span className="font-mono text-2xl font-extrabold text-cyan-400">
                {services.length}
              </span>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`mb-8 flex items-center justify-between rounded-2xl border px-5 py-4 text-sm font-medium ${
              statusMessage.type === "success"
                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                : "border-rose-400/40 bg-rose-500/10 text-rose-200"
            }`}
          >
            <span>{statusMessage.text}</span>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-xs font-bold uppercase opacity-75 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {activeTab === "projects" ? (
          /* ================= PROJECTS TAB ================= */
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Left Column: Add New Project + Image Upload Form */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleCreateProject}
                className="sticky top-24 rounded-3xl border border-white/15 bg-slate-900/60 p-7 shadow-2xl"
              >
                <h2 className="text-xl font-bold text-white">
                  Add New Project &amp; Upload Photos
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Upload one or more photos and drag thumbnails to set the cover
                  image order.
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <label
                      htmlFor="proj-title"
                      className="block text-xs font-bold tracking-wider text-slate-300 uppercase"
                    >
                      Project Title *
                    </label>
                    <input
                      id="proj-title"
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Sandy Springs Custom Gunite Pool & Paver Patio"
                      className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="proj-location"
                        className="block text-xs font-bold tracking-wider text-slate-300 uppercase"
                      >
                        Location / City
                      </label>
                      <input
                        id="proj-location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Marietta, GA"
                        className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="proj-specialty"
                        className="block text-xs font-bold tracking-wider text-slate-300 uppercase"
                      >
                        Specialty Category
                      </label>
                      <select
                        id="proj-specialty"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none"
                      >
                        {services.map((item) => (
                          <option key={item.id} value={item.title}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="proj-desc"
                      className="block text-xs font-bold tracking-wider text-slate-300 uppercase"
                    >
                      Project Description &amp; Highlights
                    </label>
                    <textarea
                      id="proj-desc"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the pool features, stone benches, drainage, turf, or concrete work completed..."
                      className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Multi-Image Upload Dropzone */}
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-slate-300 uppercase">
                      Project Photos (JPG, PNG, WebP, SVG)
                    </label>
                    <div className="mt-2 rounded-2xl border-2 border-dashed border-cyan-400/35 bg-slate-950/70 p-5 text-center transition hover:border-cyan-400">
                      <input
                        ref={fileInputRef}
                        id="proj-images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label
                        htmlFor="proj-images"
                        className="flex cursor-pointer flex-col items-center"
                      >
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-400/15 text-xl font-bold text-cyan-300">
                          +
                        </span>
                        <span className="mt-2 text-sm font-semibold text-white">
                          Click to Select Project Images
                        </span>
                        <span className="mt-1 text-xs text-slate-400">
                          You can select multiple photos at once
                        </span>
                      </label>
                    </div>

                    {/* Selected Image Previews with Drag-and-Drop Reordering */}
                    {previewUrls.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-cyan-300">
                            Ready to upload ({previewUrls.length} photo
                            {previewUrls.length === 1 ? "" : "s"}):
                          </p>
                          <span className="text-[11px] text-slate-400">
                            ⇅ Drag photos to reorder
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2.5">
                          {previewUrls.map((url, idx) => {
                            const isDragged = dragCreatePhotoIdx === idx;
                            const isDragOver = dragOverCreatePhotoIdx === idx;

                            return (
                              <div
                                key={`${url}-${idx}`}
                                draggable
                                onDragStart={() => setDragCreatePhotoIdx(idx)}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setDragOverCreatePhotoIdx(idx);
                                }}
                                onDragEnd={() => {
                                  setDragCreatePhotoIdx(null);
                                  setDragOverCreatePhotoIdx(null);
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  handleDropCreatePhoto(idx);
                                }}
                                className={`group relative aspect-video cursor-grab overflow-hidden rounded-xl border bg-slate-950 transition active:cursor-grabbing ${
                                  isDragOver
                                    ? "scale-105 border-2 border-cyan-400 ring-2 ring-cyan-400/40"
                                    : "border-white/15"
                                } ${isDragged ? "opacity-40" : "opacity-100"}`}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={url}
                                  alt={`Upload preview ${idx + 1}`}
                                  className="pointer-events-none h-full w-full object-cover"
                                />
                                <span className="absolute bottom-1 left-1 rounded bg-slate-950/85 px-1.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                                  {idx === 0 ? "Cover #1" : `#${idx + 1}`}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeSelectedFile(idx)}
                                  className="absolute top-1 right-1 rounded-full bg-slate-950/85 px-2 py-0.5 text-[10px] font-bold text-rose-300 hover:bg-rose-500 hover:text-white"
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3.5">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="h-4 w-4 accent-cyan-400"
                    />
                    <span className="text-xs font-semibold text-slate-200">
                      Mark as ★ Featured Build on Homepage
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting
                      ? "Uploading Photos & Saving..."
                      : "Publish Project & Upload Images"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Existing Projects List */}
            <div className="lg:col-span-7">
              <h2 className="text-xl font-bold text-white">
                Published Projects ({projects.length})
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Drag and drop photos directly on any project card (or inside Edit
                mode) to change their display order. Photo #1 is the cover image.
              </p>

              {loading ? (
                <div className="mt-6 space-y-4">
                  {[1, 2].map((n) => (
                    <div
                      key={n}
                      className="h-48 animate-pulse rounded-3xl border border-white/10 bg-slate-900/40"
                    />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/40 p-10 text-center">
                  <p className="text-sm text-slate-300">
                    No projects saved yet. Use the form on the left to add your
                    first project!
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-6">
                  {projects.map((project) => {
                    const isEditing = editingId === project.id;

                    return (
                      <div
                        key={project.id}
                        className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-6 transition hover:border-white/20"
                      >
                        {isEditing ? (
                          <form
                            onSubmit={(e) => handleSaveEdit(e, project.id)}
                            className="space-y-4"
                          >
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                              <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase">
                                Editing Project
                              </span>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="text-xs text-slate-400 hover:text-white"
                              >
                                Cancel
                              </button>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-300 uppercase">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-300 uppercase">
                                  Location
                                </label>
                                <input
                                  type="text"
                                  value={editLocation}
                                  onChange={(e) =>
                                    setEditLocation(e.target.value)
                                  }
                                  className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white"
                                />
                              </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-300 uppercase">
                                  Specialty
                                </label>
                                <select
                                  value={editSpecialty}
                                  onChange={(e) =>
                                    setEditSpecialty(e.target.value)
                                  }
                                  className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white"
                                >
                                  {services.map((s) => (
                                    <option key={s.id} value={s.title}>
                                      {s.title}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-end">
                                <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-xs text-slate-200">
                                  <input
                                    type="checkbox"
                                    checked={editFeatured}
                                    onChange={(e) =>
                                      setEditFeatured(e.target.checked)
                                    }
                                    className="accent-cyan-400"
                                  />
                                  Featured Project
                                </label>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-300 uppercase">
                                Description
                              </label>
                              <textarea
                                rows={3}
                                value={editDescription}
                                onChange={(e) =>
                                  setEditDescription(e.target.value)
                                }
                                className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white"
                              />
                            </div>

                            {/* Current Images Management with Drag and Drop */}
                            <div>
                              <div className="flex items-center justify-between">
                                <label className="block text-[11px] font-bold text-slate-300 uppercase">
                                  Current Photos ({editKeptImages.length})
                                </label>
                                <span className="text-[11px] text-cyan-300">
                                  ⇅ Drag photos to reorder
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-3">
                                {editKeptImages.map((imgUrl, idx) => {
                                  const isDragged = dragEditPhotoIdx === idx;
                                  const isDragOver =
                                    dragOverEditPhotoIdx === idx;

                                  return (
                                    <div
                                      key={`${imgUrl}-${idx}`}
                                      draggable
                                      onDragStart={() =>
                                        setDragEditPhotoIdx(idx)
                                      }
                                      onDragOver={(e) => {
                                        e.preventDefault();
                                        setDragOverEditPhotoIdx(idx);
                                      }}
                                      onDragEnd={() => {
                                        setDragEditPhotoIdx(null);
                                        setDragOverEditPhotoIdx(null);
                                      }}
                                      onDrop={(e) => {
                                        e.preventDefault();
                                        handleDropEditPhoto(idx);
                                      }}
                                      className={`relative h-20 w-28 cursor-grab overflow-hidden rounded-xl border transition active:cursor-grabbing ${
                                        isDragOver
                                          ? "scale-105 border-2 border-cyan-400 ring-2 ring-cyan-400/40"
                                          : "border-white/15"
                                      } ${
                                        isDragged ? "opacity-40" : "opacity-100"
                                      }`}
                                    >
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={imgUrl}
                                        alt="Project photo"
                                        className="pointer-events-none h-full w-full object-cover"
                                      />
                                      <span className="absolute bottom-1 left-1 rounded bg-slate-950/85 px-1.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                                        {idx === 0
                                          ? "Cover #1"
                                          : `#${idx + 1}`}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setEditKeptImages((prev) =>
                                            prev.filter((_, i) => i !== idx)
                                          )
                                        }
                                        className="absolute top-1 right-1 rounded bg-slate-950/90 px-1.5 py-0.5 text-[10px] font-bold text-rose-300 hover:bg-rose-600 hover:text-white"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Upload More Photos to this Project */}
                            <div>
                              <label className="block text-[11px] font-bold text-slate-300 uppercase">
                                Upload Additional Photos
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  if (e.target.files) {
                                    setEditNewFiles(Array.from(e.target.files));
                                  }
                                }}
                                className="mt-1 block w-full text-xs text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-400/20 file:px-4 file:py-1.5 file:text-xs file:font-bold file:text-cyan-300 hover:file:bg-cyan-400/30"
                              />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-slate-300"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={savingEdit}
                                className="rounded-full bg-cyan-400 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
                              >
                                {savingEdit ? "Saving..." : "Save Changes"}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div>
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded-full bg-cyan-400/15 px-3 py-0.5 text-xs font-bold text-cyan-300">
                                    {project.specialty}
                                  </span>
                                  {project.featured && (
                                    <span className="rounded-full bg-amber-400/15 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                                      ★ Featured
                                    </span>
                                  )}
                                  <span className="text-xs text-slate-400">
                                    • {project.location}
                                  </span>
                                </div>
                                <h3 className="mt-2 text-lg font-bold text-white">
                                  {project.title}
                                </h3>
                                <p className="mt-1 text-sm text-slate-300">
                                  {project.description}
                                </p>
                              </div>

                              <div className="flex shrink-0 items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => startEditing(project)}
                                  className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:border-cyan-400/50 hover:text-cyan-300"
                                >
                                  Edit / Add Photos
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteProject(
                                      project.id,
                                      project.title
                                    )
                                  }
                                  className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>

                            {/* Image Gallery Strip (Draggable to reorder directly) */}
                            <div className="mt-5">
                              {project.images.length > 1 && (
                                <p className="mb-2 text-[11px] font-medium text-cyan-300/90">
                                  ⇅ Drag photos left or right to reorder
                                </p>
                              )}
                              <div className="flex gap-3 overflow-x-auto pb-1">
                                {project.images.map((imgUrl, idx) => {
                                  const isDragged =
                                    dragProjectPhoto?.projectId ===
                                      project.id &&
                                    dragProjectPhoto.index === idx;
                                  const isDragOver =
                                    dragOverProjectPhoto?.projectId ===
                                      project.id &&
                                    dragOverProjectPhoto.index === idx;

                                  return (
                                    <div
                                      key={`${project.id}-img-${idx}`}
                                      draggable={project.images.length > 1}
                                      onDragStart={() =>
                                        setDragProjectPhoto({
                                          projectId: project.id,
                                          index: idx,
                                        })
                                      }
                                      onDragOver={(e) => {
                                        e.preventDefault();
                                        setDragOverProjectPhoto({
                                          projectId: project.id,
                                          index: idx,
                                        });
                                      }}
                                      onDragEnd={() => {
                                        setDragProjectPhoto(null);
                                        setDragOverProjectPhoto(null);
                                      }}
                                      onDrop={(e) => {
                                        e.preventDefault();
                                        handleDropPublishedProjectPhoto(
                                          project,
                                          idx
                                        );
                                      }}
                                      className={`relative h-24 w-36 shrink-0 overflow-hidden rounded-xl border bg-slate-950 transition ${
                                        project.images.length > 1
                                          ? "cursor-grab active:cursor-grabbing"
                                          : ""
                                      } ${
                                        isDragOver
                                          ? "scale-105 border-2 border-cyan-400 ring-2 ring-cyan-400/40"
                                          : "border-white/10"
                                      } ${
                                        isDragged ? "opacity-40" : "opacity-100"
                                      }`}
                                    >
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={imgUrl}
                                        alt={`${project.title} photo ${idx + 1}`}
                                        className="pointer-events-none h-full w-full object-cover"
                                      />
                                      <span className="absolute bottom-1 left-1 rounded bg-slate-950/85 px-1.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                                        {idx === 0
                                          ? "Cover #1"
                                          : `#${idx + 1}`}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ================= SERVICES & SPECIALTIES TAB ================= */
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Left Column: Add New Service / Specialty */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleCreateService}
                className="sticky top-24 rounded-3xl border border-white/15 bg-slate-900/60 p-7 shadow-2xl"
              >
                <h2 className="text-xl font-bold text-white">
                  Add Service / Specialty
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Add a new service to the public checklist, category cards, and
                  consultation form. Drag items on the right to reorder.
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <label
                      htmlFor="srv-title"
                      className="block text-xs font-bold tracking-wider text-slate-300 uppercase"
                    >
                      Specialty Name *
                    </label>
                    <input
                      id="srv-title"
                      type="text"
                      required
                      value={srvTitle}
                      onChange={(e) => setSrvTitle(e.target.value)}
                      placeholder="e.g., Outdoor Kitchens & Pergolas"
                      className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="srv-category"
                      className="block text-xs font-bold tracking-wider text-slate-300 uppercase"
                    >
                      Category Group
                    </label>
                    <select
                      id="srv-category"
                      value={srvCategory}
                      onChange={(e) => setSrvCategory(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    >
                      {DEFAULT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="srv-desc"
                      className="block text-xs font-bold tracking-wider text-slate-300 uppercase"
                    >
                      Description
                    </label>
                    <textarea
                      id="srv-desc"
                      rows={3}
                      value={srvDescription}
                      onChange={(e) => setSrvDescription(e.target.value)}
                      placeholder="Describe what is included in this service..."
                      className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingService}
                    className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:opacity-50"
                  >
                    {submittingService
                      ? "Saving Specialty..."
                      : "Add Service / Specialty"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Existing Services & Specialties List (Drag & Drop) */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Services &amp; Specialties ({services.length})
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Drag and drop any row by its handle to reorder how
                    specialties appear on the website.
                  </p>
                </div>
                {savingServiceOrder && (
                  <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-bold text-cyan-300 animate-pulse">
                    Saving Order...
                  </span>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {services.map((srv, idx) => {
                  const isEditingSrv = editingServiceId === srv.id;
                  const isDragged = dragServiceIdx === idx;
                  const isDragOver = dragOverServiceIdx === idx;

                  return (
                    <div
                      key={srv.id}
                      draggable={!isEditingSrv}
                      onDragStart={() => {
                        if (!isEditingSrv) setDragServiceIdx(idx);
                      }}
                      onDragOver={(e) => {
                        if (!isEditingSrv) {
                          e.preventDefault();
                          setDragOverServiceIdx(idx);
                        }
                      }}
                      onDragEnd={() => {
                        setDragServiceIdx(null);
                        setDragOverServiceIdx(null);
                      }}
                      onDrop={(e) => {
                        if (!isEditingSrv) {
                          e.preventDefault();
                          handleDropService(idx);
                        }
                      }}
                      className={`rounded-2xl border bg-slate-900/50 p-5 transition ${
                        !isEditingSrv
                          ? "cursor-grab active:cursor-grabbing"
                          : ""
                      } ${
                        isDragOver
                          ? "border-2 border-cyan-400 bg-cyan-950/25 ring-2 ring-cyan-400/30"
                          : "border-white/10 hover:border-white/20"
                      } ${isDragged ? "opacity-40" : "opacity-100"}`}
                    >
                      {isEditingSrv ? (
                        <form
                          onSubmit={(e) => handleSaveServiceEdit(e, srv)}
                          className="space-y-4"
                        >
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase">
                              Editing Specialty #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingServiceId(null)}
                              className="text-xs text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-300 uppercase">
                                Specialty Name
                              </label>
                              <input
                                type="text"
                                required
                                value={editSrvTitle}
                                onChange={(e) =>
                                  setEditSrvTitle(e.target.value)
                                }
                                className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-300 uppercase">
                                Category Group
                              </label>
                              <select
                                value={editSrvCategory}
                                onChange={(e) =>
                                  setEditSrvCategory(e.target.value)
                                }
                                className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white"
                              >
                                {DEFAULT_CATEGORIES.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 uppercase">
                              Description
                            </label>
                            <textarea
                              rows={2}
                              value={editSrvDescription}
                              onChange={(e) =>
                                setEditSrvDescription(e.target.value)
                              }
                              className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white"
                            />
                          </div>

                          <div className="flex justify-end gap-3 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingServiceId(null)}
                              className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-slate-300"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={savingServiceEdit}
                              className="rounded-full bg-cyan-400 px-5 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
                            >
                              {savingServiceEdit ? "Saving..." : "Save Changes"}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                          <div className="flex items-start gap-3.5">
                            {/* Drag Grip Icon */}
                            <div
                              className="mt-1 flex flex-col gap-1 text-slate-500 transition group-hover:text-cyan-400"
                              title="Drag to reorder"
                            >
                              <svg
                                viewBox="0 0 16 16"
                                className="h-5 w-5 fill-current"
                                aria-hidden="true"
                              >
                                <circle cx="5" cy="3.5" r="1.3" />
                                <circle cx="11" cy="3.5" r="1.3" />
                                <circle cx="5" cy="8" r="1.3" />
                                <circle cx="11" cy="8" r="1.3" />
                                <circle cx="5" cy="12.5" r="1.3" />
                                <circle cx="11" cy="12.5" r="1.3" />
                              </svg>
                            </div>

                            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 font-mono text-xs font-bold text-cyan-300">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-bold text-white uppercase">
                                  {srv.title}
                                </h3>
                                <span className="rounded-full border border-white/10 bg-slate-950 px-2.5 py-0.5 text-[11px] font-medium text-cyan-300">
                                  {srv.category}
                                </span>
                              </div>
                              <p className="mt-1.5 text-sm text-slate-300">
                                {srv.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <button
                              type="button"
                              onClick={() => startEditingService(srv)}
                              className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:border-cyan-400/50 hover:text-cyan-300"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteService(srv.id, srv.title)
                              }
                              className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
