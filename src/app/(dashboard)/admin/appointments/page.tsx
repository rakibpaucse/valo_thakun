import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils";

export const metadata = { title: "Admin · Appointments" };

export default async function AdminAppointmentsPage() {
  const appts = await prisma.appointment.findMany({
    orderBy: { startsAt: "desc" },
    take: 100,
    include: {
      doctor: { include: { user: true } },
      service: true,
      patient: { include: { user: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold">All appointments</h1>
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="pb-3">Patient</th>
                <th className="pb-3">Doctor</th>
                <th className="pb-3">Service</th>
                <th className="pb-3">When</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {appts.map((a) => (
                <tr key={a.id}>
                  <td className="py-3 font-medium">{a.patient?.user.name ?? a.guestName ?? "Guest"}</td>
                  <td className="py-3 text-muted-foreground">
                    {a.doctor.title} {a.doctor.user.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")}
                  </td>
                  <td className="py-3 text-muted-foreground">{a.service.name}</td>
                  <td className="py-3 text-muted-foreground">{formatDate(a.startsAt)} · {formatTime(a.startsAt)}</td>
                  <td className="py-3">
                    <Badge variant={
                      a.status === "COMPLETED" ? "success" :
                      a.status === "NO_SHOW" ? "warning" :
                      a.status === "CANCELLED" ? "destructive" : "default"
                    }>{a.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
