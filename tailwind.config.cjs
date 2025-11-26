/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Minimalist Green & Cream Palette
        'dark-green': '#1d261d',      // Deep green background
        'green': '#243f2e',            // Lighter green for cards on dark
        'cream': '#f5f4f0',            // Cream for light cards/backgrounds
        'black': '#000000',            // Black text/footer
        'white': '#ffffff',            // White text
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
