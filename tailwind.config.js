/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0e17',
        panel: '#111726',
        panel2: '#161d2e',
        edge: '#23304a',
        brand: '#3b82f6',
        brand2: '#22d3ee',
        accent: '#a855f7',
        muted: '#8aa0c6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(59,130,246,0.25), 0 8px 30px rgba(0,0,0,0.45)',
      },
    },
  },
  plugins: [],
}
