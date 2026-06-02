import { prisma } from "@/lib/prisma";
import { DoctorCard } from "@/components/marketing/doctor-card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Doctors" };

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ spec?: string }>;
}) {
  const { spec } = await searchParams;

  const [specs, doctors] = await Promise.all([
    prisma.specialization.findMany({ orderBy: { name: "asc" } }),
    prisma.doctor.findMany({
      where: spec
        ? { specializations: { some: { specialization: { slug: spec } } } }
        : undefined,
      orderBy: [{ isMain: "desc" }, { rating: "desc" }],
      include: {
        user: { select: { name: true } },
        specializations: { include: { specialization: true } },
      },
    }),
  ]);

  return (
    <div className="page-enter">
      <section className="container py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our doctors</p>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight md:text-6xl">
            Specialists, hand-picked
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Every doctor in our practice is selected for clinical excellence and the quality of their bedside manner.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <a href="/doctors">
            <Badge variant={spec ? "secondary" : "default"} className="px-3 py-1.5 text-sm">All</Badge>
          </a>
          {specs.map((s) => (
            <a key={s.id} href={`/doctors?spec=${s.slug}`}>
              <Badge variant={spec === s.slug ? "default" : "secondary"} className="px-3 py-1.5 text-sm">
                {s.name}
              </Badge>
            </a>
          ))}
        </div>
      </section>

      <section className="container pb-20">
        {doctors.length === 0 ? (
          <p className="text-center text-muted-foreground">No doctors found in this specialization.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d, i) => (
              <DoctorCard key={d.id} doctor={d} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
