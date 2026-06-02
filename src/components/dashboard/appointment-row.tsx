"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { cn, formatDate, formatTime } from "@/lib/utils";

type Status = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

const statusOptions: Status[] = ["CONFIRMED", "COMPLETED", "NO_SHOW", "CANCELLED", "PENDING"];

export function AppointmentRow({
  id,
  patientName,
  serviceName,
  startsAt,
  endsAt,
  status,
  notes,
}: {
  id: string;
  patientName: string;
  serviceName: string;
  startsAt: Date;
  endsAt: Date;
  status: Status;
  notes: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [draftNotes, setDraftNotes] = React.useState(notes ?? "");
  const [draftStatus, setDraftStatus] = React.useState<Status>(status);
  const [saving, setSaving] = React.useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: draftNotes || null, status: draftStatus }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Saved", "Appointment updated.");
      router.refresh();
      setOpen(false);
    } else {
      toast.error("Could not save");
    }
  }

  const badgeTone = (s: Status) =>
    s === "COMPLETED" ? "success" :
    s === "NO_SHOW" ? "warning" :
    s === "CANCELLED" ? "destructive" : "default";

  return (
    <div className="rounded-2xl border border-ink-100 bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-3 text-left"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid w-20 shrink-0 place-items-center rounded-lg bg-iris-50 py-2 text-center">
            <p className="text-sm font-semibold text-ink-900">{formatTime(startsAt)}</p>
            <p className="text-[10px] text-ink-700/65">{formatDate(startsAt)}</p>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-ink-900">{patientName}</p>
            <p className="truncate text-xs text-ink-700/65">{serviceName}</p>
            {notes && !open && (
              <p className="mt-1 line-clamp-1 text-xs italic text-ink-700/55">"{notes}"</p>
            )}
          </div>
          <Badge variant={badgeTone(draftStatus)}>{draftStatus}</Badge>
          <ChevronDown
            className={cn(
              "size-4 text-ink-700/65 transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-ink-100 bg-mist-50/40 p-4 space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-medium text-ink-700/85">Status</p>
            <div className="flex flex-wrap gap-1.5">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setDraftStatus(s)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    draftStatus === s
                      ? "border-iris-600 bg-iris-600 text-white"
                      : "border-ink-200 bg-card text-ink-700/75 hover:border-iris-300",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-ink-700/85">Clinical notes</p>
            <Textarea
              value={draftNotes}
              onChange={(e) => setDraftNotes(e.target.value)}
              rows={4}
              placeholder="Observations, plan, follow-up date…"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setDraftNotes(notes ?? "");
                setDraftStatus(status);
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={save} disabled={saving}>
              <Save className="size-3.5" />
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
