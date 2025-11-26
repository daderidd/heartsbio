# HeartsBio Website

A modern business landing page with R&D portfolio showcase built with Astro, Tailwind CSS, and TypeScript.

## Project Overview

HeartsBio's website serves as a professional business landing page featuring:
- Company overview and value proposition
- Technology/R&D portfolio showcase
- Before-after comparisons and case studies
- Key performance indicators (KPIs) with visual displays
- Video content integration
- Partnership and credibility sections

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
- **@astrojs/react** - React integration for interactive components
- **@astrojs/image** - Image optimization
- **astro-icon** - Icon system (optional)

## Project Structure

```
heartsbio-website/
├── src/
│   ├── components/          # Reusable components
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
│   │   ├── index.astro      # Homepage
│   │   ├── technology.astro # Technology overview
│   │   └── portfolio/       # Portfolio pages
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
└── README.md                # This file
```

## Brand Identity

### Colors
HeartsBio's color palette reflects scientific credibility, biotechnology innovation, and trust:

- **Primary (Blue)**: `#2563EB` - Bright blue for scientific credibility and trust
- **Secondary (Teal)**: `#0D9488` - Teal representing biotechnology and life sciences
- **Accent (Purple)**: `#7C3AED` - Purple for innovation and R&D
- **Neutral (Dark Gray)**: `#1F2937` - For body text

### Typography
- **Display Font**: Manrope (headings) - Modern, professional, inspired by Phospholutions
- **Body Font**: Inter (body text) - Clean, readable, widely supported

Both fonts loaded via Google Fonts CDN.

### Logo & Assets
- Temporary favicon: Blue circle with "H" letter
- Logo and brand assets to be added to `public/images/`

## Key Features

### Custom Components
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

### Build Process
```bash
npm run build
```
Generates static site in `./dist/` directory.

### Hosting Options
- **Netlify** - Zero-config Astro support
- **Vercel** - Automatic deployments from Git
- **Cloudflare Pages** - Global CDN
- **GitHub Pages** - Free static hosting

### Environment Variables
Create `.env` file for any API keys or configuration:
```
PUBLIC_SITE_URL=https://heartsbio.com
```

## Performance

Astro's architecture ensures:
- Zero JavaScript by default (only where needed)
- Optimized images with lazy loading
- Fast page loads with static generation
- SEO-friendly with server-side rendering

## SEO

Built-in SEO features:
- Meta tags in BaseLayout
- Open Graph tags for social sharing
- Sitemap generation
- Canonical URLs
- Structured data (Schema.org)

## Maintenance

### Content Updates (1-2/month)
1. Edit MDX files in `src/content/`
2. Commit changes to Git
3. Push to trigger automatic deployment

### Component Updates
1. Modify components in `src/components/`
2. Test locally
3. Deploy

## References

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MDX Documentation](https://mdxjs.com/)
- Design Inspiration: [Phospholutions](https://www.phospholutions.com/)

## Infrastructure Reference

This project shares infrastructure with `../supersol-website/` but with custom HeartsBio branding and content.

## License

> To be defined

## Contact

> To be defined
