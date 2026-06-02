import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your appointments.</p>
      </div>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-mist-200/60" />}>
        <LoginForm />
      </Suspense>
      <p className="text-sm text-muted-foreground">
        Don't have an account? <Link href="/register" className="font-medium text-primary hover:underline">Create one</Link>
      </p>
    </div>
  );
}
