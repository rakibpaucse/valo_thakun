import Link from "next/link";
import { Pencil, Phone, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { formatDate, initials } from "@/lib/utils";

export const metadata = { title: "Admin · Patients" };

export default async function AdminPatientsPage() {
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      _count: { select: { appointments: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Patients</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit any patient profile, or remove the account.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-mist-50 text-left text-xs uppercase tracking-wider text-ink-700/60">
              <tr>
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Bookings</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {patients.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">
                    No patients yet.
                  </td>
                </tr>
              )}
              {patients.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        {p.user.image && <AvatarImage src={p.user.image} alt={p.user.name} />}
                        <AvatarFallback className="bg-iris-100 text-iris-700 text-xs">
                          {initials(p.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-ink-900">{p.user.name}</p>
                        {p.gender && (
                          <Badge variant="secondary" className="mt-0.5 text-[10px]">
                            {p.gender}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-ink-700/75">
                    <div className="flex items-center gap-1.5">
                      <Mail className="size-3" /> {p.user.email}
                    </div>
                    {p.phone && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <Phone className="size-3" /> {p.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-ink-700/65">
                    {formatDate(p.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-xs text-ink-700/65">
                    {p._count.appointments}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/patients/${p.id}/edit`}>
                          <Pencil className="size-3.5" />
                          Edit
                        </Link>
                      </Button>
                      <DeleteButton
                        url={`/api/admin/patients/${p.id}`}
                        confirmMessage={`Delete ${p.user.name}? This removes their account and all history.`}
                      />
                    </div>
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
