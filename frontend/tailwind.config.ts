import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        workspace: {
          900: '#020617', // Very deep slate body
          800: '#0F172A', // Sidebars
          700: '#1E293B', // Active segments
          border: '#334155', // Structural borders
        },
        ai: {
          purple: '#8B5CF6',
          pink: '#EC4899',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};

export default config;
