import { requireUser } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Doctor · Schedule" };

const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function DoctorSchedulePage() {
  const { email } = await requireUser();
  const doctor = await prisma.doctor.findFirst({
    where: { user: { email } },
    include: { workingHours: { orderBy: { weekday: "asc" } }, timeOff: { orderBy: { startsAt: "asc" } } },
  });
  if (!doctor) return null;

  const hoursByDay: Record<number, string[]> = {};
  for (const h of doctor.workingHours) (hoursByDay[h.weekday] ??= []).push(`${h.startTime} – ${h.endTime}`);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold">Schedule</h1>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Weekly working hours</h2>
            <p className="mt-1 text-sm text-muted-foreground">Patients will only see slots within these windows.</p>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="size-4" />
            Add window
          </Button>
        </div>
        <ul className="mt-6 divide-y">
          {weekday.map((day, i) => (
            <li key={day} className="flex items-center justify-between py-3 text-sm">
              <span className="font-medium">{day}</span>
              <span className="text-muted-foreground">
                {hoursByDay[i]?.join(", ") ?? <span className="text-muted-foreground/70">Off</span>}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Time off</h2>
          <Button variant="outline" size="sm">
            <Plus className="size-4" />
            Block time
          </Button>
        </div>
        {doctor.timeOff.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No upcoming time off.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {doctor.timeOff.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-xl border bg-card p-3 text-sm">
                <div>
                  <p className="font-medium">{t.reason ?? "Off"}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(t.startsAt)} → {formatDate(t.endsAt)}</p>
                </div>
                <Badge variant="warning">blocked</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="text-xs text-muted-foreground">
        Note: in this demo, schedule edits are read-only. Hook up the mutation routes to enable editing.
      </p>
    </div>
  );
}
