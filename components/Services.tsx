import React from "react";
import {
  Zap,
  Database,
  Globe,
  Search,
  MessageSquare,
  Shield,
  TrendingUp,
} from "lucide-react";

type Icon = React.ComponentType<{ className?: string }>;

interface ServiceItem {
  icon: Icon;
  label: string;
}

interface Service {
  number: string;
  icon: Icon;
  title: string;
  description: string;
  items: ServiceItem[];
  result: string;
  tile: string;
  bar: string;
  bullet: string;
  resultBox: string;
  glow: string;
}

const SERVICES: Service[] = [
  {
    number: "01",
    icon: Zap,
    title: "Stabilise the core",
    description:
      "Speed audits, hosting refactors, production monitoring, automated backups.",
    items: [
      { icon: Shield, label: "Hardened infrastructure & recovery plans" },
      { icon: TrendingUp, label: "Core Web Vitals under 1s FCP" },
      { icon: Database, label: "Query and cache tuning for spikes" },
    ],
    result: "Result: uptime + confidence during promotions",
    tile: "bg-brand-500/15 text-brand-200 ring-brand-400/30",
    bar: "from-brand-400 to-brand-600",
    bullet: "text-brand-300",
    resultBox: "border-brand-500/30 bg-brand-500/10 text-brand-100",
    glow: "hover:border-brand-400/30",
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Make every lead count",
    description:
      "Trace every form, text, and email so sales teams never guess what happened.",
    items: [
      { icon: Database, label: "CRM + pipeline automation, zero manual CSVs" },
      { icon: Globe, label: "Inbox placement monitoring & reputation boosts" },
      { icon: TrendingUp, label: "Live dashboards that show lead source ROI" },
    ],
    result: "Result: follow-ups within minutes, not days",
    tile: "bg-success-500/15 text-success-200 ring-success-400/30",
    bar: "from-success-400 to-success-600",
    bullet: "text-success-300",
    resultBox: "border-success-500/30 bg-success-500/10 text-success-100",
    glow: "hover:border-success-400/30",
  },
  {
    number: "03",
    icon: Search,
    title: "Scale the winners",
    description:
      "Once the leaks are sealed, we turn the channels that work into predictable growth.",
    items: [
      { icon: TrendingUp, label: "SEO roadmaps tied to revenue targets" },
      { icon: MessageSquare, label: "High-converting landing pages & funnels" },
      { icon: Zap, label: "Experiment sprints with clear success metrics" },
    ],
    result: "Result: compounding organic & paid returns",
    tile: "bg-highlight-500/15 text-highlight-200 ring-highlight-400/30",
    bar: "from-highlight-400 to-highlight-600",
    bullet: "text-highlight-300",
    resultBox: "border-highlight-500/30 bg-highlight-500/10 text-highlight-100",
    glow: "hover:border-highlight-400/30",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-zinc-950 py-24 text-white">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-32 bg-gradient-to-b from-brand-900/15 via-zinc-900/70 to-zinc-950" />
      <div className="pointer-events-none absolute inset-x-0 -bottom-24 h-32 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(3,54,73,0.35),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(3,101,100,0.18),_transparent_55%)]" />
      <div className="absolute inset-0 bg-service-grid opacity-30" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-6">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
            Fixed-fee playbooks
          </p>
          <h2 className="mb-4 bg-gradient-to-r from-white via-brand-100 to-accent-100 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Same-week fixes, one owner
          </h2>
          <p className="text-lg text-zinc-300">
            Whether it&apos;s performance, deliverability, or attribution, the goal is revenue. Here&apos;s how we tackle each lever and what you walk away with.
          </p>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-900/50 p-8 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft-lg ${service.glow}`}
            >
              <span className="pointer-events-none absolute right-4 top-3 select-none text-[5.5rem] font-black leading-none text-white/[0.05] transition-colors duration-500 group-hover:text-white/[0.08]">
                {service.number}
              </span>
              <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${service.bar}`} />

              <div className="relative flex items-center gap-3">
                <div className={`rounded-2xl p-3 ring-1 ${service.tile}`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{service.title}</h3>
              </div>

              <p className="relative mt-5 text-sm leading-relaxed text-zinc-400">
                {service.description}
              </p>

              <ul className="relative mt-6 flex-grow space-y-3 text-sm text-zinc-300">
                {service.items.map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <item.icon className={`mt-0.5 h-4 w-4 flex-none ${service.bullet}`} />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>

              <div
                className={`relative mt-7 rounded-2xl border p-4 text-xs font-semibold uppercase tracking-[0.15em] ${service.resultBox}`}
              >
                {service.result}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
