import Link from "next/link";
import { ArrowRight, Award, Calendar, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/marketing/hero";
import { QuickActions } from "@/components/marketing/quick-actions";
import { StatsStrip } from "@/components/marketing/stats-strip";
import { FeaturedServices, SectionHeader } from "@/components/marketing/featured-services";
import { DoctorCard } from "@/components/marketing/doctor-card";
import { PostCard } from "@/components/marketing/post-card";

export default async function HomePage() {
  const [services, doctors, posts] = await Promise.all([
    prisma.service.findMany({ where: { isFeatured: true }, take: 6 }),
    prisma.doctor.findMany({
      take: 4,
      orderBy: [{ isMain: "desc" }, { rating: "desc" }],
      include: {
        user: { select: { name: true } },
        specializations: { include: { specialization: true } },
      },
    }),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: {
        author: { select: { name: true } },
        categories: { include: { category: true } },
      },
    }),
  ]);

  return (
    <div>
      <Hero />
      <QuickActions />
      <StatsStrip />
      <FeaturedServices services={services} />

      {/* Why us */}
      <section className="container py-20">
        <SectionHeader
          eyebrow="Why patients choose us"
          title="The standard of care you'd want for your own family"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <Award className="size-6" />,
              title: "International training",
              text: "German Approbation, Berlin fellowship, ongoing collaboration with European centres.",
            },
            {
              icon: <Calendar className="size-6" />,
              title: "Time you can feel",
              text: "First consultations are 30+ minutes — no rushed visits, no production-line medicine.",
            },
            {
              icon: <ShieldCheck className="size-6" />,
              title: "Quietly thorough",
              text: "Every plan is evidence-based, patient-friendly, and shared with you in plain language.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="press group relative rounded-3xl border border-ink-100 bg-card p-6 shadow-soft hover:shadow-lift hover:-translate-y-1"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-iris-50 text-iris-700">
                {f.icon}
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-ink-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700/70">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors */}
      <section className="container py-20">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHeader
            align="left"
            eyebrow="Meet the team"
            title="Specialists who actually listen"
          />
          <Button asChild variant="outline">
            <Link href="/doctors">
              All doctors
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((d, i) => (
            <DoctorCard key={d.id} doctor={d} index={i} />
          ))}
        </div>
      </section>

      {/* CTA — classy navy card, no gradient */}
      <section className="container py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink-900 p-10 text-mist-50 shadow-lift md:p-16">
          {/* Subtle dot pattern */}
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
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-mist-100">
                Same-week openings
              </span>
              <h2 className="mt-5 font-display text-4xl font-semibold tracking-tightx md:text-5xl">
                Ready to feel <span className="italic font-light text-iris-200">better?</span>
              </h2>
              <p className="mt-4 max-w-md text-mist-100/80">
                Book online in under a minute. Same-week appointments, transparent pricing,
                no surprises.
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
                  Book now
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/60"
              >
                <Link href="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest posts */}
      <section className="container py-20">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHeader align="left" eyebrow="Insights" title="Read & rest assured" />
          <Button asChild variant="outline">
            <Link href="/blog">
              All articles
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
