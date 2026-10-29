"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import type { ProjectItem } from "@/lib/projects-store";

const ALL_SPECIALTIES = [
  "New Pools Construction",
  "Pool Renovation",
  "Concrete Demolition",
  "Concrete Installation",
  "Driveways",
  "Grading",
  "Drainage Installation",
  "Rain Gardens",
  "Artificial Turf",
  "Sod Installation",
  "Retaining Wall Construction",
  "Wooden Fence Construction",
  "Fire Pits",
  "Stone Benches",
  "Fireplaces",
  "Pressure Washing",
  "Concrete Pavers Patios",
];

export default function AdminProjectsPage() {
  // Authentication state
  const [authChecking, setAuthChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Create form state
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState(ALL_SPECIALTIES[0]);
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function checkSession() {
    setAuthChecking(true);
    try {
      const res = await fetch("/api/admin/session", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAuthenticated(Boolean(data.authenticated));
        if (data.authenticated) {
          await fetchProjects();
        }
      }
    } catch {
      setAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  }

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setProjects(Array.isArray(data.projects) ? data.projects : []);
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Could not load projects from server.",
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
      await fetchProjects();
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
      setSpecialty(ALL_SPECIALTIES[0]);
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
              href="/#projects"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:border-cyan-400/50 hover:bg-white/10"
            >
              &larr; View Live Site Gallery
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
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
              Portfolio &amp; Photo Manager
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Project Administration Portal
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Add new construction projects, upload multiple job-site photos,
              and manage the portfolio gallery shown on the public website.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-3 text-right">
            <span className="block text-[11px] tracking-wider text-slate-400 uppercase">
              Total Published Projects
            </span>
            <span className="font-mono text-2xl font-extrabold text-cyan-400">
              {projects.length}
            </span>
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
                Upload one or more photos from your computer or phone.
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
                      {ALL_SPECIALTIES.map((item) => (
                        <option key={item} value={item}>
                          {item}
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

                  {/* Selected Image Previews */}
                  {previewUrls.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-cyan-300">
                        Ready to upload ({previewUrls.length} photo
                        {previewUrls.length === 1 ? "" : "s"}):
                      </p>
                      <div className="mt-2 grid grid-cols-3 gap-2.5">
                        {previewUrls.map((url, idx) => (
                          <div
                            key={url}
                            className="group relative aspect-video overflow-hidden rounded-xl border border-white/15 bg-slate-950"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={`Upload preview ${idx + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeSelectedFile(idx)}
                              className="absolute top-1 right-1 rounded-full bg-slate-950/85 px-2 py-0.5 text-[10px] font-bold text-rose-300 hover:bg-rose-500 hover:text-white"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
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
              Edit details, upload additional photos to existing projects, or
              remove outdated entries.
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
                                {ALL_SPECIALTIES.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
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

                          {/* Current Images Management */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 uppercase">
                              Current Photos ({editKeptImages.length})
                            </label>
                            <div className="mt-2 flex flex-wrap gap-2.5">
                              {editKeptImages.map((imgUrl, idx) => (
                                <div
                                  key={`${imgUrl}-${idx}`}
                                  className="relative h-16 w-24 overflow-hidden rounded-lg border border-white/15"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={imgUrl}
                                    alt="Project photo"
                                    className="h-full w-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEditKeptImages((prev) =>
                                        prev.filter((_, i) => i !== idx)
                                      )
                                    }
                                    className="absolute top-0.5 right-0.5 rounded bg-slate-950/90 px-1.5 py-0.5 text-[10px] font-bold text-rose-300 hover:bg-rose-600 hover:text-white"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
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
                                  handleDeleteProject(project.id, project.title)
                                }
                                className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          {/* Image Gallery Strip */}
                          <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
                            {project.images.map((imgUrl, idx) => (
                              <div
                                key={`${project.id}-img-${idx}`}
                                className="relative h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-950"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={imgUrl}
                                  alt={`${project.title} photo ${idx + 1}`}
                                  className="h-full w-full object-cover"
                                />
                                <span className="absolute bottom-1 left-1 rounded bg-slate-950/80 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                                  #{idx + 1}
                                </span>
                              </div>
                            ))}
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
      </main>
    </div>
  );
}
