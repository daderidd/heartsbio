# Google Analytics Setup Guide

## Overview

Your website now has a **GDPR-compliant Google Analytics implementation** that respects user cookie preferences.

## How It Works

### 1. Cookie Consent Flow

```
User visits site
    ↓
Cookie banner appears (after 1 second delay)
    ↓
User chooses:
  - Accept All → All cookies enabled, GA loads immediately
  - Reject All → Only essential cookies, GA not loaded
  - Customize → User selects preferences
    ↓
Choice stored in localStorage
    ↓
Google Analytics loads ONLY if user accepted analytics cookies
```

### 2. Data Storage

**Client-side (localStorage):**
- `cookieConsent`: JSON object with user preferences
  ```json
  {
    "essential": true,
    "analytics": true,  // Controls Google Analytics
    "marketing": false
  }
  ```
- `cookieConsentDate`: ISO timestamp of consent

**Google Analytics (when enabled):**
- Standard GA4 cookies
- IP anonymization enabled (GDPR requirement)
- Data stored per Google's privacy policy

### 3. Files Involved

| File | Purpose |
|------|---------|
| `src/components/CookieConsent.tsx` | Cookie consent banner UI |
| `src/components/GoogleAnalytics.astro` | GA initialization script |
| `src/layouts/BaseLayout.astro` | Integrates both components |
| `src/pages/privacy.astro` | Privacy policy with GA details |

## Setup Instructions

### Step 1: Get Your Google Analytics Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (or use existing)
3. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

### Step 2: Configure Your Measurement ID

**Option A: Direct edit (simple)**

Edit `src/components/GoogleAnalytics.astro`:

```astro
const { measurementId = 'G-XXXXXXXXXX' } = Astro.props;
                         ^^^^^^^^^^^^^^^^
                         Replace with your ID
```

**Option B: Environment variable (recommended for production)**

1. Create `.env` file:
   ```bash
   PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. Update `GoogleAnalytics.astro`:
   ```astro
   const measurementId = import.meta.env.PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
   ```

3. Add to `.gitignore` (already done):
   ```
   .env
   ```

### Step 3: Test the Implementation

1. **Clear browser data** (to reset consent)
2. Visit `http://localhost:4326/`
3. **Accept analytics cookies** in the banner
4. Open browser DevTools → Console
5. You should see: `Google Analytics initialized`
6. Check Network tab for requests to `googletagmanager.com`

### Step 4: Verify in Google Analytics

1. Go to your GA4 property
2. Navigate to **Reports → Realtime**
3. Visit your site with analytics enabled
4. You should see your visit in realtime data within 30 seconds

## GDPR Compliance Features

✅ **Opt-in consent** - GA only loads after explicit user consent
✅ **IP anonymization** - User IP addresses are anonymized
✅ **Transparent disclosure** - Privacy policy explains data collection
✅ **Easy opt-out** - Users can reject or withdraw consent anytime
✅ **Secure cookies** - SameSite=None; Secure flags set
✅ **No tracking before consent** - Zero tracking until user accepts

## Testing Cookie Consent

### Test Case 1: Accept All
1. Clear localStorage
2. Click "Accept All"
3. ✅ GA should initialize
4. ✅ localStorage should contain `analytics: true`

### Test Case 2: Reject All
1. Clear localStorage
2. Click "Reject All"
3. ✅ GA should NOT initialize
4. ✅ localStorage should contain `analytics: false`

### Test Case 3: Customize
1. Clear localStorage
2. Click "Customize"
3. Toggle analytics ON
4. Click "Save Preferences"
5. ✅ GA should initialize
6. ✅ localStorage should contain `analytics: true`

### Test Case 4: Persistence
1. Accept analytics
2. Refresh page
3. ✅ Banner should NOT appear again
4. ✅ GA should auto-initialize on page load

## Troubleshooting

### GA not loading after consent

**Check 1:** Open DevTools → Console
- Look for: `Google Analytics initialized`
- If missing, check localStorage for `cookieConsent`

**Check 2:** Verify Measurement ID
- Ensure format is `G-XXXXXXXXXX`
- No extra spaces or quotes

**Check 3:** Network requests
- Look for requests to `googletagmanager.com`
- If blocked, check browser extensions (ad blockers)

### Banner not appearing

**Check 1:** Clear localStorage
```javascript
// In browser console
localStorage.clear();
location.reload();
```

**Check 2:** Wait 1 second
- Banner has a 1-second delay on first load
- This is intentional for better UX

### Consent not persisting

**Check 1:** Browser privacy settings
- Some browsers block localStorage in private mode
- Test in normal browsing mode

**Check 2:** Check for errors
- Open DevTools → Console
- Look for localStorage errors

## Best Practices

### 1. Respect User Choices
- Never bypass consent mechanism
- Don't track users who haven't consented
- Make opt-out easy and accessible

### 2. Keep Privacy Policy Updated
- Review `src/pages/privacy.astro` regularly
- Update with any new tracking tools
- Clearly explain data usage

### 3. Monitor Compliance
- Regularly test consent flow
- Review GA data collection settings
- Ensure IP anonymization is enabled

### 4. Production Deployment
- Use environment variables for GA ID
- Never commit `.env` files to Git
- Test consent flow in production after deployment

## Updating Consent Preferences

Users can update their cookie preferences by:
1. Clearing localStorage manually (developer method)
2. Adding a "Cookie Settings" link in footer (recommended)

To add a cookie settings link, you can dispatch the reset event:

```javascript
// Clear consent and show banner again
localStorage.removeItem('cookieConsent');
localStorage.removeItem('cookieConsentDate');
location.reload();
```

## Next Steps

- [ ] Get Google Analytics Measurement ID
- [ ] Configure ID in `GoogleAnalytics.astro`
- [ ] Test consent flow thoroughly
- [ ] Verify data in GA4 dashboard
- [ ] Consider adding "Cookie Settings" link to footer
- [ ] Review and finalize Privacy Policy with legal team

## Support

For questions or issues:
- Email: info@heartsbio.nl
- Check browser console for error messages
- Test in different browsers (Chrome, Firefox, Safari, Edge)
