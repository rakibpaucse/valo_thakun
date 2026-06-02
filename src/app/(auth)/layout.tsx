import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between p-8">
        <Link href="/"><Logo /></Link>
        <div className="mx-auto w-full max-w-sm flex-1 flex items-center">{children}</div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Valo Thakun Practice</p>
      </div>

      <aside className="relative hidden overflow-hidden bg-ink-900 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative flex h-full flex-col justify-center p-12 text-white">
          <h2 className="font-display text-4xl font-semibold leading-tight">
            Care that follows you, <span className="italic text-iris-200">not the other way around.</span>
          </h2>
          <p className="mt-4 max-w-md text-white/80">
            Sign in to see upcoming appointments, manage bookings, and access your conversation history with our doctors.
          </p>
          <div className="mt-10 rounded-2xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-md">
            <p className="text-sm font-semibold">Demo logins · password: <code className="font-mono text-iris-200">password123</code></p>
            <ul className="mt-3 space-y-1 text-sm text-white/80">
              <li><code className="font-mono">admin@anisbhai.health</code> · admin</li>
              <li><code className="font-mono">anis@anisbhai.health</code> · doctor (main)</li>
              <li><code className="font-mono">rashed@example.com</code> · patient</li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
