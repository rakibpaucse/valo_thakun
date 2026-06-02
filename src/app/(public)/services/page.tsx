import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { formatBDT } from "@/lib/utils";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    include: { specialization: true, doctors: { include: { doctor: { include: { user: true } } } } },
  });
  const specs = await prisma.specialization.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="page-enter">
      <section className="container py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Treatment areas</p>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight md:text-6xl">
            Care that meets you where you are
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Each service includes time, listening, and a clear plan. Pricing is transparent — no hidden fees.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {specs.map((s) => (
            <Badge key={s.id} variant="secondary" className="px-3 py-1.5 text-sm">
              {s.name}
            </Badge>
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.id} id={s.slug} className="group h-full overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-xl scroll-mt-24">
              {s.imageUrl && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={s.imageUrl}
                    alt={s.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-foreground text-background">
                    <ServiceIcon name={s.iconKey} className="size-5" />
                  </div>
                  {s.isFeatured && <Badge variant="accent">Popular</Badge>}
                </div>
                <h2 className="mt-4 font-display text-xl font-semibold">{s.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {s.durationMinutes} min
                  </span>
                  {s.specialization && (
                    <span className="flex items-center gap-1">
                      <Tag className="size-3.5" />
                      {s.specialization.name}
                    </span>
                  )}
                  <span className="ml-auto font-semibold text-foreground">{formatBDT(s.price)}</span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t pt-4">
                  <div className="flex -space-x-2">
                    {s.doctors.slice(0, 3).map((ds) => (
                      <img
                        key={ds.doctor.id}
                        src={ds.doctor.avatarUrl ?? ""}
                        alt={ds.doctor.user.name}
                        className="size-7 rounded-full border-2 border-background object-cover"
                      />
                    ))}
                    {s.doctors.length > 3 && (
                      <span className="grid size-7 place-items-center rounded-full border-2 border-background bg-muted text-[10px] font-medium">
                        +{s.doctors.length - 3}
                      </span>
                    )}
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/book?service=${s.slug}`}>
                      Book
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
