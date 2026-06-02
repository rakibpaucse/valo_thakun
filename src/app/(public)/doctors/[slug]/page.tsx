import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Star, Languages, Stethoscope, GraduationCap, Award, Briefcase,
  Phone, MessageCircle, Calendar, Clock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { formatBDT } from "@/lib/utils";

const kindIcon: Record<string, React.ReactNode> = {
  EDUCATION: <GraduationCap className="size-4" />,
  CERTIFICATION: <Award className="size-4" />,
  POSITION: <Briefcase className="size-4" />,
  AWARD: <Award className="size-4" />,
};

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await prisma.doctor.findUnique({ where: { slug }, include: { user: true } });
  return { title: d ? `${d.title} ${d.user.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")}` : "Doctor" };
}

export default async function DoctorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = await prisma.doctor.findUnique({
    where: { slug },
    include: {
      user: true,
      specializations: { include: { specialization: true } },
      credentials: { orderBy: { yearStart: "desc" } },
      services: { include: { service: true } },
      workingHours: { orderBy: { weekday: "asc" } },
      galleryImages: { orderBy: { order: "asc" } },
    },
  });
  if (!doctor) notFound();

  const hoursByDay: Record<number, string[]> = {};
  for (const h of doctor.workingHours) {
    (hoursByDay[h.weekday] ??= []).push(`${h.startTime} – ${h.endTime}`);
  }

  return (
    <div>
      {/* Decorative banner — sits flush under the nav, capped height */}
      <div
        aria-hidden
        className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-iris-100 via-mist-200 to-iris-50"
      >
        {doctor.coverUrl && (
          <img
            src={doctor.coverUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
        )}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--primary) / 0.7) 1px, transparent 1.4px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse at center, black 10%, transparent 70%)",
          }}
        />
      </div>

      {/* Profile body — content starts cleanly below the banner.
         Only the avatar card pulls up via -mt-20 (just the image overlaps cover). */}
      <section className="container pb-16">
        <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
          {/* LEFT — sticky info column */}
          <aside className="lg:sticky lg:top-20 lg:self-start space-y-6 -mt-20 lg:-mt-24">
            <Card className="overflow-hidden p-0 shadow-lift">
              {doctor.avatarUrl && (
                <div className="aspect-square w-full overflow-hidden bg-mist-200">
                  <img
                    src={doctor.avatarUrl}
                    alt={doctor.user.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-ink-900">{doctor.rating.toFixed(1)}</span>
                  <span className="text-ink-700/65">· {doctor.reviewCount} reviews</span>
                </div>

                <h1 className="mt-3 font-display text-2xl font-semibold leading-tight text-ink-900">
                  {doctor.title} {doctor.user.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")}
                </h1>
                <p className="mt-1 text-sm text-ink-700/70">{doctor.headline}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {doctor.specializations.map((s) => (
                    <Badge key={s.specialization.id}>{s.specialization.name}</Badge>
                  ))}
                </div>

                <dl className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-sm">
                  <div className="flex items-center gap-2 text-ink-700/75">
                    <Stethoscope className="size-4 text-iris-600" />
                    <span>{doctor.yearsExperience}+ years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-700/75">
                    <Languages className="size-4 text-iris-600" />
                    <span>{doctor.languages.split(",").join(", ")}</span>
                  </div>
                </dl>

                <div className="mt-5 space-y-2">
                  <Button asChild className="w-full" size="lg">
                    <Link href={`/book?doctor=${doctor.slug}`}>
                      <Calendar className="size-4" />
                      Book — {formatBDT(doctor.consultationFee)}
                    </Link>
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    {doctor.phone && (
                      <Button asChild variant="outline" size="sm">
                        <a href={`tel:${doctor.phone}`}><Phone className="size-3.5" />Call</a>
                      </Button>
                    )}
                    {doctor.whatsapp && (
                      <Button asChild variant="outline" size="sm">
                        <a href={`https://wa.me/${doctor.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                          <MessageCircle className="size-3.5" />WhatsApp
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Hours */}
            <Card className="p-5">
              <h3 className="flex items-center gap-2 font-display text-base font-semibold text-ink-900">
                <Clock className="size-4 text-iris-600" />
                Consulting hours
              </h3>
              <div className="mt-3 space-y-1.5 text-sm">
                {weekdayLabels.map((label, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-ink-700/65">{label}</span>
                    <span className="text-ink-900">
                      {hoursByDay[i]?.join(", ") ?? <span className="text-ink-700/50">Closed</span>}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </aside>

          {/* RIGHT — content. Top padding ensures About starts well clear of the nav. */}
          <div className="space-y-12 pt-6 lg:pt-2">
            {/* Bio */}
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tightx text-ink-900">About</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-ink-700/85">
                {doctor.bio.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tightx text-ink-900">Services offered</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {doctor.services.map((ds) => (
                  <Link
                    key={ds.service.id}
                    href={`/book?doctor=${doctor.slug}&service=${ds.service.slug}`}
                    className="press group flex items-center gap-3 rounded-2xl border border-ink-100 bg-card p-4 hover:-translate-y-0.5 hover:shadow-soft"
                  >
                    <div className="grid size-10 place-items-center rounded-xl bg-iris-50 text-iris-700">
                      <ServiceIcon name={ds.service.iconKey} className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-ink-900">{ds.service.name}</p>
                      <p className="text-xs text-ink-700/65">
                        {ds.service.durationMinutes} min · {formatBDT(ds.service.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Credentials */}
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tightx text-ink-900">Credentials</h2>
              <ol className="mt-5 space-y-3">
                {doctor.credentials.map((c) => (
                  <li key={c.id} className="rounded-2xl border border-ink-100 bg-card p-4 shadow-soft">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="grid size-7 place-items-center rounded-lg bg-iris-50 text-iris-700">
                          {kindIcon[c.kind] ?? <Award className="size-3.5" />}
                        </span>
                        <h3 className="font-semibold text-ink-900">{c.title}</h3>
                      </div>
                      <span className="text-xs text-ink-700/60">
                        {c.yearStart}{c.yearEnd ? ` — ${c.yearEnd}` : c.yearStart ? " — present" : ""}
                      </span>
                    </div>
                    <p className="mt-1 pl-9 text-sm text-ink-700/70">
                      {c.institution}{c.location && ` · ${c.location}`}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            {doctor.galleryImages.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tightx text-ink-900">Gallery</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {doctor.galleryImages.map((g) => (
                    <img
                      key={g.id}
                      src={g.url}
                      alt={g.caption ?? ""}
                      className="aspect-square w-full rounded-2xl object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
