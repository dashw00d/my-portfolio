# Proposal redesign brief

## Objective

Redesign the existing interactive proposal experience so it feels polished, personal, and unmistakably part of Ryan Stefan’s portfolio brand. Improve presentation and usability while preserving the functionality, content, pricing, saved data, and access model currently implemented.

This is a visual design brief for a future implementation. It does not authorize new features, backend changes, or changes to the commercial meaning of a proposal. The current working tree is the functional baseline, including the proposal builder added alongside the client and review screens.

## Brand direction

Aim for a calm, approachable studio experience: deep teal, warm sand, generous spacing, clear typography, and restrained decoration. The page should feel like a thoughtful proposal prepared by a real person, with the choices and feedback controls easy to find.

Use these repository sources as the reference:

- [Brand kit](components/pages/BrandPage.tsx): typography, spacing, radii, and component examples; available at `/brand/`.
- [Global styles](styles/globals.css): authoritative RGB values and existing `.proposal-*` classes.
- [Tailwind configuration](tailwind.config.js): semantic color utilities.
- [Repository guidelines](AGENTS.md): project conventions.

The brand kit contains some older neutral-color examples. For new proposal styling, follow the repository’s semantic-token convention instead of copying those raw color utilities.

### Color

| Role | Existing tokens | Treatment |
| --- | --- | --- |
| Page background | `highlight-50`, `highlight-100` | A warm, quiet backdrop; avoid competing background effects. |
| Cards and inputs | White, `brand-50` | White is an existing neutral surface; use light teal for selected or grouped content. |
| Primary text | `brand-950`, `brand-900` | Strong, readable text rather than faint decorative labels. |
| Main actions | `brand-600`, `brand-700` | A consistent teal treatment for the primary action in each context. |
| Hero and emphasis | `brand-900`, `accent-900` | Deep teal or navy with sufficiently contrasting light text. |
| Borders and focus | `brand-200`, `brand-400`, `accent-400` | Quiet separation; a clearly visible keyboard focus ring. |
| Warm accents | `highlight-200` through `highlight-500` | Small accents and supporting surfaces, used sparingly. |
| Feedback states | `success`, `warning`, `danger` | Preserve clear distinctions between saved, reconnecting, and error states. Pair color with text or an icon. |

Use semantic classes such as `bg-brand-700` or CSS values such as `rgb(var(--color-brand-700))`. Keep the existing palette values; this redesign should not recolor the rest of the portfolio. Avoid introducing unrelated purple gradients, neon colors, or the separate ForgeKit palette.

### Typography and components

Use the brand’s Nunito family and established system fallbacks. Regular 400 is appropriate for body text, 600 for labels and controls, and 700 for emphasis. Build hierarchy through size, spacing, and weight. The current proposal’s Georgia headings are a local stylistic departure, not the canonical brand typeface; the preferred redesign direction is consistent brand typography.

Private proposal pages currently omit external font requests. Preserve that behavior. Use the existing fallback stack when Nunito is unavailable; any future font assets should be served locally. Check the layout with the actual fallback font, not only a design-tool font.

Use 14–16 px body text, readable line heights, and short text measures. Avoid tiny uppercase text for essential instructions or prices. Favor the existing 8/16/24/32/48 px spacing rhythm, 12 px control radii, and 16 px card radii. Keep shadows soft. Use the existing Lucide icon family with consistent stroke weight and sizing.

Typography and padding changes inside drawing surfaces require the compatibility checks below; even a font change can move the text underneath a saved mark.

## Screen-by-screen design

### Client proposal

Keep the current content sequence: personal introduction, review guidance, foundation and scope cards, optional additions, an optional preview image, ongoing support, price summary, and feedback submission.

The header should establish who prepared the proposal and who it is for. Give the title and introduction room to breathe, but keep the first actionable content reasonably close to the top. Decorative flourishes should stay outside drawing surfaces and should never resemble an approved client mockup.

Make scope cards easy to scan: heading, short description, deliverables, notes, and reaction controls. Optional service cards should make their selected state and one-time price immediately apparent. Selection must remain distinct from an “Interested” or “Question” reaction.

Give drawing controls a consistent toolbar treatment. Make Draw, Done, Undo, and Clear recognizable, preserve their existing availability rules, and make the active drawing state obvious. Keep the save indicator and its retry action visible and legible.

On wide screens, retain a useful price-summary column. On smaller screens, let the existing content flow into one column. A sticky panel must fit the viewport and must not cover controls. Show monthly, per-batch, and per-event services with their actual billing periods, separate from the one-time total.

End with a clear invitation to send feedback, the optional name field, and the existing explanation that this is a discussion rather than a payment or commitment. Preserve all commercial and client-specific wording.

### Proposal builder

Keep the current single-form workflow. Make its sections visually consistent: access, client details, foundation, scope cards, optional additions, ongoing services, and finishing touches.

Use clear labels, aligned inputs, and consistent spacing around add/remove controls. Make “Use that proposal as a template” understandable as copying content into the current draft. Keep Preview and Create proposal distinct, and keep draft-save feedback readable.

The success screen should clearly distinguish the shareable client link from the private review link. Keep copying, opening links, and creating another proposal easy to find. Avoid turning the form into a wizard or adding navigation steps, a template gallery, or extra confirmation screens.

### Private review

Style the review toolbar as an owner workspace while keeping the proposal itself visually identical to the client version. Preserve the live-versus-submitted distinction, refresh/reconnection feedback, submitted-response selector, client-link actions, access controls, and New proposal shortcut.

Keep private owner controls separate from the client-facing content. A submitted snapshot must remain clearly identifiable as a historical response.

## Functionality that must remain unchanged

| Area | Preserve exactly |
| --- | --- |
| Routes and access | Existing `/p/southern-star/`, `/p/proposal/`, `/proposal/review/`, and `/proposal/new/` routes; existing query tokens, admin authentication, and generated links. |
| Proposal content | Client and sender details, scope, deliverables, option IDs, prices, defaults, billing periods, third-party costs, and commercial wording. |
| Client input | Foundation and option selection, section notes, reaction toggles, optional display name, and existing validation limits. |
| Drawing | Per-target marks, pointer handling, Draw/Done, Undo/Clear, normalized coordinates, stored surface width, scaling, and persistence. |
| Saving | Existing autosave timing and queue, revision checks, retries, and loading/saving/saved/error states. |
| Submission | The deliberate Send feedback action, submitted snapshots, submission states, and existing notification behavior. |
| Builder | Fresh drafts, copying an existing proposal, all current editable fields, add/remove controls and limits, preview, creation, and returned links. |
| Browser storage | Current draft and created-link recovery behavior, storage keys, and handling of unavailable storage. |
| Review | Current polling, refresh, snapshot selection, copy/open actions, and active/read-only/revoked behavior. |
| Privacy and hosting | Private-page metadata and no-referrer policy, omitted analytics/external font requests, static Astro output, PHP API, and SQLite storage. |

Do not add payments, signatures, logins, uploads, new drawing tools, pin comments, replies, exports, or other features as part of this work. Some ideas appear in the older planning document, but they are not requirements for this visual redesign. Do not rename data fields, alter request payloads, reset storage, or create database migrations.

## Drawing compatibility is a release condition

Saved marks are attached to a target and a rendered surface. They are not attached semantically to a specific sentence. Changing text wrapping, font metrics, card padding, or the position of controls can move content underneath an old drawing even when all event handlers remain unchanged.

Before redesigning, save representative annotated proposals at both desktop and mobile widths. Capture where circles and underlines sit relative to the underlying words. After styling changes, reopen those same records and compare their alignment at the same widths and across devices.

Preserve target IDs, coordinate normalization, the measured card element, SVG overlay coverage, original-width scaling, and pointer-capture behavior. Keep decorative layers from intercepting input. Do not add expanding details, variable-height animations, or new content inside an annotated card.

If a visual change shifts an existing mark’s meaning, revise that change. Retain the existing geometry for affected surfaces and concentrate polish on surrounding layout, color, borders, and toolbar styling. Do not silently discard, relocate, or reinterpret saved marks to make the redesign fit.

## Implementation boundaries

Start with the proposal-scoped rules in [global styles](styles/globals.css). Limit component changes to presentation and accessible markup in:

- [Proposal page](components/pages/ProposalPage.tsx)
- [Proposal cards](components/proposal/ProposalCards.tsx)
- [Drawing wrapper and toolbar](components/proposal/ProposalMarkup.tsx)
- [Proposal builder](components/pages/ProposalBuilderPage.tsx)
- [Private review](components/pages/ProposalReviewPage.tsx)

Keep component props, callbacks, state transitions, input associations, and disabled conditions intact. Do not rewrite working components merely to reorganize their logic. Avoid global element selectors that change unrelated portfolio pages. Do not edit `dist/` by hand.

Treat `public/proposal/api.php`, proposal types/configuration/templates, storage keys, routing, and the privacy behavior in `BaseLayout.astro` as outside the visual-change scope.

## Verification and handoff

Capture a baseline before editing; browser visual testing of the preceding implementation was unavailable, so there is no established screenshot baseline to rely on.

1. Compare client, builder, and review screens at 375, 768, 1024, and 1440 px, plus 200% zoom. Check long titles, lengthy notes, many selected options, and empty optional sections.
2. Check mouse, touch, and keyboard use. Keep visible focus, input labels, pressed states, readable disabled states, and touch targets around 44 px. Verify contrast and reduced-motion behavior.
3. Reopen saved drawings, add another mark, use Undo/Clear, refresh, and inspect the same records in review. Check that ordinary scrolling works outside active drawing mode.
4. Exercise selection totals, each billing period, notes, reactions, autosave/retry, submission, snapshots, and unavailable/read-only/revoked links. Use isolated fixtures and a stub mail transport for submission testing.
5. Exercise draft recovery, template copying, preview/back navigation, creating a proposal, copy/open links, refresh recovery, and creating another. Confirm proposal data stays separate.
6. Run `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `node scripts/check-proposals.ts` with the documented Node/PHP prerequisites. These checks complement visual testing; they do not prove drawing alignment or layout quality.
7. Review the diff for accidental logic, pricing, API, or privacy changes. Confirm unrelated portfolio pages retain their styling.

Deliver before/after screenshots of all three screens, a short account of the visual changes, and the checks actually completed. Record any unavailable checks explicitly. Acceptance means the experience looks more coherent with the brand and every existing action still produces the same result, including on proposals created before the redesign.
