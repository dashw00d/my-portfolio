import React, { useState } from "react";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

import { trackEvent } from "@/lib/gtag";

type ContactState = "idle" | "submitting" | "success" | "error";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  project: string;
  timeline: string;
}

const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  company: "",
  project: "",
  timeline: "",
};

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM);
  const [status, setStatus] = useState<ContactState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    if (!formData.name || !formData.email || !formData.project) {
      setErrorMessage("Name, email, and project summary are required.");
      setStatus("error");
      trackEvent("contact_form_validation_error", {
        event_category: "engagement",
        event_label: "missing_required_fields",
      });
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message ?? "Something went wrong. Try again.");
      }

      trackEvent("contact_form_submit", {
        event_category: "engagement",
        form_name: "contact_form",
        has_company: Boolean(formData.company),
        has_timeline: Boolean(formData.timeline),
      });

      trackEvent("generate_lead", {
        event_category: "engagement",
        form_name: "contact_form",
      });

      setStatus("success");
      setFormData(INITIAL_FORM);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to send message right now."
      );
      trackEvent("contact_form_submit_error", {
        event_category: "engagement",
        event_label: "contact_form",
      });
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 py-24 text-white">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-32 bg-gradient-to-b from-brand-950/80 via-brand-900/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 -bottom-32 h-32 bg-gradient-to-t from-slate-950 via-brand-900/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(67,171,167,0.28),_transparent_60%)]" />
      <div className="relative mx-auto max-w-5xl px-6">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute left-8 top-8 h-2 w-2 rounded-full bg-accent-400/40 animate-ping" />
        <div className="pointer-events-none absolute right-12 top-16 h-1 w-10 rounded-full bg-highlight-400/30 animate-pulse" style={{animationDelay: '0.5s'}} />
        <div className="pointer-events-none absolute left-1/4 bottom-8 h-3 w-3 rotate-45 bg-brand-400/25 animate-bounce" style={{animationDelay: '1.5s'}} />

        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-500/10 to-highlight-500/10 border border-accent-500/20 px-4 py-2 text-sm font-medium text-accent-200">
            <span className="h-2 w-2 rounded-full bg-success-500 animate-pulse"></span>
Let&apos;s talk
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-brand-100 to-accent-200 bg-clip-text text-transparent sm:text-5xl">Tell me about the problem</h2>
          <p className="mt-4 text-lg text-brand-200">
            You’ll hear back within one business day with next steps. No pushy sales call, just an honest assessment.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6 rounded-3xl border border-brand-500/30 bg-white/5 p-8 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-200">What to include</p>
            <ul className="space-y-4 text-sm text-brand-100">
              <li className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-4">
                <span className="block text-xs font-semibold uppercase tracking-widest text-brand-200">1. Symptoms</span>
                <span className="mt-1 block text-base text-white">What’s breaking, slow, or costing you money right now?</span>
              </li>
              <li className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-4">
                <span className="block text-xs font-semibold uppercase tracking-widest text-brand-200">2. Impact</span>
                <span className="mt-1 block text-base text-white">How is this affecting revenue, leads, or customer trust?</span>
              </li>
              <li className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-4">
                <span className="block text-xs font-semibold uppercase tracking-widest text-brand-200">3. Timeline</span>
                <span className="mt-1 block text-base text-white">What’s your launch window or critical deadline?</span>
              </li>
            </ul>
            <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-4 text-sm text-brand-100">
              Prefer email? <a href="mailto:ryan@dashwood.net" className="font-semibold text-white underline underline-offset-4">ryan@dashwood.net</a>
            </div>
          </div>

          <form
            id="contact-form"
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border border-brand-500/40 bg-white/10 p-8 shadow-xl shadow-brand-950/30 backdrop-blur"
            style={{ scrollMarginTop: '6rem' }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">
                  Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-brand-500/40 bg-brand-900/30 px-4 py-3 text-sm text-white placeholder:text-brand-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-brand-200/70"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-brand-500/40 bg-brand-900/30 px-4 py-3 text-sm text-white placeholder:text-brand-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-brand-200/70"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">
                Company / Website
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                value={formData.company}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-brand-500/40 bg-brand-900/30 px-4 py-3 text-sm text-white placeholder:text-brand-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-brand-200/70"
                placeholder="Acme Inc."
              />
            </div>

            <div>
              <label htmlFor="project" className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">
                What do you need help with? *
              </label>
              <textarea
                id="project"
                name="project"
                required
                value={formData.project}
                onChange={handleChange}
                rows={5}
                className="mt-2 w-full rounded-xl border border-brand-500/40 bg-brand-900/30 px-4 py-3 text-sm text-white placeholder:text-brand-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-brand-200/70"
                placeholder="Slow checkout, no deliverability visibility, missing lead attribution..."
              />
            </div>

            <div>
              <label htmlFor="timeline" className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">
                Desired launch or deadline
              </label>
              <input
                id="timeline"
                name="timeline"
                type="text"
                value={formData.timeline}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-brand-500/40 bg-brand-900/30 px-4 py-3 text-sm text-white placeholder:text-brand-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-brand-200/70"
                placeholder="In production by end of May"
              />
            </div>

            {status === "error" && errorMessage && (
              <div className="flex items-center gap-2 rounded-xl border border-danger-400/40 bg-danger-500/10 px-4 py-3 text-sm text-danger-200">
                <AlertCircle className="h-4 w-4" />
                {errorMessage}
              </div>
            )}

            {status === "success" && (
              <div className="flex items-center gap-2 rounded-xl border border-success-400/40 bg-success-500/10 px-4 py-3 text-sm text-success-200">
                <CheckCircle2 className="h-4 w-4" />
                Thanks! I’ll review and reach out shortly.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:shadow-xl hover:shadow-brand-500/40 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Send message
                </>
              )}
            </button>

            <p className="text-xs text-brand-200/70">
              You’re not opting into anything. I only use this info to prep for our call and keep your project moving.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
