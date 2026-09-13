export const GUIDE_PDF = "/community-data-center/Community_Data_Center_Guide.pdf";
export const WORKSHEET_PDF = "/community-data-center/Community_Data_Center_Worksheet.pdf";
export const GUIDE_DOCX = "/community-data-center/Community_Data_Center_Guide.docx";
export const GUIDE_MARKDOWN = "/community-data-center/Community_Data_Center_Guide.md";
export const TOOLKIT_ZIP = "/Community_Data_Center_Toolkit.zip";

export const EDITION_LABEL = "US edition · September 12, 2026";

export type TopicIconKey =
  | "power"
  | "water"
  | "life"
  | "jobs"
  | "money"
  | "promises";

export interface Topic {
  id: string;
  number: string;
  icon: TopicIconKey;
  title: string;
  summary: string;
  askThis: string;
  lookFor: string[];
  lookCloser: string;
  deeper: string;
  worksheet?: string;
  extraLink?: { label: string; href: string };
}

export const topics: Topic[] = [
  {
    id: "power",
    number: "01",
    icon: "power",
    title: "Power & public costs",
    summary: "Who pays if the power demand never arrives?",
    askThis:
      "Which costs will this project create, who pays them, and what happens if it opens late or uses less power?",
    lookFor: [
      "An independent cost and ratepayer impact analysis.",
      "Written allocation of dedicated and shared upgrades.",
      "Applicable utility terms for minimum billing, cancellation, and financial backing.",
    ],
    lookCloser:
      "An affordability donation is offered without explaining who pays for the infrastructure.",
    deeper: "Guide: electricity and cost protection",
    worksheet: "Page 8",
  },
  {
    id: "water",
    number: "02",
    icon: "water",
    title: "Water & cooling",
    summary: "Plan for the hottest day, not just the average year.",
    askThis:
      "How much water is needed at peak demand, where does it come from, and what changes in a drought?",
    lookFor: [
      "Annual, peak-day, and peak-hour figures for each project phase.",
      "Separate figures for water withdrawn, water consumed, and discharge.",
      "Provider confirmation, metering, operating limits, and a workable drought plan.",
    ],
    lookCloser:
      "A phrase such as “closed loop” replaces a complete explanation of water use and heat removal.",
    deeper: "Guide: water supply and cooling",
    worksheet: "Page 9",
  },
  {
    id: "life",
    number: "03",
    icon: "life",
    title: "Life next door",
    summary: "Measure what neighbors will actually experience.",
    askThis:
      "What will people hear, breathe, and deal with during construction and full operation?",
    lookFor: [
      "Noise measurements and models that include homes, nighttime use, and generator testing.",
      "Air-permit review, lighting, road, dust, and construction plans.",
      "Emergency-service review and a clear complaint and correction process.",
    ],
    lookCloser:
      "A property-line average or a generic setback is treated as the whole neighborhood impact study.",
    deeper: "Guide: neighbors and emergency services",
    worksheet: "Page 10",
  },
  {
    id: "jobs",
    number: "04",
    icon: "jobs",
    title: "Jobs & local opportunity",
    summary: "Separate the construction rush from lasting jobs.",
    askThis:
      "How many ongoing jobs are there, what do they pay, and how can local people qualify?",
    lookFor: [
      "Construction job-years and permanent full-time equivalents reported separately.",
      "Defined wages, contractor roles, hiring dates, and what ‘local’ means.",
      "Funded training seats, a delivery partner, and reporting on placements and retention.",
    ],
    lookCloser:
      "Temporary and permanent roles are added into one impressive jobs number.",
    deeper: "Guide: jobs, training, and local suppliers",
  },
  {
    id: "money",
    number: "05",
    icon: "money",
    title: "Money that lasts",
    summary: "Follow the net value, not just the opening check.",
    askThis:
      "After incentives and public costs, what does each public body actually receive over time?",
    lookFor: [
      "Taxes and contractual payments after exemptions, abatements, and costs.",
      "A comparison with current use and realistic alternative development.",
      "Clear dates, recipients, escalation, and protection if later phases never open.",
    ],
    lookCloser:
      "Private construction spending is counted as public revenue, or the same reimbursement is counted twice.",
    deeper: "Guide: public value and financial comparison",
    worksheet: "Pages 5–6",
    extraLink: { label: "Try the offer comparison", href: "#money" },
  },
  {
    id: "promises",
    number: "06",
    icon: "promises",
    title: "Promises that hold up",
    summary: "A promise needs a payer, a deadline, and a remedy.",
    askThis:
      "Who owes what, who checks it, and what can happen if it is not delivered?",
    lookFor: [
      "A named responsible party, measurable obligation, date, reviewer, and controlling document.",
      "A capable beneficiary with enforcement rights and funded oversight.",
      "Financial backing and terms for sale, partial buildout, default, and closure.",
    ],
    lookCloser:
      "A company policy, famous logo, or advisory committee stands in for enforceable obligations.",
    deeper: "Guide: enforceable terms and oversight",
    worksheet: "Page 11",
  },
];

export interface DecoderExample {
  id: "jobs" | "water" | "investment" | "responsibility";
  label: string;
  statement: string;
  question: string;
  evidence: string;
}

export const decoderExamples: DecoderExample[] = [
  {
    id: "jobs",
    label: "Jobs",
    statement: "“This project will create hundreds of jobs.”",
    question:
      "How many are construction job-years, how many are ongoing full-time roles, and what are the wages and local hiring pathways?",
    evidence:
      "A staffing schedule separating construction, employees, and contractors; funded training commitments; placement reporting.",
  },
  {
    id: "water",
    label: "Water",
    statement: "“Our cooling system is water efficient.”",
    question:
      "What are total annual and peak-day withdrawals and consumption, and what happens during drought?",
    evidence:
      "A full water balance, provider confirmation, metered limits, and an operating drought plan.",
  },
  {
    id: "investment",
    label: "Investment",
    statement: "“We're investing billions in your community.”",
    question:
      "What does each public body collect after incentives, infrastructure, services, and monitoring costs?",
    evidence:
      "A year-by-year fiscal model with recipients, baseline, incentives, and downside cases.",
  },
  {
    id: "responsibility",
    label: "Responsibility",
    statement: "“You have our commitment to be a good neighbor.”",
    question:
      "Which entity signs, what exactly must it deliver, and who can enforce the commitment after a sale or closure?",
    evidence:
      "Executed obligations, monitoring and remedy provisions, and collectible financial backing.",
  },
];

export interface ChecklistItem {
  id: string;
  label: string;
  helper: string;
}

export const checklistItems: ChecklistItem[] = [
  {
    id: "responsible-parties",
    label: "Identify the responsible parties.",
    helper:
      "Name the landowner, developer, operator, proposed guarantor, and authorized signatories.",
  },
  {
    id: "decisions-deadlines",
    label: "Map the decisions and deadlines.",
    helper:
      "List what is requested, who has authority, existing rights, and actual filing or decision dates.",
  },
  {
    id: "affected-people",
    label: "Include the people affected.",
    helper:
      "Invite nearby residents and relevant community participants; identify Tribal governments and their distinct rights and processes where relevant.",
  },
  {
    id: "missing-evidence",
    label: "Request the missing evidence.",
    helper:
      "Track each claim as verified, developer supplied, estimated, or unknown; assign a reviewer and due date.",
  },
  {
    id: "public-value",
    label: "Separate public value from public costs.",
    helper:
      "Ask for receipts, incentives, infrastructure costs, ongoing costs, and a realistic baseline.",
  },
  {
    id: "plans-change",
    label: "Ask what happens if plans change.",
    helper:
      "Test delay, partial buildout, ownership change, default, and closure, with a responsible party for each protection.",
  },
];

export interface AgendaItem {
  time: string;
  activity: string;
}

export const agendaItems: AgendaItem[] = [
  {
    time: "15 min",
    activity:
      "Explain the project, the decision makers, and what remains unknown.",
  },
  {
    time: "20 min",
    activity: "Map affected people and choose priority outcomes.",
  },
  {
    time: "20 min",
    activity:
      "Review public costs and the evidence for the site's value.",
  },
  {
    time: "20 min",
    activity: "Choose key questions and unacceptable outcomes.",
  },
  {
    time: "15 min",
    activity: "Assign reviewers, deadlines, and the next meeting.",
  },
];

export interface Source {
  number: number;
  title: string;
  url: string;
  status: string;
}

export const sources: Source[] = [
  {
    number: 1,
    title: "Berkeley Lab — Speed to Power",
    url: "https://eta-publications.lbl.gov/sites/default/files/2026-06/lbnl_large_loads_speed_to_power_final_1.pdf",
    status: "Technical report",
  },
  {
    number: 2,
    title:
      "Berkeley Lab — US Data Center Energy and Water Modeling and Forecasting",
    url: "https://datacenters.lbl.gov/modeling-forecasting",
    status: "Forecasts",
  },
  {
    number: 3,
    title: "Virginia JLARC — Data Centers in Virginia",
    url: "https://jlarc.virginia.gov/landing-2024-data-centers-in-virginia.asp",
    status: "State research",
  },
  {
    number: 4,
    title: "AEP Ohio — Data Center Tariff",
    url: "https://www.aepohio.com/company/about/rates/data-center-tariff/",
    status: "Utility tariff resource",
  },
  {
    number: 5,
    title: "PUCO — AEP Ohio data center tariff order announcement",
    url: "https://content.govdelivery.com/accounts/OHPUC/bulletins/3e8bb79",
    status: "Regulator announcement",
  },
  {
    number: 6,
    title: "Microsoft — Building Community First AI Infrastructure",
    url: "https://blogs.microsoft.com/on-the-issues/2026/01/13/community-first-ai-infrastructure/",
    status: "Company announcement",
  },
  {
    number: 7,
    title: "Google — Arkansas investment and energy programs",
    url: "https://blog.google/company-news/inside-google/company-announcements/google-american-innovation-arkansas/",
    status: "Company announcement",
  },
  {
    number: 8,
    title: "City of St. Louis — permit and community benefit framework",
    url: "https://www.stlouis-mo.gov/government/departments/mayor/news/data-center-permit-approved.cfm",
    status: "City announcement",
  },
  {
    number: 9,
    title: "Supreme Court — Sheetz v. County of El Dorado",
    url: "https://www.supremecourt.gov/opinions/23pdf/22-1074_bqmd.pdf",
    status: "Court opinion",
  },
  {
    number: 10,
    title: "Columbia Sabin Center — Community Benefits Agreements Database",
    url: "https://climate.law.columbia.edu/content/community-benefits-agreements-database",
    status: "Agreement examples",
  },
  {
    number: 11,
    title:
      "Chester and Montgomery County Planning Commissions — Data Center Ordinance Guide",
    url: "https://www.chescoplanning.org/UandI/DataCenters/",
    status: "Planning resource",
  },
  {
    number: 12,
    title: "EPA — Clean Air Act Resources for Data Centers",
    url: "https://www.epa.gov/stationary-sources-air-pollution/clean-air-act-resources-data-centers",
    status: "Agency guidance",
  },
  {
    number: 13,
    title: "Texas Legislature — SB 6 enrolled text, 89th Legislature",
    url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00006F.htm",
    status: "Enrolled legislation",
  },
  {
    number: 14,
    title:
      "NACo — Informational Primer and County Considerations for Data Centers",
    url: "https://www.naco.org/resource/naco-informational-primer-and-county-considerations-data-centers",
    status: "County resource",
  },
];

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export const glossary: GlossaryTerm[] = [
  {
    term: "MW / MWh",
    definition:
      "MW measures power at a point in time. MWh measures energy over time. State whether a figure describes IT equipment, the whole facility, or utility imports.",
  },
  {
    term: "Full-time equivalent / job-year",
    definition:
      "A way to express ongoing staffing or one full-time year of work. Construction and permanent roles should be reported separately.",
  },
  {
    term: "Net present value",
    definition:
      "Future net cash flows translated into today's value using a stated discount rate.",
  },
  {
    term: "Abatement",
    definition:
      "A tax reduction. Its availability and effect depend on local law and the actual agreement.",
  },
  {
    term: "Financial security",
    definition:
      "Backing intended to make an obligation collectible, such as suitable collateral or a guarantee. The terms and responsible party matter.",
  },
  {
    term: "Stranded cost",
    definition:
      "Infrastructure or another committed cost left behind when the expected project use or payments do not arrive.",
  },
];

export interface StartingPoint {
  title: string;
  description: string;
  href: string;
}

export const startingPoints: StartingPoint[] = [
  {
    title: "Just hearing about it",
    description: "Get oriented and find your first questions.",
    href: "#basics",
  },
  {
    title: "Reviewing a proposal",
    description:
      "Look at impacts, costs, and what is actually promised.",
    href: "#priorities",
  },
  {
    title: "A decision is near",
    description:
      "Prepare the evidence and questions for the decision.",
    href: "#meeting",
  },
];

export interface PageNavItem {
  href: string;
  label: string;
}

export const pageNavItems: PageNavItem[] = [
  { href: "#basics", label: "The basics" },
  { href: "#priorities", label: "What matters" },
  { href: "#promises", label: "Decode a promise" },
  { href: "#money", label: "Follow the money" },
  { href: "#meeting", label: "Your next meeting" },
  { href: "#downloads", label: "Take the toolkit" },
];

export const OFFER_DOMAIN_MIN = -10;
export const OFFER_DOMAIN_MAX = 120;

const DISCOUNT_RATE = 0.04;

export interface OfferComparison {
  years: number;
  annuityFactor: number;
  offerA: number;
  offerB: number;
  difference: number;
}

export function clampYears(years: number): number {
  if (!Number.isFinite(years)) {
    return 20;
  }
  const rounded = Math.round(years);
  return Math.min(20, Math.max(1, rounded));
}

export function compareOffers(years: number): OfferComparison {
  const n = clampYears(years);
  const annuityFactor = (1 - Math.pow(1 + DISCOUNT_RATE, -n)) / DISCOUNT_RATE;
  const offerA = 2 * annuityFactor - 12 + 5;
  const offerB = 8 * annuityFactor + 2;
  const difference = offerB - offerA;
  return { years: n, annuityFactor, offerA, offerB, difference };
}
