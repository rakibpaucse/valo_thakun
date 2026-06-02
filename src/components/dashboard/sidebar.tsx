"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays, Home, Settings, Users, FileText, BarChart3, Stethoscope, Clock, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "PATIENT" | "DOCTOR" | "ADMIN";

const navByRole: Record<Role, { href: string; label: string; icon: React.ReactNode }[]> = {
  PATIENT: [
    { href: "/patient", label: "Overview", icon: <Home className="size-4" /> },
    { href: "/patient/appointments", label: "Appointments", icon: <CalendarDays className="size-4" /> },
    { href: "/patient/comments", label: "My comments", icon: <MessageSquare className="size-4" /> },
    { href: "/patient/settings", label: "Settings", icon: <Settings className="size-4" /> },
  ],
  DOCTOR: [
    { href: "/doctor", label: "Overview", icon: <Home className="size-4" /> },
    { href: "/doctor/appointments", label: "Appointments", icon: <CalendarDays className="size-4" /> },
    { href: "/doctor/schedule", label: "Schedule", icon: <Clock className="size-4" /> },
    { href: "/doctor/profile", label: "Profile", icon: <Stethoscope className="size-4" /> },
  ],
  ADMIN: [
    { href: "/admin", label: "Overview", icon: <Home className="size-4" /> },
    { href: "/admin/appointments", label: "Appointments", icon: <CalendarDays className="size-4" /> },
    { href: "/admin/doctors", label: "Doctors", icon: <Stethoscope className="size-4" /> },
    { href: "/admin/patients", label: "Patients", icon: <Users className="size-4" /> },
    { href: "/admin/posts", label: "Posts", icon: <FileText className="size-4" /> },
    { href: "/admin/messages", label: "Messages", icon: <MessageSquare className="size-4" /> },
    { href: "/admin/reports", label: "Reports", icon: <BarChart3 className="size-4" /> },
  ],
};

export function DashboardSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = navByRole[role];
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 border-r bg-background p-4 md:block">
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent/10 hover:text-foreground",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
