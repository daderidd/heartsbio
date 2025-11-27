# HeartsBio Website - Implementation Plan

**Project Start Date:** November 26, 2024
**Target Completion:** TBD
**Last Updated:** November 27, 2024 - Phase 6 Complete

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
- [x] Create `BaseLayout.astro` with HTML structure
- [x] Add meta tags for SEO
- [x] Integrate global styles
- [x] Set up font loading
- [x] Add viewport and responsive meta tags

**Completion Date:** November 26, 2024

### 2.2 Navigation Components
- [x] Create `Header.astro` component
- [x] Build navigation menu structure
- [x] Add logo/branding
- [x] Implement responsive mobile menu
- [x] Add active state styling

**Completion Date:** November 26, 2024

### 2.3 Footer Component
- [x] Create `Footer.astro` component
- [x] Add company info and links
- [x] Add contact information
- [x] Add social media links (if applicable)
- [x] Implement responsive layout

**Completion Date:** November 26, 2024

### 2.4 Global Styles
- [x] Set up Tailwind base styles
- [x] Define custom CSS variables for colors
- [x] Add typography styles
- [x] Create utility classes if needed
- [x] Test responsive breakpoints

**Completion Date:** November 26, 2024

---

## Phase 3: Homepage Development

**Goal:** Create compelling homepage with key sections

### 3.1 Hero Section
- [x] Design hero layout (inspired by Phospholutions)
- [x] Create `Hero.astro` component
- [x] Add headline and value proposition
- [x] Integrate hero image/video (placeholder)
- [x] Add call-to-action buttons
- [x] Ensure responsive design

**Completion Date:** November 26, 2024

### 3.2 Technology/Overview Section
- [x] Create `Technology.astro` section component
- [x] Add descriptive content about HeartsBio's work
- [x] Integrate supporting visuals (placeholders)
- [x] Add section heading and layout
- [x] Implement responsive grid/layout

**Completion Date:** November 26, 2024

### 3.3 KPI Display Components
- [x] Create `KPICard.astro` component
- [x] Design metric display with icons/pictograms
- [x] Create `Stats.astro` section for bold stats
- [x] Add animation/transition effects (hover states)
- [x] Create KPI section on homepage
- [x] Populate with sample HeartsBio metrics

**Completion Date:** November 26, 2024

### 3.4 Social Proof Section
- [x] Create partnerships/credibility section
- [x] Add partner logos (placeholders) or testimonials
- [x] Create `Partners.astro` component
- [x] Implement responsive layout

**Completion Date:** November 26, 2024

### 3.5 Homepage Assembly
- [x] Update `src/pages/index.astro`
- [x] Assemble all sections (Hero, Technology, Stats, Portfolio, Partners)
- [x] Test responsive layout
- [x] Optimize images (placeholders ready for replacement)
- [x] Add SEO metadata (in BaseLayout)
- [x] Review and refine spacing/typography

**Completion Date:** November 26, 2024

---

## Phase 4: Visual Identity & UX Refinement

**Goal:** Establish refined brand identity and enhance user experience

### 4.1 Color Palette Refinement
- [x] Research Phospholutions design inspiration
- [x] Define minimalist green/cream/black palette
- [x] Update Tailwind configuration with new colors
- [x] Replace all blue/teal/purple references
- [x] Ensure WCAG AA accessibility compliance

**Completion Date:** November 27, 2024

### 4.2 Navigation Enhancement
- [x] Convert header to floating rounded rectangle design
- [x] Implement backdrop blur and glass-morphism effects
- [x] Add smooth scroll behavior for anchor links
- [x] Fix navigation positioning and z-index
- [x] Connect navigation links to page sections

**Completion Date:** November 27, 2024

### 4.3 Hero Section Redesign
- [x] Add full-screen background video (hero-field.mp4)
- [x] Implement rotating text animation for adjectives
- [x] Remove decorative pill element
- [x] Position hero to extend behind navigation
- [x] Add accessibility support for reduced motion

**Completion Date:** November 27, 2024

### 4.4 Contact Section
- [x] Create Contact section with form and info card
- [x] Match Phospholutions "Get in touch" design
- [x] Implement 2-column layout (info + form)
- [x] Add email and phone with icons
- [x] Connect to navigation

**Completion Date:** November 27, 2024

### 4.5 Favicon Update
- [x] Design new favicon matching color palette
- [x] Create dark green rounded square with white "H"
- [x] Replace blue circular favicon
- [x] Test across browsers

**Completion Date:** November 27, 2024

---

## Phase 5: Navigation & Hero Section Enhancements

**Goal:** Polish navigation and hero with video and interactions

### 5.1 Video Background Implementation
- [x] Assess video format and size (MP4, 6.1MB)
- [x] Implement video element with proper attributes
- [x] Add fallback poster image
- [x] Test performance and accessibility
- [x] Implement reduced-motion support

**Completion Date:** November 27, 2024

### 5.2 Navigation Refinements
- [x] Adjust hero positioning to go behind nav bar
- [x] Fix navigation z-index and positioning
- [x] Connect Contact button to Contact section
- [x] Test smooth scrolling behavior

**Completion Date:** November 27, 2024

---

## Phase 6: Content Population & Stats Enhancement

**Goal:** Populate sections with real content and redesign stats

### 6.1 Portfolio Content
- [x] Replace placeholder projects with 5 real R&D areas
- [x] Remove product names per branding requirements
- [x] Add project highlights and descriptions
- [x] Integrate R&D portfolio images
- [x] Center last 2 cards in grid layout

**Completion Date:** November 27, 2024

### 6.2 Stats Section Redesign
- [x] Implement dark green section background
- [x] Create alternating cream and light green cards
- [x] Add modern card design with rounded corners
- [x] Implement hover effects and animations
- [x] Fix progress bar animation for all cards
- [x] Add decorative blur elements
- [x] Ensure equal card heights
- [x] Full accessibility support

**Completion Date:** November 27, 2024

### 6.3 Technology Section Update
- [x] Update to "Our Research Process"
- [x] Expand from 3 to 4 stages
- [x] Add detailed stage descriptions
- [x] Replace placeholder with lab image
- [x] Add biobank stat overlay

**Completion Date:** November 27, 2024

---

## Phase 7: Additional Pages & Special Components (Future)

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

**Overall Progress:** 60% Complete (6/10 phases)

### Phase Completion
- [x] Phase 1: Project Setup & Configuration (100%) ✅ **COMPLETE - Nov 26, 2024**
- [x] Phase 2: Core Infrastructure (100%) ✅ **COMPLETE - Nov 26, 2024**
- [x] Phase 3: Homepage Development (100%) ✅ **COMPLETE - Nov 26, 2024**
- [x] Phase 4: Visual Identity & UX Refinement (100%) ✅ **COMPLETE - Nov 27, 2024**
- [x] Phase 5: Navigation & Hero Enhancements (100%) ✅ **COMPLETE - Nov 27, 2024**
- [x] Phase 6: Content Population & Stats Enhancement (100%) ✅ **COMPLETE - Nov 27, 2024**
- [ ] Phase 7: Additional Pages & Special Components (0%)
- [ ] Phase 8: SEO & Performance (0%)
- [ ] Phase 9: Testing & QA (0%)
- [ ] Phase 10: Deployment (0%)

---

**Next Session:** Phase 7 - Additional Pages, OR Phase 8 - SEO & Performance Optimization
