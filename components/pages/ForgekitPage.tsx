import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "@/components/Link";
import {
  CheckCircle2,
  Image,
  MessageCircle,
  Phone,
  Smartphone,
  User,
  Camera,
  ScanText,
  MapPin,
  MessageSquare,
  Upload,
  Bell,
  Clock,
  ClipboardList,
  FileText,
  CreditCard,
  Navigation,
  Sparkles,
  ArrowRight,
  PlayCircle,
  Database,
  FileCheck,
  Folder,
  ArrowLeft,
  Home,
  type LucideIcon,
} from "lucide-react";

/* ========================================
   NAVIGATION COMPONENT
   ======================================== */

function NavigationBar() {
  return (
    <>
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      <nav
        className="w-full bg-zinc-950 border-b border-white/5"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-12">
            <Link
              href="/"
              className="flex items-center gap-2 text-white hover:text-emerald-400 transition-colors group"
              aria-label="Return to home page"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
              <span className="font-semibold text-sm">Back to Home</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                aria-label="Navigate to home page"
              >
                <Home className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

/* ========================================
   EMAIL CAPTURE COMPONENT
   ======================================== */

type EmailCaptureVariant = 'hero' | 'cta';

function EmailCaptureForm({ variant = 'hero' }: { variant?: EmailCaptureVariant }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    // Simulate API call (replace with actual implementation)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // TODO: Replace with actual API call
      // await fetch('/api/early-access', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const isHero = variant === 'hero';

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${isHero ? 'max-w-lg' : 'max-w-2xl mx-auto'} rounded-xl p-4 ${isHero ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-white/10 border border-white/30'}`}
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className={`h-6 w-6 ${isHero ? 'text-emerald-400' : 'text-white'}`} />
          <div>
            <p className={`font-semibold ${isHero ? 'text-emerald-200' : 'text-white'}`}>Request received!</p>
            <p className={`text-sm ${isHero ? 'text-emerald-300/80' : 'text-white/80'}`}>We'll be in touch within 24 hours.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={isHero ? 'max-w-lg' : 'max-w-2xl mx-auto'}>
      <p className={`mb-3 text-sm font-semibold ${isHero ? 'text-emerald-200' : 'text-white'}`}>
        Request Early Access:
      </p>
      <form onSubmit={handleSubmit} className={`flex ${isHero ? 'gap-3' : 'flex-col sm:flex-row gap-4'}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your work email"
          className={`flex-1 ${isHero ? 'px-5 py-3.5 rounded-xl' : 'px-6 py-4 rounded-2xl'} ${isHero ? 'bg-white/5 border border-white/20' : 'bg-white/10 border-2 border-white/30'} text-white ${isHero ? 'placeholder-zinc-400' : 'placeholder-white/60'} backdrop-blur focus:outline-none focus:ring-2 ${isHero ? 'focus:ring-emerald-400/50' : 'focus:ring-white/50 focus:bg-white/15'} transition text-base ${isHero ? '' : 'text-lg'}`}
          aria-label="Email address for early access"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`${isHero ? 'px-6 py-3.5 rounded-xl' : 'px-8 py-4 rounded-2xl'} ${isHero ? 'bg-emerald-500 text-white hover:bg-emerald-400' : 'bg-white text-emerald-700 hover:bg-emerald-50'} font-bold transition ${isHero ? 'shadow-lg' : 'shadow-2xl'} text-base ${isHero ? '' : 'text-lg'} whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {status === 'loading' ? 'Sending...' : 'Request Access →'}
        </button>
      </form>
      {status === 'error' && errorMessage && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-2 text-sm ${isHero ? 'text-red-300' : 'text-red-200'}`}
        >
          {errorMessage}
        </motion.p>
      )}
      <p className={`mt-2.5 text-xs ${isHero ? 'text-zinc-400' : 'text-emerald-50'}`}>
        No credit card required. Live in 24 hours.
      </p>
    </div>
  );
}

export default function ForgeKitMultiSectionDemo() {
  return (
    <>
      <NavigationBar />
      <main id="main-content" className="w-full">
        <HeroSection />
        <BuildingBlocksSection />
        <IndustryExamplesSection />
        <InteractiveDemoSection />
        <CustomBuilderSection />
      </main>
    </>
  );
}

/* ========================================
   SECTION 1: HERO - The Problem/Solution
   ======================================== */

function HeroSection() {
  return (
    <section
      className="relative isolate w-full min-h-[84vh] flex items-center bg-zinc-950 text-white overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background: single vignette + diagonal tint */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 65% 40%, rgba(16,185,129,0.16) 0%, rgba(16,185,129,0.07) 35%, transparent 55%), linear-gradient(105deg, transparent 0%, transparent 48%, rgba(16,185,129,0.06) 48.2%, rgba(16,185,129,0.06) 60%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-10 lg:gap-14 md:grid-cols-[2fr,1fr]">
          {/* LEFT – Copy */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Headline */}
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Cut App Chaos.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400">
                Save Hours with One-Tap Workflows.
              </span>
            </h1>

            {/* Subhead */}
            <p className="mt-4 max-w-xl text-base sm:text-lg text-emerald-100/90">
              Automate photos, check-ins, receipts, and updates. Give your field team{" "}
              <strong className="text-white">one-tap workflows</strong> that eliminate app switching.
            </p>

            {/* "We replace this mess" checklist (no floating red cards) */}
            <ul className="mt-6 space-y-2 text-sm text-emerald-50/90">
              {[
                "Take photo → Email → Attach → Type details",
                "Copy address → open Maps → paste",
                "Finish job → text boss → log hours later",
                "Paper receipts pile up",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span aria-hidden className="mt-[2px] text-rose-400">✕</span>
                  <span className="opacity-90">{line}</span>
                </li>
              ))}
            </ul>

            {/* Badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["Photo Capture", "OCR Extract", "Auto-Upload"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-emerald-200/90 backdrop-blur"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Early Access Email Capture */}
            <div className="mt-7">
              <EmailCaptureForm variant="hero" />
            </div>
          </motion.div>

          {/* RIGHT – Phone mock, floating right with one glow */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center md:justify-end"
          >
            <div className="relative">
              <div className="absolute -inset-10 rounded-[48px] bg-emerald-500/20 blur-3xl" aria-hidden />
              <div className="relative">
                <HeroPhoneMock />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll nudge */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 hidden md:flex flex-col items-center gap-2 text-zinc-400">
        <span className="text-sm">See what you can build</span>
        <motion.span
          aria-hidden
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="text-emerald-400 text-2xl"
        >
          ↓
        </motion.span>
      </div>
    </section>
  );
}


/* ========================================
   SECTION 2: BUILDING BLOCKS GALLERY
   ======================================== */

type AutomationBlock = {
  id: string;
  label: string;
  icon: LucideIcon;
  desc: string;
};

const AUTOMATION_BLOCKS: AutomationBlock[] = [
  { id: 'photo', label: 'Photo Capture', icon: Camera, desc: 'Photos with timestamps' },
  { id: 'ocr', label: 'Text Extract', icon: ScanText, desc: 'Scan receipts automatically' },
  { id: 'gps', label: 'Location Tracking', icon: MapPin, desc: 'Track team locations' },
  { id: 'sms', label: 'SMS Notifications', icon: MessageSquare, desc: 'Text customers or managers' },
  { id: 'upload', label: 'Cloud Upload', icon: Upload, desc: 'Auto-sync to cloud storage' },
  { id: 'notify', label: 'Push Alerts', icon: Bell, desc: 'In-app notifications' },
  { id: 'time', label: 'Time Logging', icon: Clock, desc: 'Auto-track hours worked' },
  { id: 'form', label: 'Quick Forms', icon: ClipboardList, desc: 'Custom data entry fields' },
  { id: 'signature', label: 'E-Signature', icon: FileText, desc: 'Capture customer signatures' },
  { id: 'payment', label: 'Payment Links', icon: CreditCard, desc: 'Send payment requests' },
  { id: 'navigate', label: 'Navigation', icon: Navigation, desc: 'One-tap directions' },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles, desc: 'Smart suggestions & automation' },
];

function BuildingBlocksSection() {
  return (
    <section
      className="relative w-full py-16 md:py-20 bg-gradient-to-b from-white via-zinc-50/50 to-white overflow-hidden"
      aria-labelledby="building-blocks-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-emerald-100 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-blue-100 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 id="building-blocks-heading" className="text-3xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Everything Your Field Team Needs
          </h2>
          <p className="mt-4 text-lg md:text-xl text-zinc-600 max-w-4xl mx-auto leading-relaxed">
            Mix and match these building blocks to build what you need.{' '}
            <span className="text-zinc-900 font-semibold">No developer required.</span>
          </p>
        </motion.div>

        {/* Building blocks in a flowing grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
          {AUTOMATION_BLOCKS.map((block, idx) => (
            <BuildingBlockCard key={block.id} block={block} delay={idx * 0.03} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BuildingBlockCard({ block, delay }: { block: AutomationBlock; delay: number }) {
  const Icon = block.icon;
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
      className="group relative"
    >
      {/* Hover glow effect */}
      <div className="absolute -inset-3 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

      <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-zinc-200/50 group-hover:border-emerald-300 group-hover:-translate-y-2">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="grid place-items-center h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 group-hover:from-emerald-100 group-hover:to-teal-100 transition-colors shadow-sm">
            <Icon className="h-8 w-8 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
          </div>
          <div>
            <div className="font-bold text-base text-zinc-900 mb-1">{block.label}</div>
            <div className="text-sm text-zinc-500 leading-tight">{block.desc}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ========================================
   SECTION 3: INDUSTRY EXAMPLES CAROUSEL
   ======================================== */

type IndustryColor = 'blue' | 'purple' | 'green' | 'orange' | 'teal';

type IndustryExample = {
  id: string;
  industry: string;
  workflow: string;
  problem: string;
  steps: JobStep[];
  saves: string;
  icon: LucideIcon;
  color: IndustryColor;
};

const INDUSTRY_EXAMPLES: IndustryExample[] = [
  {
    id: 'towing',
    industry: 'Towing & Booting',
    workflow: 'Receipt Documentation',
    problem: 'Drivers juggle paper receipts, lose them, or spend 10 min typing into QuickBooks',
    steps: [
      { label: 'Photo Capture', icon: Camera },
      { label: 'OCR Extract', icon: ScanText },
      { label: 'Upload to Accounting', icon: Database },
    ],
    saves: '8 min per receipt',
    icon: CreditCard,
    color: 'blue',
  },
  {
    id: 'cleaning',
    industry: 'Cleaning Services',
    workflow: 'Before/After Photo Proof',
    problem: 'Staff forgets to take photos, or they sit in camera roll forever',
    steps: [
      { label: 'Photo Capture', icon: Camera },
      { label: 'Location Tag', icon: MapPin },
      { label: 'SMS Client', icon: MessageSquare },
      { label: 'Add to Portfolio', icon: Folder },
    ],
    saves: '5 min per job',
    icon: Camera,
    color: 'purple',
  },
  {
    id: 'delivery',
    industry: 'Delivery & Logistics',
    workflow: 'Proof of Delivery',
    problem: 'Drivers manually text customers, lose signatures, late CRM updates',
    steps: [
      { label: 'Photo Capture', icon: Camera },
      { label: 'E-Signature', icon: FileCheck },
      { label: 'SMS Customer', icon: MessageSquare },
      { label: 'Update CRM', icon: Database },
    ],
    saves: '6 min per delivery',
    icon: CheckCircle2,
    color: 'green',
  },
  {
    id: 'hvac',
    industry: 'HVAC / Plumbing',
    workflow: 'Job Site Check-In',
    problem: 'Techs forget to log arrival, manager has no ETA visibility',
    steps: [
      { label: 'GPS Check-In', icon: MapPin },
      { label: 'SMS Customer', icon: MessageSquare },
      { label: 'Log Time', icon: Clock },
    ],
    saves: '4 min per visit',
    icon: MapPin,
    color: 'orange',
  },
  {
    id: 'landscaping',
    industry: 'Landscaping',
    workflow: 'Equipment Checklist',
    problem: 'Crews leave without tools, waste time going back',
    steps: [
      { label: 'Checklist Form', icon: ClipboardList },
      { label: 'Photo Load', icon: Camera },
      { label: 'Notify Manager', icon: Bell },
    ],
    saves: '10 min per job',
    icon: ClipboardList,
    color: 'teal',
  },
];

function IndustryExamplesSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const example = INDUSTRY_EXAMPLES[activeIdx];

  return (
    <section
      className="relative w-full py-16 md:py-24 overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-50"
      aria-labelledby="industry-examples-heading"
    >
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 id="industry-examples-heading" className="text-3xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
              Real-World Automation
            </h2>
            <p className="mt-3 text-base md:text-lg text-zinc-600 max-w-3xl mx-auto">
              See how businesses across industries save hours every day with automated workflows
            </p>
          </motion.div>
        </div>

        {/* Industry Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {INDUSTRY_EXAMPLES.map((ex, idx) => {
            const Icon = ex.icon;
            return (
              <button
                key={ex.id}
                onClick={() => setActiveIdx(idx)}
                className={`group flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                  idx === activeIdx
                    ? 'bg-zinc-900 text-white shadow-xl scale-105'
                    : 'bg-white text-zinc-600 hover:bg-zinc-100 shadow-md'
                }`}
              >
                <Icon className={`h-4 w-4 ${idx === activeIdx ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
                {ex.industry}
              </button>
            );
          })}
        </div>

        {/* Full-width split layout */}
        <AnimatePresence mode="wait">
          <IndustryShowcase key={example.id} example={example} />
        </AnimatePresence>
      </div>
    </section>
  );
}

function IndustryShowcase({ example }: { example: IndustryExample }) {
  const Icon = example.icon;
  const colorMap = {
    blue: { gradient: 'from-blue-500/10 via-blue-400/5 to-transparent', accent: 'bg-blue-500', icon: 'text-blue-600', glow: 'shadow-blue-500/50' },
    purple: { gradient: 'from-purple-500/10 via-purple-400/5 to-transparent', accent: 'bg-purple-500', icon: 'text-purple-600', glow: 'shadow-purple-500/50' },
    green: { gradient: 'from-emerald-500/10 via-emerald-400/5 to-transparent', accent: 'bg-emerald-500', icon: 'text-emerald-600', glow: 'shadow-emerald-500/50' },
    orange: { gradient: 'from-orange-500/10 via-orange-400/5 to-transparent', accent: 'bg-orange-500', icon: 'text-orange-600', glow: 'shadow-orange-500/50' },
    teal: { gradient: 'from-teal-500/10 via-teal-400/5 to-transparent', accent: 'bg-teal-500', icon: 'text-teal-600', glow: 'shadow-teal-500/50' },
  };
  const colors = colorMap[example.color as keyof typeof colorMap];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="grid md:grid-cols-2 gap-12 md:gap-20 items-center"
    >
      {/* LEFT: Problem */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="space-y-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-white text-xs font-bold mb-4 shadow-lg">
            <Icon className="h-4 w-4 text-emerald-400" />
            {example.workflow}
          </div>
          <h3 className="text-3xl md:text-5xl font-extrabold text-zinc-900 leading-tight tracking-tight">
            The Old Way
          </h3>
        </div>

        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
          <div className="relative bg-white/80 backdrop-blur rounded-2xl border-2 border-red-200/50 p-8 shadow-xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-red-100 grid place-items-center">
                <span className="text-2xl">❌</span>
              </div>
              <div>
                <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">THE PROBLEM</div>
                <p className="text-lg text-zinc-700 leading-relaxed font-medium">
                  {example.problem}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Time Savings Callout */}
        <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
          <div className="w-12 h-12 rounded-full bg-emerald-500 grid place-items-center text-2xl shadow-lg shadow-emerald-500/30">
            ⚡
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Automated Solution Saves</div>
            <div className="text-2xl font-extrabold text-emerald-700">{example.saves}</div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT: Automated Pipeline */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="space-y-8"
      >
        <div>
          <h3 className="text-3xl md:text-5xl font-extrabold text-zinc-900 leading-tight tracking-tight mb-3">
            The ForgeKit Way
          </h3>
          <p className="text-lg text-zinc-600">Automated in seconds</p>
        </div>

        {/* Pipeline Flow */}
        <div className={`relative rounded-3xl bg-gradient-to-br ${colors.gradient} p-8 md:p-12 backdrop-blur border border-zinc-200/50 shadow-2xl`}>
          {/* Pipeline Steps */}
          <div className="space-y-4">
            {example.steps.map((step, idx) => (
              <PipelineStepLarge key={idx} step={step} index={idx} isLast={idx === example.steps.length - 1} colors={colors} />
            ))}
          </div>

          {/* Success indicator */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: example.steps.length * 0.15 + 0.3, type: "spring" }}
            className="mt-6 flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm"
          >
            <CheckCircle2 className="h-5 w-5" />
            Complete — Ready in seconds
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PipelineStepLarge({
  step,
  index,
  isLast,
  colors
}: {
  step: JobStep;
  index: number;
  isLast: boolean;
  colors: { gradient: string; accent: string; icon: string; glow: string };
}) {
  const StepIcon = step.icon;
  return (
    <>
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: index * 0.15, type: "spring", stiffness: 200, damping: 20 }}
        className="relative group"
      >
        <div className={`absolute -inset-2 ${colors.accent} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity`} />
        <div className="relative flex items-center gap-4 bg-white rounded-2xl p-5 shadow-lg border border-zinc-200 hover:shadow-xl transition-shadow">
          <div className={`shrink-0 w-14 h-14 rounded-xl ${colors.accent} grid place-items-center shadow-lg ${colors.glow}`}>
            <StepIcon className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Step {index + 1}</div>
            <div className="text-lg font-bold text-zinc-900">{step.label}</div>
          </div>
          <div className="text-xs font-mono text-zinc-400">~{(index + 1) * 0.5}s</div>
        </div>
      </motion.div>

      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: index * 0.15 + 0.1, duration: 0.2 }}
          className="flex justify-center origin-top"
        >
          <div className="w-0.5 h-4 bg-gradient-to-b from-emerald-400 to-emerald-500 rounded-full" />
        </motion.div>
      )}
    </>
  );
}

/* ========================================
   SECTION 4: INTERACTIVE DEMO (Simplified from original)
   ======================================== */

type Staff = { id: string; name: string };

type JobColor = 'emerald' | 'sky' | 'amber' | 'purple' | 'rose';

type JobStep = {
  label: string;
  icon: LucideIcon;
};

type Job = {
  id: string;
  title: string;
  description: string;
  color: JobColor;
  steps: JobStep[];
};

function InteractiveDemoSection() {
  const staff: Staff[] = [
    { id: "mike", name: "Mike Davis" },
    { id: "ana", name: "Ana Lopez" },
  ];

  const [assigned, setAssigned] = useState<Record<string, Record<string, boolean>>>({
    checkin: {},
    submit: {},
    hours: {},
    receipt: {},
    sign: {},
  });

  const [selectedStaffId, setSelectedStaffId] = useState(staff[0].id);
  const [toast, setToast] = useState<{ msg: string; key: number } | null>(null);
  const [beamKey, setBeamKey] = useState(0);

  const jobs: Job[] = useMemo(
    () => [
      {
        id: "checkin",
        title: "Smart Check-In",
        description: "GPS check-in → SMS customer → log arrival",
        color: "emerald",
        steps: [
          { label: "GPS Check-In", icon: MapPin },
          { label: "SMS Customer", icon: MessageCircle },
          { label: "Log Arrival", icon: CheckCircle2 },
        ],
      },
      {
        id: "submit",
        title: "Job Photos",
        description: "Capture → OCR extract → upload to cloud",
        color: "sky",
        steps: [
          { label: "Capture Photo", icon: Image },
          { label: "OCR Extract", icon: ScanText },
          { label: "Cloud Upload", icon: Upload },
        ],
      },
      {
        id: "hours",
        title: "Log Hours",
        description: "Time entry → notify manager → sync CRM",
        color: "amber",
        steps: [
          { label: "Time Entry", icon: Clock },
          { label: "Notify Manager", icon: Phone },
          { label: "Sync CRM", icon: Smartphone },
        ],
      },
      {
        id: "receipt",
        title: "Receipt Upload",
        description: "Snap photo → OCR extract → sync accounting",
        color: "purple",
        steps: [
          { label: "Photo Receipt", icon: Camera },
          { label: "OCR Extract", icon: ScanText },
          { label: "Sync QuickBooks", icon: CreditCard },
        ],
      },
      {
        id: "sign",
        title: "Customer Signature",
        description: "E-signature → SMS receipt → update CRM",
        color: "rose",
        steps: [
          { label: "E-Signature", icon: FileText },
          { label: "SMS Receipt", icon: MessageSquare },
          { label: "Update CRM", icon: CheckCircle2 },
        ],
      },
    ],
    []
  );

  function toggleAssign(jobId: string) {
    const staffId = selectedStaffId;
    if (!staffId) return;
    setAssigned((prev) => {
      const next = { ...prev, [jobId]: { ...(prev[jobId] || {}) } };
      next[jobId][staffId] = !next[jobId][staffId];
      return next;
    });
    const crewName = staff.find((s) => s.id === staffId)?.name || "Crew";
    setToast({ msg: `Assigned to ${crewName}`, key: Date.now() });
    setTimeout(() => setToast(null), 1800);
  }

  const focusedStaff = staff.find((s) => s.id === selectedStaffId) || staff[0];
  const visibleJobs = jobs.filter((j) => assigned[j.id]?.[focusedStaff.id]);

  return (
    <section
      className="relative w-full py-16 md:py-24 bg-gradient-to-b from-white via-zinc-50/30 to-white overflow-hidden"
      aria-labelledby="interactive-demo-heading"
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-emerald-200 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-2 text-sm font-bold text-emerald-700">
            <PlayCircle className="h-5 w-5" />
            Interactive Demo
          </span>
          <h2 id="interactive-demo-heading" className="mt-4 text-3xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Try It: Assign Workflows to Your Team
          </h2>
          <p className="mt-4 text-lg md:text-xl text-zinc-600 max-w-4xl mx-auto leading-relaxed">
            Toggle workflows on the left, see them appear instantly in your staff&apos;s mobile app on the right.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative grid grid-cols-1 lg:grid-cols-[1.1fr,1fr] gap-8 lg:gap-16 items-start"
        >
          {/* LEFT */}
          <div className="relative space-y-5">
            <StaffSwitcher
              staff={staff}
              selectedId={selectedStaffId}
              onSelect={(id) => {
                setSelectedStaffId(id);
                setBeamKey((k) => k + 1);
              }}
              toast={toast}
            />

            {jobs.map((job) => (
              <JobToggleCard
                key={job.id}
                job={job}
                checked={!!assigned[job.id]?.[selectedStaffId]}
                onToggle={() => toggleAssign(job.id)}
              />
            ))}
          </div>

          {/* Beam effect */}
          <Beam key={beamKey} />

          {/* RIGHT - Phone */}
          <div className="flex items-center justify-center lg:justify-end">
            <div style={{ perspective: 1200 }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={focusedStaff.id}
                  initial={{ x: 80, opacity: 0, rotateY: 35, scale: 0.96 }}
                  animate={{ x: 0, opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ x: -80, opacity: 0, rotateY: -25, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className="relative"
                >
                  <PhoneMock employeeName={`Crew: ${focusedStaff.name}`}>
                    <LayoutGroup>
                      <AnimatePresence initial={false}>
                        {visibleJobs.map((job) => (
                          <JobCard key={job.id} job={job} />
                        ))}
                      </AnimatePresence>
                      {!visibleJobs.length && (
                        <div className="py-12 text-center text-zinc-400 text-sm">
                          Pick a workflow to see it appear instantly →
                        </div>
                      )}
                    </LayoutGroup>
                  </PhoneMock>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StaffSwitcher({
  staff,
  selectedId,
  onSelect,
  toast,
}: {
  staff: Staff[];
  selectedId: string;
  onSelect: (id: string) => void;
  toast: { msg: string; key: number } | null;
}) {
  return (
    <div className="relative rounded-2xl bg-white shadow-lg ring-1 ring-zinc-100 p-4 md:p-5">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-zinc-500">Staff:</span>
        <div className="flex flex-wrap gap-2">
          {staff.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
                selectedId === s.id
                  ? "bg-emerald-600 text-white border-emerald-700"
                  : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.key}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="ml-auto rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-3 py-1.5 text-xs font-bold shadow-lg flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function JobToggleCard({
  job,
  checked,
  onToggle,
}: {
  job: Job;
  checked: boolean;
  onToggle: () => void;
}) {
  const colorClasses: Record<JobColor, { bg: string; ring: string; icon: string }> = {
    emerald: { bg: 'bg-emerald-50', ring: 'ring-emerald-200', icon: 'text-emerald-600' },
    sky: { bg: 'bg-sky-50', ring: 'ring-sky-200', icon: 'text-sky-600' },
    amber: { bg: 'bg-amber-50', ring: 'ring-amber-200', icon: 'text-amber-600' },
    purple: { bg: 'bg-purple-50', ring: 'ring-purple-200', icon: 'text-purple-600' },
    rose: { bg: 'bg-rose-50', ring: 'ring-rose-200', icon: 'text-rose-600' },
  };

  const colors = colorClasses[job.color];

  return (
    <div className="group rounded-2xl bg-white shadow-lg ring-1 ring-zinc-100 p-4 md:p-5 hover:shadow-xl transition">
      <div className="flex items-center gap-4">
        <div className={`shrink-0 grid place-items-center h-12 w-12 rounded-xl ${colors.bg} ring-1 ${colors.ring}`}>
          <CubeIcon className={`h-6 w-6 ${colors.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-zinc-900">{job.title}</h3>
          <p className="text-sm text-zinc-500">{job.description}</p>
        </div>
        <ToggleSwitch
          checked={checked}
          onChange={onToggle}
          label={`${checked ? 'Disable' : 'Enable'} ${job.title} workflow`}
        />
      </div>
    </div>
  );
}

function HeroPhoneMock() {
  const heroJobs = [
    {
      id: "photos",
      title: "Job Photos",
      description: "Tap camera → auto-upload with metadata",
      color: "sky",
      steps: [
        { label: "Tap Camera", icon: Camera },
        { label: "Auto Upload", icon: Upload },
      ],
    },
    {
      id: "navigate",
      title: "Visit Client",
      description: "Tap client → GPS pulls address → opens maps",
      color: "emerald",
      steps: [
        { label: "Select Client", icon: User },
        { label: "Navigate", icon: Navigation },
      ],
    },
    {
      id: "complete",
      title: "Job Complete",
      description: "Tap Complete → boss notified → hours logged",
      color: "purple",
      steps: [
        { label: "Mark Complete", icon: CheckCircle2 },
        { label: "Notify & Log", icon: Phone },
      ],
    },
    {
      id: "receipt",
      title: "Receipt Scan",
      description: "Snap receipt → OCR → syncs to QuickBooks",
      color: "amber",
      steps: [
        { label: "Snap Receipt", icon: Camera },
        { label: "Sync Accounting", icon: CreditCard },
      ],
    },
  ];

  return (
    <div className="relative h-[500px] w-[280px]">
      {/* Phone Frame with realistic depth */}
      <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black shadow-2xl">
        {/* Volume buttons */}
        <div className="absolute left-0 top-[100px] w-1 h-8 bg-zinc-700 rounded-l-sm" />
        <div className="absolute left-0 top-[140px] w-1 h-12 bg-zinc-700 rounded-l-sm" />

        {/* Power button */}
        <div className="absolute right-0 top-[120px] w-1 h-16 bg-zinc-700 rounded-r-sm" />

        {/* Screen */}
        <div className="absolute inset-[10px] rounded-[32px] overflow-hidden bg-white">
          {/* Dynamic Island / Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-7 w-28 rounded-b-3xl bg-black z-50 flex items-center justify-center gap-2">
            <div className="w-14 h-1 bg-zinc-800 rounded-full" />
            <div className="w-2 h-2 bg-zinc-800 rounded-full" />
          </div>

          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-11 px-6 flex items-center justify-between text-[10px] font-semibold z-40 pt-2">
            <span className="text-zinc-900">9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-3" viewBox="0 0 16 12" fill="none">
                <path d="M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3V9C14 9.55228 13.5523 10 13 10H3C2.44772 10 2 9.55228 2 9V3Z" fill="currentColor" className="text-zinc-900"/>
                <rect x="14" y="4" width="1.5" height="4" rx="0.5" fill="currentColor" className="text-zinc-900 opacity-40"/>
              </svg>
              <span className="text-zinc-900">100%</span>
            </div>
          </div>

          {/* App Header */}
          <div className="absolute top-11 left-0 right-0 h-14 bg-gradient-to-r from-[#1e493d] via-[#25584b] to-[#2b6a5b] text-white px-4 flex items-center justify-between shadow-md">
            <div className="font-extrabold tracking-tight text-base">ForgeKit Crew</div>
            <div className="flex items-center gap-1.5 text-xs bg-white/10 rounded-full px-2.5 py-1 backdrop-blur-sm">
              <User className="h-3.5 w-3.5" />
              <span className="font-semibold">Mike Davis</span>
            </div>
          </div>

          {/* Content Area with gradient background */}
          <div className="absolute top-[100px] left-0 right-0 bottom-6 bg-gradient-to-b from-zinc-50 to-zinc-100 p-3 overflow-hidden">
            <div className="space-y-2.5 h-full overflow-y-auto no-scrollbar">
              {heroJobs.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + idx * 0.15, type: "spring" }}
                  className="relative group"
                >
                  {/* Card glow effect */}
                  <div className={`absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-md ${
                    job.color === "emerald" ? "bg-emerald-400/30" :
                    job.color === "sky" ? "bg-sky-400/30" :
                    job.color === "purple" ? "bg-purple-400/30" :
                    "bg-amber-400/30"
                  }`} />

                  <div className={`relative rounded-xl border-2 ${
                    job.color === "emerald" ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50" :
                    job.color === "sky" ? "border-sky-200 bg-gradient-to-br from-sky-50 to-sky-100/50" :
                    job.color === "purple" ? "border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50" :
                    "border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50"
                  } p-3 shadow-md backdrop-blur-sm`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`text-xs font-extrabold ${
                        job.color === "emerald" ? "text-emerald-800" :
                        job.color === "sky" ? "text-sky-800" :
                        job.color === "purple" ? "text-purple-800" :
                        "text-amber-800"
                      }`}>
                        {job.title}
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full ${
                        job.color === "emerald" ? "text-emerald-700 bg-emerald-200/50" :
                        job.color === "sky" ? "text-sky-700 bg-sky-200/50" :
                        job.color === "purple" ? "text-purple-700 bg-purple-200/50" :
                        "text-amber-700 bg-amber-200/50"
                      } font-bold`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        Active
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-600 mb-2 font-medium">{job.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {job.steps.slice(0, 2).map((s, i) => {
                        const StepIcon = s.icon;
                        return (
                          <span
                            key={i}
                            className={`inline-flex items-center gap-1 rounded-full ${
                              job.color === "emerald" ? "border-emerald-300 bg-emerald-100 text-emerald-900" :
                              job.color === "sky" ? "border-sky-300 bg-sky-100 text-sky-900" :
                              job.color === "purple" ? "border-purple-300 bg-purple-100 text-purple-900" :
                              "border-amber-300 bg-amber-100 text-amber-900"
                            } border px-2 py-0.5 text-[9px] font-semibold`}
                          >
                            <StepIcon className="h-2.5 w-2.5" /> {s.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-900 rounded-full opacity-60" />
        </div>

        {/* Screen reflection/glare effect */}
        <div className="absolute inset-[10px] rounded-[32px] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

function PhoneMock({ children, employeeName }: { children: React.ReactNode; employeeName: string }) {
  return (
    <div className="relative h-[640px] w-[340px] rounded-[36px] bg-zinc-900 shadow-2xl ring-8 ring-black/10">
      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-6 w-40 rounded-b-2xl bg-zinc-950" />
      <div className="absolute inset-[10px] rounded-[28px] overflow-hidden bg-zinc-50">
        <div className="h-16 bg-gradient-to-r from-[#1e493d] to-[#2b6a5b] text-white px-5 flex items-center justify-between">
          <div className="font-extrabold tracking-tight text-lg">ForgeKit Crew</div>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            <span className="font-semibold">{employeeName}</span>
          </div>
        </div>
        <div className="h-[calc(100%-4rem)] p-4 overflow-hidden">
          <div className="h-full overflow-y-auto space-y-3 pr-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const colorClasses: Record<JobColor, {
    card: string;
    title: string;
    status: string;
    badge: string;
  }> = {
    emerald: {
      card: 'border-emerald-200 bg-emerald-50',
      title: 'text-emerald-800',
      status: 'text-emerald-800',
      badge: 'border-emerald-200 bg-emerald-100 text-emerald-900',
    },
    sky: {
      card: 'border-sky-200 bg-sky-50',
      title: 'text-sky-800',
      status: 'text-sky-800',
      badge: 'border-sky-200 bg-sky-100 text-sky-900',
    },
    amber: {
      card: 'border-amber-200 bg-amber-50',
      title: 'text-amber-800',
      status: 'text-amber-800',
      badge: 'border-amber-200 bg-amber-100 text-amber-900',
    },
    purple: {
      card: 'border-purple-200 bg-purple-50',
      title: 'text-purple-800',
      status: 'text-purple-800',
      badge: 'border-purple-200 bg-purple-100 text-purple-900',
    },
    rose: {
      card: 'border-rose-200 bg-rose-50',
      title: 'text-rose-800',
      status: 'text-rose-800',
      badge: 'border-rose-200 bg-rose-100 text-rose-900',
    },
  };

  const colors = colorClasses[job.color];

  return (
    <motion.div
      layout
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 12, opacity: 0 }}
      className={`rounded-2xl border ${colors.card} p-3 shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div className={`text-[13px] font-extrabold ${colors.title}`}>{job.title}</div>
        <span className={`text-[11px] ${colors.status} opacity-80`}>Active</span>
      </div>
      <p className="mt-1 text-[12px] text-zinc-600">{job.description}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {job.steps.map((s, idx: number) => {
          const StepIcon = s.icon;
          return (
            <span
              key={idx}
              className={`inline-flex items-center gap-1 rounded-full border ${colors.badge} px-2.5 py-1 text-[11px] font-semibold`}
            >
              <StepIcon className="h-3.5 w-3.5" /> {s.label}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label || (checked ? 'Disable workflow' : 'Enable workflow')}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
        checked ? "bg-emerald-500" : "bg-zinc-300"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
        aria-hidden="true"
      />
    </button>
  );
}

function CubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M12 3v18" />
      <path d="M20 7.5l-8 4.5-8-4.5" />
    </svg>
  );
}

function Beam() {
  return (
    <motion.div
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: [-60, 40, 80, 140, 220], opacity: [0, 0.8, 1, 0.6, 0] }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="pointer-events-none absolute top-6 left-0 h-2 rounded-full hidden md:block"
      style={{
        width: "45%",
        background: "linear-gradient(90deg, rgba(16,185,129,0) 0%, rgba(16,185,129,0.55) 35%, rgba(16,185,129,0.15) 100%)",
      }}
    />
  );
}

/* ========================================
   SECTION 5: CUSTOM BUILDER TEASER + CTA
   ======================================== */

function CustomBuilderSection() {
  return (
    <section
      className="relative w-full py-20 md:py-32 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Dynamic background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 2px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute top-20 left-20 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-emerald-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '1.5s' }} />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12 text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Sparkles className="h-12 w-12 mx-auto mb-6 text-emerald-200" aria-hidden="true" />

          <h2 id="cta-heading" className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Build the Solution<br />You&apos;ve Been Imagining
          </h2>

          <p className="text-lg md:text-xl text-emerald-50 max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
            Whether it&apos;s receipt scanning, location tracking, photo workflows, or custom checklists –
            we&apos;ll help you automate the tasks eating your team&apos;s time.
          </p>

          {/* Mini workflow builder preview */}
          <div className="max-w-4xl mx-auto mb-10 rounded-3xl bg-white/10 backdrop-blur-md border-2 border-white/30 p-8 shadow-2xl">
            <div className="text-base font-bold text-emerald-100 mb-6 tracking-wider">BUILD IN MINUTES:</div>
            <div className="flex flex-wrap justify-center gap-4">
              {['Photo', 'OCR', 'Upload', 'Notify'].map((step, idx) => (
                <motion.div
                  key={step}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, type: "spring" }}
                  className="px-6 py-3 rounded-2xl bg-white text-emerald-700 font-bold text-lg flex items-center gap-3 shadow-xl"
                >
                  {idx > 0 && <ArrowRight className="h-5 w-5" />}
                  {step}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Early Access Email Capture */}
          <div className="mb-10">
            <EmailCaptureForm variant="cta" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-base text-emerald-50">
            <span className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-5 w-5" />
              Live in 24 hours
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-5 w-5" />
              Try it free
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-5 w-5" />
              Cancel anytime
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
