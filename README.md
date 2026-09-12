# Portfolio Site

A business-focused portfolio website built with Astro, React islands, and Tailwind CSS. Production is a static HTML export with PHP contact and proposal endpoints.

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
```

HTML lands in `dist/` (gitignored). Preview locally with `npm run preview`.

## Deployment

This is a static site. Point the web root at `dist/`. There is no Docker image and no Node process in production.

Typical panel (RunCloud-style) setup:

1. After pull: `npm ci && npm run build`
2. Document root: `dist/`
3. Enable PHP for `/api/contact.php` and the proposal API routes described below
4. Copy `.env.example` to `.env` and add SMTP credentials, or set the same variables in the host panel

An nginx starting point lives in `deploy/nginx.conf.example`. Keep PHP-FPM on `ondemand` so idle RAM is just nginx.

## Contact form

The form posts JSON to `/api/contact.php`. PHP reads `SMTP_*` and `CONTACT_*` from the environment, then from `.env`. It is not a standing Node mail server.

## Interactive proposals

### Admin panel

Open `/proposal/` to see all proposals, search by client or title, filter by link status, and sort by creation or activity date. Each row shows created/latest activity dates, response counts, client links, and a private review link. **New proposal** opens the builder; **All proposals** returns from the builder or review screen.

Unlock the panel with the original owner admin link/token (the admin token used to initialize the Southern Star record, initially `PROPOSAL_ADMIN_TOKEN`). Individual proposal admin links still access only their own review and cannot list or manage other proposals. Changing the environment variable does not rotate an existing stored owner token.

Owner access is remembered in session storage for the current tab. **Lock** clears it. Panel review links contain a proposal ID and require owner access when opened; they do not reveal or replace existing per-proposal admin tokens. Client links remain shareable. If browser storage is disabled, paste the owner token again when opening a review.

The list uses `GET /proposal/api.php/admin?action=list`; owner reviews and access changes select a record with `?proposal=ID`. Existing nginx PHP locations already cover these endpoints. No additional database columns or runtime services are needed.

Choose **Edit copy** on a proposal row or review screen to update its wording at `/proposal/edit/`. Preview changes, then choose **Save changes** to update the existing client link. This preserves prices, option IDs, client selections, drawings, and submitted snapshots. Copy saves use a separate config version to reject stale edits from another tab. The original Southern Star proposal becomes database-backed on its first copy save while retaining its original link.

Feedback submission checks the saved state `revision` while creating the snapshot. Copy edits do not introduce a client confirmation step. Unsaved feedback and pending submissions trigger the browser's leave-page warning.

The private client page is `/p/southern-star/`, and Ryan's review screen is `/proposal/review/`. The proposal API is `public/proposal/api.php` and stores data in SQLite at `data/proposal/proposals.sqlite`, outside the public build output.

The dev server starts one local PHP worker for proposal requests and keeps it warm, so opening and saving proposals do not reload PHP extensions on every request. The worker stops with the dev server; production still uses PHP-FPM.

For local testing, export these before running `npm run dev`:

```bash
export PROPOSAL_CLIENT_TOKEN=local-client-token
export PROPOSAL_ADMIN_TOKEN=local-admin-token
```

Open:

```bash
/p/southern-star/?token=local-client-token
/proposal/review/?admin=local-admin-token
```

For production, set distinct, long random values for `PROPOSAL_CLIENT_TOKEN` and `PROPOSAL_ADMIN_TOKEN` in the PHP-FPM environment or FastCGI parameters. Missing tokens disable the API with HTTP 503. Add the proposal PHP location from `deploy/proposal.nginx.conf.example` before the generic PHP deny location, and run `npm ci && npm run build`.

PHP 8.1+ with `pdo_sqlite` and `mbstring` is required. Create `data/proposal/` beside `dist/` and grant the PHP-FPM user write access. The database is created there on first use and must persist across builds. Back it up with application data. Tokens are hashed into the database on first use, so changing the environment alone does not rotate existing access links. Proposal submission notifications currently require a working PHP `mail()` transport.

On ServerChirp, set `PROPOSAL_DATA_DIR` to `/home/cloud/apps/portfolio/shared/proposal` in the portfolio PHP-FPM pool. This keeps feedback outside timestamped release directories. Keep the proposal tokens in the app's persistent environment and pass them to the same pool. Point the nginx API locations at that pool's socket, then validate nginx and PHP-FPM before reloading them.

### Creating another proposal

Open `/proposal/new/`, or click **New proposal** from an existing proposal’s review screen.

1. Paste an existing admin review link or token to authorize creation. The review-screen shortcut fills it in for you.
2. Fill in the client, introduction, scope cards, prices, and any optional or ongoing services. **Use that proposal as a template** copies its content into the current draft; replace the client-specific wording before sharing.
3. Use **Preview** to inspect the client-facing layout. Your draft saves in this browser, without storing the admin token in the draft.
4. Click **Create proposal**, then save the private review link and share the client link yourself. Creating a proposal does not send a message. The resulting links survive a refresh in the same tab; save the review link somewhere durable.

New proposals are available immediately at `/p/proposal/?token=…`, with their own configuration, feedback, drawings, and access tokens. No new route, code edit, or rebuild is needed for each proposal after deploying this update. The review screen can make each link read-only, revoke it, or reopen it. Use **New proposal** to make a revised copy; existing proposals keep their original content and submitted snapshots. Preview images are optional existing site paths such as `/images/client-mockup.jpg`; the studio does not upload files.

The original Southern Star content remains in `lib/proposal/config.ts`, and its existing links and feedback continue to work. The API adds nullable columns to the existing SQLite table on first use. New proposal configurations are stored in that private database and included in submitted snapshots. Admin tokens are stored only as hashes; new client tokens are also retained in the private database so the review screen can recover the client link. Private proposal pages omit analytics and external font requests and send a no-referrer policy.

### Checking proposal changes

Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`. With Node 22.18+ and the PHP extensions listed above, run `node scripts/check-proposals.ts` for isolated API checks covering existing-database migration, authenticated creation, validation, separate client state, save/reopen, drawing persistence, revision conflicts, submitted price snapshots, and access controls. The script uses temporary storage and a stub mail transport; it never emails anyone or changes real proposals.

Manually check `/proposal/new/` and a client link at mobile and desktop widths, including drawing, undo, clear, saving, preview, and copying links. Production submission notifications still use the existing PHP `mail()` transport and the portfolio owner’s configured recipient in `public/proposal/api.php`.


## Customization

- Edit components in `/components/`
- Contact copy: `components/Contact.tsx`
- Services: `components/Services.tsx`
- Analytics: `ANALYTICS.md`
- Global styles: `styles/globals.css`
- Theme tokens: `:root` in `styles/globals.css`

### Adding New Sections
1. Create a component in `/components/`
2. Import it in `pages/index.astro`

## Project Structure

```
├── components/          # React islands and UI pieces
├── content/blog/        # MDX posts
├── layouts/             # Astro layouts
├── lib/                 # Shared helpers
├── pages/               # Astro routes
├── public/              # Static assets + api/contact.php
├── styles/              # Global CSS
└── dist/                # Generated static export (gitignored)
```
