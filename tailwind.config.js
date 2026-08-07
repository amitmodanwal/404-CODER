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
        synapse: {
          dark: '#0B1220',
          card: '#111A2E',
          border: '#1E293B',
          light: '#F8FAFC',
          purple: '#6C3BFF',
          purpleLight: '#8B5CF6',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#EF4444',
          cyan: '#06B6D4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        pixel: ['Press Start 2P', 'monospace'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
