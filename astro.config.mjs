// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://heartsbio.nl',
  integrations: [
    tailwind(),
    react(),
    mdx(),
    sitemap({
      // Emits hreflang alternates linking each English page to its /nl/ twin
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', nl: 'nl' },
      },
    }),
  ],
});
