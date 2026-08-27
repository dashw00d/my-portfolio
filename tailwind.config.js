import typography from "@tailwindcss/typography";

const withOpacityValue = (variable) => ({ opacityValue }) => {
  if (opacityValue === undefined) {
    return `rgb(var(${variable}) / 1)`;
  }
  return `rgb(var(${variable}) / ${opacityValue})`;
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx,astro}',
    './components/**/*.{js,ts,jsx,tsx,mdx,astro}',
    './layouts/**/*.{js,ts,jsx,tsx,mdx,astro}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: withOpacityValue('--color-brand-50'),
          100: withOpacityValue('--color-brand-100'),
          200: withOpacityValue('--color-brand-200'),
          300: withOpacityValue('--color-brand-300'),
          400: withOpacityValue('--color-brand-400'),
          500: withOpacityValue('--color-brand-500'),
          600: withOpacityValue('--color-brand-600'),
          700: withOpacityValue('--color-brand-700'),
          800: withOpacityValue('--color-brand-800'),
          900: withOpacityValue('--color-brand-900'),
          950: withOpacityValue('--color-brand-950'),
          DEFAULT: withOpacityValue('--color-brand-500'),
        },
        accent: {
          50: withOpacityValue('--color-accent-50'),
          100: withOpacityValue('--color-accent-100'),
          200: withOpacityValue('--color-accent-200'),
          300: withOpacityValue('--color-accent-300'),
          400: withOpacityValue('--color-accent-400'),
          500: withOpacityValue('--color-accent-500'),
          600: withOpacityValue('--color-accent-600'),
          700: withOpacityValue('--color-accent-700'),
          800: withOpacityValue('--color-accent-800'),
          900: withOpacityValue('--color-accent-900'),
          950: withOpacityValue('--color-accent-950'),
          DEFAULT: withOpacityValue('--color-accent-500'),
        },
        highlight: {
          50: withOpacityValue('--color-highlight-50'),
          100: withOpacityValue('--color-highlight-100'),
          200: withOpacityValue('--color-highlight-200'),
          300: withOpacityValue('--color-highlight-300'),
          400: withOpacityValue('--color-highlight-400'),
          500: withOpacityValue('--color-highlight-500'),
          600: withOpacityValue('--color-highlight-600'),
          700: withOpacityValue('--color-highlight-700'),
          800: withOpacityValue('--color-highlight-800'),
          900: withOpacityValue('--color-highlight-900'),
          950: withOpacityValue('--color-highlight-950'),
          DEFAULT: withOpacityValue('--color-highlight-500'),
        },
        success: {
          50: withOpacityValue('--color-success-50'),
          100: withOpacityValue('--color-success-100'),
          200: withOpacityValue('--color-success-200'),
          300: withOpacityValue('--color-success-300'),
          400: withOpacityValue('--color-success-400'),
          500: withOpacityValue('--color-success-500'),
          600: withOpacityValue('--color-success-600'),
          700: withOpacityValue('--color-success-700'),
          800: withOpacityValue('--color-success-800'),
          900: withOpacityValue('--color-success-900'),
          950: withOpacityValue('--color-success-950'),
          DEFAULT: withOpacityValue('--color-success-500'),
        },
        warning: {
          50: withOpacityValue('--color-warning-50'),
          100: withOpacityValue('--color-warning-100'),
          200: withOpacityValue('--color-warning-200'),
          300: withOpacityValue('--color-warning-300'),
          400: withOpacityValue('--color-warning-400'),
          500: withOpacityValue('--color-warning-500'),
          600: withOpacityValue('--color-warning-600'),
          700: withOpacityValue('--color-warning-700'),
          800: withOpacityValue('--color-warning-800'),
          900: withOpacityValue('--color-warning-900'),
          950: withOpacityValue('--color-warning-950'),
          DEFAULT: withOpacityValue('--color-warning-500'),
        },
        danger: {
          50: withOpacityValue('--color-danger-50'),
          100: withOpacityValue('--color-danger-100'),
          200: withOpacityValue('--color-danger-200'),
          300: withOpacityValue('--color-danger-300'),
          400: withOpacityValue('--color-danger-400'),
          500: withOpacityValue('--color-danger-500'),
          600: withOpacityValue('--color-danger-600'),
          700: withOpacityValue('--color-danger-700'),
          800: withOpacityValue('--color-danger-800'),
          900: withOpacityValue('--color-danger-900'),
          950: withOpacityValue('--color-danger-950'),
          DEFAULT: withOpacityValue('--color-danger-500'),
        },
        // ForgeKit brand colors
        'forgekit-green': '#1e493d',
        'forgekit-zinc': '#18181b',
        'forgekit-tan': '#CDB380',
        'forgekit-dark': '#031634',
      },
    },
  },
  plugins: [typography],
};
