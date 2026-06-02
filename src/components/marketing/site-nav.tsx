"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { UserMenu } from "@/components/marketing/user-menu";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/doctors", label: "Doctors" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl transition-all duration-300",
        scrolled && "border-b border-ink-100 shadow-[0_4px_20px_-12px_rgba(18,32,86,0.18)]",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="group">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "link-underline px-3 py-2 text-sm transition-colors",
                  active ? "font-medium text-ink-900 is-active" : "text-ink-700/75 hover:text-ink-900",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <UserMenu />
          <Button asChild size="sm">
            <Link href="/book">Book appointment</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen((o) => !o)} aria-label="Open menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-100 glass md:hidden">
          <nav className="container flex flex-col py-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-secondary">
                {l.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 pt-2 border-t border-ink-100">
              <Button asChild variant="outline"><Link href="/login">Sign in</Link></Button>
              <Button asChild><Link href="/book">Book</Link></Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
