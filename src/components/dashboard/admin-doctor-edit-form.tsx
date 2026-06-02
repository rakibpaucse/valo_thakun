"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function AdminDoctorEditForm({
  id,
  defaults,
}: {
  id: string;
  defaults: {
    name: string;
    title: string;
    headline: string;
    bio: string;
    yearsExperience: number;
    consultationFee: number;
    languages: string;
    phone: string;
    whatsapp: string;
    isAcceptingNew: boolean;
    isMain: boolean;
  };
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [isAcceptingNew, setIsAcceptingNew] = React.useState(defaults.isAcceptingNew);
  const [isMain, setIsMain] = React.useState(defaults.isMain);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch(`/api/admin/doctors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...fd,
        yearsExperience: Number(fd.yearsExperience),
        consultationFee: Number(fd.consultationFee),
        isAcceptingNew,
        isMain,
      }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success("Saved", "Doctor profile updated.");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error("Could not save", data.error ?? "Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <Label htmlFor="name">Display name</Label>
          <Input id="name" name="name" required defaultValue={defaults.name} />
        </div>
        <div className="w-32">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required defaultValue={defaults.title} />
        </div>
      </div>
      <div>
        <Label htmlFor="headline">Headline</Label>
        <Input id="headline" name="headline" required defaultValue={defaults.headline} />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={7} required defaultValue={defaults.bio} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="yearsExperience">Years experience</Label>
          <Input id="yearsExperience" name="yearsExperience" type="number" min={0} max={80}
                 defaultValue={defaults.yearsExperience} />
        </div>
        <div>
          <Label htmlFor="consultationFee">Fee (BDT)</Label>
          <Input id="consultationFee" name="consultationFee" type="number" min={0}
                 defaultValue={defaults.consultationFee} />
        </div>
        <div>
          <Label htmlFor="languages">Languages</Label>
          <Input id="languages" name="languages" defaultValue={defaults.languages} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={defaults.phone} />
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input id="whatsapp" name="whatsapp" defaultValue={defaults.whatsapp} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink-100 p-3 hover:bg-secondary">
          <input
            type="checkbox"
            checked={isAcceptingNew}
            onChange={(e) => setIsAcceptingNew(e.target.checked)}
            className="size-4 accent-iris-600"
          />
          <span className="text-sm">
            <span className="block font-medium text-ink-900">Accepting new patients</span>
            <span className="text-xs text-ink-700/65">Shown on the public profile.</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink-100 p-3 hover:bg-secondary">
          <input
            type="checkbox"
            checked={isMain}
            onChange={(e) => setIsMain(e.target.checked)}
            className="size-4 accent-iris-600"
          />
          <span className="text-sm">
            <span className="block font-medium text-ink-900">Main practice doctor</span>
            <span className="text-xs text-ink-700/65">Only one doctor at a time can hold this.</span>
          </span>
        </label>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          <Save className="size-4" />
          {loading ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
