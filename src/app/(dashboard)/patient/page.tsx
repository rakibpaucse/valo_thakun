import Link from "next/link";
import { CalendarDays, MessageSquare, CheckCircle2, Clock } from "lucide-react";
import { requireUser } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatDateLong, formatTime } from "@/lib/utils";

export const metadata = { title: "Patient dashboard" };

export default async function PatientDashboard() {
  const { email } = await requireUser();

  const patient = await prisma.patient.findFirst({
    where: { user: { email } },
    include: { user: true },
  });
  if (!patient) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <p>No patient profile found for this account.</p>
      </div>
    );
  }

  const now = new Date();
  const [upcoming, past, comments] = await Promise.all([
    prisma.appointment.findMany({
      where: { patientId: patient.id, startsAt: { gte: now }, status: { in: ["CONFIRMED", "PENDING"] } },
      orderBy: { startsAt: "asc" },
      include: { doctor: { include: { user: true } }, service: true },
    }),
    prisma.appointment.findMany({
      where: { patientId: patient.id, startsAt: { lt: now } },
      orderBy: { startsAt: "desc" },
      take: 5,
      include: { doctor: { include: { user: true } }, service: true },
    }),
    prisma.comment.count({ where: { authorId: patient.userId } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Welcome back, {patient.user.name.split(" ")[0]}</h1>
        <p className="mt-1 text-muted-foreground">Here's a quick look at your health journey with us.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Upcoming visits" value={upcoming.length} icon={<CalendarDays className="size-5" />} />
        <StatCard label="Visits this year" value={past.length + upcoming.length} icon={<CheckCircle2 className="size-5" />} tone="success" />
        <StatCard label="Comments" value={comments} icon={<MessageSquare className="size-5" />} tone="accent" />
        <StatCard label="Account status" value="Active" hint="Verified email" tone="success" icon={<CheckCircle2 className="size-5" />} />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Upcoming appointments</h2>
          <Button asChild size="sm" variant="gradient">
            <Link href="/book">Book another</Link>
          </Button>
        </div>
        <div className="mt-5">
          {upcoming.length === 0 ? (
            <p className="rounded-xl border bg-secondary/30 p-6 text-center text-sm text-muted-foreground">
              You have no upcoming appointments. <Link href="/book" className="text-primary hover:underline">Book one →</Link>
            </p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    {a.doctor.avatarUrl && (
                      <img src={a.doctor.avatarUrl} alt="" className="size-12 rounded-xl object-cover" />
                    )}
                    <div>
                      <p className="font-medium">{a.service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.doctor.title} {a.doctor.user.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{formatDateLong(a.startsAt)}</p>
                    <p className="text-muted-foreground flex items-center gap-1 justify-end"><Clock className="size-3" />{formatTime(a.startsAt)}</p>
                  </div>
                  <Badge variant="success">{a.status}</Badge>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/manage/${a.cancelToken}`}>Manage</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-xl font-semibold">Recent visits</h2>
        <div className="mt-5">
          {past.length === 0 ? (
            <p className="text-sm text-muted-foreground">No past visits yet.</p>
          ) : (
            <ul className="divide-y">
              {past.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium">{a.service.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.doctor.title} {a.doctor.user.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")} · {formatDateLong(a.startsAt)}
                    </p>
                  </div>
                  <Badge variant={a.status === "COMPLETED" ? "success" : a.status === "NO_SHOW" ? "warning" : "secondary"}>
                    {a.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
