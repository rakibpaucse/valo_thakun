import Link from "next/link";
import {
  ArrowRight, Calendar, Clock, ShieldCheck, HeartHandshake,
  BookOpenCheck, MessageCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { AboutHero } from "@/components/marketing/about-hero";

export const metadata = {
  title: "About",
  description:
    "About Valo Thakun (ভালো থাকুন) — a Dhaka-based multi-specialty medical practice built around time, evidence and warmth.",
};

const principles = [
  {
    icon: <Clock className="size-6" />,
    title: "Time, not throughput",
    text: "First visits are 30+ minutes. We don't run a production line — we run a practice.",
  },
  {
    icon: <BookOpenCheck className="size-6" />,
    title: "Evidence over opinion",
    text: "Every plan is grounded in current clinical guidelines and shared with you in plain language.",
  },
  {
    icon: <HeartHandshake className="size-6" />,
    title: "Continuity of care",
    text: "Same doctor, same context. Your history follows you across every visit and every specialist on our team.",
  },
  {
    icon: <ShieldCheck className="size-6" />,
    title: "Privacy by default",
    text: "Records stay on servers in Bangladesh. No ad trackers. You can request or delete your data any time.",
  },
];

export default async function AboutPage() {
  const [specializations, doctors] = await Promise.all([
    prisma.specialization.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { doctors: true } } },
    }),
    prisma.doctor.findMany({
      orderBy: [{ isMain: "desc" }, { rating: "desc" }],
      include: {
        user: { select: { name: true } },
        specializations: { include: { specialization: true } },
      },
    }),
  ]);

  // Aggregate stats for the hero collage
  const totalYearsOfCare = doctors.reduce((sum, d) => sum + (d.yearsExperience ?? 0), 0);

  return (
    <div>
      <AboutHero
        yearsOfCare={totalYearsOfCare}
        doctorCount={doctors.length}
        specialtyCount={specializations.length}
        founded={2015}
      />

      {/* ── Story ────────────────────────────────────────────────── */}
      <section className="container py-20">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-iris-700">
              Our story
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tightx text-ink-900 md:text-5xl">
              Started small.<br />
              <span className="italic font-light text-ink-700">Built slowly.</span>
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-ink-700/80">
            <p>
              Valo Thakun began as a single-doctor cardiology clinic in Banani,
              Dhaka — a quiet pushback against the rushed, fifteen-minute
              consultations that had become the norm in private practice across
              the country.
            </p>
            <p>
              Over the years, careful colleagues joined — a dermatologist, a
              pediatrician, a psychiatrist, an orthopedic surgeon. Each invited
              because they share the same belief: that the unhurried hour is
              where medicine actually happens.
            </p>
            <p>
              We built our own booking platform because the off-the-shelf tools
              felt patient-hostile. Today, you can move from a search result to
              a confirmed slot in under a minute — and reschedule from a single
              link, with no login required.
            </p>
          </div>
        </div>
      </section>

      {/* ── Principles ───────────────────────────────────────────── */}
      <section className="border-y border-ink-100 bg-mist-100/40">
        <div className="container py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-iris-700">
              How we work
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tightx text-ink-900 md:text-5xl">
              Four principles, kept simple.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <div
                key={p.title}
                className="press group relative rounded-3xl border border-ink-100 bg-card p-6 shadow-soft hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="grid size-12 place-items-center rounded-2xl bg-iris-50 text-iris-700">
                  {p.icon}
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink-900">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700/70">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we treat ────────────────────────────────────────── */}
      <section className="container py-20">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-iris-700">
              What we treat
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tightx text-ink-900 md:text-5xl">
              Across {specializations.length}{" "}
              <span className="italic font-light text-ink-700">specialties.</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-700/75">
              Common conditions, second opinions, ongoing care — handled by
              specialists who actually know each other and confer when needed.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/services">
              View all services
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {specializations.map((s) => (
            <Link
              key={s.id}
              href={`/doctors?spec=${s.slug}`}
              className="press group flex items-center gap-3 rounded-2xl border border-ink-100 bg-card p-4 hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-iris-50 text-iris-700">
                <ServiceIcon name={s.iconKey} className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-ink-900">{s.name}</p>
                <p className="text-xs text-ink-700/65">
                  {s._count.doctors} {s._count.doctors === 1 ? "doctor" : "doctors"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────── */}
      <section className="container py-20">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-iris-700">
              The team
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tightx text-ink-900 md:text-5xl">
              {doctors.length} doctors,{" "}
              <span className="italic font-light text-ink-700">one practice.</span>
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/doctors">
              Meet everyone
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => (
            <Link
              key={d.id}
              href={`/doctors/${d.slug}`}
              className="press group flex items-center gap-4 rounded-3xl border border-ink-100 bg-card p-4 hover:-translate-y-1 hover:shadow-lift"
            >
              {d.avatarUrl && (
                <img
                  src={d.avatarUrl}
                  alt={d.user.name}
                  className="size-16 shrink-0 rounded-2xl object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base font-semibold text-ink-900">
                  {d.title} {d.user.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")}
                </p>
                <p className="mt-0.5 truncate text-xs text-ink-700/65">
                  {d.specializations.map((s) => s.specialization.name).join(" · ")}
                </p>
                <div className="mt-2 flex gap-1.5 overflow-hidden">
                  {d.specializations.slice(0, 1).map((s) => (
                    <Badge key={s.specialization.id} className="text-[10px]">
                      {s.specialization.name}
                    </Badge>
                  ))}
                  {d.yearsExperience > 0 && (
                    <Badge variant="secondary" className="text-[10px]">
                      {d.yearsExperience}+ yrs
                    </Badge>
                  )}
                </div>
              </div>
              <ArrowRight className="size-4 shrink-0 text-iris-600 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="container py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink-900 p-10 text-mist-50 shadow-lift md:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="font-display text-4xl font-semibold tracking-tightx md:text-5xl">
                Care that feels{" "}
                <span className="italic font-light text-iris-200">like a conversation.</span>
              </h2>
              <p className="mt-4 max-w-md text-mist-100/80">
                Book in under a minute, or send us a question first. Either way,
                you'll hear back from a real human.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <Button
                asChild
                size="xl"
                className="bg-background text-foreground hover:bg-mist-200"
              >
                <Link href="/book">
                  <Calendar className="size-5" />
                  Book a visit
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/60"
              >
                <Link href="/contact">
                  <MessageCircle className="size-5" />
                  Ask a question
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
