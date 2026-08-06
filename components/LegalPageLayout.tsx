import Head from "next/head";
import Link from "next/link";
import type { ReactNode } from "react";

import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface LegalPageLayoutProps {
  children: ReactNode;
  description: string;
  path: string;
  title: string;
}

export default function LegalPageLayout({
  children,
  description,
  path,
  title,
}: LegalPageLayoutProps) {
  const canonical = `${SITE_URL}${path}`;
  const pageTitle = `${title} | Ryan Stefan`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index,follow" />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content={SITE_NAME} />

        <link rel="canonical" href={canonical} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-white via-brand-50/30 to-white px-6 pb-24 pt-32 text-zinc-900">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-900"
          >
            <span aria-hidden>←</span>
            Back to dashwood.net
          </Link>

          <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-brand-950/5">
            <header className="border-b border-brand-100 bg-gradient-to-br from-brand-950 via-brand-900 to-accent-900 px-6 py-10 text-white sm:px-10">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">
                Dashwood policies
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 text-sm text-brand-100">
                Effective August 6, 2026 · Last updated August 6, 2026
              </p>
            </header>

            <article className="prose prose-zinc max-w-none px-6 py-10 prose-headings:scroll-mt-24 prose-headings:text-zinc-900 prose-a:text-brand-700 prose-a:decoration-brand-300 prose-a:underline-offset-4 hover:prose-a:text-brand-900 sm:px-10">
              {children}
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
