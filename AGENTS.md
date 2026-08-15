# Repository Guidelines

## Project Structure & Module Organization
Source lives in `pages/` for route entries and `components/` for reusable, typed React building blocks (PascalCase). Global styling is in `styles/globals.css`, composed with Tailwind utilities configured via `tailwind.config.js` and `postcss.config.js`. Keep shared constants or helpers inside `components/` alongside the consumers until a dedicated `lib/` directory is introduced. The `out/` folder holds static export artefacts—never edit or commit manual changes there.

## Build, Test, and Development Commands
Run `npm run dev` for the local Next.js dev server with fast refresh. Production is a static export (`npm run build:static`) served by `docker/static-server.mjs` — HTML and assets get long-lived cache headers, and only `POST /api/contact` stays dynamic. `npm run start` serves that static tree. `npm run lint` executes the Next/ESLint ruleset; fix warnings before pushing.

## Coolify
Dockerfile build pack on `ae-coolify-01`. Git push auto-deploys; Docker layer cache must stay warm (do not force-rebuild, do not enable nightly Docker cleanup). Never build this image in GitHub Actions. Caps: 64m / 0.15 CPU. Follow the `coolify-docker-deploys` skill.

## Coding Style & Naming Conventions
TypeScript is required for all new modules. Favour 2-space indentation (default in the repo), and keep imports sorted by path depth. Components and hooks use PascalCase and camelCase names respectively (e.g. `components/Hero.tsx`, `useViewport`). Tailwind utility classes should be grouped semantically (layout → spacing → typography). When shared styling becomes verbose, promote it to reusable class names inside `globals.css`.

## Theming & Color Palette
Semantic color tokens (`brand`, `accent`, `highlight`, `success`, `warning`, `danger`) are defined as CSS variables in `styles/globals.css` and surfaced through Tailwind in `tailwind.config.js`. Use these tokens in class names (e.g. `bg-brand-600`, `text-success-500`) instead of raw colour names so swapping palettes only requires updating the variables. To adjust the look and feel, edit the RGB values in `:root` without touching component code.

## Contact Form Configuration
The contact form posts to `/api/contact` which uses Nodemailer. Add the following environment variables to `.env.local` (and hosting provider secrets) before deploying:

```
SMTP_HOST=your.smtp.host
SMTP_PORT=587          # use 465 for SSL
SMTP_USER=your-username
SMTP_PASS=your-password
CONTACT_TO=ryan@dashwood.net
CONTACT_FROM=Portfolio <ryan@dashwood.net>   # optional override
CONTACT_BCC=ryan@dashwood.net                # optional
```

Run `npm install` after setting these to ensure dependencies are installed, then `npm run dev` or `npm run build`.

## Testing Guidelines
No automated test suite ships today; align on adding React Testing Library or Playwright tests when introducing complex behaviour. Until then, rely on `npm run lint` plus manual verification across mobile and desktop breakpoints. Document expected screenshots or acceptance criteria in your PR description so reviewers can reproduce.

## Commit & Pull Request Guidelines
Follow the existing imperative, concise commit style (`initial commit`); keep messages under ~72 characters and expand details in the body when needed. Each pull request should describe the change, list manual checks (commands run, browsers tested), and link related issues. Attach before/after screenshots or videos when UI changes are involved, and request review from another contributor before merging.
