import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Save your details for faster bookings.</p>
      </div>
      <RegisterForm />
      <p className="text-sm text-muted-foreground">
        Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
