import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Logo } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = ((session.user as { role?: string }).role ?? "PATIENT") as "PATIENT" | "DOCTOR" | "ADMIN";

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 md:px-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Logo size="sm" />
            <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
              {role.toLowerCase()}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar className="size-8">
                {session.user.image && <AvatarImage src={session.user.image} alt={session.user.name ?? ""} />}
                <AvatarFallback>{initials(session.user.name ?? "U")}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-sm">
                <p className="font-medium leading-tight">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="flex">
        <DashboardSidebar role={role} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
