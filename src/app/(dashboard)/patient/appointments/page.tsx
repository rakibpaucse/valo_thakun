import Link from "next/link";
import { requireUser } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateLong, formatTime } from "@/lib/utils";

export const metadata = { title: "Appointments" };

export default async function PatientAppointmentsPage() {
  const { email } = await requireUser();
  const patient = await prisma.patient.findFirst({
    where: { user: { email } },
  });
  if (!patient) return null;

  const appts = await prisma.appointment.findMany({
    where: { patientId: patient.id },
    orderBy: { startsAt: "desc" },
    include: { doctor: { include: { user: true } }, service: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">All appointments</h1>
          <p className="mt-1 text-muted-foreground">Past and upcoming.</p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/book">Book new</Link>
        </Button>
      </div>

      <Card className="p-6">
        {appts.length === 0 ? (
          <p className="text-sm text-muted-foreground">You haven't made any bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="pb-3">Service</th>
                  <th className="pb-3">Doctor</th>
                  <th className="pb-3">When</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {appts.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3 font-medium">{a.service.name}</td>
                    <td className="py-3 text-muted-foreground">
                      {a.doctor.title} {a.doctor.user.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {formatDateLong(a.startsAt)} · {formatTime(a.startsAt)}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          a.status === "CONFIRMED" || a.status === "COMPLETED" ? "success" :
                          a.status === "CANCELLED" ? "destructive" :
                          a.status === "NO_SHOW" ? "warning" : "secondary"
                        }
                      >
                        {a.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/manage/${a.cancelToken}`}>Manage</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
