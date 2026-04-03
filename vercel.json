# Godhans Tree Company — Site

## Project Structure
```
godhans/
├── api/
│   └── reviews.js        ← Vercel serverless function (Google Reviews proxy)
├── public/
│   ├── index.html        ← Home (animated forest hero)
│   ├── services.html     ← Services
│   ├── about.html        ← About
│   ├── service-area.html ← Service Area
│   ├── reviews.html      ← Reviews (live from Google API)
│   ├── contact.html      ← Contact / Free Estimate
│   ├── style.css         ← Shared styles
│   └── shared.js         ← Shared JS (cursor, nav, reveal)
└── vercel.json           ← Vercel routing config
```

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import repo
3. Set root directory to `/` (not /public)
4. Add Environment Variables:
   - `GOOGLE_API_KEY` = Mike's Google API key
   - `GOOGLE_PLACE_ID` = Godhans Place ID (ChIJ... format)
5. Deploy

## GHL Form Wiring (Contact Page)
In `contact.html`, find the `handleSubmit` function and replace the `setTimeout` with a GHL webhook POST once credentials are available.

## Pending
- [ ] Google API key from Mike's Google Console
- [ ] Confirmed ChIJ... Place ID
- [ ] GHL Location ID, Pipeline ID, Stage ID for contact form
- [ ] Real photos from Mike (hero, about, services)
- [ ] Domain pointed to Vercel via Namecheap DNS
