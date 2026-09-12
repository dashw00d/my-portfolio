# Portfolio Site

A business-focused portfolio website built with Astro, React islands, and Tailwind CSS. Production is a static HTML export plus one PHP mail endpoint.

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

## Southern Star proposal

The private client page is `/p/southern-star/`, and Ryan's review screen is `/proposal/review/`. The proposal API is `public/proposal/api.php` and stores data in SQLite at `data/proposal/proposals.sqlite`, outside the public build output.

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
