"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function AdminPatientEditForm({
  id,
  defaults,
}: {
  id: string;
  defaults: {
    name: string;
    email: string;
    phone: string;
    gender: string;
    insuranceType: string;
    dateOfBirth: string;
    notes: string;
  };
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch(`/api/admin/patients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.name,
        phone: fd.phone || null,
        gender: fd.gender || null,
        insuranceType: fd.insuranceType || null,
        dateOfBirth: fd.dateOfBirth || null,
        notes: fd.notes || null,
      }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success("Saved", "Patient updated.");
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
        <Input id="phone" name="phone" defaultValue={defaults.phone} />
      </div>
      <div>
        <Label htmlFor="dateOfBirth">Date of birth</Label>
        <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={defaults.dateOfBirth} />
      </div>
      <div>
        <Label htmlFor="gender">Gender</Label>
        <Input id="gender" name="gender" defaultValue={defaults.gender} />
      </div>
      <div>
        <Label htmlFor="insuranceType">Insurance</Label>
        <Input id="insuranceType" name="insuranceType" defaultValue={defaults.insuranceType} />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="notes">Internal notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={defaults.notes}
          placeholder="Allergies, ongoing conditions, anything the front desk should know."
        />
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
