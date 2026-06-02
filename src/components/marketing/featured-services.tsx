import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ServiceIcon } from "./service-icon";
import { formatBDT } from "@/lib/utils";

type Service = {
  id: string;
  slug: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  iconKey: string | null;
};

export function FeaturedServices({ services }: { services: Service[] }) {
  return (
    <section className="container py-20">
      <SectionHeader
        eyebrow="What we treat"
        title="Care across the moments that matter"
        description="From a routine check-up to a complex cardiac case, we provide the same calm, thorough attention."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link key={s.id} href={`/services#${s.slug}`} className="group block h-full">
            <Card className="press group relative h-full overflow-hidden p-6 hover:-translate-y-1 hover:shadow-lift">
              <div className="absolute -right-10 -top-10 size-32 rounded-full bg-iris-100/0 blur-2xl transition-colors duration-300 group-hover:bg-iris-100" />
              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-iris-50 text-iris-700">
                  <ServiceIcon name={s.iconKey} className="size-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink-900">{s.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-700/70">
                  {s.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4 text-xs text-ink-700/70">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {s.durationMinutes} min
                  </span>
                  <span className="font-medium text-ink-900">From {formatBDT(s.price)}</span>
                </div>

                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-iris-700">
                  Learn more
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  const isCenter = align === "center";
  return (
    <div className={isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-iris-700">{eyebrow}</p>
      )}
      <h2 className="mt-3 font-display text-4xl font-semibold tracking-tightx text-ink-900 md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-ink-700/75">{description}</p>
      )}
    </div>
  );
}
