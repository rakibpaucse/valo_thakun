# Anis Bhai — Doctor Practice Platform

A full-stack web application for a multi-doctor medical practice. Built as a single Next.js 15 app: portfolio, online booking, blog/community, and role-based dashboards (patient / doctor / admin) — all wired with rich dummy data.

> Read `PLAN.md` for the architecture and design rationale.

---

## ⚡ Quick start

```bash
# Install deps
npm install

# Push schema + seed dummy data into SQLite (one-time)
npm run db:reset

# Start the dev server
npm run dev   # http://localhost:3000
```

That's it. SQLite is file-based, so there is nothing else to install.

---

## 🔑 Demo accounts

All accounts share the password **`password123`**.

| Role | Email | What you'll see |
|---|---|---|
| **Admin** | `admin@anisbhai.health` | Practice-wide overview, all bookings, all doctors, posts, reports |
| **Doctor** (main) | `anis@anisbhai.health` | Today's schedule, weekly calendar, profile editor |
| **Doctor** | `farhana@anisbhai.health` | Same dashboard, scoped to her own bookings |
| **Patient** | `rashed@example.com` | Upcoming visits, history, comment archive, settings |

---

## 🗺 Routes

### Public
- `/` — animated landing page
- `/about` — main doctor's bio + career timeline + gallery
- `/services` — all treatment areas
- `/doctors` — list, filter by specialization
- `/doctors/[slug]` — individual doctor profile
- `/blog`, `/blog/[slug]` — articles + comments + reactions
- `/contact` — message form + opening hours + map
- `/book` — 4-step booking flow (doctor → service → slot → details → done)
- `/manage/[token]` — public link to view/cancel a booking (no login)
- `/legal/{privacy|terms|disclaimer}` — Bangladesh-flavored legal stubs
- `/login`, `/register` — auth (split-screen layout with demo creds)

### Authenticated (auto-redirect to login)
- `/patient`, `/patient/{appointments,comments,settings}`
- `/doctor`, `/doctor/{appointments,schedule,profile}`
- `/admin`, `/admin/{appointments,doctors,posts,messages,reports}`

### API
- `POST /api/register` — create patient account
- `POST /api/auth/[...nextauth]` — sign-in / sign-out
- `GET  /api/booking/availability?doctor=&service=&date=` — compute free slots
- `POST /api/booking/create` — create appointment (guest or patient)
- `POST /api/booking/cancel/[token]` — cancel via token
- `POST /api/comments` — submit comment (with simple spam filter)
- `POST /api/reactions` — emoji react on a post
- `POST /api/contact` — contact form
- `POST /api/newsletter` — newsletter signup

---

## 🧱 Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** + handmade shadcn-style UI primitives in `src/components/ui/`
- **Framer Motion** for hero, page transitions, slot picker, reactions
- **Prisma** + **SQLite** (one-line swap to Postgres for prod)
- **NextAuth.js v5** (Auth.js) credentials provider
- **Zod** validation on every API route
- **Lucide** icons

---

## 🧬 Data model

Single source of truth: `prisma/schema.prisma`. Highlights:

- `User` (role: PATIENT / DOCTOR / ADMIN) is the auth root; `Doctor` and `Patient` are 1:1 satellite profiles with role-specific fields.
- `Specialization` ⇆ `Doctor` and `Service` ⇆ `Doctor` are many-to-many.
- Scheduling: `WorkingHours` (per weekday), `TimeOff` (date ranges), `SlotOverride` (ad-hoc opens/blocks). Slot computation lives in `src/lib/slots.ts` — pure function, easy to unit test.
- `Appointment` carries `cancelToken` so guests can manage bookings without an account.
- `Post` has categories, tags, threaded `Comment`s with moderation status, and `Reaction`s.

Re-seed any time:
```bash
npm run db:reset
```

---

## 🎨 Design notes

- Brand palette tuned around `brand` blue + `accent` cyan, defined in `tailwind.config.ts`.
- `next-themes` powers light/dark mode (toggle in nav).
- The `Hero`, `BookingFlow`, `ReactionsBar`, and `StatsStrip` components contain the most polish; everything else uses subtle `viewport-once` reveal animations.
- Custom utilities in `globals.css`: `.gradient-text`, `.grid-bg`, `.glass`, `.mask-fade-b`, `.page-enter`.

---

## 🌍 Internationalization

A minimal stub lives in `src/lib/i18n.ts` with English + Bangla dictionaries for navigation. To add full multi-locale routing, switch to **next-intl**:

```bash
npm i next-intl
```

…then move pages under `src/app/[locale]/` and wire `next-intl/middleware`.

---

## 🚧 What's stubbed (and where to plug in)

These are flagged with `TODO(prod)` in code so they are easy to find:

| Feature | File | Swap with |
|---|---|---|
| Email send | `src/lib/email.ts` | Resend / SendGrid |
| SMS | `src/lib/email.ts` | Twilio / SSL Wireless |
| Payment | n/a | bKash / Stripe |
| Real moderation | `src/app/api/comments/route.ts` | Manual queue + Akismet |
| 2FA | n/a (UI placeholder in patient settings) | NextAuth + TOTP |

---

## 🧪 Testing the booking flow end-to-end

1. Open <http://localhost:3000/book>
2. Pick **Dr. Anisul Karim** → **Cardiac Checkup** → tomorrow → any time slot
3. Fill name / email / phone → confirm
4. You're redirected to a confirmation card with a `manage/<token>` link
5. Open that link in another tab — cancel → status flips to `CANCELLED`
6. Sign in as `admin@anisbhai.health` and visit `/admin/appointments` to see the audit trail

---

## 📦 Folder structure

```
src/
├── app/
│   ├── (public)/           # marketing site
│   ├── (auth)/             # login / register (split-screen layout)
│   ├── (dashboard)/        # patient / doctor / admin (auth-gated layout)
│   └── api/                # backend routes
├── components/
│   ├── ui/                 # Button, Card, Input, Avatar, Badge, Toast …
│   ├── marketing/          # Hero, FeaturedServices, DoctorCard …
│   ├── booking/            # BookingFlow, CancelButton
│   ├── blog/               # CommentsSection, ReactionsBar
│   ├── dashboard/          # Sidebar, StatCard
│   ├── auth/               # LoginForm, RegisterForm
│   └── theme-provider.tsx, theme-toggle.tsx, session-provider.tsx
└── lib/
    ├── prisma.ts           # client singleton
    ├── auth.ts             # NextAuth config
    ├── require-auth.ts     # server-side auth guard
    ├── slots.ts            # slot computation (pure)
    ├── email.ts            # email/SMS stubs
    ├── i18n.ts             # locale dictionary stub
    └── utils.ts            # cn(), formatBDT, formatDate …

prisma/
├── schema.prisma           # all 20+ models
└── seed.ts                 # rich dummy data
```

---

## 🚀 Going to production

1. Swap the `datasource db { provider = "sqlite" }` to `postgresql` in `prisma/schema.prisma` and update `DATABASE_URL`.
2. Replace email/SMS stubs in `src/lib/email.ts`.
3. Set a real `AUTH_SECRET` in environment (generate with `openssl rand -base64 32`).
4. Build:
   ```bash
   npm run build && npm start
   ```
5. Behind a CDN (Vercel works out of the box; the SQLite file would need a swap to Postgres on Vercel since the FS is read-only on serverless).

---

## License

Private demo build.
