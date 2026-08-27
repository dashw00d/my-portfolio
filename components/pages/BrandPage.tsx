import Link from "@/components/Link";
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function BrandKit() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(label);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const colorPalettes = {
    brand: {
      name: 'Brand Blues',
      description: 'Primary brand color - teal-inspired blues',
      shades: [
        { weight: 50, hex: '#E3F2F0', rgb: '227, 242, 240' },
        { weight: 100, hex: '#CDE7E4', rgb: '205, 231, 228' },
        { weight: 200, hex: '#A0D4D0', rgb: '160, 212, 208' },
        { weight: 300, hex: '#72C0BC', rgb: '114, 192, 188' },
        { weight: 400, hex: '#43ABA7', rgb: '67, 171, 167' },
        { weight: 500, hex: '#036564', rgb: '3, 101, 100' },
        { weight: 600, hex: '#035652', rgb: '3, 86, 82' },
        { weight: 700, hex: '#034743', rgb: '3, 71, 67' },
        { weight: 800, hex: '#023836', rgb: '2, 56, 54' },
        { weight: 900, hex: '#012927', rgb: '1, 41, 39' },
      ],
    },
    accent: {
      name: 'Accent Emerald-Navy',
      description: 'Secondary accent color - deep navy with emerald undertones',
      shades: [
        { weight: 50, hex: '#E4EDF2', rgb: '228, 237, 242' },
        { weight: 100, hex: '#C8DBE5', rgb: '200, 219, 229' },
        { weight: 200, hex: '#9AB7CD', rgb: '154, 183, 205' },
        { weight: 300, hex: '#6D94B4', rgb: '109, 148, 180' },
        { weight: 400, hex: '#417094', rgb: '65, 112, 148' },
        { weight: 500, hex: '#033649', rgb: '3, 54, 73' },
        { weight: 600, hex: '#02304F', rgb: '2, 48, 79' },
        { weight: 700, hex: '#022740', rgb: '2, 39, 64' },
        { weight: 800, hex: '#021F32', rgb: '2, 31, 50' },
        { weight: 900, hex: '#011725', rgb: '1, 23, 37' },
      ],
    },
    highlight: {
      name: 'Highlight Sand',
      description: 'Warm highlight color - soft sandy tones',
      shades: [
        { weight: 50, hex: '#FBF6ED', rgb: '251, 246, 237' },
        { weight: 100, hex: '#F6EDDC', rgb: '246, 237, 220' },
        { weight: 200, hex: '#EBDAC0', rgb: '235, 218, 192' },
        { weight: 300, hex: '#DEC49F', rgb: '222, 196, 159' },
        { weight: 400, hex: '#D1AF7F', rgb: '209, 175, 127' },
        { weight: 500, hex: '#CDB380', rgb: '205, 179, 128' },
        { weight: 600, hex: '#B69563', rgb: '182, 149, 99' },
        { weight: 700, hex: '#9A7C50', rgb: '154, 124, 80' },
        { weight: 800, hex: '#7E6240', rgb: '126, 98, 64' },
        { weight: 900, hex: '#634C30', rgb: '99, 76, 48' },
      ],
    },
    success: {
      name: 'Success Teal',
      description: 'Success states - vibrant teal',
      shades: [
        { weight: 500, hex: '#2B7E72', rgb: '43, 126, 114' },
        { weight: 600, hex: '#23665B', rgb: '35, 102, 91' },
      ],
    },
    warning: {
      name: 'Warning Ochre',
      description: 'Warning states - warm ochre',
      shades: [
        { weight: 500, hex: '#D88D2A', rgb: '216, 141, 42' },
        { weight: 600, hex: '#B27122', rgb: '178, 113, 34' },
      ],
    },
    danger: {
      name: 'Danger Clay',
      description: 'Error states - muted clay red',
      shades: [
        { weight: 500, hex: '#B02E2E', rgb: '176, 46, 46' },
        { weight: 600, hex: '#8E2424', rgb: '142, 36, 36' },
      ],
    },
  };

  const typography = {
    fontFamily: 'Nunito',
    fallback: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weights: [
      { name: 'Regular', weight: 400, usage: 'Body text, descriptions' },
      { name: 'Semibold', weight: 600, usage: 'Headings, labels, buttons' },
      { name: 'Bold', weight: 700, usage: 'Strong emphasis' },
    ],
    scale: [
      { name: 'xs', size: '0.75rem', lineHeight: '1rem', usage: 'Captions, labels' },
      { name: 'sm', size: '0.875rem', lineHeight: '1.25rem', usage: 'Small body text' },
      { name: 'base', size: '1rem', lineHeight: '1.5rem', usage: 'Body text' },
      { name: 'lg', size: '1.125rem', lineHeight: '1.75rem', usage: 'Large body text' },
      { name: 'xl', size: '1.25rem', lineHeight: '1.75rem', usage: 'Small headings' },
      { name: '2xl', size: '1.5rem', lineHeight: '2rem', usage: 'Section headings' },
      { name: '3xl', size: '1.875rem', lineHeight: '2.25rem', usage: 'Page headings' },
      { name: '4xl', size: '2.25rem', lineHeight: '2.5rem', usage: 'Hero headings' },
    ],
  };

  const spacing = {
    name: 'Tailwind Default Scale',
    values: [
      { token: '2', rem: '0.5rem', px: '8px', usage: 'Tight spacing' },
      { token: '4', rem: '1rem', px: '16px', usage: 'Default spacing' },
      { token: '6', rem: '1.5rem', px: '24px', usage: 'Card padding' },
      { token: '8', rem: '2rem', px: '32px', usage: 'Section spacing' },
      { token: '12', rem: '3rem', px: '48px', usage: 'Large gaps' },
      { token: '16', rem: '4rem', px: '64px', usage: 'Section padding (mobile)' },
      { token: '20', rem: '5rem', px: '80px', usage: 'Section padding (tablet)' },
      { token: '24', rem: '6rem', px: '96px', usage: 'Section padding (desktop)' },
    ],
  };

  const borderRadius = [
    { name: 'Small', class: 'rounded-lg', value: '0.5rem', usage: 'Badges, tags' },
    { name: 'Medium', class: 'rounded-xl', value: '0.75rem', usage: 'Buttons, inputs' },
    { name: 'Large', class: 'rounded-2xl', value: '1rem', usage: 'Cards, containers' },
    { name: 'Full', class: 'rounded-full', value: '9999px', usage: 'Pills, avatars' },
  ];

  const shadows = [
    { name: 'Small', class: 'shadow-sm', usage: 'Subtle elevation' },
    { name: 'Default', class: 'shadow', usage: 'Cards at rest' },
    { name: 'Medium', class: 'shadow-md', usage: 'Dropdown menus' },
    { name: 'Large', class: 'shadow-lg', usage: 'Modals, popovers' },
    { name: 'Extra Large', class: 'shadow-xl', usage: 'Hero cards' },
  ];

  const components = [
    {
      name: 'Primary Button',
      class: 'btn-primary',
      code: 'bg-gradient-to-r from-brand-600 to-accent-600 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:-translate-y-0.5',
    },
    {
      name: 'Secondary Button',
      class: 'btn-secondary',
      code: 'border-2 border-zinc-300 bg-white px-6 py-3 rounded-xl text-zinc-700 font-semibold hover:border-zinc-400',
    },
    {
      name: 'Card',
      class: 'card',
      code: 'rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-lg',
    },
    {
      name: 'Gradient Heading',
      class: 'gradient-heading',
      code: 'bg-gradient-to-r from-zinc-900 via-brand-900 to-accent-900 bg-clip-text text-transparent',
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-brand-50/30 to-accent-50/20">
        {/* Header */}
        <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <Link href="/" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 transition">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="mt-4 text-4xl font-bold text-zinc-900">Brand Kit</h1>
            <p className="mt-2 text-lg text-zinc-600">
              Design system and brand guidelines for consistent UI development
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-12">
          {/* Color Palettes */}
          <section className="mb-16">
            <h2 className="mb-2 text-3xl font-bold text-zinc-900">Color Palette</h2>
            <p className="mb-8 text-zinc-600">
              Semantic color tokens using CSS variables with Tailwind integration. All colors support opacity modifiers.
            </p>

            <div className="space-y-12">
              {Object.entries(colorPalettes).map(([key, palette]) => (
                <div key={key}>
                  <h3 className="mb-2 text-xl font-semibold text-zinc-900">{palette.name}</h3>
                  <p className="mb-4 text-sm text-zinc-600">{palette.description}</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-10">
                    {palette.shades.map((shade) => (
                      <button
                        key={shade.weight}
                        onClick={() => copyToClipboard(shade.hex, `${key}-${shade.weight}`)}
                        className="group relative overflow-hidden rounded-xl border border-zinc-200 shadow-sm transition hover:scale-105 hover:shadow-md"
                        title={`Click to copy ${shade.hex}`}
                      >
                        <div
                          className="h-24"
                          style={{ backgroundColor: shade.hex }}
                        />
                        <div className="bg-white p-3">
                          <div className="text-xs font-semibold text-zinc-900">{shade.weight}</div>
                          <div className="mt-1 text-xs text-zinc-500">{shade.hex}</div>
                          <div className="mt-0.5 text-xs text-zinc-400">rgb({shade.rgb})</div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                          {copiedColor === `${key}-${shade.weight}` ? (
                            <Check className="h-6 w-6 text-white" />
                          ) : (
                            <Copy className="h-6 w-6 text-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 rounded-lg bg-zinc-100 px-4 py-2 font-mono text-sm text-zinc-700">
                    <span className="text-zinc-500">Tailwind:</span> <code>bg-{key}-500</code>, <code>text-{key}-600</code>, <code>border-{key}-200</code>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section className="mb-16">
            <h2 className="mb-2 text-3xl font-bold text-zinc-900">Typography</h2>
            <p className="mb-8 text-zinc-600">
              Primary typeface: {typography.fontFamily} with system font fallbacks
            </p>

            <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-zinc-900">Font Weights</h3>
              <div className="space-y-4">
                {typography.weights.map((weight) => (
                  <div key={weight.weight} className="flex items-baseline gap-4">
                    <span
                      className="text-2xl"
                      style={{ fontWeight: weight.weight }}
                    >
                      {weight.name}
                    </span>
                    <span className="text-sm text-zinc-500">
                      {weight.weight} - {weight.usage}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-zinc-900">Type Scale</h3>
              <div className="space-y-6">
                {typography.scale.map((size) => (
                  <div key={size.name} className="border-b border-zinc-100 pb-4 last:border-0">
                    <div className="mb-2 flex items-baseline gap-3">
                      <code className="rounded bg-zinc-100 px-2 py-1 text-sm font-semibold text-brand-600">
                        text-{size.name}
                      </code>
                      <span className="text-sm text-zinc-500">
                        {size.size} / {size.lineHeight}
                      </span>
                      <span className="text-sm text-zinc-400">{size.usage}</span>
                    </div>
                    <p
                      className="text-zinc-900"
                      style={{ fontSize: size.size, lineHeight: size.lineHeight }}
                    >
                      The quick brown fox jumps over the lazy dog
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Spacing */}
          <section className="mb-16">
            <h2 className="mb-2 text-3xl font-bold text-zinc-900">Spacing</h2>
            <p className="mb-8 text-zinc-600">
              Consistent spacing scale using Tailwind defaults
            </p>

            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <table className="w-full">
                <thead className="border-b border-zinc-200 bg-zinc-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">Token</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">REM</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">Pixels</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">Usage</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">Visual</th>
                  </tr>
                </thead>
                <tbody>
                  {spacing.values.map((space) => (
                    <tr key={space.token} className="border-b border-zinc-100 last:border-0">
                      <td className="px-6 py-4">
                        <code className="rounded bg-zinc-100 px-2 py-1 text-sm font-semibold text-brand-600">
                          {space.token}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-700">{space.rem}</td>
                      <td className="px-6 py-4 text-sm text-zinc-700">{space.px}</td>
                      <td className="px-6 py-4 text-sm text-zinc-600">{space.usage}</td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-brand-500" style={{ width: space.rem }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Border Radius */}
          <section className="mb-16">
            <h2 className="mb-2 text-3xl font-bold text-zinc-900">Border Radius</h2>
            <p className="mb-8 text-zinc-600">
              Rounded corners for different component types
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {borderRadius.map((radius) => (
                <div key={radius.name} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <div className={`mb-4 h-24 bg-gradient-to-br from-brand-500 to-accent-500 ${radius.class}`} />
                  <h3 className="text-lg font-semibold text-zinc-900">{radius.name}</h3>
                  <code className="mt-1 block text-sm text-brand-600">{radius.class}</code>
                  <p className="mt-1 text-sm text-zinc-500">{radius.value}</p>
                  <p className="mt-2 text-xs text-zinc-600">{radius.usage}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Shadows */}
          <section className="mb-16">
            <h2 className="mb-2 text-3xl font-bold text-zinc-900">Shadows</h2>
            <p className="mb-8 text-zinc-600">
              Elevation system for creating depth
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shadows.map((shadow) => (
                <div key={shadow.name} className="rounded-2xl border border-zinc-200 bg-white p-6">
                  <div className={`mb-4 flex h-24 items-center justify-center rounded-xl bg-white ${shadow.class}`}>
                    <span className="text-sm font-semibold text-zinc-400">Elevation</span>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900">{shadow.name}</h3>
                  <code className="mt-1 block text-sm text-brand-600">{shadow.class}</code>
                  <p className="mt-2 text-xs text-zinc-600">{shadow.usage}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Components */}
          <section className="mb-16">
            <h2 className="mb-2 text-3xl font-bold text-zinc-900">Component Styles</h2>
            <p className="mb-8 text-zinc-600">
              Pre-built component classes defined in globals.css
            </p>

            <div className="space-y-8">
              {components.map((component) => (
                <div key={component.name} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-zinc-900">{component.name}</h3>
                  <div className="mb-4 flex items-center gap-4">
                    {component.name.includes('Button') ? (
                      <button className={component.class}>
                        Example Button
                      </button>
                    ) : component.name === 'Card' ? (
                      <div className={`${component.class} w-64`}>
                        <h4 className="font-semibold">Card Title</h4>
                        <p className="mt-2 text-sm text-zinc-600">Card content goes here</p>
                      </div>
                    ) : (
                      <h4 className={`${component.class} text-2xl`}>Gradient Heading</h4>
                    )}
                  </div>
                  <div className="rounded-lg bg-zinc-900 p-4">
                    <code className="text-xs text-zinc-100">{component.code}</code>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Design Principles */}
          <section>
            <h2 className="mb-2 text-3xl font-bold text-zinc-900">Design Principles</h2>
            <p className="mb-8 text-zinc-600">
              Guidelines for maintaining consistency
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-zinc-900">Visual Hierarchy</h3>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li>• Use gradient headings for emphasis</li>
                  <li>• Maintain consistent font weights</li>
                  <li>• Apply proper spacing between sections</li>
                  <li>• Use shadows to create depth</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-zinc-900">Interaction</h3>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li>• Subtle hover animations (-translate-y-0.5)</li>
                  <li>• Clear focus states (ring-2)</li>
                  <li>• Smooth transitions (duration-300)</li>
                  <li>• Accessible touch targets (min 44x44px)</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-zinc-900">Color Usage</h3>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li>• Brand colors for primary actions</li>
                  <li>• Accent for secondary elements</li>
                  <li>• Highlight for warmth and emphasis</li>
                  <li>• Semantic colors for states</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-zinc-900">Accessibility</h3>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li>• WCAG AA contrast ratios</li>
                  <li>• Keyboard navigation support</li>
                  <li>• Screen reader friendly markup</li>
                  <li>• Focus-visible indicators</li>
                </ul>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-zinc-200 bg-white/80 py-8">
          <div className="mx-auto max-w-7xl px-6 text-center text-sm text-zinc-600">
            Brand Kit powered by Next.js + Tailwind CSS
          </div>
        </footer>
      </div>
    </>
  );
}
