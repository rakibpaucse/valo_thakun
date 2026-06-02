import { CalendarDays, Users, CheckCircle2, AlertCircle } from "lucide-react";
import { requireUser } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatDateLong, formatTime } from "@/lib/utils";

export const metadata = { title: "Doctor dashboard" };

export default async function DoctorDashboard() {
  const { email } = await requireUser();
  const doctor = await prisma.doctor.findFirst({
    where: { user: { email } },
    include: { user: true },
  });
  if (!doctor) {
    return <div className="rounded-2xl border bg-card p-8 text-center">No doctor profile linked to this account.</div>;
  }

  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(now);
  dayEnd.setHours(23, 59, 59, 999);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [today, upcoming, monthCount, noShows] = await Promise.all([
    prisma.appointment.findMany({
      where: { doctorId: doctor.id, startsAt: { gte: dayStart, lte: dayEnd } },
      orderBy: { startsAt: "asc" },
      include: { service: true, patient: { include: { user: true } } },
    }),
    prisma.appointment.findMany({
      where: { doctorId: doctor.id, startsAt: { gte: now }, status: { in: ["CONFIRMED", "PENDING"] } },
      orderBy: { startsAt: "asc" },
      take: 5,
      include: { service: true, patient: { include: { user: true } } },
    }),
    prisma.appointment.count({ where: { doctorId: doctor.id, startsAt: { gte: monthStart } } }),
    prisma.appointment.count({ where: { doctorId: doctor.id, startsAt: { gte: monthStart }, status: "NO_SHOW" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Good day, {doctor.title} {doctor.user.name.split(" ").pop()}</h1>
        <p className="mt-1 text-muted-foreground">Your schedule at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's bookings" value={today.length} icon={<CalendarDays className="size-5" />} />
        <StatCard label="This month" value={monthCount} icon={<Users className="size-5" />} tone="accent" />
        <StatCard label="No-shows (month)" value={noShows} icon={<AlertCircle className="size-5" />} tone="warning" />
        <StatCard label="Status" value="Accepting" hint={`${doctor.isAcceptingNew ? "New & returning" : "Returning only"}`} icon={<CheckCircle2 className="size-5" />} tone="success" />
      </div>

      <Card className="p-6">
        <h2 className="font-display text-xl font-semibold">Today's schedule</h2>
        <div className="mt-5">
          {today.length === 0 ? (
            <p className="rounded-xl border bg-secondary/30 p-6 text-center text-sm text-muted-foreground">
              No appointments today. Enjoy the breather.
            </p>
          ) : (
            <ul className="space-y-2">
              {today.map((a) => {
                const patientName = a.patient?.user.name ?? a.guestName ?? "Guest";
                return (
                  <li key={a.id} className="flex items-center gap-4 rounded-xl border bg-card p-3 transition-all hover:shadow-md">
                    <div className="grid w-20 shrink-0 place-items-center rounded-lg bg-primary/5 py-2 text-center">
                      <p className="text-sm font-semibold">{formatTime(a.startsAt)}</p>
                      <p className="text-[10px] text-muted-foreground">{a.service.durationMinutes} min</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{patientName}</p>
                      <p className="text-xs text-muted-foreground">{a.service.name}</p>
                      {a.notes && <p className="mt-1 text-xs text-muted-foreground italic line-clamp-1">"{a.notes}"</p>}
                    </div>
                    <Badge
                      variant={a.status === "COMPLETED" ? "success" : a.status === "NO_SHOW" ? "warning" : a.status === "CANCELLED" ? "destructive" : "default"}
                    >
                      {a.status}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-xl font-semibold">Upcoming</h2>
        <ul className="mt-5 divide-y">
          {upcoming.map((a) => (
            <li key={a.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{a.patient?.user.name ?? a.guestName ?? "Guest"}</p>
                <p className="text-xs text-muted-foreground">{a.service.name} · {formatDateLong(a.startsAt)} · {formatTime(a.startsAt)}</p>
              </div>
              <Badge variant="default">{a.status}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
