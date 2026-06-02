"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { UserPlus } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fd),
    });
    if (res.ok) {
      const sign = await signIn("credentials", {
        email: fd.email,
        password: fd.password,
        redirect: false,
      });
      setLoading(false);
      if (sign?.error) {
        toast.error("Account created but couldn't sign in", "Please try logging in.");
        router.push("/login");
      } else {
        toast.success("Account created", "Welcome aboard!");
        router.push("/patient");
        router.refresh();
      }
    } else {
      const data = await res.json().catch(() => ({}));
      setLoading(false);
      toast.error("Could not create account", data.error ?? "Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required minLength={2} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" placeholder="+880 ..." />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required minLength={8} />
      </div>
      <Button type="submit" disabled={loading} variant="gradient" size="lg" className="w-full">
        <UserPlus className="size-4" />
        {loading ? "Creating…" : "Create account"}
      </Button>
    </form>
  );
}
