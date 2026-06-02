# Deploy Valo Thakun to Vercel

This guide walks you from a fresh GitHub repo to a live Vercel deployment.

Total time: **~15 minutes**.

---

## Step 1 — Create a free Postgres database

Vercel's serverless functions have a **read-only filesystem**, so SQLite
doesn't survive there. You need a hosted Postgres. Pick one:

| Provider           | URL                                | Notes                                |
|--------------------|------------------------------------|--------------------------------------|
| **Neon**           | https://neon.tech                  | Recommended. 0.5 GB free, instant.   |
| **Supabase**       | https://supabase.com               | 500 MB free.                         |
| **Vercel Postgres**| Vercel Storage tab                 | Tightest integration with Vercel.    |

For Neon:
1. Sign up → **Create project** → pick the region nearest your users (Singapore for Dhaka).
2. After creation you'll see two connection strings on the dashboard:
   - **Pooled** (`postgresql://…/neondb?sslmode=require` with `pgbouncer=true`)
   - **Direct** (the same URL but without `pgbouncer=true`)
3. Copy both. You'll use the **pooled URL as `DATABASE_URL`** and the
   **direct URL as `DIRECT_URL`**.

---

## Step 2 — Wire up local env + push the schema

In your project root, copy the template and fill in real values:

```bash
copy .env.example .env          # PowerShell
# or:
cp .env.example .env            # mac / linux
```

Open `.env` and paste:

```
DATABASE_URL="postgresql://USER:PASS@HOST/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://USER:PASS@HOST/neondb?sslmode=require"
AUTH_SECRET="<run: openssl rand -base64 32>"
AUTH_TRUST_HOST="true"
NEXTAUTH_URL="https://your-app.vercel.app"
```

Now push the schema and load the demo data into Postgres:

```bash
npx prisma db push     # creates all tables on Neon
npm run db:seed        # loads 5 doctors, 9 services, 5 patients, etc.
```

You should see `🌱  Seed complete.` and the demo-login list.

---

## Step 3 — Push your code to GitHub

If you haven't yet:

```bash
git add .
git commit -m "Switch to Postgres for Vercel deploy"
git push -u origin main
```

> If push fails with *"src refspec main does not match any"*, it means
> you skipped the commit step — git can't push an empty branch.

---

## Step 4 — Import the repo on Vercel

1. Go to https://vercel.com/new and import your GitHub repo.
2. Vercel auto-detects Next.js. Leave **Framework Preset** as Next.js.
3. **Build Command:** leave as default — `package.json` already defines
   `vercel-build` which runs `prisma generate && next build`.
4. **Output / Install:** leave default.

### Environment Variables (the important bit)

Under **Environment Variables**, add these **before** the first deploy.
Tick all three environments (Production, Preview, Development):

| Key             | Value                                                                |
|-----------------|----------------------------------------------------------------------|
| `DATABASE_URL`  | the pooled Neon URL                                                  |
| `DIRECT_URL`    | the direct Neon URL                                                  |
| `AUTH_SECRET`   | a 32-byte random string (`openssl rand -base64 32`)                  |
| `AUTH_TRUST_HOST` | `true`                                                             |
| `NEXTAUTH_URL`  | leave blank for now — set it after Vercel gives you the URL          |

Click **Deploy**.

### After the first deploy

1. Note the URL Vercel gave you (e.g. `https://valo-thakun-xyz.vercel.app`).
2. Go back to **Settings → Environment Variables** and set
   `NEXTAUTH_URL` to that URL.
3. **Redeploy** (Deployments → ⋯ → Redeploy).

---

## Step 5 — Verify

Open the URL. You should see the home page rendering live data from Neon.

Demo logins (password `password123`):

| Role    | Email                          |
|---------|--------------------------------|
| ADMIN   | `admin@anisbhai.health`        |
| DOCTOR  | `anis@anisbhai.health` (main)  |
| PATIENT | `rashed@example.com`           |

Sign in. The dashboards work; admin can CRUD doctors/patients; doctors
can edit appointment notes; patients can update settings.

---

## Troubleshooting

### `Environment variable not found: DATABASE_URL`
Vercel can't see the env var. Re-check **Settings → Environment Variables**
and make sure it's set for the **Production** environment. Then redeploy.

### `prisma generate` fails on Vercel
Usually a stale lockfile. Run `npm install` locally, commit `package-lock.json`,
push. Vercel reinstalls cleanly.

### Build succeeds but pages are blank / 500 errors
The Postgres database is empty. You forgot Step 2 (`prisma db push` +
`db:seed` pointing at the Neon URL). Re-run them locally and refresh.

### `Error: P1001: Can't reach database server`
Either the Neon DB is paused (free tier auto-sleeps after 5 min idle —
the first request wakes it; subsequent ones are fast), or the URL is
wrong. Check the URL has `?sslmode=require` at the end.

### `useSearchParams() should be wrapped in a suspense boundary`
You shouldn't see this — already fixed in [src/app/layout.tsx](src/app/layout.tsx)
and [src/app/(auth)/login/page.tsx](src/app/(auth)/login/page.tsx). If
you do, paste the path that broke and I'll patch it.

---

## What's NOT included in this deploy

These are stubbed and need a real provider before going to real patients:

- **Email** ([src/lib/email.ts](src/lib/email.ts)) — currently console logs.
  Drop in Resend or SendGrid.
- **SMS** — same file. Drop in Twilio or SSL Wireless.
- **Payments** — no integration yet. bKash or Stripe.
- **2FA** — UI placeholder only.

Each is flagged with `TODO(prod)` in code.
