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
3. Enable PHP only for `/api/contact.php`
4. Copy `contact.config.example.php` to `contact.config.php` in the repo root and add SMTP credentials

An nginx starting point lives in `deploy/nginx.conf.example`. Keep PHP-FPM on `ondemand` so idle RAM is just nginx.

## Contact form

The form posts JSON to `/api/contact.php`. That script speaks SMTP over a short-lived PHP request (or PHP `mail()` if SMTP is unset). It is not a standing Node mail server.

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
