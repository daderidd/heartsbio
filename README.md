# HeartsBio Website

A modern, GDPR-compliant business landing page with R&D portfolio showcase built with Astro, Tailwind CSS, and TypeScript.

**Status:** ✅ Live in Production on Netlify
**Deployed:** November 27, 2024

## Project Overview

HeartsBio's website is a professional single-page landing experience featuring:
- Full-screen hero with background video and rotating adjectives
- Company overview and core values (About section)
- Technology platform and research process (4-stage workflow)
- Impact metrics with animated KPI displays
- R&D portfolio showcase (5 research areas)
- Contact form with GDPR-compliant privacy consent
- **Cookie consent banner** with customizable preferences (Essential, Analytics, Marketing)
- **Google Analytics integration** that respects user privacy choices
- Legal pages (Privacy Policy with cookie details, Terms of Service)

## Design Inspiration

Inspired by [Phospholutions](https://www.phospholutions.com/), featuring:
- Clean, modern aesthetic
- Bold KPI displays with compelling metrics
- Data-driven storytelling
- High-quality imagery and video integration
- Simple, intuitive navigation
- Social proof through partnerships and testimonials

## Tech Stack

### Core Framework
- **Astro 5.x** - Modern static site generator optimized for content-focused sites
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.x** - Utility-first CSS framework (custom components, no DaisyUI)

### Content Management
- **Astro Content Collections** - Type-safe, file-based content management
- **MDX** - Markdown with embedded JSX components for rich R&D content

### Additional Features
- **@astrojs/react** - React integration for interactive components (CookieConsent)
- **@astrojs/sitemap** - Automatic sitemap generation
- **@astrojs/image** - Image optimization with lazy loading
- **Google Analytics 4** - Privacy-respecting analytics (consent-based)

## Project Structure

```
heartsbio-website/
├── src/
│   ├── components/          # Reusable components
│   │   ├── CookieConsent.tsx      # GDPR cookie consent banner (React)
│   │   ├── GoogleAnalytics.astro  # GA4 integration with consent
│   │   ├── ui/              # UI elements (KPICard, BeforeAfter, etc.)
│   │   ├── sections/        # Page sections (Hero, Technology, etc.)
│   │   └── layout/          # Header, Footer, Navigation
│   ├── content/             # Content Collections
│   │   ├── config.ts        # Content schema definitions
│   │   ├── projects/        # R&D portfolio items (MDX)
│   │   └── case-studies/    # Case studies and success stories
│   ├── layouts/             # Page layouts
│   │   └── BaseLayout.astro # Base page template
│   ├── pages/               # Routes (file-based routing)
│   │   ├── index.astro      # Homepage (single-page design)
│   │   ├── privacy.astro    # Privacy Policy (GDPR)
│   │   └── terms.astro      # Terms of Service
│   ├── styles/              # Global styles
│   │   └── global.css       # Global CSS and Tailwind directives
│   └── lib/                 # Utilities and helpers
│       └── utils.ts         # Helper functions
├── public/                  # Static assets
│   ├── images/              # Images
│   ├── videos/              # Video files
│   └── favicon.svg          # Favicon
├── astro.config.mjs         # Astro configuration
├── tailwind.config.cjs      # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies
├── DEPLOYMENT_GUIDE.md      # Complete deployment instructions
├── GOOGLE_ANALYTICS_SETUP.md # GA4 setup and testing guide
├── IMPLEMENTATION_PLAN.md   # Full project roadmap and progress
└── README.md                # This file
```

## Brand Identity

### Colors
HeartsBio's minimalist color palette inspired by Phospholutions:

- **Dark Green**: `#1d261d` - Primary brand color for backgrounds and emphasis
- **Green**: `#243f2e` - Secondary green for accents and cards
- **Cream**: `#f5f4f0` - Warm neutral for cards and contrast
- **Black/White**: `#000000` / `#ffffff` - For text and clarity

The palette emphasizes clean, professional aesthetics with natural earth tones reflecting biotechnology and sustainability.

### Typography
- **Display Font**: System font stack - Modern, professional
- **Body Font**: System font stack - Clean, readable, performant

Using system fonts for optimal performance and native feel.

### Logo & Assets
- Favicon: Dark green rounded square with white "H" letter
- Brand assets in `public/images/`
- R&D portfolio images in `public/images/R&D portfolio/`

## Homepage Structure

The site uses a single-page scroll design with smooth anchor navigation:

1. **Hero** - Full-screen video background with rotating adjectives
2. **Technology** - Research process overview with 4-stage workflow
3. **Stats** - Impact metrics with animated KPI cards (dark green background)
4. **Portfolio** - 5 R&D research areas with project cards
5. **About** - Company mission and 6 core values
6. **Contact** - Contact form with GDPR privacy consent checkbox

All sections accessible via navigation menu with smooth scrolling.

**Note:** Partners/testimonial section is hidden (can be re-enabled in `Partners.astro`)

## Key Features

### GDPR Compliance
- **Cookie Consent Banner** - Customizable preferences with 3 categories:
  - Essential cookies (always enabled)
  - Analytics cookies (Google Analytics, opt-in)
  - Marketing cookies (opt-in)
- **LocalStorage-based consent** - Persists user choices across sessions
- **Privacy-first analytics** - GA4 loads only after user consent
- **IP anonymization** - Protects user privacy (GDPR requirement)
- **Privacy Policy** - Comprehensive policy with cookie details
- **Contact form consent** - Required privacy policy acceptance checkbox

### Custom Components
- **CookieConsent** (React) - Interactive cookie consent banner
- **GoogleAnalytics** - Consent-aware GA4 integration
- **KPICard** - Display key metrics with icons/pictograms
- **BeforeAfter** - Before-after comparison component
- **VideoEmbed** - YouTube/video integration
- **MetricDisplay** - Bold stat displays
- **ProjectCard** - R&D project showcase cards

### Content Types
- **Projects** - R&D portfolio items with detailed descriptions
- **Case Studies** - Success stories with metrics and comparisons
- **Blog Posts** (optional) - News and updates

## Development

### Prerequisites
- Node.js 18+
- npm or pnpm

### Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro -- --help` | Get help with Astro CLI |

### Development Workflow
1. Update content in `src/content/` (MDX files)
2. Build components in `src/components/`
3. Create/modify pages in `src/pages/`
4. Style with Tailwind utility classes
5. Test locally with `npm run dev`

## Content Management

### Adding R&D Projects
1. Create new MDX file in `src/content/projects/`
2. Follow schema defined in `src/content/config.ts`
3. Include frontmatter with metadata
4. Write content with embedded components

Example:
```mdx
---
title: "Project Name"
description: "Brief description"
date: 2024-01-01
category: "Research"
featured: true
image: "/images/project.jpg"
---

# Project Details

Your content here with **markdown** and <CustomComponent />
```

### Adding Case Studies
Similar process in `src/content/case-studies/` with before-after data, KPIs, etc.

## Deployment

**Current Status:** ✅ Deployed on Netlify with auto-deploy from GitHub

### Build Process
```bash
npm run build      # Production build
npm run preview    # Test production build locally
```
Generates optimized static site in `./dist/` directory (186KB → 58KB gzipped).

### Hosting (Netlify)
- **Platform:** Netlify
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Auto-deploy:** Enabled on push to `main` branch
- **HTTPS:** Automatic SSL certificate
- **CDN:** Global edge network

For detailed deployment instructions, see **`DEPLOYMENT_GUIDE.md`**

### Environment Variables (Optional)
For Google Analytics (recommended to use environment variable in production):
```env
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Add in Netlify dashboard: Site settings → Environment variables

## Performance

Astro's architecture ensures:
- Zero JavaScript by default (only where needed)
- Optimized images with lazy loading
- Fast page loads with static generation
- SEO-friendly with server-side rendering

## SEO & Analytics

### SEO Features
- Comprehensive meta tags in BaseLayout
- Open Graph tags for social sharing
- Twitter Card metadata
- **Auto-generated sitemap** (`/sitemap-index.xml`)
- Canonical URLs
- Structured data (JSON-LD for organization)
- Optimized for search engines

### Analytics
- **Google Analytics 4** integration
- Only loads after user consent (GDPR-compliant)
- IP anonymization enabled
- Custom event tracking for cookie consent
- Setup guide: `GOOGLE_ANALYTICS_SETUP.md`

## Maintenance & Updates

### Content Updates
1. Edit content in MDX files or components
2. Test locally: `npm run dev`
3. Commit and push to GitHub
4. Netlify auto-deploys in 1-2 minutes

### Google Analytics Setup
1. Get Measurement ID from [Google Analytics](https://analytics.google.com)
2. Update `src/components/GoogleAnalytics.astro` line 7
3. Commit and push
4. See `GOOGLE_ANALYTICS_SETUP.md` for details

### Contact Form Backend
Currently, the contact form needs a backend. Options:
- **Netlify Forms** (easiest, 100 submissions/month free)
- **Formspree** (50 submissions/month free)
- **Web3Forms** (250 submissions/month free)
- Custom backend (Netlify Functions, Cloudflare Workers)

Instructions in `DEPLOYMENT_GUIDE.md`

## Documentation

- **`README.md`** (this file) - Project overview and quick start
- **`DEPLOYMENT_GUIDE.md`** - Complete deployment instructions for Netlify/Vercel/Cloudflare
- **`GOOGLE_ANALYTICS_SETUP.md`** - GA4 setup, testing, and troubleshooting
- **`IMPLEMENTATION_PLAN.md`** - Full project roadmap, progress tracking, and history

## References

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)
- Design Inspiration: [Phospholutions](https://www.phospholutions.com/)

## Project Timeline

- **November 26, 2024** - Project initialized and core setup complete
- **November 27, 2024** - GDPR compliance, Google Analytics integration, and deployment to Netlify

## Contact

For questions or issues:
- Email: info@heartsbio.nl
- Website: www.heartsbio.nl (coming soon)
