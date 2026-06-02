import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminDoctorEditForm } from "@/components/dashboard/admin-doctor-edit-form";
import { DeleteButton } from "@/components/dashboard/delete-button";

export const metadata = { title: "Admin · Edit doctor" };

export default async function AdminEditDoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: {
      user: true,
      specializations: { include: { specialization: true } },
    },
  });
  if (!doctor) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/admin/doctors">
            <ChevronLeft className="size-4" />
            All doctors
          </Link>
        </Button>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Edit {doctor.title} {doctor.user.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")}
        </h1>
      </div>

      <Card className="p-6">
        <AdminDoctorEditForm
          id={doctor.id}
          defaults={{
            name: doctor.user.name,
            title: doctor.title,
            headline: doctor.headline,
            bio: doctor.bio,
            yearsExperience: doctor.yearsExperience,
            consultationFee: doctor.consultationFee,
            languages: doctor.languages,
            phone: doctor.phone ?? "",
            whatsapp: doctor.whatsapp ?? "",
            isAcceptingNew: doctor.isAcceptingNew,
            isMain: doctor.isMain,
          }}
        />
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold">Specializations</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {doctor.specializations.map((s) => (
            <Badge key={s.specialization.id}>{s.specialization.name}</Badge>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Specialization edits live in the database admin for now.
        </p>
      </Card>

      <Card className="border-rose-200 bg-rose-50/40 p-6">
        <h2 className="font-display text-lg font-semibold text-rose-700">Danger zone</h2>
        <p className="mt-1 text-sm text-rose-700/85">
          Deleting removes this doctor and all their data. Upcoming appointments must be cancelled first.
        </p>
        <div className="mt-4">
          <DeleteButton
            url={`/api/admin/doctors/${doctor.id}`}
            variant="destructive"
            confirmMessage={`Delete ${doctor.user.name}? This cannot be undone.`}
            onSuccessRedirect="/admin/doctors"
            label="Delete doctor"
            size="default"
          />
        </div>
      </Card>
    </div>
  );
}
