# Anis Bhai — Doctor Practice Platform

> A 3-in-1 web application for a physician's online presence: **Personal Brand Portfolio** + **Multi-Doctor Appointment Booking** + **Content / Community Platform**.

---

## 1. Product Vision

Three products fused into one cohesive platform for Bangladeshi (and international) physicians:

1. **Portfolio** – establishes credibility (credentials, specializations, gallery, bio).
2. **Booking** – converts visitors into patients (browse → pick service → pick slot → confirm).
3. **Content / Community** – keeps visitors coming back (blog, videos, comments, reactions, newsletter).

The platform must be **SEO-strong** (patients Google their symptoms), **mobile-first** (most BD traffic is mobile), **bilingual** (Bangla + English), and **delightful** (subtle animations, clear typography).

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)** + TypeScript | SSR/SSG for SEO, single repo for FE+BE, file-based routing |
| Styling | **Tailwind CSS** + **shadcn/ui** | Fast iteration, consistent design system |
| Animation | **Framer Motion** | Catchy, declarative animations |
| Database | **SQLite** (dev) via **Prisma** | Zero-setup on Windows, easy swap to Postgres for prod |
| ORM | **Prisma** | Type-safe queries, auto migrations |
| Auth | **NextAuth.js v5 (Auth.js)** | Sessions, OAuth-ready, role guards |
| Forms | **React Hook Form** + **Zod** | Type-safe validation |
| Icons | **Lucide React** | Clean, tree-shakeable |
| Dates | **date-fns** | Light, locale-aware |
| i18n | **next-intl** | Server/client i18n for App Router |
| Email | **Resend** (stubbed in dev) | Transactional email |
| SMS | Stub | Real provider (Twilio/SSL Wireless) wired later |

### Folder Structure

```
ANIS_BHAI/
├── prisma/
│   ├── schema.prisma           # Full data model
│   └── seed.ts                 # Rich dummy data
├── public/
│   └── images/                 # Static assets
├── src/
│   ├── app/
│   │   ├── (public)/           # Marketing site
│   │   │   ├── page.tsx              # Home
│   │   │   ├── about/
│   │   │   ├── services/
│   │   │   ├── doctors/
│   │   │   │   └── [slug]/
│   │   │   ├── contact/
│   │   │   ├── blog/
│   │   │   │   └── [slug]/
│   │   │   ├── book/                 # Booking flow
│   │   │   └── legal/[doc]/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── patient/              # Patient dashboard
│   │   │   ├── doctor/               # Doctor dashboard
│   │   │   └── admin/                # Admin dashboard
│   │   ├── api/                # Backend routes
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── booking/
│   │   │   ├── doctors/
│   │   │   ├── blog/
│   │   │   ├── comments/
│   │   │   ├── reactions/
│   │   │   └── admin/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # shadcn primitives
│   │   ├── marketing/          # Hero, FeatureGrid, etc.
│   │   ├── booking/            # SlotPicker, ServiceCard
│   │   ├── blog/               # PostCard, CommentTree
│   │   └── dashboard/          # Calendar, StatsCard
│   ├── lib/
│   │   ├── prisma.ts           # DB client singleton
│   │   ├── auth.ts             # NextAuth config
│   │   ├── slots.ts            # Slot computation
│   │   ├── email.ts            # Email stubs
│   │   └── utils.ts
│   └── server/
│       └── actions/            # Server actions
└── README.md
```

---

## 3. Database Schema (entities)

| Entity | Purpose |
|---|---|
| `User` | Single account table (role: PATIENT, DOCTOR, ADMIN) |
| `Doctor` | Doctor profile (linked 1:1 to User) — bio, specializations, credentials |
| `Patient` | Patient profile (linked 1:1 to User) — DOB, phone, optional insurance |
| `Specialization` | Tag entity for filtering doctors |
| `Credential` | Education / Approbation entries (timeline) |
| `Service` | Treatment offered (name, duration, price, buffer time) |
| `DoctorService` | Many-to-many: which doctor offers which service |
| `WorkingHours` | Per-doctor weekday schedule |
| `TimeOff` | Vacation / breaks |
| `SlotOverride` | Manual single-slot overrides |
| `Appointment` | Booking record (patient, doctor, service, time, status) |
| `AppointmentToken` | Secure token for guest reschedule/cancel links |
| `Post` | Blog post (rich text, status, author, slug, SEO) |
| `Category` / `Tag` | Post taxonomy |
| `Comment` | Threaded, with moderation status |
| `Reaction` | Like/emoji on post or comment |
| `Newsletter` | Email signups |

See `prisma/schema.prisma` for full definition.

---

## 4. Module Breakdown

### A. Public-Facing Portfolio
- **Home** – animated hero, featured services, doctor intro, latest posts, stats, CTA strip
- **About** – academic timeline (Approbation, residencies), specializations, philosophy
- **Services** – grid of treatment areas with details
- **Doctors** – list (filter by specialization) + individual profile (bio, gallery, services, book CTA)
- **Contact** – embedded map, opening hours, address, contact form
- **Legal** – privacy policy, terms (BD-specific stubs)

### B. Appointment Booking
- **Patient flow**: pick doctor → pick service → see calendar with available slots (computed from working hours minus existing bookings minus time-off) → fill details (guest or logged-in) → confirm → email + token link
- **Doctor flow**: calendar view, define hours, add time-off, override slots, see patient notes, mark complete/no-show
- **Admin flow**: manage all calendars, invite doctors, manual booking, reports

### C. Blog / Content
- Public list (filter by category/tag), single post with reading time, related posts
- Comments (threaded, moderation queue)
- Reactions (emoji)
- Share buttons, newsletter form

### D. Accounts
- Patient self-register, dashboard with appointments + comment history
- Doctor invite-only, dashboard
- Admin dashboard

---

## 5. Build Phases (this session)

1. ✅ Plan
2. Scaffold + deps
3. Schema + seed (dummy doctors, services, posts, appointments)
4. Layout shell + design tokens
5. Public site (home → about → services → doctors → contact → blog)
6. Booking flow
7. Auth + dashboards
8. Polish + i18n stub + README

Some integrations (real SMS, real email, full 2FA, payment) are stubbed in this session — clearly marked with `// TODO(prod)` so they're easy to replace.

---

## 6. Out of Scope (this session)

- Real payment integration (bKash / Stripe)
- Real SMS/email delivery (using console-stub providers)
- Production deployment infra (Docker, CI/CD)
- Telemedicine video calls
- EMR / prescription system

These are explicitly listed as future phases in the README.
