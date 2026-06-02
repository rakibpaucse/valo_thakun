"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, LogIn, LogOut, User, CalendarDays, Stethoscope, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { initials } from "@/lib/utils";

const roleHome: Record<string, string> = {
  PATIENT: "/patient",
  DOCTOR: "/doctor",
  ADMIN: "/admin",
};

const roleIcon: Record<string, React.ReactNode> = {
  PATIENT: <User className="size-4" />,
  DOCTOR: <Stethoscope className="size-4" />,
  ADMIN: <ShieldCheck className="size-4" />,
};

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-8 w-24 rounded-full bg-mist-200 animate-pulse" aria-hidden />;
  }

  if (!session?.user) {
    return (
      <Button asChild variant="ghost" size="sm">
        <Link href="/login">
          <LogIn className="size-4" />
          Sign in
        </Link>
      </Button>
    );
  }

  const role = ((session.user as { role?: string }).role ?? "PATIENT") as keyof typeof roleHome;
  const home = roleHome[role] ?? "/patient";
  const name = session.user.name ?? "You";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="press inline-flex items-center gap-2 rounded-full border border-ink-100 bg-card pl-1 pr-3 py-1 text-sm shadow-soft hover:border-iris-300 hover:shadow-lift"
          aria-label="Open user menu"
        >
          <Avatar className="size-7">
            {session.user.image && <AvatarImage src={session.user.image} alt={name} />}
            <AvatarFallback className="bg-iris-100 text-iris-700 text-[11px]">
              {initials(name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden font-medium text-ink-900 sm:inline">
            {name.split(" ").slice(0, 2).join(" ")}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <div className="px-3 py-3">
          <p className="font-medium text-sm text-ink-900 truncate">{name}</p>
          <p className="text-xs text-ink-700/65 truncate">{session.user.email}</p>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-iris-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-iris-700">
            {roleIcon[role] ?? <User className="size-3" />}
            {role.toLowerCase()}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={home}>
            <LayoutDashboard className="size-4 text-iris-600" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        {role === "PATIENT" && (
          <DropdownMenuItem asChild>
            <Link href="/patient/appointments">
              <CalendarDays className="size-4 text-iris-600" />
              My appointments
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => signOut({ callbackUrl: "/" })}
          className="text-red-600 focus:bg-rose-50"
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
