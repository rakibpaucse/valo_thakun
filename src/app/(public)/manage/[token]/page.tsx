import { notFound } from "next/navigation";
import { CalendarDays, Clock, User, Stethoscope } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CancelButton } from "@/components/booking/cancel-button";
import { formatDateLong, formatTime } from "@/lib/utils";

export const metadata = { title: "Manage your appointment" };

export default async function ManageAppointmentPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const appt = await prisma.appointment.findUnique({
    where: { cancelToken: token },
    include: {
      doctor: { include: { user: true } },
      service: true,
      patient: { include: { user: true } },
    },
  });
  if (!appt) notFound();

  const cancelled = appt.status === "CANCELLED";
  const past = new Date(appt.startsAt) < new Date();

  return (
    <div className="container-prose page-enter py-16">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Manage your appointment</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Your booking</h1>

      <Card className="mt-8 p-6">
        <div className="flex items-center justify-between">
          <Badge variant={cancelled ? "destructive" : past ? "secondary" : "success"}>{appt.status}</Badge>
          <span className="text-xs text-muted-foreground">#{appt.id.slice(0, 8)}</span>
        </div>

        <h2 className="mt-4 font-display text-2xl font-semibold">{appt.service.name}</h2>
        <p className="text-muted-foreground">
          with {appt.doctor.title} {appt.doctor.user.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")}
        </p>

        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          <Row icon={<CalendarDays className="size-4" />} label="Date" value={formatDateLong(appt.startsAt)} />
          <Row icon={<Clock className="size-4" />} label="Time" value={`${formatTime(appt.startsAt)} – ${formatTime(appt.endsAt)}`} />
          <Row icon={<User className="size-4" />} label="Patient" value={appt.patient?.user.name ?? appt.guestName ?? "—"} />
          <Row icon={<Stethoscope className="size-4" />} label="Service duration" value={`${appt.service.durationMinutes} min`} />
        </dl>

        {appt.notes && (
          <div className="mt-6 rounded-xl border bg-secondary/40 p-4 text-sm">
            <p className="text-xs font-medium uppercase text-muted-foreground">Notes you provided</p>
            <p className="mt-1">{appt.notes}</p>
          </div>
        )}

        {!cancelled && !past && (
          <div className="mt-8 border-t pt-6">
            <p className="text-sm text-muted-foreground">Need to change something? Cancel and rebook for a different slot.</p>
            <CancelButton token={token} />
          </div>
        )}
      </Card>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
