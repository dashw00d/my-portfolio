# Portfolio Site

A business-focused portfolio website built with Next.js and Tailwind CSS.

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

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

(`npm run start` serves the standalone build output.)

## Deployment

This project is configured for a Next.js server runtime by default (`output: "standalone"`).

### Coolify (Recommended for self-hosting)
1. Use the included `Dockerfile`
2. Build context: repository root
3. Exposed port: `3000`
4. Start command is baked into the image (`node server.js`)

This keeps installs/build layers cached between deploys and is typically much faster than generic buildpacks.

### Vercel
1. Push to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Deploy automatically

### Static export (optional)
If you need a fully static export, set `STATIC_EXPORT=true` for build time and deploy the generated `out/` directory.

Note: static export disables server features (like API routes).

## Customization

### Updating Content
- Edit the components in `/components/` to change content
- Update contact information in `components/Contact.tsx`
- Modify services in `components/Services.tsx`
- Analytics setup/tracking: see `ANALYTICS.md`

### Styling
- Global styles are in `styles/globals.css`
- Tailwind config in `tailwind.config.js`
- Component-specific styles are inline with Tailwind classes

### Adding New Sections
1. Create a new component in `/components/`
2. Import and add it to `pages/index.tsx`

## Project Structure

```
├── components/          # Reusable React components
│   ├── Hero.tsx        # Hero section
│   ├── Problems.tsx    # Problem/solution section
│   ├── Services.tsx    # Services offered
│   ├── Process.tsx     # How we work
│   ├── Examples.tsx    # Case studies
│   ├── Contact.tsx     # Contact form/section
│   └── TerminalBlock.tsx # Animated terminal component
├── pages/              # Next.js pages
│   ├── _app.tsx        # App wrapper
│   └── index.tsx       # Home page
├── styles/             # Global styles
└── Configuration files # next.config.js, tailwind.config.js, etc.
```
