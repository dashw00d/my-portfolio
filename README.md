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

## Deployment

This project is configured for static site generation and can be deployed to:

### Vercel (Recommended)
1. Push to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Deploy automatically

### Netlify
1. Build command: `npm run build`
2. Publish directory: `out`
3. Deploy

### Other Platforms
The `next.config.js` is configured for static export, so it works on any static hosting service.

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
