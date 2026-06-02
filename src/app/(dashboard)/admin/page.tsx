import { CalendarDays, Users, FileText, MessageSquare, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatDateLong, formatTime, relativeTime } from "@/lib/utils";

export const metadata = { title: "Admin dashboard" };

export default async function AdminDashboard() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(now);
  dayEnd.setHours(23, 59, 59, 999);

  const [
    todayCount,
    monthCount,
    doctorsCount,
    postsCount,
    pendingComments,
    unreadMessages,
    todayList,
  ] = await Promise.all([
    prisma.appointment.count({ where: { startsAt: { gte: dayStart, lte: dayEnd } } }),
    prisma.appointment.count({ where: { startsAt: { gte: monthStart } } }),
    prisma.doctor.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.comment.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.appointment.findMany({
      where: { startsAt: { gte: dayStart, lte: dayEnd } },
      orderBy: { startsAt: "asc" },
      include: { doctor: { include: { user: true } }, service: true, patient: { include: { user: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Practice overview</h1>
        <p className="mt-1 text-muted-foreground">All doctors, all bookings, all in one place.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Bookings today" value={todayCount} icon={<CalendarDays className="size-5" />} />
        <StatCard label="This month" value={monthCount} icon={<CalendarDays className="size-5" />} tone="accent" />
        <StatCard label="Active doctors" value={doctorsCount} icon={<Users className="size-5" />} tone="success" />
        <StatCard label="Published posts" value={postsCount} icon={<FileText className="size-5" />} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Moderation queue</p>
              <p className="mt-1 font-display text-2xl font-semibold">{pendingComments}</p>
              <p className="mt-1 text-xs text-muted-foreground">comments awaiting review</p>
            </div>
            <div className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
              <MessageSquare className="size-5" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Unread messages</p>
              <p className="mt-1 font-display text-2xl font-semibold">{unreadMessages}</p>
              <p className="mt-1 text-xs text-muted-foreground">contact form submissions</p>
            </div>
            <div className="grid size-10 place-items-center rounded-xl bg-red-500/10 text-red-600">
              <AlertCircle className="size-5" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="font-display text-xl font-semibold">Today's bookings — all doctors</h2>
        <div className="mt-5">
          {todayList.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings today.</p>
          ) : (
            <ul className="space-y-2">
              {todayList.map((a) => (
                <li key={a.id} className="flex items-center gap-4 rounded-xl border bg-card p-3">
                  <div className="grid w-20 shrink-0 place-items-center rounded-lg bg-primary/5 py-2 text-center">
                    <p className="text-sm font-semibold">{formatTime(a.startsAt)}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{a.patient?.user.name ?? a.guestName ?? "Guest"}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.service.name} · {a.doctor.title} {a.doctor.user.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")}
                    </p>
                  </div>
                  <Badge variant={
                    a.status === "COMPLETED" ? "success" :
                    a.status === "NO_SHOW" ? "warning" :
                    a.status === "CANCELLED" ? "destructive" : "default"
                  }>{a.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
