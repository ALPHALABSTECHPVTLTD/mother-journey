# Mother Journey — Deploy Guide (Vercel + Supabase PWA)

A production Next.js 14 PWA: live pregnancy dashboard, 3D Living Womb driven by
your real timeline, daily weight/kicks graph, and web push notifications.

---

## 1 · Database — Supabase (5 min)

1. Go to https://supabase.com → New project (free tier is fine).
2. Open **SQL Editor** → paste the whole of `supabase/schema.sql` → Run.
3. Go to **Project Settings → API** and copy:
   - Project URL  → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> The schema ships with open anon policies for the MVP. Before a public launch,
> switch to Supabase Auth and scope every policy to `auth.uid()`.

## 2 · Push keys — VAPID (1 min)

```bash
npx web-push generate-vapid-keys
```
- Public key → `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- Private key → `VAPID_PRIVATE_KEY`
- Also set `VAPID_SUBJECT=mailto:you@yourdomain.com`
- Pick any strong string for `NOTIFY_SECRET`

## 3 · Hosting — Vercel (5 min)

1. Push this folder to a GitHub repo.
2. https://vercel.com → Add New Project → import the repo (Next.js is auto-detected).
3. In **Settings → Environment Variables**, add all six vars from `.env.local.example`.
4. Deploy. You get `https://your-app.vercel.app` with HTTPS — required for PWA + push.

`vercel.json` already schedules a **daily cron at 03:30 UTC (9:00 AM IST)** that
hits `/api/notify` and sends every subscribed mother a personalised push:
*"Week 21, day 3 — baby is about the size of a banana today."*

## 4 · Install as an app

- **Android / Chrome:** open the site → ⋮ menu → *Install app*.
- **iPhone (iOS 16.4+):** Safari → Share → *Add to Home Screen* → open from the
  home screen icon → tap *Enable daily reminders*. (iOS only allows web push
  for installed PWAs.)

## 5 · Test push manually

```bash
curl -X POST https://your-app.vercel.app/api/notify \
  -H "Content-Type: application/json" \
  -d '{"key":"YOUR_NOTIFY_SECRET","title":"Scan tomorrow 💕","body":"Heartbeat scan at Bloom Clinic, 10 AM.","url":"/womb"}'
```

## 6 · Local development

```bash
cp .env.local.example .env.local   # fill in values
npm install
npm run dev                        # http://localhost:3000
```
(Service worker + push need HTTPS in production; localhost is exempt.)

---

## What's wired where

| Feature | Files |
|---|---|
| Pregnancy engine (LMP → week/day/EDD/progress) | `src/lib/engine.js` |
| Dashboard + first-run setup (saves to DB) | `src/app/page.js` |
| Living Womb 3D, defaults to *today's* week | `src/app/womb/page.js`, `src/components/LivingWomb.js` |
| Daily graph + log form (upsert per day) | `src/app/graph/page.js` |
| PWA manifest / icons / service worker | `public/` |
| Push subscribe + personalised daily broadcast | `src/app/api/subscribe`, `src/app/api/notify` |
| Cron schedule | `vercel.json` |
| Database schema | `supabase/schema.sql` |

## Next steps when you productise

- Supabase Auth (email/OTP) + per-user RLS policies
- Supabase Storage bucket for scan uploads + the OCR/Claude extraction pipeline
- The `documents` table is already in the schema, ready for extracted scan data
- Family view-only sharing via signed links
