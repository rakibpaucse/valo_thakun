import { prisma } from "@/lib/prisma";
import { BookingFlow } from "@/components/booking/booking-flow";

export const metadata = { title: "Book an appointment" };

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ doctor?: string; service?: string }>;
}) {
  const { doctor: doctorSlug, service: serviceSlug } = await searchParams;

  const doctors = await prisma.doctor.findMany({
    orderBy: [{ isMain: "desc" }, { rating: "desc" }],
    include: {
      user: { select: { name: true } },
      specializations: { include: { specialization: true } },
      services: { include: { service: true } },
    },
  });

  return (
    <div className="page-enter">
      <section className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Book</p>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight md:text-6xl">
            Reserve your time
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Three quick steps. No phone call needed.
          </p>
        </div>
      </section>

      <section className="container pb-20">
        <BookingFlow
          doctors={doctors.map((d) => ({
            id: d.id,
            slug: d.slug,
            name: d.user.name,
            title: d.title,
            avatarUrl: d.avatarUrl,
            specializations: d.specializations.map((s) => s.specialization.name),
            services: d.services.map((s) => ({
              id: s.service.id,
              slug: s.service.slug,
              name: s.service.name,
              description: s.service.description,
              durationMinutes: s.service.durationMinutes,
              price: s.service.price,
              iconKey: s.service.iconKey,
            })),
          }))}
          initialDoctorSlug={doctorSlug}
          initialServiceSlug={serviceSlug}
        />
      </section>
    </div>
  );
}
