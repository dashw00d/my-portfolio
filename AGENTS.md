# Repository Guidelines

## Project Structure & Module Organization
This is a statically built Astro site. Routes live in `pages/` as `.astro` files. Reusable React islands are in `components/` (PascalCase). Shared helpers are in `lib/`. Global styling is in `styles/globals.css`, composed with Tailwind via `tailwind.config.js` and `postcss.config.js`. Blog posts are MDX files in `content/blog/`. `npm run build` writes HTML to `dist/` — that directory is gitignored. Never edit it by hand.

## Build and Development Commands
- `npm run dev` — Astro dev server at http://localhost:3000
- `npm run build` — static export into `dist/`
- `npm run preview` — preview the `dist/` tree locally
- `npm run lint` — ESLint, including Astro files

Production is nginx (or Apache) serving `dist/`. There is no Node server at runtime.

## Hosting
Point the vhost document root at `dist/`. See `deploy/nginx.conf.example`. After a git pull, run `npm ci && npm run build`.

Copy `.env.example` to `.env` in the repo root and fill SMTP values, or set the same variables in the host panel. The PHP script loads process env first, then `.env`. The contact form posts to `/api/contact.php`. Use ondemand PHP-FPM so idle memory stays with nginx.

## Coding Style & Naming Conventions
TypeScript is required for all new modules. Favour 2-space indentation, and keep imports sorted by path depth. Components and hooks use PascalCase and camelCase respectively (e.g. `components/Hero.tsx`, `useShallowQuery`). Tailwind utility classes should be grouped semantically (layout → spacing → typography). When shared styling becomes verbose, promote it to reusable class names inside `globals.css`.

## Theming & Color Palette
Semantic color tokens (`brand`, `accent`, `highlight`, `success`, `warning`, `danger`) are defined as CSS variables in `styles/globals.css` and surfaced through Tailwind in `tailwind.config.js`. Use these tokens in class names (e.g. `bg-brand-600`, `text-success-500`) instead of raw colour names. To adjust the look and feel, edit the RGB values in `:root` without touching component code.

## Contact Form Configuration
The form posts JSON to `/api/contact.php`. Set these as environment variables (or in a gitignored `.env` at the repo root):

```
SMTP_HOST=your.smtp.host
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
CONTACT_TO=ryan@dashwood.net
CONTACT_FROM=Portfolio <ryan@dashwood.net>
CONTACT_BCC=ryan@dashwood.net
```

If SMTP is not configured, the script falls back to PHP `mail()`.

## Testing Guidelines
No automated test suite ships today. Until then, rely on `npm run lint` plus manual verification across mobile and desktop breakpoints.

## Commit & Pull Request Guidelines
Follow the existing imperative, concise commit style; keep messages under ~72 characters and expand details in the body when needed. Each pull request should describe the change, list manual checks, and attach before/after screenshots when UI changes are involved.
