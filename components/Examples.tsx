import React from "react";
import Link from "@/components/Link";
import { ArrowRight } from "lucide-react";

const CASES = [
  {
    sector: "Marketing Intelligence",
    title: "A client’s 15 years of staff logs → 20× marketing boost",
    summary:
      "Converted historical staffing and event logs into structured growth intelligence: trend extraction, segment mapping, content triggers, and campaign direction tied to real demand data.",
    before: "Siloed historical logs",
    after: "20× marketing lift",
    tags: ["Data Intelligence", "Laravel 12", "Growth Automation", "SEO Systems"],
    accentColor: "brand",
  },
  {
    sector: "Performance Optimization",
    title: "WordPress blog migrated to custom platform",
    summary:
      "Switched from 9-second loading WordPress blog to custom platform with Livewire SPA, lazy loading, advanced caching, font swapping, and comprehensive SEO optimization.",
    before: "9s page load time",
    after: "0.8s average load time",
    tags: ["Livewire", "SPA", "SEO Optimization", "Performance"],
    accentColor: "success",
  },
  {
    sector: "AI & Workflow Automation",
    title: "Reusable automation for day-to-day operations",
    summary:
      "Built an AI automation platform that coordinates tasks, shares information between workflows, and helps teams track and recover from problems.",
    before: "One-off scripts and manual ops",
    after: "Reusable, connected workflows",
    tags: ["Agent Orchestration", "Automation", "ChromaDB", "Operational Reliability"],
    accentColor: "accent",
  },
  {
    sector: "Email Marketing",
    title: "Emails hitting spam? 98% inbox rate now",
    summary:
      "Complete email deliverability overhaul: DNS configuration, dedicated sending domains, warming schedule, unsubscribe compliance, dead email culling, engagement segmentation, IP reputation monitoring, and comprehensive deliverability reporting.",
    before: "60% delivery",
    after: "98% delivery",
    tags: ["SPF/DKIM", "Sendgrid", "Email Compliance", "List Hygiene"],
    accentColor: "highlight",
  },
] as const;

const ACCENTS = {
  brand: {
    bar: "before:bg-brand-500",
    label: "text-brand-600",
    chip: "bg-brand-500/10 text-brand-700",
    tag: "bg-brand-500/10 text-brand-700",
    hover: "hover:border-brand-300",
  },
  success: {
    bar: "before:bg-success-500",
    label: "text-success-600",
    chip: "bg-success-500/10 text-success-700",
    tag: "bg-success-500/10 text-success-700",
    hover: "hover:border-success-300",
  },
  accent: {
    bar: "before:bg-accent-500",
    label: "text-accent-600",
    chip: "bg-accent-500/10 text-accent-700",
    tag: "bg-accent-500/10 text-accent-700",
    hover: "hover:border-accent-300",
  },
  highlight: {
    bar: "before:bg-highlight-500",
    label: "text-highlight-600",
    chip: "bg-highlight-500/10 text-highlight-700",
    tag: "bg-highlight-500/10 text-highlight-700",
    hover: "hover:border-highlight-300",
  },
} as const;

export default function Examples() {
  return (
    <section
      id="examples"
      className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-highlight-50 py-24"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-32 bg-gradient-to-b from-highlight-100/60 via-white/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 -bottom-24 h-32 bg-gradient-to-t from-brand-900/15 via-brand-800/5 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(3,101,100,0.08),_transparent_65%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="section-eyebrow mb-4">
              <span className="h-2 w-2 rounded-full bg-success-500" />
              Real results
            </div>
            <h2 className="gradient-heading text-4xl font-bold md:text-5xl">
              Proof it works in the real world
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              Faster websites, emails that reach customers, and fewer manual
              tasks. Here’s what that work has looked like for real clients.
            </p>
          </div>
          <Link
            href="/projects"
            className="btn-secondary group shrink-0 hover:border-brand-300 hover:text-brand-700"
          >
            View in-depth demos
            <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {CASES.map((item) => {
            const accent = ACCENTS[item.accentColor];
            return (
              <article
                key={item.title}
                className={`group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90 p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg ${accent.hover} before:absolute before:left-0 before:top-0 before:h-full before:w-1 ${accent.bar}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent.label}`}>
                    {item.sector}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${accent.chip}`}>
                    Case snapshot
                  </span>
                </div>

                <h3 className="text-xl font-bold text-zinc-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-600">{item.summary}</p>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                      Before
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-600">{item.before}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-300" aria-hidden />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-success-600">
                      After
                    </p>
                    <p className="mt-1 text-base font-bold text-success-700">{item.after}</p>
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${accent.tag}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
