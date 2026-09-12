import React, { useState } from "react";
import Link from "@/components/Link";
import { ArrowUpRight, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

import { trackEvent } from "@/lib/gtag";

type ContactState = "idle" | "submitting" | "success" | "error";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  project: string;
  timeline: string;
  website: string;
}

const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  company: "",
  project: "",
  timeline: "",
  website: "",
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
      const response = await fetch("/api/contact.php", {
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
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative border-t border-brand-100 bg-brand-50/60 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 xl:gap-24">
        <div className="flex flex-col items-start lg:py-6">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            <span aria-hidden="true" className="h-px w-8 bg-brand-500" />
            Let’s talk
          </p>
          <h2 id="contact-heading" className="mt-6 max-w-lg text-4xl font-bold leading-[1.1] tracking-tight text-brand-950 sm:text-5xl lg:text-6xl">
            Tell me about the problem.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-600">
            Something broken? A new idea to build? Tell me where you’re stuck,
            and we’ll work out the next step.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <img
              src="/images/ryan_stefan.png"
              alt="Ryan Stefan"
              width={56}
              height={56}
              loading="lazy"
              className="h-14 w-14 shrink-0 rounded-2xl bg-brand-100 object-cover"
            />
            <div>
              <p className="font-semibold text-brand-950">You’ll hear from me, Ryan.</p>
              <p className="mt-1 text-sm text-zinc-600">Usually within one business day.</p>
            </div>
          </div>

          <div className="mt-10 w-full max-w-md border-t border-brand-200/70 pt-6 lg:mt-12">
            <p className="text-sm font-semibold text-brand-950">No perfect brief needed.</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              A few lines about what’s happening, what you’d like to change,
              and any deadline are plenty to start with.
            </p>
            <p className="mt-6 text-sm text-zinc-600">Prefer email?</p>
            <a
              href="mailto:ryan@dashwood.net"
              className="mt-1 inline-flex items-center gap-2 rounded-sm text-lg font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 transition-colors hover:text-brand-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4"
            >
              ryan@dashwood.net
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <form
          id="contact-form"
          aria-labelledby="contact-form-heading"
          aria-busy={status === "submitting"}
          onSubmit={handleSubmit}
          className="relative min-w-0 scroll-mt-24 space-y-6 rounded-3xl border border-brand-100 bg-white p-5 shadow-soft sm:p-8 lg:p-10"
        >
          <div>
            <h3 id="contact-form-heading" className="text-xl font-bold text-brand-950 sm:text-2xl">A few details to get started</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">Just your name, email, and a little context.</p>
          </div>

          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="contact-label">Your name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="contact-field"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="contact-label">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="contact-field"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="project" className="contact-label">What do you need help with?</label>
            <textarea
              id="project"
              name="project"
              required
              value={formData.project}
              onChange={handleChange}
              rows={5}
              className="contact-field min-h-36 resize-y"
              placeholder="Tell me what’s not working, or what you’d like to build…"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="company" className="contact-label">
                Company or website <span className="font-normal text-zinc-500">(optional)</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                value={formData.company}
                onChange={handleChange}
                className="contact-field"
                placeholder="Company name or URL"
              />
            </div>
            <div>
              <label htmlFor="timeline" className="contact-label">
                Timeline <span className="font-normal text-zinc-500">(optional)</span>
              </label>
              <input
                id="timeline"
                name="timeline"
                type="text"
                value={formData.timeline}
                onChange={handleChange}
                className="contact-field"
                placeholder="Next month, or just exploring"
              />
            </div>
          </div>

          {status === "error" && errorMessage && (
            <div role="alert" className="flex items-start gap-3 rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {errorMessage}
            </div>
          )}

          {status === "success" && (
            <div role="status" className="flex items-start gap-3 rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Thanks! I’ll review your message and reach out shortly.
            </div>
          )}

          <div className="space-y-4 border-t border-zinc-100 pt-6">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>
                  Send message
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
            <p className="text-center text-xs leading-relaxed text-zinc-500">
              I’ll only use your details to respond to your inquiry.{' '}
              <Link href="/privacy-policy" className="rounded-sm underline underline-offset-2 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                Privacy policy
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
