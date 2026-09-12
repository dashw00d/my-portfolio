# Interactive proposal: loose build plan

Build Ryan Stefan a polished, temporary proposal page he can text to Erica and Taylor at Southern Star. They should be able to choose options, leave notes, mark up a preview, and return later. Ryan needs to see and reply to their feedback.

Use the attached `Southern-Star-Website-and-Marketing-Plan.docx` as the source of truth for scope and pricing. This plan describes the proposal tool itself, not additional services to charge the client for.

## The feel

A personal proposal from Ryan, easy to use on a phone. Warm, attractive, and straightforward. No client account setup. Keep technical implementation details out of the client-facing copy. Use short explanations of what each option does for their business.

Suggested address: `dashwood.net/p/<unguessable-token>`. This is a proposed route, not an existing URL. Inspect the existing site and hosting before choosing the integration approach; preserve its established styling where practical.

## What they see

1. **Personal introduction.** A short message to Erica and Taylor explaining the rebuild and inviting them to pick options or leave questions.
2. **The core rebuild.** Show the $120 base, included work, and the price breakdown from the document. Regular event pages and on-site SEO are included.
3. **Optional upgrades.** Cards ordered by effort, each with its price, concrete deliverables, a selection checkbox, and a note button. Keep larger automations visually secondary.
4. **A running total.** Separate one-time work, optional monthly services, and third-party costs. Start with the base rebuild selected and extras off. Use the document's actual prices; $180 includes the farm wizard, and $240 includes both the farm wizard and campaign tracking.
5. **A preview to discuss.** If a mockup or screenshot is supplied, display it with annotation tools. Otherwise ship the proposal first and let Ryan add a preview later; do not invent an approved design.
6. **A clear finish.** “Send feedback to Ryan” submits a snapshot of their selections and comments. Explain that selections are for discussion, not a payment or binding acceptance.

## Feedback that feels effortless

- Each section supports short comments and a status: Interested, Question, or Maybe later. Status is separate from the checkbox that affects price.
- Ask for a first name once so comments can say Erica or Taylor. Treat this as a display name, not verified identity.
- Let them click or tap a preview to place a numbered pin and add a note. Ryan can reply and mark a thread resolved.
- Add a small pen tool for circles and freehand doodles after comments and pins work. Include undo and delete. Restrict drawing to a fixed preview image so marks stay attached to the right content.
- Save feedback and selections automatically, with visible Saving / Saved / Retry states. “Send feedback” is the deliberate notification step, not the only save point.
- Store shared data on the server. Opening the same proposal link on another device should restore the shared choices and discussion. Preserve unsent text locally if a request fails.
- Keep an annotation attached to its original preview version when Ryan replaces a mockup. Do not silently move old comments onto a new image.

## Ryan's side

One protected review screen is enough. Show selected options, totals, comments, drawings, and the latest submitted response. Let Ryan reply, resolve comments, upload or replace a preview, and copy the client link.

Include controls to expire, revoke, or reopen the link and make a proposal read-only. Email Ryan when the client presses Send feedback, with a link to the saved response. Prevent duplicate emails from repeated taps. Saving must still work if email delivery fails.

Keep a snapshot of each submitted response and its proposal version so later price edits do not change what they previously reviewed. Clients cannot edit prices.

## Sensible implementation direction

Prefer the existing site's stack where it saves work. Astro with a little client-side interactivity, a small PHP API, SQLite, and the existing email provider would fit this scope. Adapt to the actual hosting rather than adding infrastructure solely for this page. Cron is only needed if notification retries or cleanup require it.

Keep proposal content in one editable configuration, with stable IDs for sections and options. Keep client feedback separate. A minimal data model needs proposals, options, shared selections, comment threads, preview annotations, and submitted response snapshots.

Use a long random client token and separate protected admin access. Anyone with the client link can participate, so make it revocable. Enforce access and expiry on the server for proposal data, previews, downloads, and writes. Keep private content out of public build assets; add noindex and avoid third-party scripts that could receive the link. Validate input and uploads, escape comments, protect admin sessions, and keep the database and secrets outside the public web directory.

For annotations, store positions relative to image dimensions so resizing works. Save comments independently and use a revision check for shared selections so simultaneous edits do not silently overwrite each other. Refresh after saves or periodically; live cursors and WebSockets are unnecessary here.

## Build order

1. Read the attached proposal, inspect the site, and build the mobile-friendly page with editable content, options, and accurate totals.
2. Add persistent selections, section comments, submitted snapshots, and Ryan's protected review screen.
3. Add preview pins, replies, and lightweight freehand markup.
4. Connect email notifications and link lifecycle controls, then prepare deployment instructions for Ryan's domain.

Keep this a small reusable tool. One proposal configuration and one review screen are sufficient. Payments, contracts, CRM integrations, a visual page builder, and ongoing experimentation are outside this build.

## Before handing it back

Verify the complete flow with two browser sessions: select options, comment, annotate, refresh, reopen the link, submit feedback, and view it as Ryan. Check mobile drawing alignment, pricing totals, simultaneous edits, a failed save, a failed notification, and expired-link access. Confirm client access cannot modify prices or reach admin functions.

Deliver the working implementation, an editable proposal configuration populated from the document, a brief setup/deployment note, and instructions for creating another proposal and revoking a link. Use placeholders for missing credentials; clearly identify any deployment work still needed.
