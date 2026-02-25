**# From Legacy Rat Nest to Laravel + Unpoly Hybrid: How I Modernized a 15-Year-Old PHP Admin Without a Rewrite**

A few years ago, a friend reached out in a panic. His boss owned a fully online staffing business, and the entire platform had been built by a Chinese expat developer who spoke very little English. One day the developer was suddenly forced to return to China, and with him went all support, documentation, and knowledge of the system.

I had been writing PHP since high school in 2006, so I thought this would be right in my wheelhouse. I still had fond memories of those early days cranking out spaghetti code on XAMPP. I figured I was the perfect person to step in and help. The reality hit much harder than I expected.

The codebase was not simply old; it was a complete disaster. The developer had started with a Chinese shopping-cart script and hacked it into a staffing platform. There were no classes, no functions, no abstraction at all. Just the same 15 core PHP files copied and pasted across every page on the site. Half the variables and comments were still in Chinese.

Two weeks after I started, the owner—who had paid BlueHost only $800—received an email announcing the end of support for PHP versions below 7. I had exactly one day to migrate the live site to a custom DigitalOcean droplet, or thousands of employees would lose access to the platform that ran their entire company. My repeated calls to BlueHost support went nowhere, and we never saw a refund. Their customer-facing WordPress site was its own separate nightmare.

Today, that same platform is a clean, modern Laravel application with perfect 100 Lighthouse scores across the board, a polished Filament admin panel, and every piece of original business logic carefully preserved. Here is exactly how I modernized it, without a full rewrite, without any downtime, and without the non-technical staff even noticing the change.

---

## The Starting Point: A System That Worked, But at a Cost

The original admin was classic procedural PHP that had grown over 15 years to meet real business needs. It was not built for architectural purity, but it kept the company running.

The typical legacy issues were present:
- Large procedural files handling many responsibilities
- Heavy use of globals and implicit coupling
- Session, authentication, and permission logic mixed with presentation code
- Business-critical workflows that no one wanted to risk changing
- Inconsistent validation and input handling
- Domain rules scattered across many files in conditional statements

At the same time, the system was actively used every day by hundreds of non-technical staff for scheduling, assignments, communication, reporting, and operations. A full rewrite would have carried too much operational risk and too many unknown edge cases hidden in 15 years of production data.

I therefore chose a clear path: no rewrite. Only incremental modernization with strict compatibility.

![[old-vs-new.png]]
*This shows a side-by-side of the remake desktop/mobile above the original (this is the original post my improvements)*

---

## The Core Strategy: Progressive Hybridization

I did not convert the entire application to pure Laravel. Instead I introduced Laravel components only where they provided clear, immediate value:

- Routing
- Controllers
- Eloquent models
- Repositories and service layer
- Blade templates and components
- Improved application structure

I kept legacy behavior intact wherever changing it would introduce risk:

- Native session handling
- Existing permission model
- Data assumptions
- Request and response flows

The result was a hybrid architecture created by design. Deliberate hybrids can remain stable and productive; accidental ones usually do not.

---
## The Workload Reality: What the Git History Shows

Over the past six months, the migration touched **958,060 lines of code** in total (**394,800 added** and **563,260 removed**, net **168,460 fewer lines** overall). The heaviest lift was in December 2025:

- September 2025: **243 lines touched** (199 added / 44 removed)
- December 2025: **907,675 lines touched** (358,837 added / 548,838 removed)
- January 2026: **44,449 lines touched** (31,430 added / 13,019 removed)
- February 2026: **5,693 lines touched** (4,334 added / 1,359 removed)

This pattern is typical for a legacy modernization: one intense structural push (including large-scale deletions of obsolete code), followed by a stabilization phase and then smaller ongoing improvements on the new foundation.

---
## Phase 0: Stabilize the Runtime First

One of the earliest important steps was getting the application stable on PHP 8.3. Before changing any architecture I needed a solid baseline. I focused on compatibility from PHP 5.6 to 8.3, removed obvious dead code, and eliminated brittle workarounds. This ensured that later changes could be clearly attributed to the new architecture rather than language issues.

Rule number one for legacy migrations: stabilize the runtime before touching architecture.

---

## Phase 1: Introduce Laravel Components in High-Value Areas

Early progress came from focusing on high-traffic, high-maintenance sections. I introduced Blade templates, Eloquent models, modern routing, and controllers in those key areas. Each improved section became easier to maintain, which created time and confidence to tackle the next one. This positive cycle kept the project moving forward.

---

## Phase 2: Document the Hybrid Rules

One of the most valuable things I did was write clear documentation that defined the hybrid approach. I spelled out which parts follow Laravel conventions, which parts must remain legacy-compatible, and what helper patterns should be used for requests, sessions, and permissions.

This documentation prevented future developers from accidentally breaking legacy behavior by assuming full Laravel rules applied everywhere. It became an important part of maintaining system safety.

---

## Phase 3: Structural Reorganization

The most demanding phase was the large-scale structural reorganization. Legacy files were moved into standard `app/` and `resources/` directories, namespaces were updated, old paths were retired or shimmed, and routing was rebuilt from the ground up.

There is no easy way through this stage. I kept changes focused, documented every transition, preserved compatibility seams, and continuously verified critical user flows.

---

## Unpoly: Modern UX Without SPA Complexity

Choosing Unpoly was one of the best technical decisions in the project. I wanted a more responsive and modern interface without the maintenance burden of a full single-page application.

Unpoly provided:
- Server-rendered fragments
- Targeted page updates
- Smoother navigation and modals
- Business logic that remains on the server

The interface now feels noticeably more modern while keeping the backend simple and secure.

![[old-vs-new-2.png]]
*Another new vs original showing how hard the old site was to navigate on mobile devices*

---

## LiveBind Experiment and Later Simplification

I briefly introduced additional client-side binding features, then removed the parts that added unnecessary complexity. Recognizing when to remove an experiment is an important part of any modernization effort.

---

## Hardening the Seams: Sessions, Auth, Requests, and Services

As the hybrid system matured, edge cases appeared at the boundaries between old and new code. I made several important improvements around session handling, cross-site authentication, impersonation logic, request processing, input sanitization, and the service and repository layers.

These changes turned a system that “mostly worked” into one that could be relied on consistently.

---

## Testing Against Real Legacy Behavior

I invested heavily in integration tests that ran against the actual legacy database schema and data patterns. These tests captured quirks that unit tests alone would miss. Once the suite covered real production behavior, refactoring became much safer and faster.

---

## UI Systemization and Communication Modernization

I created reusable Blade components for forms, tables, modals, badges, and bulk actions. This improved both visual consistency and development speed. I also modernized the communication features (email and SMS via Mailgun and Twilio), which helped reduce long-standing support issues.

---

## What This Migration Was Not
- A greenfield Laravel project
- A months-long pause in feature development
- An attempt at complete framework purity
- A replacement of every old pattern before proving value in production

It was practical, incremental modernization.

---

## Tradeoffs I Accepted
- Architectural purity versus operational continuity (continuity took priority)
- Slower broad cleanup versus safer incremental progress
- Temporary coexistence of old and new patterns
- Additional documentation and convention overhead

All of these were conscious choices.

---

## Things That Broke (As They Always Do)

Routing mismatches during file moves, Unpoly fragment issues, session edge cases, and legacy date assumptions in scripts. The key was not avoiding every problem, but building a fast cycle of detection, root-cause analysis, minimal-fix patching, and documentation so the process improved over time.

---

## Why This Worked

1. Compatibility was treated as a primary requirement, not an afterthought.
2. Each phase delivered measurable improvements for users or developers.
3. Clear documentation prevented regression.
4. Unpoly delivered modern interaction while keeping logic server-side.
5. Tests were built against real legacy data and behavior.

---

## Practical Advice for Similar Migrations
- Document what must not break before starting
- Stabilize the runtime before any architectural changes
- Prove the hybrid pattern in one high-value area first
- Create helper conventions early
- Prefer server-driven tools like Unpoly unless a full SPA is truly required
- Test against the real database and data patterns
- Maintain a migration journal
- Remove experiments that add more complexity than value

---

## Before vs After (Conceptual)

**Before**  
Procedural files with mixed responsibilities, fragile navigation, and high risk when making changes.

**After**  
Clear route and controller structure, reusable Blade components, Eloquent and service layering in key areas, Unpoly-driven updates, and integration tests that support confident refactoring.

---

## The Human Side

This work reduces risk for the entire team. Developers become willing to touch previously avoided code. Onboarding improves. Support tickets decrease. Architecture discussions shift from reactive to strategic.

The result is greater organizational capability, not just cleaner code.

---

## What I Would Do Differently Next Time
- Enforce cleaner commit organization from the beginning
- Define phase-completion criteria earlier
- Build a small set of critical regression tests sooner
- Create periodic architecture diagrams to show progress

---

## What Comes Next

Continue reducing legacy-only areas, strengthen service boundaries, expand test coverage on frequently changed modules, and simplify frontend behavior where possible. The goal is steady, sustainable improvement rather than another large-scale event.

---

## Closing Thought

You do not need a full rewrite to bring modern development practices to a long-lived system.

What you need is careful sequencing, explicit rules, compatibility-focused design, and a willingness to iterate.

This 15-year-old legacy platform is now a Laravel + Unpoly hybrid that is faster to develop, more reliable, and more approachable for the team. If your organization feels stuck between leaving the old system untouched or attempting a complete rewrite, consider the middle path.

Respect the system and the business logic it contains. Modernize it step by step. Document the boundaries. Keep delivering value.

You may be surprised at how effective that approach can be.