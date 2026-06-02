import { requireUser } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { AppointmentRow } from "@/components/dashboard/appointment-row";

export const metadata = { title: "Doctor · Appointments" };

export default async function DoctorAppointmentsPage() {
  const { email } = await requireUser();
  const doctor = await prisma.doctor.findFirst({ where: { user: { email } } });
  if (!doctor) return null;
  const appts = await prisma.appointment.findMany({
    where: { doctorId: doctor.id },
    orderBy: { startsAt: "desc" },
    take: 100,
    include: { service: true, patient: { include: { user: true } } },
  });

  const now = new Date();
  const upcoming = appts.filter((a) => a.startsAt >= now);
  const past = appts.filter((a) => a.startsAt < now);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Appointments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tap a row to add clinical notes or change the status.
        </p>
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">
          Upcoming
          <span className="ml-2 text-sm font-normal text-muted-foreground">({upcoming.length})</span>
        </h2>
        {upcoming.length === 0 ? (
          <Card className="p-6 text-sm text-muted-foreground">No upcoming appointments.</Card>
        ) : (
          <div className="space-y-2">
            {upcoming.map((a) => (
              <AppointmentRow
                key={a.id}
                id={a.id}
                patientName={a.patient?.user.name ?? a.guestName ?? "Guest"}
                serviceName={a.service.name}
                startsAt={a.startsAt}
                endsAt={a.endsAt}
                status={a.status as "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"}
                notes={a.notes}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">
          Past
          <span className="ml-2 text-sm font-normal text-muted-foreground">({past.length})</span>
        </h2>
        {past.length === 0 ? (
          <Card className="p-6 text-sm text-muted-foreground">No past appointments.</Card>
        ) : (
          <div className="space-y-2">
            {past.map((a) => (
              <AppointmentRow
                key={a.id}
                id={a.id}
                patientName={a.patient?.user.name ?? a.guestName ?? "Guest"}
                serviceName={a.service.name}
                startsAt={a.startsAt}
                endsAt={a.endsAt}
                status={a.status as "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"}
                notes={a.notes}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
