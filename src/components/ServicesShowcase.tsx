"use client";

import React, { useEffect, useState } from "react";
import type { ServiceItem } from "@/lib/services-constants";
import {
  DEFAULT_SEED_SERVICES,
  SERVICE_CATEGORY_META,
} from "@/lib/services-constants";

export function ServicesShowcase() {
  const [services, setServices] = useState<ServiceItem[]>(
    DEFAULT_SEED_SERVICES
  );

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.services) && data.services.length > 0) {
            setServices(data.services);
          }
        }
      } catch {
        // keep default seed services fallback
      }
    }
    load();
  }, []);

  useEffect(() => {
    const selectEl = document.getElementById(
      "service"
    ) as HTMLSelectElement | null;
    if (!selectEl) return;
    const currentVal = selectEl.value;
    selectEl.innerHTML = "";
    for (const s of services) {
      const opt = document.createElement("option");
      opt.value = s.title;
      opt.textContent = s.title;
      selectEl.appendChild(opt);
    }
    const multiOpt = document.createElement("option");
    multiOpt.value = "Multiple Services / Full Backyard";
    multiOpt.textContent = "Multiple Services / Full Backyard Transformation";
    selectEl.appendChild(multiOpt);
    if (currentVal) {
      selectEl.value = currentVal;
    }
  }, [services]);

  // Group services by category while preserving order of appearance
  const groupedCategories = Array.from(
    new Set(services.map((s) => s.category))
  ).map((category) => ({
    category,
    subtitle:
      SERVICE_CATEGORY_META[category] ||
      "Custom outdoor construction & backyard craftsmanship",
    items: services.filter((s) => s.category === category),
  }));

  return (
    <>
      {/* Full List of Services & Specialties Banner (Matching Company Sheet) */}
      <section
        id="checklist"
        className="border-b border-white/10 bg-slate-900/50 py-20"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold tracking-widest text-cyan-400 uppercase">
              Official Capabilities
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              List of Services &amp; Specialties
            </h2>
            <p className="mt-3 text-slate-300">
              Everything your property needs from initial excavation and
              drainage to pools, stonework, driveways, and finishing touches.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-3xl border border-white/15 bg-slate-950 shadow-2xl">
            <div className="border-b border-white/10 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 px-6 py-4 text-center">
              <h3 className="text-sm font-bold tracking-widest text-cyan-300 uppercase">
                Description of Specialties ({services.length})
              </h3>
            </div>
            <div className="grid divide-y divide-white/10 sm:grid-cols-2 sm:divide-x lg:grid-cols-3">
              {services.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3.5 px-6 py-4 transition hover:bg-cyan-400/5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 font-mono text-xs font-bold text-cyan-300">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-bold tracking-wide text-white uppercase">
                    {item.title}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-6 py-4 sm:col-span-2 lg:col-span-1">
                <a
                  href="#contact"
                  className="text-xs font-extrabold tracking-widest text-cyan-300 uppercase hover:text-cyan-200"
                >
                  Request a Quote for Any Service &rarr;
                </a>
              </div>
            </div>
            <div className="border-t border-white/10 bg-cyan-950/40 px-6 py-3.5 text-center">
              <p className="text-xs font-extrabold tracking-widest text-cyan-300 uppercase">
                “Bringing Happiness, Creating the Backyard of Your Dreams”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Categorized Services Section */}
      <section id="specialties" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-widest text-cyan-400 uppercase">
              Turnkey Craftsmanship
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Complete Pool, Concrete &amp; Backyard Solutions
            </h2>
            <p className="mt-4 text-slate-400">
              Instead of hiring multiple contractors for your pool, concrete,
              grading, drainage, fencing, and landscaping, our family company
              coordinates and builds your entire outdoor project seamlessly.
            </p>
          </div>

          <div className="mt-14 space-y-14">
            {groupedCategories.map((group) => (
              <div key={group.category}>
                <div className="border-l-4 border-cyan-400 pl-4">
                  <h3 className="text-2xl font-bold text-white">
                    {group.category}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {group.subtitle}
                  </p>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((service) => (
                    <div
                      key={service.id}
                      className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition hover:border-cyan-400/40 hover:bg-slate-900"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
                          <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                            ATL Inspiration Specialty
                          </span>
                        </div>
                        <h4 className="mt-3 text-lg font-bold text-white uppercase transition group-hover:text-cyan-300">
                          {service.title}
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
