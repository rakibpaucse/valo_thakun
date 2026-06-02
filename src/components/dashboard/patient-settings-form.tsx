"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function PatientSettingsForm({
  defaults,
}: {
  defaults: {
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    insuranceType: string;
  };
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/me/patient", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.name,
        phone: fd.phone || null,
        gender: fd.gender || null,
        insuranceType: fd.insuranceType || null,
        dateOfBirth: fd.dateOfBirth || null,
      }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success("Saved", "Your profile is up to date.");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error("Could not save", data.error ?? "Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required defaultValue={defaults.name} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" defaultValue={defaults.email} disabled />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" defaultValue={defaults.phone} placeholder="+880 ..." />
      </div>
      <div>
        <Label htmlFor="dateOfBirth">Date of birth</Label>
        <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={defaults.dateOfBirth} />
      </div>
      <div>
        <Label htmlFor="gender">Gender</Label>
        <Input id="gender" name="gender" defaultValue={defaults.gender} placeholder="e.g. Male" />
      </div>
      <div>
        <Label htmlFor="insuranceType">Insurance</Label>
        <Input id="insuranceType" name="insuranceType" defaultValue={defaults.insuranceType} placeholder="e.g. Pragati Life" />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={loading}>
          <Save className="size-4" />
          {loading ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
