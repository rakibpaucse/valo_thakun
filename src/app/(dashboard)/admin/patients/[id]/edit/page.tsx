import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminPatientEditForm } from "@/components/dashboard/admin-patient-edit-form";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { formatDate, formatTime } from "@/lib/utils";

export const metadata = { title: "Admin · Edit patient" };

export default async function AdminEditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      user: true,
      appointments: {
        orderBy: { startsAt: "desc" },
        take: 10,
        include: { doctor: { include: { user: true } }, service: true },
      },
    },
  });
  if (!patient) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/admin/patients">
            <ChevronLeft className="size-4" />
            All patients
          </Link>
        </Button>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Edit {patient.user.name}
        </h1>
      </div>

      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold">Profile</h2>
        <div className="mt-6">
          <AdminPatientEditForm
            id={patient.id}
            defaults={{
              name: patient.user.name,
              email: patient.user.email,
              phone: patient.phone ?? "",
              gender: patient.gender ?? "",
              insuranceType: patient.insuranceType ?? "",
              dateOfBirth: patient.dateOfBirth?.toISOString().slice(0, 10) ?? "",
              notes: patient.notes ?? "",
            }}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold">Recent appointments</h2>
        {patient.appointments.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No appointments yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {patient.appointments.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-100 p-3 text-sm"
              >
                <div>
                  <p className="font-medium text-ink-900">{a.service.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.doctor.title} {a.doctor.user.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")}
                    {" · "}
                    {formatDate(a.startsAt)} · {formatTime(a.startsAt)}
                  </p>
                </div>
                <Badge
                  variant={
                    a.status === "COMPLETED" ? "success" :
                    a.status === "NO_SHOW" ? "warning" :
                    a.status === "CANCELLED" ? "destructive" : "default"
                  }
                >
                  {a.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="border-rose-200 bg-rose-50/40 p-6">
        <h2 className="font-display text-lg font-semibold text-rose-700">Danger zone</h2>
        <p className="mt-1 text-sm text-rose-700/85">
          Deleting removes this patient and all their history. Upcoming appointments must be cancelled first.
        </p>
        <div className="mt-4">
          <DeleteButton
            url={`/api/admin/patients/${patient.id}`}
            variant="destructive"
            confirmMessage={`Delete ${patient.user.name}? This cannot be undone.`}
            onSuccessRedirect="/admin/patients"
            label="Delete patient"
            size="default"
          />
        </div>
      </Card>
    </div>
  );
}
