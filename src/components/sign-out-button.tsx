"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function SignOutButton({
  variant = "ghost",
  size = "sm",
  showIcon = true,
  callbackUrl = "/",
}: {
  variant?: "ghost" | "outline" | "default" | "destructive";
  size?: "sm" | "default" | "lg";
  showIcon?: boolean;
  callbackUrl?: string;
}) {
  const [loading, setLoading] = React.useState(false);

  async function onClick() {
    setLoading(true);
    try {
      await signOut({ callbackUrl, redirect: true });
    } catch {
      toast.error("Could not sign out", "Please try again.");
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant={variant} size={size} onClick={onClick} disabled={loading}>
      {showIcon && <LogOut className="size-4" />}
      {loading ? "Signing out…" : "Sign out"}
    </Button>
  );
}
