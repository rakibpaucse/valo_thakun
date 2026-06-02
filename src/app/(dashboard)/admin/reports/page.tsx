import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export const metadata = { title: "Admin · Reports" };

export default async function AdminReportsPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const allMonthAppts = await prisma.appointment.findMany({
    where: { startsAt: { gte: monthStart } },
    include: { doctor: { include: { user: true } }, service: true },
  });

  // bookings per doctor
  const byDoctor = new Map<string, { name: string; count: number; noShows: number }>();
  for (const a of allMonthAppts) {
    const key = a.doctorId;
    const existing = byDoctor.get(key) ?? {
      name: `${a.doctor.title} ${a.doctor.user.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")}`,
      count: 0,
      noShows: 0,
    };
    existing.count++;
    if (a.status === "NO_SHOW") existing.noShows++;
    byDoctor.set(key, existing);
  }

  // popular services
  const byService = new Map<string, { name: string; count: number }>();
  for (const a of allMonthAppts) {
    const key = a.serviceId;
    const existing = byService.get(key) ?? { name: a.service.name, count: 0 };
    existing.count++;
    byService.set(key, existing);
  }

  const totalAppts = allMonthAppts.length;
  const totalNoShows = allMonthAppts.filter((a) => a.status === "NO_SHOW").length;
  const noShowRate = totalAppts ? ((totalNoShows / totalAppts) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Reports</h1>
        <p className="mt-1 text-muted-foreground">For {now.toLocaleString("en-US", { month: "long", year: "numeric" })}.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SmallStat label="Total bookings" value={totalAppts} />
        <SmallStat label="No-shows" value={totalNoShows} />
        <SmallStat label="No-show rate" value={`${noShowRate}%`} />
      </div>

      <Card className="p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          <TrendingUp className="size-5 text-primary" />
          Bookings per doctor
        </h2>
        <ul className="mt-5 space-y-3">
          {[...byDoctor.values()]
            .sort((a, b) => b.count - a.count)
            .map((d) => {
              const max = Math.max(...[...byDoctor.values()].map((x) => x.count), 1);
              const pct = (d.count / max) * 100;
              return (
                <li key={d.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{d.name}</span>
                    <span className="text-muted-foreground">
                      {d.count} {d.noShows > 0 && <Badge variant="warning" className="ml-2 text-[10px]">{d.noShows} no-shows</Badge>}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
        </ul>
      </Card>

      <Card className="p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          <TrendingUp className="size-5 text-primary" />
          Popular services
        </h2>
        <ul className="mt-5 space-y-3">
          {[...byService.values()]
            .sort((a, b) => b.count - a.count)
            .slice(0, 8)
            .map((s) => {
              const max = Math.max(...[...byService.values()].map((x) => x.count), 1);
              const pct = (s.count / max) * 100;
              return (
                <li key={s.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-muted-foreground">{s.count}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gradient-to-r from-accent to-brand-500" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
        </ul>
      </Card>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
