export interface ProposalOption {
  id: string;
  label: string;
  price: number;
  effort: "Low" | "Medium" | "Medium to higher" | "Higher";
  summary: string;
  includes: string[];
  selectedByDefault?: boolean;
}

export interface ProposalSection {
  id: string;
  title: string;
  summary: string;
  bullets: string[];
}

export interface ProposalRecurringOption {
  id: string;
  label: string;
  price: number;
  period: "month" | "batch" | "event";
  summary: string;
  selectedByDefault?: boolean;
}

export interface ProposalThirdPartyCost {
  id: string;
  label: string;
  detail: string;
}

export interface ProposalConfig {
  id: string;
  title: string;
  clientName: string;
  clientNames: string[];
  senderName: string;
  senderEmail: string;
  introduction: string;
  baseOption: ProposalOption;
  sections: ProposalSection[];
  oneTimeOptions: ProposalOption[];
  recurringOptions: ProposalRecurringOption[];
  thirdPartyCosts: ProposalThirdPartyCost[];
  previewCaption: string;
  previewImage: string | null;
  previewDimensions: { width: number; height: number };
  closingNote: string;
}

export const PROPOSAL_CONFIG: ProposalConfig = {
  id: "southern-star-website-rebuild",
  title: "Southern Star website rebuild",
  clientName: "Southern Star",
  clientNames: ["Erica", "Taylor"],
  senderName: "Ryan Stefan",
  senderEmail: "ryan@dashwood.net",
  introduction:
    "Hi Erica and Taylor — I put this together as a simple way to review the Southern Star website rebuild. Choose what you want to discuss, leave notes or questions as you go, and send everything back to me. Nothing here is a payment or a commitment.",
  baseOption: {
    id: "astro-rebuild",
    label: "Complete Astro website rebuild",
    price: 120,
    effort: "Low",
    summary:
      "Rebuild the whole site into a fast, mobile-friendly experience and move it off Squarespace.",
    includes: [
      "Clean layouts, stronger typography, and better photo presentation",
      "Clearer venue, wedding, event, space, package, and contact pages",
      "Short inquiry forms that keep the existing tour scheduler connected",
      "On-site SEO, page redirects, sitemap, launch checks, and mobile testing",
    ],
    selectedByDefault: true,
  },
  sections: [
    {
      id: "design-content",
      title: "Design and content cleanup",
      summary: "A fresh look that makes the farm easier to explore.",
      bullets: [
        "Refresh the whole site with consistent layouts and mobile experience",
        "Reorganize venue, weddings, events, spaces, packages, photos, and contact details",
        "Tighten copy, remove repetition, and fix outdated details",
        "Bring useful brochure details into the pages where visitors need them",
      ],
    },
    {
      id: "build-migration",
      title: "Astro build and migration",
      summary: "Fast pages that remain simple to host and maintain.",
      bullets: [
        "Rebuild in Astro with optimized images and lightweight pages",
        "Move content and useful page addresses from Squarespace",
        "Redirect changed addresses so visitors and search engines land correctly",
        "Host the finished static site with a small PHP form handler",
      ],
    },
    {
      id: "inquiry-handling",
      title: "Inquiry handling",
      summary: "Make booking and questions effortless on a phone.",
      bullets: [
        "Make Book a Tour and Ask About Your Event easy to find",
        "Replace the long first inquiry with a short form",
        "Save inquiries and email them to Erica",
        "Keep the existing tour scheduler connected",
      ],
    },
    {
      id: "seo-launch",
      title: "SEO and launch checks",
      summary: "Get the new site found and launch with confidence.",
      bullets: [
        "Add page titles, descriptions, headings, image text, internal links, and a sitemap",
        "Check forms, links, mobile layouts, email delivery, and the farm order route",
        "Test the site before switching over from Squarespace",
      ],
    },
  ],
  oneTimeOptions: [
    {
      id: "branded-email-setup",
      label: "Branded email setup",
      price: 25,
      effort: "Low",
      summary: "Set up one branded mailbox and one sending provider with DNS and delivery checks.",
      includes: ["One branded mailbox", "One sending provider", "DNS setup and delivery checks"],
    },
    {
      id: "google-review-qr-kit",
      label: "Google review QR kit",
      price: 25,
      effort: "Low",
      summary: "Create a printable review prompt guests can scan after their visit.",
      includes: ["One printable card or sign design", "Direct review link", "Thank-you message"],
    },
    {
      id: "search-platform-setup",
      label: "Search platform setup",
      price: 35,
      effort: "Low",
      summary: "Connect Southern Star to Google and Bing search tools and update the business profile.",
      includes: [
        "Google Search Console connection",
        "Bing Webmaster Tools connection",
        "Sitemap submission",
        "Existing Google Business Profile update",
      ],
    },
    {
      id: "campaign-pages-tracking",
      label: "Campaign pages + tracking",
      price: 60,
      effort: "Medium",
      summary: "Track where inquiries come from and test a headline or call-to-action.",
      includes: [
        "Up to three targeted campaign pages",
        "Custom funnel tracking for visits, form starts, successful inquiries, and tour-link clicks",
        "Simple results report",
        "One A/B headline or CTA variant",
      ],
    },
    {
      id: "farm-preorder-wizard",
      label: "Farm preorder wizard",
      price: 60,
      effort: "Medium",
      summary: "Turn farm ordering into a guided, mobile-friendly flow.",
      includes: [
        "Guided ordering for up to 10 items",
        "Save progress and resume on the same browser or device",
        "Pickup choices, editable order summary, saved orders, and confirmation emails",
        "Mobile and submission checks",
      ],
    },
    {
      id: "simple-follow-ups",
      label: "Simple follow-ups",
      price: 75,
      effort: "Medium",
      summary: "Send useful follow-up emails without turning inbox checking into another job.",
      includes: [
        "Up to three timed email templates",
        "Manual pause and booked controls",
        "One review-request trigger",
      ],
    },
    {
      id: "lead-list-and-reminders",
      label: "Lead list and reminders",
      price: 125,
      effort: "Medium",
      summary: "Keep event leads organized with a private list and a daily reminder.",
      includes: [
        "Private lead list with contact details, event notes, and status",
        "Next-action dates",
        "Daily reminder email",
      ],
    },
    {
      id: "easy-content-updates",
      label: "Easy content updates",
      price: 150,
      effort: "Medium",
      summary: "Let Erica update photos, packages, FAQs, and stories without asking for help.",
      includes: [
        "Configuration of an existing editor",
        "Photos, packages, FAQs, and stories",
        "Publishing setup",
        "Brief walkthrough",
      ],
    },
    {
      id: "photos-into-marketing",
      label: "Photos into marketing",
      price: 200,
      effort: "Medium to higher",
      summary: "Turn event photos into approved website stories and social captions.",
      includes: [
        "Upload-and-notes workflow",
        "Draft story and social captions for approval",
        "Website publishing",
        "Three sample events",
      ],
    },
    {
      id: "business-data-marketing",
      label: "Business data marketing",
      price: 350,
      effort: "Higher",
      summary: "Analyze existing event records and turn recurring questions into useful content.",
      includes: [
        "One email export or selected folder",
        "One booking export",
        "Up to 100 event records",
        "Recurring-question analysis and verified statistics",
        "Three content drafts",
      ],
    },
  ],
  recurringOptions: [
    {
      id: "hosting-upkeep",
      label: "Hosting and basic upkeep",
      price: 15,
      period: "month",
      summary: "SSL, backups, and routine technical maintenance for this site.",
    },
    {
      id: "small-content-updates",
      label: "Small content changes",
      price: 20,
      period: "batch",
      summary: "Up to five text or photo changes in one batch.",
    },
    {
      id: "event-story-update",
      label: "Event story and gallery update",
      price: 25,
      period: "event",
      summary: "One event using supplied notes and up to 10 photos.",
    },
  ],
  thirdPartyCosts: [
    {
      id: "third-party-at-cost",
      label: "Third-party fees at cost",
      detail:
        "Domain renewal, mailbox or email-provider fees, paid editor plans, AI usage, retained shop fees, and printing are separate.",
    },
  ],
  previewCaption: "We can add a current Southern Star screenshot or design mockup here.",
  previewImage: null,
  previewDimensions: { width: 1200, height: 800 },
  closingNote:
    "Use the boxes and notes to tell me what interests you. Send feedback when you're ready and I'll follow up with next steps.",
};
