import React from "react";
import { Zap, Database, Globe, Search, MessageSquare, Shield, TrendingUp } from "lucide-react";

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-zinc-950 py-24 text-white">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-32 bg-gradient-to-b from-brand-900/15 via-zinc-900/70 to-zinc-950" />
      <div className="pointer-events-none absolute inset-x-0 -bottom-24 h-32 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(3,54,73,0.32),_transparent_60%)]" />
      <div className="absolute inset-0 bg-service-grid opacity-40 animate-grid-wave" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-6">
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-200">
            Fixed-fee playbooks
          </p>
          <h2 className="mb-4 text-4xl font-semibold bg-gradient-to-r from-white via-brand-100 to-accent-100 bg-clip-text text-transparent md:text-5xl">Same-week fixes, one owner</h2>
          <p className="text-lg text-zinc-300">
            Whether it&apos;s performance, deliverability, or attribution, the goal is revenue. Here&apos;s how we tackle each lever and what you walk away with.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
          <div className="group flex flex-col space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl relative overflow-hidden hover:shadow-2xl hover:shadow-brand-500/20 transition-all duration-500 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-brand-400 before:to-brand-600 before:transition-all before:duration-500 group-hover:before:w-2">
            {/* Floating accent elements */}
            <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-brand-400/30 animate-ping group-hover:animate-none" />
            <div className="absolute top-4 right-8 h-2 w-2 rounded-full bg-accent-400/40 opacity-60 animate-pulse" style={{animationDelay: '0.5s'}} />
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand-500/15 p-3 ring-1 ring-brand-400/30">
                <Zap className="h-6 w-6 text-brand-300" />
              </div>
              <h3 className="text-xl font-semibold">Stabilise the core</h3>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              Speed audits, hosting refactors, production monitoring, automated backups.
            </p>
            <ul className="space-y-3 text-sm text-zinc-300 flex-grow">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand-400" /> Hardened infrastructure &amp; recovery plans
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand-400" /> Core Web Vitals under 1s FCP
              </li>
              <li className="flex items-center gap-2">
                <Database className="h-4 w-4 text-brand-400" /> Query and cache tuning for spikes
              </li>
            </ul>
            <div className="rounded-2xl border border-brand-500/40 bg-brand-500/10 p-4 text-xs uppercase tracking-widest text-brand-200 mt-auto">
              Result: uptime + confidence during promotions
            </div>
          </div>

          <div className="group flex flex-col space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl relative overflow-hidden hover:shadow-2xl hover:shadow-success-500/20 transition-all duration-500 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-success-400 before:to-success-600 before:transition-all before:duration-500 group-hover:before:w-2">
            {/* Floating accent elements */}
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success-400/30 animate-ping group-hover:animate-none" />
            <div className="absolute top-6 right-6 h-1.5 w-1.5 rounded-full bg-highlight-400/50 opacity-70 animate-pulse" style={{animationDelay: '1s'}} />
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-success-500/15 p-3 ring-1 ring-success-400/30">
                <MessageSquare className="h-6 w-6 text-success-300" />
              </div>
              <h3 className="text-xl font-semibold">Make every lead count</h3>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              Trace every form, text, and email so sales teams never guess what happened.
            </p>
            <ul className="space-y-3 text-sm text-zinc-300 flex-grow">
              <li className="flex items-center gap-2">
                <Database className="h-4 w-4 text-success-300" /> CRM + pipeline automation, zero manual CSVs
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-success-300" /> Inbox placement monitoring &amp; reputation boosts
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success-300" /> Live dashboards that show lead source ROI
              </li>
            </ul>
            <div className="rounded-2xl border border-success-500/40 bg-success-500/10 p-4 text-xs uppercase tracking-widest text-success-200 mt-auto">
              Result: follow-ups within minutes, not days
            </div>
          </div>

          <div className="group flex flex-col space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl relative overflow-hidden hover:shadow-2xl hover:shadow-highlight-500/20 transition-all duration-500 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-highlight-400 before:to-highlight-600 before:transition-all before:duration-500 group-hover:before:w-2">
            {/* Floating accent elements */}
            <div className="absolute -top-3 -right-3 h-5 w-5 rotate-45 bg-highlight-400/20 animate-bounce group-hover:animate-none" />
            <div className="absolute top-8 right-4 h-2 w-6 rounded-full bg-accent-400/30 opacity-50 animate-pulse" style={{animationDelay: '1.5s'}} />
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-highlight-500/15 p-3 ring-1 ring-highlight-400/30">
                <Search className="h-6 w-6 text-highlight-300" />
              </div>
              <h3 className="text-xl font-semibold">Scale the winners</h3>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              Once the leaks are sealed, we turn the channels that work into predictable growth.
            </p>
            <ul className="space-y-3 text-sm text-zinc-300 flex-grow">
              <li className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-highlight-300" /> SEO roadmaps tied to revenue targets
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-highlight-300" /> High-converting landing pages &amp; funnels
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-highlight-300" /> Experiment sprints with clear success metrics
              </li>
            </ul>
            <div className="rounded-2xl border border-highlight-500/40 bg-highlight-500/10 p-4 text-xs uppercase tracking-widest text-highlight-200 mt-auto">
              Result: compounding organic &amp; paid returns
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
