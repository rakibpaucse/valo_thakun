import Link from "next/link";
import { CalendarCheck, Stethoscope, FileHeart, ArrowUpRight } from "lucide-react";

const items = [
  {
    title: "Book an appointment",
    desc: "Pick a doctor, a time that works, and you're done in 60 seconds.",
    href: "/book",
    cta: "Reserve now",
    icon: CalendarCheck,
    tint: "bg-iris-50 text-iris-700",
  },
  {
    title: "Find your specialist",
    desc: "Cardiology, dermatology, pediatrics, psychiatry, orthopedics — meet the team.",
    href: "/doctors",
    cta: "Browse doctors",
    icon: Stethoscope,
    tint: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "New here?",
    desc: "What to expect, what to bring, and how we work with insurance.",
    href: "/about",
    cta: "First-visit guide",
    icon: FileHeart,
    tint: "bg-amber-50 text-amber-700",
  },
];

export function QuickActions() {
  return (
    <section className="container -mt-10 relative z-10 grid gap-4 md:grid-cols-3 md:-mt-16">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <Link
            key={it.title}
            href={it.href}
            className="reveal press group relative overflow-hidden rounded-3xl border border-ink-100 bg-card p-6 shadow-soft hover:shadow-lift hover:-translate-y-1"
            style={{ animationDelay: `${0.1 + i * 0.06}s` }}
          >
            <div className={`grid size-12 place-items-center rounded-2xl ${it.tint}`}>
              <Icon className="size-5" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold text-ink-900">
              {it.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-700/70">{it.desc}</p>
            <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-iris-700">
              {it.cta}
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="pointer-events-none absolute -right-12 -bottom-12 size-44 rounded-full bg-iris-50 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
          </Link>
        );
      })}
    </section>
  );
}
