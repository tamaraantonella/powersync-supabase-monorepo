import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './shared/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'skeleton-animation': 'shadow-effect 1s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        'shadow-effect': {
          '0%': { left: '-200%' },
          '40%, 100%': { left: '100%' },
        },
        'accordion-down': {
          from: { height: 0, opacity: 0 },
          to: { height: 'var(--radix-accordion-content-height)', opacity: 1 },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)', opacity: 1 },
          to: { height: 0, opacity: 0 },
        },
      },
      backgroundImage: {
        'skeleton-animation-gradient':
          'linear-gradient(90deg,rgba(0, 0, 0, 0) 0%,#00000015 50%,rgba(0, 0, 0, 0) 100%)',
      },
      fontWeight: {
        inherit: 'inherit',
        h1: defaultTheme.fontWeight.semibold,
        h2: defaultTheme.fontWeight.semibold,
        h3: defaultTheme.fontWeight.semibold,
        h4: defaultTheme.fontWeight.semibold,
        subtitle1: defaultTheme.fontWeight.normal,
        subtitle2: defaultTheme.fontWeight.semibold,
        body1: defaultTheme.fontWeight.normal,
        body2: defaultTheme.fontWeight.normal,
        body3: defaultTheme.fontWeight.normal,
        button: defaultTheme.fontWeight.semibold,
        'sub-button': defaultTheme.fontWeight.semibold,
        'active-label': defaultTheme.fontWeight.normal,
        'passive-label': defaultTheme.fontWeight.normal,
        'select-option': defaultTheme.fontWeight.normal,
      },
    },
  },
};
