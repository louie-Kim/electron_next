/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Segoe UI',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },
      colors: {
        'slate-950-tint': '#0f172a',
      },
      boxShadow: {
        panel: '0 25px 50px -12px rgba(15, 23, 42, 0.1)',
      },
    },
  },
  plugins: [],
}
