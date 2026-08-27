# CLAUDE.md

Guidance for working in this repository.

## Development Commands

- **Development server**: `npm run dev` — Astro at http://localhost:3000
- **Production build**: `npm run build` — static export in `dist/`
- **Production preview**: `npm run preview` — serves the `dist/` tree locally
- **Linting**: `npm run lint`

## Architecture Overview

This is a **statically-exported Astro 5 portfolio**. nginx serves HTML from `dist/`. The only dynamic endpoint is `public/api/contact.php`, which PHP-FPM runs on demand.

- **Static export** (Astro default `dist/`)
- **React islands** for interactive UI (`client:load` / `client:idle` / `client:visible`)
- **CSS-in-JS theming** via semantic color tokens in Tailwind

### Page Structure

The main landing page (`pages/index.astro`) composes sections in this order:
1. Navigation (layout)
2. Hero
3. Problems
4. Services
5. Process
6. Examples
7. Contact
8. Footer (layout)

Each section is a self-contained component in `/components/`.

### Theming System

- **Color tokens**: `brand`, `accent`, `highlight`, `success`, `warning`, `danger`
- **Definition**: RGB values in CSS variables in `styles/globals.css` (`:root`)
- **Usage**: Tailwind classes like `bg-brand-600`, `text-success-500`
- **To change theme**: Edit RGB values in `:root` without touching component code

The `tailwind.config.js` uses a `withOpacityValue` helper to map CSS variables to Tailwind with opacity support.

### Path Aliases

TypeScript is configured with `@/*` pointing to the repo root:
```typescript
import Component from '@/components/Component'
```

## Code Style

- **TypeScript required** for all new modules
- **2-space indentation**
- **Component naming**: PascalCase (e.g. `Hero.tsx`)
- **Hook naming**: camelCase (e.g. `useShallowQuery`)
- **Import sorting**: By path depth
- **Tailwind classes**: Group semantically (layout → spacing → typography)
- **Shared styles**: Promote verbose utility combinations to reusable classes in `globals.css`

## Static Export Notes

- No Node server at runtime
- `dist/` contains build artifacts — gitignored, never edit directly
- Trailing slashes are always on (`trailingSlash: 'always'`)
- Contact mail is PHP, not a Node process

## Content Updates

- **Contact info**: Edit `components/Contact.tsx`
- **Services**: Edit `components/Services.tsx`
- **Meta tags**: Update in the matching `pages/*.astro` frontmatter / `BaseLayout` props
- **New sections**: Create a component in `/components/`, import in `pages/index.astro`
- **Blog posts**: Add MDX under `content/blog/`
