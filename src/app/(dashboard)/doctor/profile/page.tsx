import { requireUser } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DoctorProfileForm } from "@/components/dashboard/doctor-profile-form";

export const metadata = { title: "Doctor · Profile" };

export default async function DoctorProfilePage() {
  const { email } = await requireUser();
  const doctor = await prisma.doctor.findFirst({
    where: { user: { email } },
    include: {
      user: true,
      specializations: { include: { specialization: true } },
    },
  });
  if (!doctor) return null;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold">Profile</h1>

      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold">Public profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This is what patients see on your doctor page.
        </p>

        <div className="mt-6">
          <DoctorProfileForm
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
            }}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold">Specializations</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Managed by the practice admin. Get in touch to change yours.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {doctor.specializations.map((s) => (
            <Badge key={s.specialization.id}>{s.specialization.name}</Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
