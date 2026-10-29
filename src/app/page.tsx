import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";

const serviceCategories = [
  {
    category: "Pools & Aquatic Renovations",
    subtitle: "Custom swimming pools built & restored for family memories",
    items: [
      {
        title: "New Pools Construction",
        description:
          "Turnkey custom swimming pool design, excavation, steel, shotcrete/gunite, plumbing, and luxury water features.",
      },
      {
        title: "Pool Renovation",
        description:
          "Complete pool remodeling including new interior finishes, waterline tile, coping replacement, decking, and equipment upgrades.",
      },
    ],
  },
  {
    category: "Concrete, Pavers & Masonry",
    subtitle: "Durable structural concrete & artisan outdoor living features",
    items: [
      {
        title: "Concrete Demolition",
        description:
          "Safe, clean removal and haul-away of old pool decks, cracked slabs, patios, and walkways.",
      },
      {
        title: "Concrete Installation",
        description:
          "Precision-poured architectural, brushed, and stamped concrete for pool decks, slabs, and walkways.",
      },
      {
        title: "Driveways",
        description:
          "Full driveway replacement, extensions, and decorative finishes engineered for long-term durability.",
      },
      {
        title: "Concrete Pavers Patios",
        description:
          "Custom interlocking concrete pavers, travertine, and stone patios that elevate your outdoor entertaining space.",
      },
    ],
  },
  {
    category: "Outdoor Fire, Seating & Structures",
    subtitle: "Custom backyard gathering spots crafted in stone & timber",
    items: [
      {
        title: "Fireplaces",
        description:
          "Custom-built outdoor stone and masonry fireplaces that serve as the centerpiece of your backyard.",
      },
      {
        title: "Fire Pits",
        description:
          "Wood-burning or gas-integrated stone fire pits for cozy year-round evenings poolside.",
      },
      {
        title: "Stone Benches",
        description:
          "Built-in architectural stone seating walls and custom benches integrated around fire pits and patios.",
      },
      {
        title: "Retaining Wall Construction",
        description:
          "Engineered stone, block, and timber retaining walls to terrace sloped Georgia yards and prevent erosion.",
      },
      {
        title: "Wooden Fence Construction",
        description:
          "Custom privacy and pool-code compliant wooden fencing built with premium treated lumber and cedar.",
      },
    ],
  },
  {
    category: "Grading, Drainage, Turf & Exterior Care",
    subtitle: "Complete site preparation, water management & lush lawns",
    items: [
      {
        title: "Grading",
        description:
          "Precision lot leveling, backyard re-sloping, and site preparation for pools, patios, and lawns.",
      },
      {
        title: "Drainage Installation",
        description:
          "French drains, catch basins, downspout tie-ins, and channel drains to protect your pool and foundation.",
      },
      {
        title: "Rain Gardens",
        description:
          "Eco-friendly landscaped basins designed to capture runoff, filter stormwater, and beautify your yard.",
      },
      {
        title: "Artificial Turf",
        description:
          "Low-maintenance, mud-free synthetic turf for pool surrounds, putting greens, and pet-friendly play areas.",
      },
      {
        title: "Sod Installation",
        description:
          "Fresh, professional-grade sod installation (Zoysia, Bermuda, Fescue) for an instant lush green lawn.",
      },
      {
        title: "Pressure Washing",
        description:
          "Deep exterior surface cleaning for pool decks, driveways, stone walls, patios, and siding.",
      },
    ],
  },
];

const allSpecialtiesList = [
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

const processSteps = [
  {
    step: "01",
    title: "Free On-Site Consultation",
    description:
      "We visit your property, evaluate grading and drainage, listen to your vision, and provide honest recommendations in English or Spanish.",
  },
  {
    step: "02",
    title: "Site Prep, Grading & Drainage",
    description:
      "From concrete demolition and precision grading to drainage installation and retaining walls, we build a rock-solid foundation.",
  },
  {
    step: "03",
    title: "Pool & Hardscape Construction",
    description:
      "Our family-led crew constructs your new pool or renovation alongside paver patios, fireplaces, fire pits, and stone benches.",
  },
  {
    step: "04",
    title: "Turf, Fencing & Final Detailing",
    description:
      "We complete the transformation with artificial turf or fresh sod, wooden privacy fencing, rain gardens, and pressure washing.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-400 selection:text-slate-950">
      {/* Top Contact Bar */}
      <div className="border-b border-white/10 bg-slate-900/90 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-6 py-2.5 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Hablamos Español • English &amp; Spanish
            </span>
            <a
              href="mailto:Atlinspirationpools@gmail.com"
              className="hover:text-cyan-300 transition"
            >
              Atlinspirationpools@gmail.com
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs">
            <a href="tel:4045739665" className="hover:text-cyan-300 transition">
              Office: (404) 573-9665
            </a>
            <a href="tel:4049568471" className="hover:text-cyan-300 transition">
              Cell: (404) 956-8471
            </a>
            <a href="tel:4044535360" className="hover:text-cyan-300 transition">
              Cell: (404) 453-5360
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-8">
          <Link href="/" aria-label="ATL Inspiration Pools & Construction Inc. Home">
            <BrandLogo variant="compact" />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a href="#projects" className="transition hover:text-cyan-400">
              Projects
            </a>
            <a href="#specialties" className="transition hover:text-cyan-400">
              Services &amp; Specialties
            </a>
            <a href="#checklist" className="transition hover:text-cyan-400">
              All 17 Specialties
            </a>
            <a href="#contact" className="transition hover:text-cyan-400">
              Contact Us
            </a>
            <Link
              href="/admin"
              className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 transition hover:border-cyan-400/50 hover:bg-white/10"
            >
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:4045739665"
              className="hidden rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/20 sm:inline-block"
            >
              (404) 573-9665
            </a>
            <a
              href="#contact"
              className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Free Estimate
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-white/10 py-16 sm:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/25 via-blue-900/15 to-slate-950"
          />
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan-300 uppercase">
                  <span>“A Family Company”</span>
                  <span className="text-white/30">•</span>
                  <span className="text-amber-300">English &amp; Spanish</span>
                </div>

                <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:leading-[1.1]">
                  Bringing Happiness,{" "}
                  <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-400 bg-clip-text text-transparent">
                    Creating the Backyard of Your Dreams.
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
                  <strong className="font-semibold text-white">
                    ATL Inspiration Pools &amp; Construction Inc.
                  </strong>{" "}
                  is a family-owned Atlanta pool and outdoor construction company.
                  From custom new pools, renovations, and concrete paver patios to
                  grading, drainage, retaining walls, fireplaces, and turf—our team
                  handles every detail of your backyard transformation.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a
                    href="#contact"
                    className="rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-7 py-4 text-base font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:brightness-110"
                  >
                    Request Information &amp; Estimate
                  </a>
                  <a
                    href="#specialties"
                    className="rounded-full border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white transition hover:border-cyan-400/50 hover:bg-white/10"
                  >
                    Explore All 17 Specialties
                  </a>
                </div>

                {/* Direct Contact Strip */}
                <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                    <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Office Line
                    </p>
                    <a
                      href="tel:4045739665"
                      className="mt-1 block font-mono text-base font-bold text-white hover:text-cyan-300"
                    >
                      (404) 573-9665
                    </a>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                    <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Direct Cell Lines
                    </p>
                    <div className="mt-1 space-y-0.5 font-mono text-sm font-bold text-cyan-300">
                      <a href="tel:4049568471" className="block hover:underline">
                        (404) 956-8471
                      </a>
                      <a href="tel:4044535360" className="block hover:underline">
                        (404) 453-5360
                      </a>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                    <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Email &amp; Languages
                    </p>
                    <a
                      href="mailto:Atlinspirationpools@gmail.com"
                      className="mt-1 block truncate text-xs font-semibold text-white hover:text-cyan-300"
                    >
                      Atlinspirationpools@gmail.com
                    </a>
                    <p className="mt-1 text-xs font-medium text-amber-300">
                      English &amp; Spanish
                    </p>
                  </div>
                </div>
              </div>

              {/* Improved Brand Logo Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl border border-cyan-400/25 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-8 shadow-2xl shadow-cyan-500/10">
                  <div className="rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.16),_transparent_70%)] p-6 text-center">
                    <BrandLogo variant="full" className="mx-auto" />
                  </div>

                  <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-950/30 p-4 text-center">
                    <p className="text-xs font-extrabold tracking-widest text-cyan-300 uppercase">
                      “Bringing Happiness, Creating the Backyard of Your Dreams”
                    </p>
                    <p className="mt-2 text-xs text-slate-300">
                      Complete Pool Construction, Concrete, Hardscaping, Grading &amp;
                      Drainage Specialists Across Metro Atlanta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Projects Portfolio Gallery */}
        <ProjectsShowcase />

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
                Everything your property needs from initial excavation and drainage
                to pools, stonework, driveways, and finishing touches.
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-3xl border border-white/15 bg-slate-950 shadow-2xl">
              <div className="border-b border-white/10 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 px-6 py-4 text-center">
                <h3 className="text-sm font-bold tracking-widest text-cyan-300 uppercase">
                  Description of Specialties
                </h3>
              </div>
              <div className="grid divide-y divide-white/10 sm:grid-cols-2 sm:divide-x lg:grid-cols-3">
                {allSpecialtiesList.map((item, idx) => (
                  <div
                    key={item}
                    className="flex items-center gap-3.5 px-6 py-4 transition hover:bg-cyan-400/5"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 font-mono text-xs font-bold text-cyan-300">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-bold tracking-wide text-white uppercase">
                      {item}
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
              {serviceCategories.map((group) => (
                <div key={group.category}>
                  <div className="border-l-4 border-cyan-400 pl-4">
                    <h3 className="text-2xl font-bold text-white">
                      {group.category}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">{group.subtitle}</p>
                  </div>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((service) => (
                      <div
                        key={service.title}
                        className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition hover:border-cyan-400/40 hover:bg-slate-900"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                              ATL Inspiration Specialty
                            </span>
                          </div>
                          <h4 className="mt-3 text-lg font-bold text-white transition group-hover:text-cyan-300 uppercase">
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

        {/* Construction Process */}
        <section
          id="process"
          className="border-t border-white/10 bg-slate-900/30 py-24"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold tracking-widest text-cyan-400 uppercase">
                A Family Company You Can Trust
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                From Raw Yard to Dream Oasis
              </h2>
              <p className="mt-4 text-slate-400">
                Every project is built with care, clear communication in English
                and Spanish, and enduring structural quality.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((item) => (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-white/10 bg-slate-950 p-6"
                >
                  <span className="font-mono text-3xl font-black text-cyan-400/30">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Consultation / Contact CTA */}
        <section
          id="contact"
          className="border-t border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 py-24"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="text-sm font-semibold tracking-widest text-cyan-400 uppercase">
                  Contact Us Today
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  We&apos;re Glad to Assist You
                </h2>
                <p className="mt-4 text-slate-300">
                  If you would like to get more information from us, please feel
                  free to contact us at your earliest convenience. Our team will
                  be more than glad to assist you!
                </p>

                <div className="mt-8 space-y-4 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs font-bold tracking-wider text-cyan-400 uppercase">
                      Phone Numbers
                    </p>
                    <div className="mt-3 space-y-2 font-mono text-base">
                      <p className="flex items-center justify-between">
                        <span className="font-sans text-xs text-slate-400">
                          Office:
                        </span>
                        <a
                          href="tel:4045739665"
                          className="font-bold text-white hover:text-cyan-300"
                        >
                          (404) 573-9665
                        </a>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="font-sans text-xs text-slate-400">
                          Cell 1:
                        </span>
                        <a
                          href="tel:4049568471"
                          className="font-bold text-white hover:text-cyan-300"
                        >
                          (404) 956-8471
                        </a>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="font-sans text-xs text-slate-400">
                          Cell 2:
                        </span>
                        <a
                          href="tel:4044535360"
                          className="font-bold text-white hover:text-cyan-300"
                        >
                          (404) 453-5360
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs font-bold tracking-wider text-cyan-400 uppercase">
                      Email Address
                    </p>
                    <a
                      href="mailto:Atlinspirationpools@gmail.com"
                      className="mt-2 block font-mono text-base font-bold text-white hover:text-cyan-300"
                    >
                      Atlinspirationpools@gmail.com
                    </a>
                  </div>

                  <div className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-5">
                    <p className="text-xs font-bold tracking-wider text-amber-300 uppercase">
                      Bilingual Service
                    </p>
                    <p className="mt-1 text-sm text-slate-200">
                      We proudly serve clients in both{" "}
                      <strong className="text-white">English &amp; Spanish</strong>{" "}
                      across the Greater Atlanta area.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <form className="rounded-3xl border border-white/10 bg-slate-950 p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-white">
                    Request a Free Estimate
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Select the services you need and tell us about your backyard
                    goals.
                  </p>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your Name"
                        className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(404) 555-0100"
                        className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="service"
                        className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                      >
                        Primary Service Needed
                      </label>
                      <select
                        id="service"
                        name="service"
                        className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none"
                      >
                        {allSpecialtiesList.map((specialty) => (
                          <option key={specialty} value={specialty}>
                            {specialty}
                          </option>
                        ))}
                        <option value="Multiple Services / Full Backyard">
                          Multiple Services / Full Backyard Transformation
                        </option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="details"
                        className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                      >
                        Project Details
                      </label>
                      <textarea
                        id="details"
                        name="details"
                        rows={4}
                        placeholder="Tell us about your project (New Pool, Renovation, Concrete, Grading/Drainage, Pavers, Fire Pit, Turf, etc.)..."
                        className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-6 w-full rounded-full bg-cyan-400 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                  >
                    Send Request • Solicitar Información
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-12 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row lg:px-8">
          <BrandLogo variant="compact" />
          <div className="text-center sm:text-right">
            <p className="font-bold text-cyan-300 uppercase">
              “Bringing Happiness, Creating the Backyard of Your Dreams”
            </p>
            <p className="mt-1">
              &copy; 2026 ATL Inspiration Pools &amp; Construction Inc. (“A Family
              Company”). All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
