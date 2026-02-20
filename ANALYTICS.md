# Analytics (GA4)

## Property / Stream
- **Property ID:** `525391557`
- **Stream Name:** `dashwood`
- **Stream URL:** `https://dashwood.net`
- **Stream ID:** `13641667456`
- **Measurement ID:** `G-45RNCPBHRD`

## Implementation
GA4 is loaded in:
- `pages/_app.tsx`

Helpers:
- `lib/gtag.ts`

Current measurement ID source:
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (if set)
- fallback default: `G-45RNCPBHRD`

## Tracked Events
From `components/Contact.tsx`:
- `contact_form_submit` (successful form submission)
- `generate_lead` (successful form submission, recommended GA conversion event)
- `contact_form_validation_error` (missing required fields)
- `contact_form_submit_error` (submit request failed)

## Recommended GA4 Setup
In GA4 admin:
1. Go to **Admin → Events**
2. Mark `generate_lead` as a conversion
3. (Optional) Mark `contact_form_submit` as conversion if you want both

## Quick Verification
1. Open `https://dashwood.net`
2. Submit test contact form
3. In GA4, open **Realtime** and confirm events appear
4. In **DebugView**, verify event params from contact form

## Notes
- Sitewide pageview tracking is enabled via route change tracking in `_app.tsx`.
- Contact tracking fires only after API success for submit events.
