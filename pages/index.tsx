import React from "react";
import Head from "next/head";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Problems from "../components/Problems";
import Services from "../components/Services";
import Process from "../components/Process";
import Examples from "../components/Examples";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Automation + Revenue Engineering | Ryan Stefan</title>
        <meta name="description" content="I turn messy operations into growth systems. From converting a client's 15 years of staff logs into a 20x marketing boost to building adaptive AI agent automation platforms for any use case." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="AI automation platform, agent orchestration, Laravel 12, revenue engineering, SEO automation, marketing intelligence, Ryan Stefan, dashwood" />
        <meta name="author" content="Ryan Stefan" />

        {/* Open Graph */}
        <meta property="og:title" content="AI Automation + Revenue Engineering | Ryan Stefan" />
        <meta property="og:description" content="I build adaptive agent automation systems and revenue engines: from legacy data unlocks to production-grade AI workflows." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dashwood.net" />
        <meta property="og:site_name" content="Ryan Stefan - Dashwood" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Automation + Revenue Engineering | Ryan Stefan" />
        <meta name="twitter:description" content="Adaptive agent automation and real-world growth systems built on modern 2026 stacks." />

        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://dashwood.net" />

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Dashwood - Ryan Stefan",
              "description": "Revenue-focused engineering and AI automation systems that convert operational complexity into measurable growth.",
              "url": "https://dashwood.net",
              "telephone": "(737) 205-9226",
              "email": "ryan@dashwood.net",
              "founder": {
                "@type": "Person",
                "name": "Ryan Stefan",
                "jobTitle": "Automation Systems Engineer",
                "email": "ryan@dashwood.net"
              },
              "areaServed": "Worldwide",
              "serviceType": ["AI Agent Automation", "Revenue Systems Engineering", "SEO Automation", "Marketing Intelligence", "Performance Optimization"]
            })
          }}
        />
      </Head>

      <Navigation />

      <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-brand-50/20 to-white text-zinc-900">
        <Hero />
        <Problems />
        <Services />
        <Process />
        <Examples />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
