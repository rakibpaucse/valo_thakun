"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function CancelButton({ token }: { token: string }) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  async function cancel() {
    if (!confirm("Cancel this appointment? You can rebook a new slot at any time.")) return;
    setLoading(true);
    const res = await fetch(`/api/booking/cancel/${token}`, { method: "POST" });
    setLoading(false);
    if (res.ok) {
      toast.success("Appointment cancelled");
      router.refresh();
    } else {
      toast.error("Could not cancel", "Please try again.");
    }
  }

  return (
    <Button onClick={cancel} variant="destructive" className="mt-3" disabled={loading}>
      {loading ? "Cancelling…" : "Cancel appointment"}
    </Button>
  );
}
