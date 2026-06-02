"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function DeleteButton({
  url,
  label = "Delete",
  confirmMessage = "Delete this record? This cannot be undone.",
  onSuccessRedirect,
  size = "sm",
  variant = "outline",
}: {
  url: string;
  label?: string;
  confirmMessage?: string;
  onSuccessRedirect?: string;
  size?: "sm" | "default" | "lg";
  variant?: "outline" | "destructive" | "ghost";
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function go() {
    if (!confirm(confirmMessage)) return;
    setLoading(true);
    const res = await fetch(url, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      toast.success("Deleted");
      if (onSuccessRedirect) router.push(onSuccessRedirect);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error("Could not delete", data.error ?? "Please try again.");
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={go}
      disabled={loading}
      className={variant === "outline" ? "border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-400" : ""}
    >
      <Trash2 className="size-3.5" />
      {loading ? "…" : label}
    </Button>
  );
}
