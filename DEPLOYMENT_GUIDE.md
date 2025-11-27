# HeartsBio Website - Deployment Guide

## Pre-Deployment Checklist

### ✅ Content Review
- [ ] All placeholder text replaced with final content
- [ ] Images optimized and properly sized
- [ ] Contact information verified (email, phone)
- [ ] All internal links working
- [ ] Privacy Policy reviewed by legal team
- [ ] Terms of Service reviewed by legal team

### ✅ Technical Setup
- [x] Production build successful (`npm run build`)
- [x] Cookie consent banner implemented
- [x] GDPR compliance features active
- [ ] Google Analytics Measurement ID configured
- [ ] SSL certificate ready for domain
- [ ] DNS records accessible for domain configuration

### ✅ SEO & Performance
- [x] Meta tags configured
- [x] Sitemap generated automatically
- [x] robots.txt created
- [x] Open Graph tags set
- [x] Structured data (JSON-LD) implemented
- [ ] Lighthouse audit performed (manual)
- [ ] Images lazy-loaded

### ✅ Testing
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsive testing (iOS, Android)
- [ ] Cookie consent flow tested
- [ ] Contact form tested
- [ ] All navigation links verified
- [ ] Performance acceptable on slow connections

---

## Recommended Hosting Platforms

### Option 1: Netlify (Recommended for Beginners)

**Pros:**
- ✅ Free tier with generous limits
- ✅ Automatic HTTPS
- ✅ Easy GitHub integration
- ✅ Built-in form handling
- ✅ Instant rollbacks
- ✅ Edge CDN included

**Pricing:** Free for basic use, €19/month for Pro

#### Netlify Deployment Steps

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Connect Repository**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub → Select your repository
   - Authorize Netlify

3. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (~1-2 minutes)

5. **Configure Custom Domain**
   - Go to Site settings → Domain management
   - Add custom domain: `www.heartsbio.nl`
   - Configure DNS (instructions provided by Netlify)

6. **Environment Variables** (if using)
   - Go to Site settings → Build & deploy → Environment
   - Add: `PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`

---

### Option 2: Vercel (Best Performance)

**Pros:**
- ✅ Excellent performance and edge caching
- ✅ Free tier with great limits
- ✅ Automatic HTTPS
- ✅ GitHub integration
- ✅ Built-in analytics
- ✅ Fast global CDN

**Pricing:** Free for personal projects, $20/month for Pro

#### Vercel Deployment Steps

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import from GitHub
   - Select your repository

3. **Configure Project**
   ```
   Framework Preset: Astro
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment (~1 minute)

5. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Add: `www.heartsbio.nl`
   - Configure DNS as instructed

6. **Environment Variables**
   - Settings → Environment Variables
   - Add: `PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`

---

### Option 3: Cloudflare Pages (Best for EU/GDPR)

**Pros:**
- ✅ Completely free (unlimited bandwidth)
- ✅ Excellent EU presence (good for .nl domain)
- ✅ DDoS protection included
- ✅ Fast global CDN
- ✅ GitHub integration
- ✅ Strong privacy focus

**Pricing:** Free forever for static sites

#### Cloudflare Pages Deployment Steps

1. **Create Cloudflare Account**
   - Go to [cloudflare.com](https://cloudflare.com)
   - Sign up for free

2. **Create Pages Project**
   - Go to Workers & Pages → Create application
   - Click "Pages" tab → "Connect to Git"
   - Authorize GitHub → Select repository

3. **Configure Build**
   ```
   Framework preset: Astro
   Build command: npm run build
   Output directory: dist
   ```

4. **Deploy**
   - Click "Save and Deploy"
   - Wait for build completion

5. **Custom Domain**
   - Go to Custom domains
   - Add: `www.heartsbio.nl`
   - Update DNS records as instructed

---

## Domain Configuration (www.heartsbio.nl)

### Step 1: Access Domain Registrar

Your domain `heartsbio.nl` is registered somewhere (e.g., TransIP, Antagonist, GoDaddy). Log in to your registrar.

### Step 2: Configure DNS Records

**For Netlify/Vercel:**
```
Type: A
Name: @
Value: [IP provided by host]

Type: CNAME
Name: www
Value: [subdomain provided by host]
```

**For Cloudflare Pages:**
```
(Cloudflare will provide specific nameservers or CNAME records)
```

### Step 3: Wait for Propagation

DNS changes can take 24-48 hours to propagate fully, but often work within 1-2 hours.

### Step 4: Force HTTPS

All three platforms automatically provision SSL certificates via Let's Encrypt. Ensure "Force HTTPS" is enabled in platform settings.

---

## Post-Deployment Tasks

### 1. Verify Deployment

Visit your site and check:
- [ ] Homepage loads correctly
- [ ] All images display
- [ ] Navigation works
- [ ] Contact form appears (won't submit without backend)
- [ ] Cookie banner appears on first visit
- [ ] Privacy Policy and Terms pages load
- [ ] Mobile responsive

### 2. Set Up Google Analytics

- [ ] Add Measurement ID to environment variables or code
- [ ] Test analytics with browser in incognito mode
- [ ] Verify data in GA4 Realtime dashboard
- [ ] Set up goals/conversions as needed

### 3. Submit to Search Engines

**Google Search Console:**
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property: `https://www.heartsbio.nl`
3. Verify ownership (DNS, HTML tag, or GA)
4. Submit sitemap: `https://www.heartsbio.nl/sitemap-index.xml`

**Bing Webmaster Tools:**
1. Go to [bing.com/webmasters](https://www.bing.com/webmasters)
2. Add site and verify
3. Submit sitemap

### 4. Set Up Monitoring

**Uptime Monitoring (Free Options):**
- [UptimeRobot](https://uptimerobot.com) - Free monitoring every 5 minutes
- [Pingdom](https://www.pingdom.com) - Free tier available
- [StatusCake](https://www.statuscake.com) - Free monitoring

**Performance Monitoring:**
- Run Lighthouse audit monthly
- Monitor Core Web Vitals in Google Search Console
- Use PageSpeed Insights regularly

### 5. Backups

**Git Repository:**
- Your code is already backed up on GitHub
- Ensure you commit and push regularly

**Content Backups:**
- Export any form submissions regularly (if using Netlify Forms)
- Document any content changes

---

## Contact Form Integration

Currently, the contact form has `action="/api/contact"` but no backend. You have several options:

### Option 1: Netlify Forms (Easiest)

Update `Contact.astro`:
```html
<form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="contact" />
  <!-- existing form fields -->
</form>
```

Free tier: 100 submissions/month

### Option 2: Formspree

1. Sign up at [formspree.io](https://formspree.io)
2. Create form endpoint
3. Update form action: `action="https://formspree.io/f/YOUR_FORM_ID"`

Free tier: 50 submissions/month

### Option 3: Web3Forms

1. Get API key at [web3forms.com](https://web3forms.com)
2. Add hidden field: `<input type="hidden" name="access_key" value="YOUR_KEY">`
3. Update action: `action="https://api.web3forms.com/submit"`

Free tier: 250 submissions/month

### Option 4: Custom Backend (Advanced)

Build API endpoint with:
- Node.js + Express
- Cloudflare Workers
- Netlify Functions
- Vercel Serverless Functions

---

## Performance Optimization Tips

### Image Optimization

All images should be:
- WebP or AVIF format when possible
- Properly sized (not larger than display size)
- Compressed (use tools like TinyPNG, Squoosh)
- Lazy-loaded (already implemented)

### Asset Optimization

```bash
# Already done in build:
✅ JavaScript minified
✅ CSS minified
✅ Assets hashed for cache-busting
✅ Gzip compression enabled
```

### CDN Configuration

All recommended hosts include CDN automatically:
- ✅ Edge caching enabled
- ✅ Brotli compression
- ✅ HTTP/2 or HTTP/3

---

## Troubleshooting Common Issues

### Build Fails on Deployment

**Check:**
1. Node version compatibility
2. All dependencies in `package.json`
3. Build command correct: `npm run build`
4. Output directory correct: `dist`

**Solution:**
- Specify Node version in platform settings (use Node 18 or 20)
- Commit `package-lock.json` to repo

### Domain Not Resolving

**Check:**
1. DNS records configured correctly
2. Sufficient propagation time (wait 24-48 hours)
3. WWW vs non-WWW settings

**Solution:**
- Use DNS checker tools (whatsmydns.net)
- Verify records in domain registrar
- Check platform-specific DNS documentation

### Cookie Banner Not Appearing

**Check:**
1. JavaScript enabled in browser
2. LocalStorage not blocked
3. React hydration successful

**Solution:**
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Test in incognito mode

### Forms Not Submitting

**Check:**
1. Form backend configured
2. CORS settings if using external API
3. Network tab for failed requests

**Solution:**
- Set up Netlify Forms or Formspree
- Configure proper CORS headers
- Add error handling to form

---

## Security Checklist

- [x] HTTPS enforced (automatic with hosting platforms)
- [x] GDPR cookie consent implemented
- [x] Privacy Policy in place
- [x] Terms of Service in place
- [ ] Security headers configured (CSP, HSTS)
- [ ] Rate limiting on forms (when backend added)
- [ ] Regular dependency updates

### Recommended Security Headers

Add to your hosting platform:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Netlify:** Add `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

---

## Maintenance Schedule

### Weekly
- [ ] Monitor uptime status
- [ ] Check for any reported issues
- [ ] Review form submissions

### Monthly
- [ ] Run Lighthouse audit
- [ ] Check Google Analytics data
- [ ] Review and update content as needed
- [ ] Check for dependency updates

### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] Content refresh
- [ ] SEO review

### Annually
- [ ] Privacy Policy review
- [ ] Terms of Service review
- [ ] Full site audit
- [ ] Domain renewal

---

## Cost Estimate

### Minimum Setup (Free)
- Hosting: €0 (Netlify/Vercel/Cloudflare free tier)
- Domain: ~€10-15/year (.nl domain)
- SSL Certificate: €0 (included)
- **Total: ~€10-15/year**

### Professional Setup
- Hosting: €19/month (Netlify Pro or Vercel Pro)
- Domain: €10-15/year
- Email hosting: €5-10/month (optional)
- Monitoring: €10/month (optional)
- **Total: ~€35-50/month**

---

## Quick Start Deployment (5 Minutes)

### For Netlify:

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Netlify**
   - Visit netlify.com → Login with GitHub
   - "Add new site" → "Import from Git"
   - Select repository
   - Build: `npm run build` | Directory: `dist`
   - Click "Deploy"

3. **Configure Domain**
   - Site settings → Domain management
   - Add custom domain
   - Follow DNS instructions

4. **Done!** 🎉

---

## Support & Resources

### Documentation
- [Astro Docs](https://docs.astro.build)
- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PageSpeed Insights](https://pagespeed.web.dev)
- [GTmetrix](https://gtmetrix.com)
- [WebPageTest](https://www.webpagetest.org)

### Need Help?
- Check implementation plan: `IMPLEMENTATION_PLAN.md`
- Review GA setup: `GOOGLE_ANALYTICS_SETUP.md`
- Email: info@heartsbio.nl

---

## Next Steps

1. [ ] Choose hosting platform (Netlify recommended)
2. [ ] Set up account and deploy
3. [ ] Configure custom domain (www.heartsbio.nl)
4. [ ] Add Google Analytics Measurement ID
5. [ ] Test thoroughly in production
6. [ ] Submit sitemap to search engines
7. [ ] Set up monitoring
8. [ ] Configure contact form backend
9. [ ] Announce launch! 🚀

**Estimated time to deployment: 1-2 hours**

Good luck with your launch! 🎉
