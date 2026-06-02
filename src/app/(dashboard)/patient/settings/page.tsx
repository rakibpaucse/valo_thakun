import { requireUser } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { PatientSettingsForm } from "@/components/dashboard/patient-settings-form";

export const metadata = { title: "Settings" };

export default async function PatientSettingsPage() {
  const { email } = await requireUser();
  const user = await prisma.user.findUnique({
    where: { email },
    include: { patient: true },
  });
  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold">Settings</h1>

      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your contact details are shared with your doctor at the time of your visit.
        </p>

        <div className="mt-6">
          <PatientSettingsForm
            defaults={{
              name: user.name,
              email: user.email,
              phone: user.patient?.phone ?? "",
              gender: user.patient?.gender ?? "",
              insuranceType: user.patient?.insuranceType ?? "",
              dateOfBirth: user.patient?.dateOfBirth?.toISOString().slice(0, 10) ?? "",
            }}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold">Security</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Password change + two-factor authentication land here next.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">Coming soon.</p>
      </Card>
    </div>
  );
}
