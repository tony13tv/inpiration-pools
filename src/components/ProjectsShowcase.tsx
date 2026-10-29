"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { ProjectItem } from "@/lib/projects-store";

export function ProjectsShowcase() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeImageIndexes, setActiveImageIndexes] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setProjects(Array.isArray(data.projects) ? data.projects : []);
        }
      } catch {
        // fallback empty
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const specialties = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.specialty))),
  ];

  const visibleProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.specialty === selectedCategory);

  function setImageIdx(projectId: string, idx: number) {
    setActiveImageIndexes((prev) => ({ ...prev, [projectId]: idx }));
  }

  return (
    <section
      id="projects"
      className="border-b border-white/10 bg-slate-950 py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold tracking-widest text-cyan-400 uppercase">
              Our Portfolio Gallery
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Featured Pool &amp; Construction Projects
            </h2>
            <p className="mt-3 max-w-2xl text-slate-400">
              Explore recent pools, renovations, paver patios, fire pits, and
              backyard transformations built across Metro Atlanta.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 self-start rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-bold tracking-wider text-cyan-300 uppercase transition hover:bg-cyan-400/20 sm:self-auto"
          >
            <span>+ Manage Projects (Admin)</span>
          </Link>
        </div>

        {/* Filter Pills */}
        {specialties.length > 2 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {specialties.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-white/10 bg-slate-900 text-slate-300 hover:border-cyan-400/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {[1, 2].map((skeleton) => (
              <div
                key={skeleton}
                className="h-96 animate-pulse rounded-3xl border border-white/10 bg-slate-900/50 p-6"
              />
            ))}
          </div>
        ) : visibleProjects.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center">
            <p className="text-base font-semibold text-white">
              No projects uploaded in this category yet.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Use the Administration Portal to add new projects and upload
              backyard photos.
            </p>
            <Link
              href="/admin"
              className="mt-6 inline-block rounded-full bg-cyan-400 px-6 py-2.5 text-xs font-bold text-slate-950 uppercase"
            >
              Go to Admin Portal
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {visibleProjects.map((project) => {
              const currentIdx = activeImageIndexes[project.id] || 0;
              const currentImage =
                project.images[currentIdx] ||
                project.images[0] ||
                "/uploads/sample-pool-oasis.svg";

              return (
                <article
                  key={project.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 shadow-xl transition hover:border-cyan-400/40"
                >
                  <div>
                    {/* Main Image Viewer */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentImage}
                        alt={project.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-slate-950/80 to-transparent p-4">
                        <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-bold text-cyan-300 backdrop-blur-md">
                          {project.specialty}
                        </span>
                        {project.featured && (
                          <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md">
                            ★ Featured Build
                          </span>
                        )}
                      </div>

                      {project.images.length > 1 && (
                        <div className="absolute right-3 bottom-3 rounded-full bg-slate-950/80 px-2.5 py-1 font-mono text-[11px] text-slate-200 backdrop-blur">
                          Photo {currentIdx + 1} of {project.images.length}
                        </div>
                      )}
                    </div>

                    {/* Multi-Image Thumbnail Strip */}
                    {project.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto border-b border-white/10 bg-slate-950/70 px-6 py-3">
                        {project.images.map((imgUrl, idx) => (
                          <button
                            key={`${project.id}-thumb-${idx}`}
                            type="button"
                            onClick={() => setImageIdx(project.id, idx)}
                            className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                              idx === currentIdx
                                ? "border-cyan-400 opacity-100"
                                : "border-transparent opacity-60 hover:opacity-90"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt={`${project.title} thumbnail ${idx + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Project Details */}
                    <div className="p-6">
                      <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                        {project.location}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-white">
                        {project.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-xs text-slate-400">
                    <span>ATL Inspiration Pools &amp; Construction Inc.</span>
                    <a
                      href="#contact"
                      className="font-bold text-cyan-400 hover:text-cyan-300"
                    >
                      Request Similar Design &rarr;
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
