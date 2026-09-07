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
        // Core soil/bark palette
        soil: {
          50:  '#fdf6f0',
          100: '#f9e8d8',
          200: '#f0cca8',
          300: '#e4a96f',
          400: '#d4813c',
          500: '#b8621e',
          600: '#964d18',
          700: '#6e3812',
          800: '#4a260c',
          900: '#2c1508',
          950: '#180b04',
        },
        // Pomelo citrus spectrum
        citrus: {
          50:  '#fff9eb',
          100: '#ffefc4',
          200: '#ffdb84',
          300: '#ffc240',
          400: '#ffa720',
          500: '#f98208',
          600: '#dd5d04',
          700: '#b73d07',
          800: '#942f0e',
          900: '#7a280f',
          950: '#461103',
        },
        // Pomelo interior pink/coral
        pomelo: {
          50:  '#fff2f2',
          100: '#ffe1e1',
          200: '#ffc8c8',
          300: '#ffa0a0',
          400: '#ff6b6b',
          500: '#f83b3b',
          600: '#e51c1c',
          700: '#c11313',
          800: '#a01414',
          900: '#841818',
          950: '#490707',
        },
        // Deep lime accent
        lime: {
          50:  '#f4ffe6',
          100: '#e6ffc9',
          200: '#c9ff99',
          300: '#a3f460',
          400: '#7fe030',
          500: '#5ec412',
          600: '#469c0b',
          700: '#36770d',
          800: '#2c5e10',
          900: '#254f11',
          950: '#102c04',
        },
        // Neutral bark tones
        bark: {
          50:  '#f7f4f0',
          100: '#ede6dc',
          200: '#dacdb8',
          300: '#c3ad8e',
          400: '#ad8f68',
          500: '#9e7a50',
          600: '#886545',
          700: '#6e4f38',
          800: '#5c4232',
          900: '#4e392d',
          950: '#2a1d16',
        },
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Cormorant SC"', '"Cormorant Garamond"', 'serif'],
        mono: ['"IBM Plex Mono"', 'Menlo', 'monospace'],
        sans: ['"Jost"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'topo-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpath d='M0 50 Q25 20 50 50 Q75 80 100 50' stroke='%23ffffff08' fill='none' stroke-width='1'/%3E%3Cpath d='M0 30 Q25 0 50 30 Q75 60 100 30' stroke='%23ffffff05' fill='none' stroke-width='1'/%3E%3Cpath d='M0 70 Q25 40 50 70 Q75 100 100 70' stroke='%23ffffff05' fill='none' stroke-width='1'/%3E%3C/svg%3E\")",
        'citrus-radial': 'radial-gradient(ellipse at 30% 20%, #ffa72033 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, #f83b3b22 0%, transparent 50%)',
        'soil-gradient': 'linear-gradient(135deg, #2c1508 0%, #4a260c 40%, #180b04 100%)',
        'leaf-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cellipse cx='30' cy='30' rx='12' ry='20' stroke='%235ec41210' fill='none' stroke-width='1' transform='rotate(45 30 30)'/%3E%3Cellipse cx='30' cy='30' rx='12' ry='20' stroke='%235ec41208' fill='none' stroke-width='1' transform='rotate(-45 30 30)'/%3E%3C/svg%3E\")",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan-line': 'scanLine 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scanLine: {
          '0%': { top: '0%', opacity: '1' },
          '50%': { opacity: '0.5' },
          '100%': { top: '100%', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px #ffa72040' },
          '50%': { boxShadow: '0 0 40px #ffa72080, 0 0 60px #ffa72030' },
        },
      },
      boxShadow: {
        'citrus': '0 4px 24px -4px #ffa72060',
        'pomelo': '0 4px 24px -4px #f83b3b60',
        'soil': '0 4px 24px -4px #2c150880',
        'lime': '0 4px 24px -4px #5ec41260',
        'inner-glow': 'inset 0 0 40px #ffa72010',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}
