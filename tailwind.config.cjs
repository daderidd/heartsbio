/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // Primary: Deep blue - scientific credibility and trust
          primary: '#2563EB',    // Bright blue
          // Secondary: Teal - biotechnology and life sciences
          secondary: '#0D9488',  // Teal
          // Accent: Purple - innovation and R&D
          accent: '#7C3AED',     // Purple
          // Neutral: Dark gray for text
          neutral: '#1F2937',
        }
      },
      fontFamily: {
        // Sans-serif for body text - clean and modern
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        // Display font for headings - inspired by Phospholutions' Manrope
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
