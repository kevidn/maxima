/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Forest green brand ────────────────
        forest: {
          950: '#071a0f',
          900: '#0d2b1d',
          800: '#1b4332',  // PRIMARY - dark sidebar, CTAs
          700: '#2d6a4f',
          600: '#40916c',
          500: '#52b788',
          400: '#74c69d',
          300: '#95d5b2',
          200: '#b7e4c7',
          100: '#d8f3dc',
          50:  '#eef7f1',
        },
        // ── Coral / pomelo interior ───────────
        coral: {
          900: '#7f1d1d',
          800: '#991b1b',
          700: '#b91c1c',
          600: '#c25c52',  // PRIMARY CORAL accent
          500: '#d4726a',
          400: '#e8958d',
          300: '#f0b8b3',
          200: '#f8d7d4',
          100: '#faeae8',
          50:  '#fdf4f3',
        },
        // ── Stone / warm neutrals ─────────────
        stone: {
          950: '#0c0a09',
          900: '#1c1917',  // PRIMARY text
          800: '#292524',
          700: '#44403c',
          600: '#57534e',
          500: '#78716c',
          400: '#a8a29e',
          300: '#d6d3d1',
          200: '#e7e5e4',
          100: '#f5f5f4',
          50:  '#fafaf9',
        },
        // ── Sage accent ───────────────────────
        sage: {
          700: '#3d6b4a',
          600: '#4a7c59',
          500: '#6b9e7a',
          400: '#8fb89e',
          200: '#c5dccb',
          100: '#e2f0e6',
          50:  '#f3f9f5',
        },
        // ── Warm canvas ───────────────────────
        canvas: {
          base:    '#f9f8f5',
          warm:    '#f5f3ee',
          paper:   '#fffffe',
          subtle:  '#f0ede6',
        },
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Cormorant SC"', '"Cormorant Garamond"', 'serif'],
        mono:    ['"IBM Plex Mono"', 'Menlo', 'monospace'],
        sans:    ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':    '0 1px 4px rgba(0,0,0,0.06), 0 6px 24px rgba(0,0,0,0.05)',
        'card-md': '0 2px 8px rgba(0,0,0,0.07), 0 12px 40px rgba(0,0,0,0.07)',
        'card-lg': '0 4px 16px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.08)',
        'forest':  '0 4px 20px rgba(27,67,50,0.25)',
        'coral':   '0 4px 20px rgba(194,92,82,0.30)',
        'inset-top': 'inset 0 3px 0 0',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
        'topo-light': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M0 100 Q50 70 100 100 Q150 130 200 100' stroke='%231b433210' fill='none' stroke-width='1'/%3E%3Cpath d='M0 70 Q50 40 100 70 Q150 100 200 70' stroke='%231b43320a' fill='none' stroke-width='1'/%3E%3Cpath d='M0 130 Q50 100 100 130 Q150 160 200 130' stroke='%231b43320a' fill='none' stroke-width='1'/%3E%3C/svg%3E\")",
        'hero-gradient': 'radial-gradient(ellipse 70% 50% at 50% 0%, #eef7f1 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 90% 80%, #faeae8 0%, transparent 60%)',
      },
      animation: {
        'float':     'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-coral': 'pulseCoral 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-6px)' },
        },
        pulseCoral: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(194,92,82,0.3)' },
          '50%':       { boxShadow: '0 0 0 8px rgba(194,92,82,0)' },
        },
      },
    },
  },
  plugins: [],
}
