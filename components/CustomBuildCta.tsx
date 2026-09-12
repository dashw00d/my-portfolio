import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

type CustomBuildCtaProps = {
  href?: string;
  eyebrow?: string;
  headline?: string;
  subcopy?: string;
  className?: string;
  decoration?: React.ReactNode;
};

export default function CustomBuildCta({
  href = "#contact-form",
  eyebrow = "Planning something new?",
  headline = "Scope a custom app build",
  subcopy = "Bring a feature or product idea and walk away with timelines, costs, and architecture.",
  className = "",
  decoration,
}: CustomBuildCtaProps) {
  return (
    <a
      href={href}
      className={`group relative inline-block rounded-2xl p-[2px] text-left transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${className}`}
    >
      {decoration}
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-600 via-accent-600 to-brand-700 opacity-50 blur-sm transition duration-300 group-hover:opacity-75 group-hover:blur-sm" aria-hidden />
      <span className="relative flex w-full items-center gap-4 rounded-[calc(1rem-1px)] bg-white px-6 py-4 shadow-lg shadow-brand-900/10">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 text-white shadow-md shadow-brand-900/20">
          <Sparkles className="h-6 w-6" />
        </span>
        <span className="flex-1">
          <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-brand-600 sm:tracking-[0.32em]">
            {eyebrow}
          </span>
          <span className="mt-1 block text-base font-semibold text-zinc-900">
            {headline}
          </span>
          <span className="mt-1 block text-sm text-zinc-500">
            {subcopy}
          </span>
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-600 transition duration-300 group-hover:translate-x-0.5 group-hover:border-transparent group-hover:bg-brand-600 group-hover:text-white">
          <ArrowRight className="h-4 w-4" />
        </span>
      </span>
    </a>
  );
}
