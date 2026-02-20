import React from "react";
import Head from "next/head";
import Link from "next/link";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Contact from "../components/Contact";
import CustomBuildCta from "../components/CustomBuildCta";

const DEMOS = [
  {
    title: "Client Staff Log Intelligence Engine",
    caption: "15 years of ops data → measurable demand",
    description:
      "Converted long-tail staffing logs into clean, queryable marketing intelligence. Built extraction + normalization + insight loops that unlocked campaign targeting and content velocity.",
    metrics: [
      { label: "Marketing impact", value: "20× boost" },
      { label: "Historical depth", value: "15 years" },
    ],
    technologies: ["Laravel 12", "Data Normalization", "SEO Automation"],
    previewLink: "",
  },
  {
    title: "Elite Agent Automation Platform",
    caption: "Adaptable automation for any use case",
    description:
      "A modular multi-agent system with shared context, recovery guardrails, and role-based orchestration. Designed to adapt quickly to ops, support, growth, and content workflows.",
    metrics: [
      { label: "Deployment mode", value: "Composable" },
      { label: "Use-case fit", value: "Cross-domain" },
    ],
    technologies: ["OpenClaw", "ChromaDB", "Workflow Orchestration"],
    previewLink: "",
  },
  {
    title: "2026 Revenue Systems Modernization",
    caption: "Current stack, practical execution",
    description:
      "Production modernization across legacy and current systems: Laravel 12 hardening, AI-assisted automation, SEO infrastructure, and observability that ties engineering output to growth outcomes.",
    metrics: [
      { label: "Core stack", value: "Laravel 12 + AI" },
      { label: "Delivery style", value: "Build + prove" },
    ],
    technologies: ["Laravel 12", "AI Automation", "Observability"],
    previewLink: "",
  },
];

export default function Projects() {
  return (
    <>
      <Head>
        <title>Project Demos - Ryan Stefan | AI Automation + Revenue Systems</title>
        <meta
          name="description"
          content="Case studies and demos: a 20× marketing boost from a client's 15 years of staff logs, adaptive agent automation platforms, and 2026-ready revenue engineering systems."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="AI automation portfolio, Laravel 12 projects, agent orchestration, marketing intelligence, revenue systems, Ryan Stefan, dashwood" />
        <meta name="author" content="Ryan Stefan" />

        {/* Open Graph */}
        <meta property="og:title" content="Project Demos - Ryan Stefan | AI Automation + Revenue Systems" />
        <meta property="og:description" content="See how legacy data became a 20× marketing boost, and how adaptive agent automation platforms are built for real operations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dashwood.net/projects" />
        <meta property="og:site_name" content="Ryan Stefan - Dashwood" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Project Demos - Ryan Stefan | AI Automation + Revenue Systems" />
        <meta name="twitter:description" content="20× marketing lift case study + adaptive agent automation systems built on modern 2026 stacks." />

        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://dashwood.net/projects" />

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "Project Demos - Ryan Stefan",
              "description": "A curated collection of revenue-focused engineering case studies by Ryan Stefan, including AI automation and legacy-data intelligence projects.",
              "url": "https://dashwood.net/projects",
              "author": {
                "@type": "Person",
                "name": "Ryan Stefan",
                "jobTitle": "Web Developer",
                "email": "ryan@dashwood.net",
                "telephone": "(737) 205-9226"
              },
              "mainEntity": {
                "@type": "ItemList",
                "itemListElement": [
                  {
                    "@type": "SoftwareApplication",
                    "name": "Client Staff Log Intelligence Engine",
                    "description": "Transformed a client's 15 years of staffing logs into actionable marketing intelligence and campaign acceleration.",
                    "applicationCategory": "WebApplication"
                  },
                  {
                    "@type": "SoftwareApplication",
                    "name": "Elite Agent Automation Platform",
                    "description": "Composable multi-agent orchestration platform adaptable across operations, support, content, and growth workflows.",
                    "applicationCategory": "WebApplication"
                  },
                  {
                    "@type": "SoftwareApplication",
                    "name": "2026 Revenue Systems Modernization",
                    "description": "Modern Laravel 12 + AI automation architecture with SEO infrastructure and observability tied to growth outcomes.",
                    "applicationCategory": "WebApplication"
                  }
                ]
              }
            })
          }}
        />
      </Head>

      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-white via-brand-50/30 to-white text-zinc-900">
        <section className="relative overflow-hidden px-6 pb-24 pt-32">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-brand-200/30 blur-3xl" />
            <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-highlight-200/40 blur-3xl" />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-brand-50/50 to-brand-50" />

          <div className="mx-auto flex max-w-4xl flex-col gap-6 text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-200/60 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600 shadow-sm">
              2026 featured systems
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              High-leverage builds, not portfolio fluff
            </h1>
            <p className="text-lg leading-relaxed text-zinc-600">
              From turning a client’s 15 years of staffing logs into a 20× marketing boost
              to building adaptable agent automation platforms, these are the
              systems I deploy when outcomes matter.
            </p>
            <div className="mt-2">
              <CustomBuildCta
                href="#contact-form"
                className="mx-auto w-full max-w-xl"
                eyebrow="Have a blank canvas?"
                headline="Kick off a custom product build"
                subcopy="Share your roadmap and I'll scope the architecture, team, and delivery milestones."
              />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-6 pb-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-50 via-white to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(205,179,128,0.12),_transparent_60%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/60 to-transparent" />
          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-3">
            {DEMOS.map((demo) => (
              <article
                key={demo.title}
                className="flex h-full flex-col gap-6 rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest text-brand-500">{demo.caption}</p>
                  <h2 className="text-2xl font-semibold text-zinc-900">{demo.title}</h2>
                  <p className="text-sm leading-relaxed text-zinc-600">{demo.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 text-sm">
                  {demo.metrics.map((metric) => (
                    <div key={metric.label}>
                      <p className="text-xs uppercase tracking-widest text-zinc-400">{metric.label}</p>
                      <p className="mt-1 font-semibold text-zinc-900">{metric.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-medium text-brand-600">
                  {demo.technologies.map((tech) => (
                    <span key={tech} className="rounded-full bg-brand-500/10 px-3 py-1">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between">
                  {demo.previewLink ? (
                    <Link
                      href={demo.previewLink}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                    >
                      View walkthrough
                      <span aria-hidden>→</span>
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-zinc-400">Walkthrough video coming soon</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden bg-white/80 py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-white/70 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(3,101,100,0.08),_transparent_70%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-900/20 via-brand-900/10 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-3xl font-semibold text-zinc-900 md:text-4xl">
              Want a tailored walkthrough?
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              Drop me a line with your stack and goals. I’ll prep a live demo showing exactly how we’d solve it.
            </p>
          </div>
        </section>

        <div className="relative bg-gradient-to-br from-brand-50 via-white to-brand-100">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-900/30 via-brand-200/30 to-transparent" />
          <Contact />
        </div>
      </main>

      <Footer />
    </>
  );
}
