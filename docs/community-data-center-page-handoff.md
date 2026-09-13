# Community data center page — implementation handoff

Prepared September 12, 2026. This document is the deliverable for the planning task. Implement the page only when instructed to implement this handoff.

## 1. Build this

Add `/community-data-center/` to the existing Astro portfolio. Turn the supplied toolkit into a friendly, interactive community field guide. A reader should understand the central idea in one minute, explore a concern in five minutes, and leave with useful questions and the original worksheet.

The page is the guide itself. Its primary experience is reading and exploring useful material, with downloads available throughout.

**Audience:** residents, local officials, Tribal governments, public utilities, and community organizations assessing a proposed large data center in the US. Assume curiosity and little technical vocabulary. Preserve the distinction between those groups' authority.

**Editorial position:** help people evaluate evidence, costs, impacts, and commitments. Do not assume a project should be approved or opposed. Do not assign a project approval score.

**Visual thesis:** a contemporary civic field guide with bold chapter numbers, an ink-and-teal palette, warm highlight notes, and short interactive lessons. Make the experience inviting through clarity, discovery, and visible cause and effect.

### Finished scope

- One public, statically generated page.
- Three entry links for different stages of community review.
- A compact explanation of leverage, authority, and readiness.
- Six expandable topic cards.
- A promise decoder with four examples.
- An interactive timeline comparing the guide's two fictional offers.
- A six-item meeting preparation checklist with a printable version.
- Original document downloads and a source directory.
- One discovery link on the Projects page and one sitemap entry.

Keep implementation bounded: no login, backend, AI chat, project database, user uploads, email collection, remote persistence, live market data, new dependencies, or automated approval recommendations. Do not edit or regenerate the original documents. Do not deploy, commit, or change hosting as part of implementation unless that is separately requested.

## 2. Repository facts and source of truth

Repository: `/home/ryan/Production/my-portfolio`.

- This is an Astro static export with React islands, not Next.js.
- Routes are in `pages/`, not `src/pages/` or `app/`.
- React components are in `components/`; new modules must use TypeScript.
- Use the existing `layouts/BaseLayout.astro` with its default navigation and footer.
- The primary navigation is fixed and 64px tall. Account for it in top padding and anchor offsets.
- Shared semantic tokens live in `styles/globals.css`; Tailwind exposes `brand`, `accent`, `highlight`, `success`, `warning`, and `danger` scales.
- Nunito is already loaded by BaseLayout. Use it; add no font downloads.
- `lucide-react`, React, and Tailwind are installed. Use them without adding an icon or component package.
- `pages/sitemap.xml.ts` has an explicit `staticRoutes` array.
- The existing Projects page is `pages/projects.astro`, with inline project data. There is no `ProjectsPage.tsx` to modify.
- There is no `.openai/hosting.json`. Preserve the existing nginx/Apache static hosting architecture and PHP contact endpoint.
- `dist/` is generated and gitignored. Never edit it manually.
- At planning time, the supplied ZIP was untracked. Preserve it and all unrelated changes.

### Supplied material

`public/Community_Data_Center_Toolkit.zip` contains:

| Filename | Purpose |
| --- | --- |
| `START_HERE.txt` | Reading routes, worksheet instructions, adaptation guidance |
| `Community_Data_Center_Guide.md` | Full guide and 14 numbered source links; canonical text for adaptation |
| `Community_Data_Center_Guide.pdf` | Shareable guide; described by the package as 26 pages |
| `Community_Data_Center_Guide.docx` | Editable Word guide |
| `Community_Data_Center_Worksheet.pdf` | Printable and fillable worksheet; described as 12 pages and 158 fields |

The supplied edition is dated September 12, 2026. This handoff adapts supplied content; it does not independently verify the guide's legal claims or dated external examples. Keep dated source descriptions attributed to the supplied edition. Do not label this page's sources “verified today.” If adding current legal, tariff, policy, or company claims beyond this handoff, first verify them against primary sources and record the verification date.

Inspect ZIP members before extraction. Extract only the five known files to `public/community-data-center/`, preserving their filenames and bytes. Keep the original ZIP at its current path. Do not use a ZIP library in the browser or read the ZIP at runtime.

## 3. Page map and wireframes

The site navigation and footer remain. The page has six numbered chapters after its opening. Keep the number of top-level sections fixed; deeper material lives inside disclosure panels or downloads.

| Position | Anchor | Navigation label | Heading |
| --- | --- | --- | --- |
| Opening | `#start` | — | A data center is coming. What should your community ask? |
| 01 | `#basics` | The basics | Start with three questions. |
| 02 | `#priorities` | What matters | Six things worth getting right. |
| 03 | `#promises` | Decode a promise | Sounds good. What does it actually mean? |
| 04 | `#money` | Follow the money | The biggest check isn't always the best deal. |
| 05 | `#meeting` | Your next meeting | Walk in with better questions. |
| 06 | `#downloads` | Take the toolkit | Take it to the table. |

### Desktop sketch, approximately 1440px wide

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Ryan Stefan                       Home   Projects   Blog   Contact      │
├──────────────────────────────────────────────────────────────────────────┤
│                       COMMUNITY FIELD GUIDE                              │
│                                                                          │
│ A data center is coming.          ┌─ THE WHOLE IDEA ──────────────────┐  │
│ What should your                  │ Know what they need.             │  │
│ community ask?                    │ Know what it costs you.          │  │
│                                  │ Get the promises in writing.      │  │
│ Clear questions. Real protections.│                                  │  │
│ A practical place to start.       │ Before discretionary concessions │  │
│                                  │ or public assets are committed.  │  │
│ [Find your starting point ↓]      └──────────────────────────────────┘  │
│ [Download the toolkit ↓]           US edition · September 12, 2026      │
│                                                                          │
│ START WHERE YOU ARE                                                      │
│ [Just hearing about it →] [Reviewing a proposal →] [A decision is near →] │
├──────────────────────────────────────────────────────────────────────────┤
│ The basics · What matters · Decode a promise · Follow the money · ...    │
├──────────────────────────────────────────────────────────────────────────┤
│ 01   Start with three questions.                                         │
│      [Why here?]     [Who controls what?]     [Is it ready?]              │
│      Three separate lanes: Rules | Commercial terms | Community benefits│
│                                                                          │
│ 02   Six things worth getting right.                                    │
│      [01 Power & public costs   +] [02 Water & cooling            +]     │
│      [03 Life next door         +] [04 Jobs & local opportunity   +]     │
│      [05 Money that lasts       +] [06 Promises that hold up      +]     │
│                                                                          │
│ ┌─ 03  SOUNDS GOOD. WHAT DOES IT ACTUALLY MEAN? ──────────────────────┐  │
│ │ [Jobs] [Water] [Investment] [Responsibility]                         │  │
│ │ “This project will create hundreds of jobs.”                       │  │
│ │ [Show the better question ↓]                                       │  │
│ │ ↓ Plain-English question + evidence to request                     │  │
│ └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│ 04   The biggest check isn't always the best deal.                      │
│      FICTIONAL EXAMPLE · ALL AMOUNTS IN TODAY'S DOLLARS                  │
│      Years included: 20     1 ────────────────● 20                       │
│      Offer A  [===========]                         $20.18m              │
│      Offer B  [===================================] $110.72m             │
│      [How these numbers work +]                                         │
│                                                                          │
│ 05   Walk in with better questions.                                     │
│      [ ] Who is responsible?              ┌─ FIRST 90 MINUTES ──────┐  │
│      [ ] What needs our decision?          │ 15 min · Orient         │  │
│      ...                                  │ 20 min · Priorities      │  │
│      0 of 6 topics prepared               │ ...                      │  │
│      [Print meeting sheet]                 └────────────────────────┘  │
│      BEFORE THE DECISION: Authority · Impacts · Public costs · Enforcement│
│                                                                          │
│ 06   Take it to the table.                                              │
│      [Download everything · ZIP]                                        │
│      [Read the guide · PDF] [Fillable worksheet · PDF] [Editable files]  │
│      [Terms in plain English +] [Sources & edition notes +]              │
├──────────────────────────────────────────────────────────────────────────┤
│ Existing site footer                                                    │
└──────────────────────────────────────────────────────────────────────────┘
```

The drawing is organizational, not a request to squeeze all of this onto one screen. At a 1440×900 viewport, the opening and starting-point links should be visible without a tall blank hero.

### Mobile sketch, approximately 390px wide

```text
┌──────────────────────────────────┐
│ Ryan Stefan                 Menu │
├──────────────────────────────────┤
│ COMMUNITY FIELD GUIDE            │
│ A data center is coming.         │
│ What should your community ask?  │
│ Short introduction               │
│ [Find your starting point ↓]     │
│ Download the toolkit ↓           │
│ ┌─ THE WHOLE IDEA ─────────────┐ │
│ │ Three short lines + context │ │
│ └─────────────────────────────┘ │
│ [Just hearing about it       →] │
│ [Reviewing a proposal        →] │
│ [A decision is near          →] │
│ On this page [Jump to…       ▾] │
├──────────────────────────────────┤
│ 01  Start with three questions.  │
│ Three stacked explanations       │
│ 02  Six things worth…            │
│ [01 Power & public costs      +] │
│ [02 Water & cooling           +] │
│ ...                              │
│ Promise decoder                  │
│ [Jobs] [Water]                    │
│ [Investment] [Responsibility]    │
│ Claim, reveal, evidence           │
│ Money explorer                   │
│ Full-width slider                │
│ Two stacked results              │
│ Checklist, then workshop agenda  │
│ Download links, then references  │
└──────────────────────────────────┘
```

Mobile is a single column. No horizontal page scroll, tiny diagram labels, clipped controls, fixed bottom toolbar, or horizontally scrolling topic cards.

## 4. Visual specification

### Palette and typography

Reuse existing token values; do not change global RGB values and accidentally recolor the portfolio.

| Use | Existing token or value |
| --- | --- |
| Page background, cards | White |
| Main ink, chapter headings | `brand-950` |
| Secondary readable copy | `accent-700` |
| Primary buttons, links | `brand-700`; white button text |
| Subtle panels | `brand-50` |
| Borders | `brand-200` |
| Field-note surface | `highlight-100`; `highlight-950` text |
| Promise decoder | `accent-950`; white text; `brand-200` highlights |
| “Evidence to request” accent | `success-700` on `success-50` |
| Caution / unresolved issue | `warning-100` with `warning-900` text and a text label |
| Offer A / Offer B graphic | `accent-400` / `brand-600`, both directly labeled |

Use Nunito for all text. H1: weight 900, approximately `clamp(2.4rem, 4.7vw, 4.5rem)`, line-height 1.06, modest negative letter spacing. H2: 30–40px desktop and 28–32px mobile. Main body: 18px/1.65; disclosure body: 16px/1.65. Standard labels: at least 14px. Edition metadata may be 13px. Use tabular numerals for money and progress values.

### Layout and shape

- Main content width: 1160px; horizontal gutters 24px desktop and 20px mobile.
- Main top padding: 112px desktop, 96px mobile, including space for the site nav.
- Hero columns: roughly 60/40 with a 40px gap; stack below 900px.
- Between chapters: 72px desktop, 48px mobile. Override the existing global `section` spacing inside `.community-toolkit` so padding does not double.
- Card padding: 24px desktop, 20px mobile. Radius: 20px for panels, 12px for controls. Use thin borders and restrained shadows.
- Big chapter numbers sit left of the heading on desktop and above it on narrow screens. They are decoration, not a replacement for heading text.
- Starting-point links use a simple outlined three-column row; one column on mobile.
- Topic cards use two columns at 900px and above. Opening one may make that grid row taller; align the neighboring card to its top. Do not introduce masonry or absolute positioning.
- Limit paragraphs to roughly 65–72 characters per line where practical.
- Page navigation is sticky below the site's 64px navigation only at desktop widths. Give it an opaque white background. On mobile use an in-flow native `<details>` titled “On this page” containing anchor links; do not add a second sticky layer.
- All chapter anchor targets get `scroll-margin-top: 140px` desktop and `88px` mobile.

### Where the fun comes from

1. Numbered chapters make the guide feel manageable.
2. The reader opens the concern they actually have.
3. The promise decoder reveals a better question with one click.
4. The timeline makes upfront money versus recurring value tangible.
5. A quiet checklist progress indicator makes meeting preparation feel achievable.

Use Lucide icons: `Zap`, `Droplets`, `House`, `BriefcaseBusiness`, `Coins`, `ShieldCheck`, `ArrowDown`, `ArrowUpRight`, `Download`, `ChevronDown`, `Check`, and `Printer`. Verify exports against the installed package before using them. Icons are supplementary and `aria-hidden` when paired with text.

No image generation or stock photography is required. Typography, icons, and the financial visualization carry this page. No mascots, confetti, points, competitive badges, flip-card animations, parallax, autoplay carousels, or jokes about affected residents. Animate only button feedback, disclosure chevrons, and chart changes over 150–200ms. Respect reduced motion, including overriding the global smooth scrolling for this route when requested by the OS.

## 5. Exact opening content

Eyebrow: **COMMUNITY FIELD GUIDE**

H1: **A data center is coming. What should your community ask?**

Intro: “Clear questions. Real protections. A practical place to start when a large data center is proposed near you.”

Primary link: **Find your starting point** → `#starting-points`.

Secondary link: **Download the toolkit** → `/Community_Data_Center_Toolkit.zip`, with `download`.

Field note heading: **The whole idea**

Three separate lines:

> Know what they need.
> Know what it costs you.
> Get the promises in writing.

Field note supporting sentence: “Work out the essential protections before discretionary concessions or public assets are committed.”

Edition line: **US edition · September 12, 2026**

Starting-point row, `id="starting-points"`, heading **Start where you are**:

| Link heading | Supporting text | Destination |
| --- | --- | --- |
| Just hearing about it | Get oriented and find your first questions. | `#basics` |
| Reviewing a proposal | Look at impacts, costs, and what is actually promised. | `#priorities` |
| A decision is near | Prepare the evidence and questions for the decision. | `#meeting` |

These are ordinary anchor links. They never hide sections, set a persona, or create a wizard.

## 6. Chapter 01 — the basics

Heading: **Start with three questions.**

Intro: “A useful deal starts with evidence about the site, the decision, and the people behind the project.”

Render three equal cards with the following text:

| Heading | Explanation | Question to ask |
| --- | --- | --- |
| Why here? | A useful site can combine power, land, water, fiber, and timing. An advantage matters only if the project actually needs it. | “What can this site deliver that your other realistic options cannot?” |
| Who controls what? | Residents, landowners, local governments, utilities, regulators, and Tribal governments have different roles. Identify the authorized party for each decision. | “Which specific asset, agreement, or approval do you need, and who controls it?” |
| Is it ready? | A proposal needs credible land control, financing, an operator, and a utility path. A strong site alone does not make a funded project. | “What evidence supports your financing, operator commitment, and service date?” |

Below, a native disclosure titled **Keep three different conversations separate**. Inside:

- **Rules and protections:** legally supportable requirements for project impacts and public health.
- **Commercial terms:** terms for land, utility service, or authorized discretionary incentives.
- **Community benefits:** separately negotiated commitments through a capable, authorized party.

Closing sentence: “Putting an ask in a separate agreement or calling it voluntary does not automatically make it lawful. Have local counsel confirm authority and the appropriate instrument.”

Small note: “These are separate questions, not points to add together. Missing authority or an unready project cannot be fixed by a high score elsewhere.”

Source reference: supplied guide topics “Verify what makes your site valuable” and “Map who can actually make the deal”; worksheet pages 1–4. The authority map must retain Tribal governments as distinct sovereign participants, not ordinary neighborhood groups.

## 7. Chapter 02 — six priorities

Heading: **Six things worth getting right.**

Intro: “Pick a topic. Get the question, the evidence to request, and a promise worth looking at more closely.”

Use six native `<details>` cards. All start closed; multiple may remain open. The entire summary row is clickable, keyboard operable, and includes the number, icon, heading, one-sentence summary, and chevron. No nested buttons inside `<summary>`.

Expanded content always follows this sequence: **Ask this**, **Look for**, **Look closer when**, **Go deeper**. Use the copy below. All “Go deeper” links open the original guide PDF in the same tab and name the relevant topic. Do not invent PDF page fragments for topics without verified page numbers.

### 01 · Power & public costs

Summary: “Who pays if the power demand never arrives?”

Ask this: “Which costs will this project create, who pays them, and what happens if it opens late or uses less power?”

Look for:

- An independent cost and ratepayer impact analysis.
- Written allocation of dedicated and shared upgrades.
- Applicable utility terms for minimum billing, cancellation, and financial backing.

Look closer when: “An affordability donation is offered without explaining who pays for the infrastructure.”

Go deeper: **Guide: electricity and cost protection**. Worksheet reference: **Page 8**.

### 02 · Water & cooling

Summary: “Plan for the hottest day, not just the average year.”

Ask this: “How much water is needed at peak demand, where does it come from, and what changes in a drought?”

Look for:

- Annual, peak-day, and peak-hour figures for each project phase.
- Separate figures for water withdrawn, water consumed, and discharge.
- Provider confirmation, metering, operating limits, and a workable drought plan.

Look closer when: “A phrase such as ‘closed loop’ replaces a complete explanation of water use and heat removal.”

Go deeper: **Guide: water supply and cooling**. Worksheet reference: **Page 9**.

### 03 · Life next door

Summary: “Measure what neighbors will actually experience.”

Ask this: “What will people hear, breathe, and deal with during construction and full operation?”

Look for:

- Noise measurements and models that include homes, nighttime use, and generator testing.
- Air-permit review, lighting, road, dust, and construction plans.
- Emergency-service review and a clear complaint and correction process.

Look closer when: “A property-line average or a generic setback is treated as the whole neighborhood impact study.”

Go deeper: **Guide: neighbors and emergency services**. Worksheet reference: **Page 10**.

### 04 · Jobs & local opportunity

Summary: “Separate the construction rush from lasting jobs.”

Ask this: “How many ongoing jobs are there, what do they pay, and how can local people qualify?”

Look for:

- Construction job-years and permanent full-time equivalents reported separately.
- Defined wages, contractor roles, hiring dates, and what ‘local’ means.
- Funded training seats, a delivery partner, and reporting on placements and retention.

Look closer when: “Temporary and permanent roles are added into one impressive jobs number.”

Go deeper: **Guide: jobs, training, and local suppliers**. Do not attach an unverified worksheet page number to this topic.

### 05 · Money that lasts

Summary: “Follow the net value, not just the opening check.”

Ask this: “After incentives and public costs, what does each public body actually receive over time?”

Look for:

- Taxes and contractual payments after exemptions, abatements, and costs.
- A comparison with current use and realistic alternative development.
- Clear dates, recipients, escalation, and protection if later phases never open.

Look closer when: “Private construction spending is counted as public revenue, or the same reimbursement is counted twice.”

Go deeper: **Guide: public value and financial comparison**. Worksheet reference: **Pages 5–6**. Also provide an inline **Try the offer comparison** link to `#money`.

### 06 · Promises that hold up

Summary: “A promise needs a payer, a deadline, and a remedy.”

Ask this: “Who owes what, who checks it, and what can happen if it is not delivered?”

Look for:

- A named responsible party, measurable obligation, date, reviewer, and controlling document.
- A capable beneficiary with enforcement rights and funded oversight.
- Financial backing and terms for sale, partial buildout, default, and closure.

Look closer when: “A company policy, famous logo, or advisory committee stands in for enforceable obligations.”

Go deeper: **Guide: enforceable terms and oversight**. Worksheet reference: **Page 11**.

## 8. Chapter 03 — promise decoder

Heading: **Sounds good. What does it actually mean?**

Intro: “An announcement is a starting point. Turn it into a question someone can answer with evidence.”

Use a dark full-width panel. Mark all examples **Illustrative statements**, not quotes from real companies. Implement one React island with four native radio inputs styled as segmented choices. Use a `<fieldset>` and visible legend **Choose a promise to unpack**. Native radios supply arrow-key behavior; avoid inventing a partial ARIA tabs implementation.

Default: Jobs selected; answer closed. Render all four example articles in server HTML, then select the active article after hydration. With JavaScript disabled, display all four articles with native answer disclosures. Do not ship a no-JavaScript dead end.

| Choice | Illustrative statement | Better question | Evidence to request |
| --- | --- | --- | --- |
| Jobs | “This project will create hundreds of jobs.” | “How many are construction job-years, how many are ongoing full-time roles, and what are the wages and local hiring pathways?” | A staffing schedule separating construction, employees, and contractors; funded training commitments; placement reporting. |
| Water | “Our cooling system is water efficient.” | “What are total annual and peak-day withdrawals and consumption, and what happens during drought?” | A full water balance, provider confirmation, metered limits, and an operating drought plan. |
| Investment | “We're investing billions in your community.” | “What does each public body collect after incentives, infrastructure, services, and monitoring costs?” | A year-by-year fiscal model with recipients, baseline, incentives, and downside cases. |
| Responsibility | “You have our commitment to be a good neighbor.” | “Which entity signs, what exactly must it deliver, and who can enforce the commitment after a sale or closure?” | Executed obligations, monitoring and remedy provisions, and collectible financial backing. |

Interaction contract:

1. Choosing a radio changes the displayed statement and resets its answer disclosure to closed.
2. The answer disclosure summary reads **Show the better question** when closed and **Hide the better question** when open.
3. The revealed area contains the better question followed by a labeled evidence block. It must work on touch and keyboard without hover.
4. Selection does not scroll, steal focus, change the URL, or load anything from a server.
5. Use a short polite live announcement for a selection change, such as “Water example selected.” Do not announce the whole panel repeatedly.
6. Height changes remain in document flow. Do not overlay answers or use a fixed height that clips long text.

There is no quiz score, answer timer, randomization, next-step gate, or implication that an illustrative claim is false.

## 9. Chapter 04 — offer explorer

Heading: **The biggest check isn't always the best deal.**

Intro: “Move the timeline to see how recurring value and public costs change the comparison.”

Always-visible label: **Fictional example from the toolkit · Not market rates or a valuation of a real project**.

Use the source guide's exact simplified comparison. This is an educational timeline, not a configurable financial-advice calculator. The only editable input is the number of operating years included.

### Inputs and calculation

| Item, millions of constant dollars | Offer A | Offer B |
| --- | ---: | ---: |
| Annual taxes before discretionary abatement | 8.00 | 8.00 |
| Annual abatement, deducted | 5.00 | 0.00 |
| Annual contractual benefit | 0.50 | 1.50 |
| Annual services and monitoring, deducted | 1.50 | 1.50 |
| Annual net recurring value | 2.00 | 8.00 |
| Unreimbursed public capital at year zero, deducted | 12.00 | 0.00 |
| One-time benefit at year zero | 5.00 | 2.00 |

For integer horizon `n`, from 1 through 20, at a fixed 4% real discount rate:

```ts
const annuityFactor = (1 - Math.pow(1.04, -n)) / 0.04;
const offerA = 2 * annuityFactor - 12 + 5;
const offerB = 8 * annuityFactor + 2;
const difference = offerB - offerA;
```

All values are in millions. Keep full precision for calculations; round only display values to two decimals. Clamp and validate horizon to integer 1–20. Default to 20 on both server and client to avoid hydration mismatch.

Display:

- Native range input labeled **Years of operation included**, min 1, max 20, step 1, default 20; current year value appears next to the label.
- Small endpoint labels **1 year** and **20 years**.
- Always-visible Offer A and Offer B numeric results, with direct text labels and **Value in today's dollars**.
- A two-row diverging horizontal bar graphic: negative values extend left of a visible zero line; positive values extend right.
- Fixed shared domain of **−10 to 120 million** across both bars and all horizons. Never resize each bar against its own maximum or hide negative values.
- Tick labels at −10, 0, 60, and 120 million if there is room; on narrow screens use only the zero marker and directly labeled values outside the plot. No tiny labels.
- Sentence: **Over {n} years, Offer B has ${difference} million more net present value under these assumptions.**
- Plain-English note: “The larger opening payment in Offer A comes with a public capital cost and lower recurring value. Both offers still need comparison with current use and other realistic options.”

Use normal React/CSS geometry or a small SVG for this actual data visualization. No chart dependency is necessary. Treat the plot as decorative with `aria-hidden="true"` because the labeled numbers and accessible data table carry the same information. Use `aria-valuetext` on the slider, such as “20 years of operation.” Put a concise result summary in a polite `role="status"` region; debounce announcements by about 250ms during dragging while updating the visible values immediately. Clear the timer on unmount.

### Disclosure: “How these numbers work”

Include the full input table above and these assumptions:

“This example describes a fictional 100 MW project for one local government. It assumes end-of-year payments, a 4% real discount rate, constant dollars, no terminal value, the same project impacts under each offer, and authority to receive the stated payments. The original guide compares 20 operating years; this explorer also shows shorter horizons using the same simplified inputs.”

Then define: “Net present value translates future net payments into today's value using a stated discount rate.”

Then: “Real assessment values, exemptions, construction dates, and project phases change. Replace simplified inputs with a reviewed local model before evaluating an actual offer.”

Outside the disclosure, keep this sentence visible: **A larger financial benefit does not resolve unacceptable impacts or missing legal authority.**

### Required numeric checks

| Horizon | Offer A | Offer B | Difference |
| --- | ---: | ---: | ---: |
| 1 year | −$5.08m | $9.69m | $14.77m |
| 20 years | $20.18m | $110.72m | $90.54m |

The 20-year annuity factor is approximately 13.590326. Formatting must place the minus sign before the currency symbol. The graphic must show A left of zero at year 1. The zero line must not move as the user changes years.

With JavaScript disabled, show the default 20-year result, assumptions, and table; hide the nonfunctional slider using enhancement state. Do not hide the comparison.

## 10. Chapter 05 — meeting preparation

Heading: **Walk in with better questions.**

Intro: “Use these six prompts to prepare an agenda. Keep the evidence and detailed notes in the companion worksheet.”

### Checklist

Six native checkboxes with the following visible labels and helper text:

| Label | Helper text |
| --- | --- |
| Identify the responsible parties. | Name the landowner, developer, operator, proposed guarantor, and authorized signatories. |
| Map the decisions and deadlines. | List what is requested, who has authority, existing rights, and actual filing or decision dates. |
| Include the people affected. | Invite nearby residents and relevant community participants; identify Tribal governments and their distinct rights and processes where relevant. |
| Request the missing evidence. | Track each claim as verified, developer supplied, estimated, or unknown; assign a reviewer and due date. |
| Separate public value from public costs. | Ask for receipts, incentives, infrastructure costs, ongoing costs, and a realistic baseline. |
| Ask what happens if plans change. | Test delay, partial buildout, ownership change, default, and closure, with a responsible party for each protection. |

Under checklist: **{count} of 6 topics prepared** and a small progress bar. Initial count 0. Checking/unchecking updates count immediately. Labels must toggle inputs. Completion copy at 6: **Your meeting outline is ready. Bring the worksheet and record what is still unknown.**

Always-visible note: **This tracks preparation, not whether a project is ready for approval. Selections last until you reload or leave this page.**

Do not persist checklist state, send events containing selections, request project details, or add text fields. State belongs only to this island. No cross-section score.

Buttons: **Print meeting sheet** and **Open the fillable worksheet**. Worksheet link points to the extracted original PDF. Printing is user-triggered; never open the print dialog on mount or completion.

### Print behavior

Use a dedicated static print region outside the interactive component, generated from the same shared checklist data. Browser printing shows that region only, with:

- “Community data center — meeting preparation” title.
- Blank lines for project, meeting date, and next meeting.
- All six prompts with empty printed checkboxes and writing space, regardless of current web selections.
- The 90-minute agenda below.
- A reminder to record source, status, reviewer, and next action for each unresolved claim.
- Edition, canonical page URL, and toolkit guidance note.

Name the button **Print meeting sheet** rather than “Print my progress” so blank checkboxes are expected. Aim for two readable pages at Letter and A4, with no clipped text. Allow a third page under larger text settings. Screen hides the print region; print hides site navigation, footer, other sections, and interactive buttons. Write `@media print` rules in a page-specific stylesheet loaded only by this route; do not change print output on unrelated routes. Calling `window.print()` is sufficient. No PDF-generation dependency.

With JavaScript disabled, keep checkboxes usable, hide the computed counter/progress and print button, and show “Use your browser's Print command for a blank meeting sheet.”

### Workshop agenda, beside checklist on desktop

Heading: **A useful first 90 minutes**

| Time | Activity |
| --- | --- |
| 15 min | Explain the project, the decision makers, and what remains unknown. |
| 20 min | Map affected people and choose priority outcomes. |
| 20 min | Review public costs and the evidence for the site's value. |
| 20 min | Choose key questions and unacceptable outcomes. |
| 15 min | Assign reviewers, deadlines, and the next meeting. |

Footnote: “A workshop agenda, not a statutory review schedule.”

### Before a decision

Below the checklist, a field-note panel titled **Some gaps cannot be averaged away.**

Copy: “Unresolved authority, unacceptable resource impacts, unprotected public spending, or obligations that cannot be enforced need resolution through the appropriate process. A larger payment does not cancel them out.”

Link: **Use worksheet page 12 with the authorized decision body** → worksheet PDF. Supporting text: “Record whether to proceed, seek revisions, defer a discretionary commitment, or decline through the lawful process, with reasons and a next date.”

Do not offer clickable approval/decline buttons, a legal checklist certification, or a computed recommendation.

## 11. Chapter 06 — downloads and references

Heading: **Take it to the table.**

Intro: “Use the full guide for the detail and the worksheet to keep the conversation concrete.”

Primary action: **Download everything · ZIP** → `/Community_Data_Center_Toolkit.zip`, `download`.

Secondary downloads:

| Label | URL |
| --- | --- |
| Read the guide · PDF | `/community-data-center/Community_Data_Center_Guide.pdf` |
| Download the fillable worksheet · PDF | `/community-data-center/Community_Data_Center_Worksheet.pdf` |
| Editable guide · Word | `/community-data-center/Community_Data_Center_Guide.docx` |
| Plain-text guide · Markdown | `/community-data-center/Community_Data_Center_Guide.md` |

Use `download` on worksheet, Word, Markdown, and ZIP actions. “Read” and “Open” PDF links use normal navigation. Download links must be actual anchors, never fake buttons or fetch-and-blob implementations. Avoid hardcoded file sizes unless measured from extracted assets.

Worksheet note: “Download the worksheet and open it in a PDF reader that supports forms if your browser will not let you type. Save your own completed copy. Calculations in the worksheet are manual.”

### Disclosure: “Terms in plain English”

Use a definition list with six entries:

| Term | Definition |
| --- | --- |
| MW / MWh | MW measures power at a point in time. MWh measures energy over time. State whether a figure describes IT equipment, the whole facility, or utility imports. |
| Full-time equivalent / job-year | A way to express ongoing staffing or one full-time year of work. Construction and permanent roles should be reported separately. |
| Net present value | Future net cash flows translated into today's value using a stated discount rate. |
| Abatement | A tax reduction. Its availability and effect depend on local law and the actual agreement. |
| Financial security | Backing intended to make an obligation collectible, such as suitable collateral or a guarantee. The terms and responsible party matter. |
| Stranded cost | Infrastructure or another committed cost left behind when the expected project use or payments do not arrive. |

### Disclosure: “Sources & edition notes”

Opening copy: “Adapted from the Community Guide to Data Center Negotiations, US edition, September 12, 2026. The supplied guide contains the source references below. Source descriptions reflect that edition; linked policies and rules may change.”

List all 14 references, preserving their source numbers and exact URLs from the Markdown guide. Use descriptive titles and publisher names. This section is a source directory, not evidence that every source has been reverified during implementation.

| No. | Publisher / short title | Status label |
| --- | --- | --- |
| 1 | [Berkeley Lab — Speed to Power](https://eta-publications.lbl.gov/sites/default/files/2026-06/lbnl_large_loads_speed_to_power_final_1.pdf) | Technical report |
| 2 | [Berkeley Lab — US Data Center Energy and Water Modeling and Forecasting](https://datacenters.lbl.gov/modeling-forecasting) | Forecasts |
| 3 | [Virginia JLARC — Data Centers in Virginia](https://jlarc.virginia.gov/landing-2024-data-centers-in-virginia.asp) | State research |
| 4 | [AEP Ohio — Data Center Tariff](https://www.aepohio.com/company/about/rates/data-center-tariff/) | Utility tariff resource |
| 5 | [PUCO — AEP Ohio data center tariff order announcement](https://content.govdelivery.com/accounts/OHPUC/bulletins/3e8bb79) | Regulator announcement |
| 6 | [Microsoft — Building Community First AI Infrastructure](https://blogs.microsoft.com/on-the-issues/2026/01/13/community-first-ai-infrastructure/) | Company announcement |
| 7 | [Google — Arkansas investment and energy programs](https://blog.google/company-news/inside-google/company-announcements/google-american-innovation-arkansas/) | Company announcement |
| 8 | [City of St. Louis — permit and community benefit framework](https://www.stlouis-mo.gov/government/departments/mayor/news/data-center-permit-approved.cfm) | City announcement |
| 9 | [Supreme Court — Sheetz v. County of El Dorado](https://www.supremecourt.gov/opinions/23pdf/22-1074_bqmd.pdf) | Court opinion |
| 10 | [Columbia Sabin Center — Community Benefits Agreements Database](https://climate.law.columbia.edu/content/community-benefits-agreements-database) | Agreement examples |
| 11 | [Chester and Montgomery County Planning Commissions — Data Center Ordinance Guide](https://www.chescoplanning.org/UandI/DataCenters/) | Planning resource |
| 12 | [EPA — Clean Air Act Resources for Data Centers](https://www.epa.gov/stationary-sources-air-pollution/clean-air-act-resources-data-centers) | Agency guidance |
| 13 | [Texas Legislature — SB 6 enrolled text, 89th Legislature](https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00006F.htm) | Enrolled legislation |
| 14 | [NACo — Informational Primer and County Considerations for Data Centers](https://www.naco.org/resource/naco-informational-primer-and-county-considerations-data-centers) | County resource |

Do not import company investment amounts, the St. Louis per-square-foot figure, electricity forecasts, or state-specific thresholds into new headline statistics. They are unnecessary to this page's teaching flow and require context and current verification if featured.

Outside the disclosure, keep a small, readable note: “This toolkit is negotiation guidance, not a ready-to-sign contract or legal opinion. Use verified local evidence and appropriate legal, utility, engineering, and tax review before adopting terms.”

## 12. Implementation architecture

Keep the reading experience server-rendered. Hydrate only three independent islands: promise decoder, offer explorer, and meeting checklist. Native topic disclosures and anchors need no React.

### Files to create

```text
pages/community-data-center.astro
components/community-data-center/PromiseDecoder.tsx
components/community-data-center/OfferExplorer.tsx
components/community-data-center/MeetingChecklist.tsx
lib/community-data-center.ts
styles/community-data-center.css
public/community-data-center/START_HERE.txt
public/community-data-center/Community_Data_Center_Guide.md
public/community-data-center/Community_Data_Center_Guide.pdf
public/community-data-center/Community_Data_Center_Guide.docx
public/community-data-center/Community_Data_Center_Worksheet.pdf
```

### Files to update

```text
styles/globals.css           # Shared toolkit component classes only, scoped
pages/projects.astro        # One resource link in the existing page
pages/sitemap.xml.ts        # Add route to staticRoutes
```

Astro page outline:

```astro
---
import MeetingChecklist from "../components/community-data-center/MeetingChecklist";
import OfferExplorer from "../components/community-data-center/OfferExplorer";
import PromiseDecoder from "../components/community-data-center/PromiseDecoder";
import BaseLayout from "../layouts/BaseLayout.astro";
import { checklistItems, topics, sources } from "../lib/community-data-center";
import "../styles/community-data-center.css";
---

<BaseLayout
  title="Community Data Center Toolkit | Ryan Stefan"
  description="A plain-language guide to data center proposals: understand public costs, explore the promises, and prepare better questions for your next community meeting."
  path="/community-data-center"
>
  <a class="toolkit-skip-link" href="#toolkit-main">Skip to the field guide</a>
  <main id="toolkit-main" class="community-toolkit">
    <!-- Opening, anchors, basics, and native topic disclosures -->
    <!-- Each island is wrapped in its numbered section with its heading -->
    <PromiseDecoder client:visible />
    <OfferExplorer client:visible />
    <MeetingChecklist client:visible />
    <!-- Downloads, glossary, and references -->
  </main>
  <!-- Dedicated print region, outside main, generated from shared data -->
</BaseLayout>
```

This is structural pseudocode. Implement every numbered section and heading; do not literally output the comment placeholders. Follow repository import ordering and two-space indentation.

Use typed arrays for topic content, decoder examples, checklist items, and sources in `lib/community-data-center.ts`. Export a small pure `compareOffers(years: number)` function for the numerical model. Keep file paths and download metadata in the same module. Store editorial text as data, not HTML strings. Render with normal text interpolation; do not add `dangerouslySetInnerHTML`.

Hydration behavior: React's initial server and client render match. If an island needs an enhanced mode, initialize `enhanced` to false and switch it in `useEffect`. Essential reading content is visible before hydration. Hide only JS-dependent controls until enhanced. The promise decoder's no-JS view shows all examples; the explorer shows the static 20-year comparison; the checklist shows usable native inputs and print guidance. Avoid reserving an arbitrary fixed panel height to mask hydration changes.

Use `.community-toolkit` to scope every shared toolkit class in `globals.css`. Put route-only print rules and motion overrides in `styles/community-data-center.css`, imported only by this route. Do not style generic `details`, `button`, `section`, or `table` selectors globally.

### Discovery and metadata

On `pages/projects.astro`, add one text-led resource callout after the existing “Take a look around” project grid, without altering the existing cards:

- Eyebrow: **Community resource**
- Title: **Community Data Center Toolkit**
- Description: “A plain-language field guide to public costs, community benefits, and better questions about a proposed data center.”
- Link: **Explore the toolkit** → `/community-data-center/`.

No fabricated project screenshot, no changes to the global navigation, and no new marketing contact section. Keep the existing project JSON-LD list accurate for the items it describes; the resource callout can remain outside that list.

Add `["/community-data-center", "monthly", "0.6"]` to the sitemap's static routes. Follow the site's existing canonical convention: BaseLayout receives the path without a trailing slash and the route is served with the configured trailing slash. Do not rewrite global canonical behavior. No new social-preview image is needed; use BaseLayout's existing metadata behavior.

## 13. Accessibility and responsive requirements

- One H1, H2 for each numbered chapter, H3 or correctly structured summary titles for subtopics. Do not use visual heading size to skip the document hierarchy.
- Add the skip link before page content; it becomes visible on keyboard focus. The fixed site navigation remains usable.
- Touch targets at least 44×44px, including radios, disclosure summaries, checklist labels, and icon controls.
- Native controls keep visible focus. Links must be identifiable beyond color alone.
- No information revealed only on hover. No icon-only essential instructions.
- Text contrast: 4.5:1 for normal text and 3:1 for large text; verify actual token combinations. Control boundaries and meaningful graphics need sufficient contrast as well.
- Do not communicate checked, warning, negative value, or selected states with color alone.
- Opening a disclosure leaves focus on its summary. Selecting a decoder option leaves focus on the radio. The slider uses native arrow-key behavior.
- Decorative graphics/icons have appropriate `aria-hidden`. Live regions announce concise changes, not whole sections.
- At 320px width and 200% zoom, content and controls remain accessible without horizontal page scrolling. Stack the comparison's explanatory blocks; place wide tables in their own labeled scroll region only if needed.
- Long filenames and source URLs must not create overflow; show human labels, not raw URLs.
- For `prefers-reduced-motion: reduce`, remove transitions and smooth anchor scrolling on this route.
- Print output is high contrast on white and does not rely on printing background colors.

## 14. Implementation sequence

Work in this order. Finish each step before introducing optional polish.

1. Read repository `AGENTS.md`; inspect current status and files listed here. Preserve unrelated edits.
2. Read `START_HERE.txt` and the Markdown guide from the ZIP. Confirm filenames, edition, worksheet references, and source URLs. Extract only the known document members.
3. Create the Astro route, shared typed content module, and scoped styles. Build the opening, page navigation, basics, and six native disclosure cards first.
4. Start `npm run dev` using the established project flow. Request the printed local URL for `/community-data-center/` and resolve compile failures. If a user-facing preview tool is available, open this coherent first version once. Do not present a blank placeholder.
5. Implement the promise decoder exactly as specified, including its no-JS reading mode.
6. Implement the offer comparison and independently check the two required numeric cases and negative bar geometry.
7. Implement checklist, shared-data print sheet, agenda, and decision note.
8. Add downloads, glossary, and source directory. Verify every local asset link against actual extracted files.
9. Add the Projects resource callout and sitemap entry.
10. Run the build and lint; fix issues caused by these changes. Inspect type diagnostics for new TSX modules because the existing lint configuration may not cover them. Do not blindly fix unrelated pre-existing diagnostics.
11. Complete mobile, desktop, keyboard, no-JS, and print verification below using the available browser tools. This handoff requests those checks as part of the implementation. If browser access is unavailable, state exactly which checks remain unverified.
12. Review the diff for unrelated changes and deliver the page URL/path, brief behavior summary, validation results, and any actual limitations. Do not claim the page is live unless deployment was authorized and completed.

Do not stop after making a download landing page. The topic explanations, decoder, offer explorer, and meeting preparation are essential to the requested experience.

## 15. Acceptance checklist

### Content and navigation

- [ ] `/community-data-center/` builds as static HTML and uses the existing site layout.
- [ ] The opening conveys the topic and central idea immediately.
- [ ] All six chapter links reach visible headings below the fixed navigation.
- [ ] The three entry links scroll to their specified sections without filtering content.
- [ ] All six topic cards contain the specified question, evidence, caution, and deeper reference.
- [ ] Authority, public costs, impacts, and enforceability remain distinct from additional benefits.
- [ ] The page labels its fictional figures and supplied edition accurately.
- [ ] There are 14 correctly numbered source links with preserved URLs and status labels.
- [ ] All document links point to real assets, and extracted files match the ZIP members byte for byte.
- [ ] The existing Projects page links to the new resource, and the sitemap contains the route exactly once.

### Interactive behavior

- [ ] Every native topic disclosure opens with mouse, touch, Enter, and Space and can close again.
- [ ] Decoder defaults to Jobs; each of the four choices displays the matching statement and answer.
- [ ] Switching decoder examples closes the previous answer; focus remains stable.
- [ ] Slider defaults to 20; arrow keys work; range stays within 1–20 integer years.
- [ ] Year 1 yields −$5.08m / $9.69m / $14.77m and a negative A bar.
- [ ] Year 20 yields $20.18m / $110.72m / $90.54m.
- [ ] Both bars use the same fixed scale, and the zero line never moves.
- [ ] Checklist starts 0/6, reaches 6/6, and returns to 5/6 when an item is unchecked.
- [ ] Checklist reload returns to 0/6, matching the disclosed behavior; it never becomes an approval score.
- [ ] Print button opens a readable blank meeting sheet, with all six prompts and the 90-minute agenda.
- [ ] Downloads use real browser links and the original worksheet remains fillable.

### Quality and fallback

- [ ] `npm run build` succeeds; `npm run lint` succeeds or unrelated existing failures are clearly identified.
- [ ] New TypeScript modules have no introduced type errors; build success alone is not claimed as a full TS check.
- [ ] Verify desktop 1440×900 and mobile 390×844; also inspect 320px width and 200% zoom.
- [ ] No horizontal page overflow, clipped expanded text, overlapping sticky bars, or inaccessible controls.
- [ ] Keyboard-only walkthrough reaches all controls with visible focus and no trap.
- [ ] With JS disabled, readers can access all core text, decoder examples, original documents, default comparison, and print instructions.
- [ ] Reduced-motion mode removes unnecessary movement and smooth scrolling.
- [ ] Letter and A4 print previews show only the meeting sheet, with no clipping or mostly blank pages.
- [ ] No missing icons, hydration warnings, browser runtime errors, or local asset 404s.
- [ ] Existing home, Projects, and contact navigation still work.
- [ ] Capture a full-page desktop screenshot, a mobile screenshot, and one expanded/interactive state for review when browser tooling is available.

Use meaningful checks for the numerical comparison because a sign or units error changes the lesson. Do not introduce a broad test framework or snapshot suite for static copy. Existing lint/build plus focused calculation checks and manual browser verification are sufficient for this scope.

## 16. Copy-paste instruction for the implementing model

> Implement `docs/community-data-center-page-handoff.md` in this repository. Treat it as the content, design, interaction, and acceptance specification. Read AGENTS.md first. Build the new Astro route and all three specified React islands; preserve static HTML and the existing site's layout, colors, dependencies, hosting, and contact behavior. Use the supplied toolkit as the source of truth, retain all original downloads, and do not invent current facts or legal entitlements. Follow the file map and implementation order. Perform the requested desktop/mobile, keyboard, no-JS, calculation, and print checks where tools permit, and run build and lint. Keep changes scoped and report anything you could not verify. Do not commit or deploy unless separately instructed.
