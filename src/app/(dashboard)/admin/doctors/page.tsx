import Link from "next/link";
import { Star, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/dashboard/delete-button";

export const metadata = { title: "Admin · Doctors" };

export default async function AdminDoctorsPage() {
  const doctors = await prisma.doctor.findMany({
    orderBy: [{ isMain: "desc" }, { rating: "desc" }],
    include: {
      user: true,
      specializations: { include: { specialization: true } },
      _count: { select: { appointments: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Doctors</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit profiles, change main-doctor status, or remove from the practice.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((d) => (
          <Card key={d.id} className="overflow-hidden">
            <div className="flex items-center gap-3 p-5">
              {d.avatarUrl && (
                <img src={d.avatarUrl} alt="" className="size-12 rounded-xl object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">
                    {d.title} {d.user.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")}
                  </p>
                  {d.isMain && <Badge className="text-[10px]">Main</Badge>}
                </div>
                <p className="truncate text-xs text-muted-foreground">{d.user.email}</p>
              </div>
            </div>
            <div className="border-t bg-secondary/30 p-5 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  {d.rating.toFixed(1)} · {d.reviewCount} reviews
                </span>
                <span className="text-xs text-muted-foreground">{d._count.appointments} bookings</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {d.specializations.map((s) => (
                  <Badge key={s.specialization.id} variant="secondary" className="text-[10px]">
                    {s.specialization.name}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link href={`/admin/doctors/${d.id}/edit`}>
                    <Pencil className="size-3.5" />
                    Edit
                  </Link>
                </Button>
                <DeleteButton
                  url={`/api/admin/doctors/${d.id}`}
                  confirmMessage={`Delete ${d.user.name}? This removes their account and all related data. Upcoming appointments must be cancelled first.`}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
