# HeartsBio Website - Implementation Plan

**Project Start Date:** November 26, 2024
**Target Completion:** TBD
**Last Updated:** November 26, 2024 - Phase 1 Complete

## Overview

This document outlines the complete implementation plan from initial setup to deployment. Check off items as completed and update dates accordingly.

---

## Phase 1: Project Setup & Configuration

**Goal:** Establish the foundation with proper tooling and configuration

### 1.1 Initialize Project
- [x] Initialize Astro project with TypeScript template
- [x] Set up Git repository
- [x] Create `.gitignore` file
- [x] Install core dependencies (Astro, Tailwind, TypeScript)
- [x] Install additional dependencies (@astrojs/react, @astrojs/mdx, etc.)

**Completion Date:** November 26, 2024

### 1.2 Configure Build Tools
- [x] Set up `astro.config.mjs` with integrations
- [x] Configure `tailwind.config.cjs` with custom theme
- [x] Set up `tsconfig.json` for TypeScript
- [x] Configure `postcss.config.mjs` if needed
- [x] Add package.json scripts (dev, build, preview)

**Completion Date:** November 26, 2024

### 1.3 Define Brand Identity
- [x] Finalize HeartsBio brand colors (primary, secondary, accent)
- [x] Choose typography (font families for headings and body)
- [x] Collect logo files and brand assets (temporary favicon created)
- [x] Add colors to Tailwind config
- [x] Add fonts to project (Google Fonts or local)

**Completion Date:** November 26, 2024

### 1.4 Project Structure
- [x] Create folder structure (`components/`, `layouts/`, `pages/`, etc.)
- [x] Set up `src/content/` directory
- [x] Create Content Collections config (`content/config.ts`)
- [x] Set up `public/` directory with subdirectories
- [x] Create global styles file (`styles/global.css`)

**Completion Date:** November 26, 2024

---

## Phase 2: Core Infrastructure

**Goal:** Build foundational layouts and components

### 2.1 Base Layout
- [ ] Create `BaseLayout.astro` with HTML structure
- [ ] Add meta tags for SEO
- [ ] Integrate global styles
- [ ] Set up font loading
- [ ] Add viewport and responsive meta tags

**Completion Date:** _________

### 2.2 Navigation Components
- [ ] Create `Header.astro` component
- [ ] Build navigation menu structure
- [ ] Add logo/branding
- [ ] Implement responsive mobile menu
- [ ] Add active state styling

**Completion Date:** _________

### 2.3 Footer Component
- [ ] Create `Footer.astro` component
- [ ] Add company info and links
- [ ] Add contact information
- [ ] Add social media links (if applicable)
- [ ] Implement responsive layout

**Completion Date:** _________

### 2.4 Global Styles
- [ ] Set up Tailwind base styles
- [ ] Define custom CSS variables for colors
- [ ] Add typography styles
- [ ] Create utility classes if needed
- [ ] Test responsive breakpoints

**Completion Date:** _________

---

## Phase 3: Homepage Development

**Goal:** Create compelling homepage with key sections

### 3.1 Hero Section
- [ ] Design hero layout (inspired by Phospholutions)
- [ ] Create `Hero.astro` component
- [ ] Add headline and value proposition
- [ ] Integrate hero image/video
- [ ] Add call-to-action buttons
- [ ] Ensure responsive design

**Completion Date:** _________

### 3.2 Technology/Overview Section
- [ ] Create `Technology.astro` section component
- [ ] Add descriptive content about HeartsBio's work
- [ ] Integrate supporting visuals
- [ ] Add section heading and layout
- [ ] Implement responsive grid/layout

**Completion Date:** _________

### 3.3 KPI Display Components
- [ ] Create `KPICard.astro` component
- [ ] Design metric display with icons/pictograms
- [ ] Create `MetricDisplay.astro` for bold stats
- [ ] Add animation/transition effects (optional)
- [ ] Create KPI section on homepage
- [ ] Populate with HeartsBio metrics

**Completion Date:** _________

### 3.4 Social Proof Section
- [ ] Create partnerships/credibility section
- [ ] Add partner logos or testimonials
- [ ] Create `PartnerLogo.astro` component if needed
- [ ] Implement responsive layout

**Completion Date:** _________

### 3.5 Homepage Assembly
- [ ] Create `src/pages/index.astro`
- [ ] Assemble all sections
- [ ] Test responsive layout
- [ ] Optimize images
- [ ] Add SEO metadata
- [ ] Review and refine spacing/typography

**Completion Date:** _________

---

## Phase 4: Content Collections & Portfolio

**Goal:** Set up content management system for R&D portfolio

### 4.1 Content Schema
- [ ] Define Project schema in `content/config.ts`
- [ ] Define Case Study schema
- [ ] Add type definitions for frontmatter
- [ ] Document schema for future content creation

**Completion Date:** _________

### 4.2 Sample Content
- [ ] Create 2-3 sample projects in `content/projects/`
- [ ] Create 1-2 sample case studies
- [ ] Add images for sample content
- [ ] Test content rendering

**Completion Date:** _________

### 4.3 Portfolio Components
- [ ] Create `ProjectCard.astro` component
- [ ] Create `CaseStudyCard.astro` component
- [ ] Build portfolio list/grid layout
- [ ] Add filtering/sorting (optional)
- [ ] Implement pagination if needed

**Completion Date:** _________

### 4.4 Portfolio Pages
- [ ] Create `src/pages/portfolio/index.astro` (list view)
- [ ] Create dynamic route for individual projects
- [ ] Create `src/pages/portfolio/[slug].astro`
- [ ] Add breadcrumb navigation
- [ ] Add "Back to portfolio" links

**Completion Date:** _________

---

## Phase 5: Special Components

**Goal:** Build unique components for data presentation

### 5.1 Before-After Component
- [ ] Design before-after comparison layout
- [ ] Create `BeforeAfter.astro` component
- [ ] Add slider functionality if interactive (React component)
- [ ] Test with real content
- [ ] Ensure responsive behavior

**Completion Date:** _________

### 5.2 Video Integration
- [ ] Create `VideoEmbed.astro` component
- [ ] Support YouTube embeds
- [ ] Add fallback/loading state
- [ ] Test responsiveness
- [ ] Optimize loading performance

**Completion Date:** _________

### 5.3 Data Visualization (if needed)
- [ ] Identify data visualization needs
- [ ] Choose charting library if needed (Chart.js, etc.)
- [ ] Create chart components
- [ ] Integrate with content

**Completion Date:** _________

---

## Phase 6: Additional Pages

**Goal:** Complete remaining website pages

### 6.1 Technology Page
- [ ] Create `src/pages/technology.astro`
- [ ] Detail HeartsBio's R&D approach
- [ ] Add technical explanations
- [ ] Integrate relevant components
- [ ] Add SEO metadata

**Completion Date:** _________

### 6.2 About Page (if needed)
- [ ] Create `src/pages/about.astro`
- [ ] Add company history/mission
- [ ] Add team information
- [ ] Integrate components

**Completion Date:** _________

### 6.3 Contact Page (if needed)
- [ ] Create `src/pages/contact.astro`
- [ ] Add contact form or contact info
- [ ] Integrate form handling (Netlify Forms, etc.)
- [ ] Add map/location if relevant

**Completion Date:** _________

---

## Phase 7: SEO & Performance

**Goal:** Optimize for search engines and performance

### 7.1 SEO Optimization
- [ ] Add comprehensive meta tags to all pages
- [ ] Create `robots.txt`
- [ ] Generate `sitemap.xml` (Astro plugin)
- [ ] Add Open Graph tags for social sharing
- [ ] Add Twitter Card metadata
- [ ] Test with SEO tools

**Completion Date:** _________

### 7.2 Performance Optimization
- [ ] Optimize all images (compression, proper formats)
- [ ] Implement lazy loading for images
- [ ] Minimize CSS/JS bundles
- [ ] Test with Lighthouse
- [ ] Achieve 90+ performance score
- [ ] Test on mobile devices

**Completion Date:** _________

### 7.3 Accessibility
- [ ] Add proper ARIA labels
- [ ] Ensure keyboard navigation works
- [ ] Test color contrast ratios
- [ ] Add alt text to all images
- [ ] Test with screen reader
- [ ] Run accessibility audit

**Completion Date:** _________

---

## Phase 8: Content Population

**Goal:** Replace placeholder content with real HeartsBio content

### 8.1 Content Gathering
- [ ] Collect all copy/text content
- [ ] Gather high-quality images
- [ ] Collect videos or video links
- [ ] Gather partner logos/testimonials
- [ ] Collect R&D project descriptions

**Completion Date:** _________

### 8.2 Content Integration
- [ ] Replace homepage placeholder content
- [ ] Add real R&D projects to content collections
- [ ] Add real case studies
- [ ] Update KPIs with real metrics
- [ ] Add real images throughout site

**Completion Date:** _________

### 8.3 Copy Review
- [ ] Proofread all content
- [ ] Check for consistency (tone, terminology)
- [ ] Verify all links work
- [ ] Check formatting and typography

**Completion Date:** _________

---

## Phase 9: Testing & QA

**Goal:** Ensure everything works perfectly

### 9.1 Cross-Browser Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge
- [ ] Fix any browser-specific issues

**Completion Date:** _________

### 9.2 Device Testing
- [ ] Test on desktop (various resolutions)
- [ ] Test on tablet
- [ ] Test on mobile (iOS)
- [ ] Test on mobile (Android)
- [ ] Fix responsive issues

**Completion Date:** _________

### 9.3 Functionality Testing
- [ ] Test all navigation links
- [ ] Test all CTAs and buttons
- [ ] Test form submissions (if applicable)
- [ ] Test video embeds
- [ ] Test image loading
- [ ] Test content collection pages

**Completion Date:** _________

### 9.4 Performance Testing
- [ ] Run Lighthouse audit
- [ ] Test page load speeds
- [ ] Test on slow connections
- [ ] Optimize as needed

**Completion Date:** _________

---

## Phase 10: Deployment

**Goal:** Launch the website to production

### 10.1 Pre-Deployment
- [ ] Choose hosting platform (Netlify/Vercel/Cloudflare)
- [ ] Set up hosting account
- [ ] Configure domain name
- [ ] Set up SSL certificate
- [ ] Configure environment variables

**Completion Date:** _________

### 10.2 Initial Deployment
- [ ] Connect Git repository to hosting
- [ ] Configure build settings
- [ ] Deploy to production
- [ ] Test production site
- [ ] Verify all functionality works

**Completion Date:** _________

### 10.3 Domain Configuration
- [ ] Point domain to hosting
- [ ] Configure DNS settings
- [ ] Test domain resolution
- [ ] Force HTTPS
- [ ] Test www and non-www versions

**Completion Date:** _________

### 10.4 Post-Deployment
- [ ] Submit sitemap to Google Search Console
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Set up monitoring/uptime checks
- [ ] Create backup strategy
- [ ] Document deployment process

**Completion Date:** _________

---

## Phase 11: Launch & Handoff

**Goal:** Finalize and document everything

### 11.1 Final Review
- [ ] Complete end-to-end review
- [ ] Fix any last-minute issues
- [ ] Get stakeholder approval
- [ ] Prepare launch announcement

**Completion Date:** _________

### 11.2 Documentation
- [ ] Update README.md with final info
- [ ] Document content update process
- [ ] Create troubleshooting guide
- [ ] Document any custom components

**Completion Date:** _________

### 11.3 Training (if needed)
- [ ] Train on content updates
- [ ] Show how to add new projects
- [ ] Explain deployment process

**Completion Date:** _________

---

## Success Metrics

### Performance Targets
- [ ] Lighthouse Performance Score: 90+
- [ ] Lighthouse Accessibility Score: 95+
- [ ] Lighthouse Best Practices Score: 95+
- [ ] Lighthouse SEO Score: 95+
- [ ] First Contentful Paint: < 1.5s
- [ ] Time to Interactive: < 3.0s

### Business Goals
- [ ] Professional, credible design
- [ ] Clear value proposition communicated
- [ ] R&D portfolio effectively showcased
- [ ] Mobile-friendly experience
- [ ] Fast page loads
- [ ] Easy content updates

---

## Notes & Decisions

### Key Decisions Made
1. **No Sanity CMS** - Using Astro Content Collections for simplicity and zero cost
2. **No DaisyUI** - Custom components for unique branding
3. **MDX for content** - Allows rich, interactive content
4. **Phospholutions-inspired design** - Clean, modern, data-driven aesthetic

### Open Questions
- [x] Final brand colors? - **ANSWERED:** Blue (#2563EB), Teal (#0D9488), Purple (#7C3AED)
- [x] Specific font choices? - **ANSWERED:** Manrope (display), Inter (body)
- [x] Domain name confirmed? - **ANSWERED:** www.heartsbio.nl
- [ ] Hosting platform preference?

### Risks & Mitigations
- **Risk:** Content not ready on time → **Mitigation:** Use placeholder content, deploy in phases
- **Risk:** Design takes longer than expected → **Mitigation:** Start with minimal MVP, iterate
- **Risk:** Performance issues → **Mitigation:** Use Astro's built-in optimizations, test early

---

## Progress Tracking

**Overall Progress:** 9% Complete (1/11 phases)

### Phase Completion
- [x] Phase 1: Project Setup & Configuration (100%) ✅ **COMPLETE - Nov 26, 2024**
- [ ] Phase 2: Core Infrastructure (0%)
- [ ] Phase 3: Homepage Development (0%)
- [ ] Phase 4: Content Collections & Portfolio (0%)
- [ ] Phase 5: Special Components (0%)
- [ ] Phase 6: Additional Pages (0%)
- [ ] Phase 7: SEO & Performance (0%)
- [ ] Phase 8: Content Population (0%)
- [ ] Phase 9: Testing & QA (0%)
- [ ] Phase 10: Deployment (0%)
- [ ] Phase 11: Launch & Handoff (0%)

---

**Next Session:** Phase 2 - Core Infrastructure (Header, Footer, Base Layout)
