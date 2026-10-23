/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./client/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070a12',
          900: '#0b0f19',
          800: '#111827',
          700: '#1e293b',
          600: '#334155'
        },
        electric: {
          blue: '#38bdf8',
          violet: '#818cf8',
          purple: '#c084fc'
        }
      }
    },
  },
  plugins: [],
}
