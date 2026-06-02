"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Clock, CalendarDays, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { toast } from "@/components/ui/toast";
import { cn, formatBDT, formatDateLong, formatTime } from "@/lib/utils";

type ServiceLite = {
  id: string;
  slug: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  iconKey: string | null;
};

type DoctorLite = {
  id: string;
  slug: string;
  name: string;
  title: string;
  avatarUrl: string | null;
  specializations: string[];
  services: ServiceLite[];
};

const steps = ["Doctor", "Service", "Slot", "Details", "Done"] as const;

export function BookingFlow({
  doctors,
  initialDoctorSlug,
  initialServiceSlug,
}: {
  doctors: DoctorLite[];
  initialDoctorSlug?: string;
  initialServiceSlug?: string;
}) {
  const initialDoctor = doctors.find((d) => d.slug === initialDoctorSlug) ?? null;
  const initialService =
    initialDoctor?.services.find((s) => s.slug === initialServiceSlug) ??
    (initialServiceSlug ? doctors.flatMap((d) => d.services).find((s) => s.slug === initialServiceSlug) : null) ??
    null;

  const [step, setStep] = React.useState(initialDoctor ? (initialService ? 2 : 1) : 0);
  const [doctor, setDoctor] = React.useState<DoctorLite | null>(initialDoctor);
  const [service, setService] = React.useState<ServiceLite | null>(initialService);
  const [slot, setSlot] = React.useState<string | null>(null);
  const [confirmed, setConfirmed] = React.useState<{ id: string; cancelToken: string } | null>(null);

  function next() {
    setStep((s) => Math.min(steps.length - 1, s + 1));
  }
  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Stepper */}
      <ol className="mb-10 flex items-center justify-between gap-2 overflow-x-auto px-1">
        {steps.map((label, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-all",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary bg-primary/10 text-primary ring-2 ring-primary/20",
                  !active && !done && "border-border bg-card text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" /> : i + 1}
              </div>
              <span className={cn("hidden text-sm font-medium sm:inline", active ? "text-foreground" : "text-muted-foreground")}>
                {label}
              </span>
              {i < steps.length - 1 && (
                <span className={cn("ml-2 h-px flex-1", done ? "bg-primary" : "bg-border")} />
              )}
            </li>
          );
        })}
      </ol>

      <Card className="overflow-hidden p-6 md:p-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <Step key="doctor">
              <h2 className="font-display text-2xl font-semibold">Choose a doctor</h2>
              <p className="mt-1 text-sm text-muted-foreground">Pick the specialist you'd like to see.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {doctors.map((d) => {
                  const selected = doctor?.id === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setDoctor(d);
                        setService(null);
                        setSlot(null);
                      }}
                      className={cn(
                        "group flex items-center gap-3 rounded-2xl border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
                        selected && "border-primary ring-2 ring-primary/20",
                      )}
                    >
                      {d.avatarUrl && (
                        <img src={d.avatarUrl} alt={d.name} className="size-14 rounded-xl object-cover" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{d.title} {d.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {d.specializations.slice(0, 2).map((s) => (
                            <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                          ))}
                        </div>
                      </div>
                      {selected && <Check className="size-5 text-primary" />}
                    </button>
                  );
                })}
              </div>
              <Footer next={() => doctor && next()} disableNext={!doctor} />
            </Step>
          )}

          {step === 1 && doctor && (
            <Step key="service">
              <h2 className="font-display text-2xl font-semibold">Choose a service</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Services {doctor.title} {doctor.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")} offers.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {doctor.services.map((s) => {
                  const selected = service?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setService(s);
                        setSlot(null);
                      }}
                      className={cn(
                        "group flex items-start gap-3 rounded-2xl border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
                        selected && "border-primary ring-2 ring-primary/20",
                      )}
                    >
                      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <ServiceIcon name={s.iconKey} className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{s.name}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{s.description}</p>
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="size-3" />{s.durationMinutes} min</span>
                          <span className="font-medium text-foreground">{formatBDT(s.price)}</span>
                        </div>
                      </div>
                      {selected && <Check className="size-5 shrink-0 text-primary" />}
                    </button>
                  );
                })}
              </div>
              <Footer back={back} next={() => service && next()} disableNext={!service} />
            </Step>
          )}

          {step === 2 && doctor && service && (
            <Step key="slot">
              <h2 className="font-display text-2xl font-semibold">Pick a slot</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose a date with availability for {service.name}.
              </p>
              <SlotPicker
                doctorSlug={doctor.slug}
                serviceSlug={service.slug}
                selected={slot}
                onSelect={setSlot}
              />
              <Footer back={back} next={() => slot && next()} disableNext={!slot} />
            </Step>
          )}

          {step === 3 && doctor && service && slot && (
            <Step key="details">
              <h2 className="font-display text-2xl font-semibold">Your details</h2>
              <p className="mt-1 text-sm text-muted-foreground">We need this to confirm your booking.</p>
              <DetailsForm
                doctor={doctor}
                service={service}
                slot={slot}
                onConfirm={(c) => {
                  setConfirmed(c);
                  next();
                }}
                onBack={back}
              />
            </Step>
          )}

          {step === 4 && doctor && service && slot && confirmed && (
            <Step key="done">
              <ConfirmationView
                doctor={doctor}
                service={service}
                slot={slot}
                cancelToken={confirmed.cancelToken}
              />
            </Step>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}

function Step({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function Footer({
  back,
  next,
  disableNext,
}: {
  back?: () => void;
  next?: () => void;
  disableNext?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-2 border-t pt-4">
      <div>
        {back && (
          <Button variant="ghost" onClick={back}>
            <ChevronLeft className="size-4" />
            Back
          </Button>
        )}
      </div>
      {next && (
        <Button onClick={next} disabled={disableNext} variant="gradient">
          Continue
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  );
}

// ─── Slot picker ─────────────────────────────────────────────────────
function SlotPicker({
  doctorSlug,
  serviceSlug,
  selected,
  onSelect,
}: {
  doctorSlug: string;
  serviceSlug: string;
  selected: string | null;
  onSelect: (s: string) => void;
}) {
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const days = React.useMemo(() => {
    const list: Date[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      list.push(d);
    }
    return list;
  }, [today]);

  const [date, setDate] = React.useState<Date>(today);
  const [slots, setSlots] = React.useState<{ start: string; end: string }[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    fetch(`/api/booking/availability?doctor=${doctorSlug}&service=${serviceSlug}&date=${dateStr}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setSlots(data.slots ?? []);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [doctorSlug, serviceSlug, date]);

  return (
    <div className="mt-6">
      {/* day strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((d) => {
          const active = sameDay(d, date);
          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => setDate(d)}
              className={cn(
                "flex shrink-0 flex-col items-center gap-0.5 rounded-xl border px-3 py-2 text-xs transition-all",
                active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/50",
              )}
            >
              <span className={cn("text-[10px] uppercase", active ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span className="text-base font-semibold">{d.getDate()}</span>
              <span className={cn("text-[10px]", active ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {d.toLocaleDateString("en-US", { month: "short" })}
              </span>
            </button>
          );
        })}
      </div>

      {/* slots */}
      <div className="mt-6 min-h-[160px] rounded-2xl border bg-secondary/30 p-4">
        {loading ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="flex h-full min-h-[120px] flex-col items-center justify-center text-center text-muted-foreground">
            <CalendarDays className="size-8" />
            <p className="mt-2 text-sm">No available slots on this day. Try another date.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {slots.map((s) => {
              const active = selected === s.start;
              return (
                <button
                  key={s.start}
                  type="button"
                  onClick={() => onSelect(s.start)}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-sm font-medium transition-all",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "bg-card hover:border-primary/50 hover:-translate-y-0.5",
                  )}
                >
                  {formatTime(new Date(s.start))}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// ─── Details form ────────────────────────────────────────────────────
function DetailsForm({
  doctor,
  service,
  slot,
  onConfirm,
  onBack,
}: {
  doctor: DoctorLite;
  service: ServiceLite;
  slot: string;
  onConfirm: (c: { id: string; cancelToken: string }) => void;
  onBack: () => void;
}) {
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorSlug: doctor.slug,
          serviceSlug: service.slug,
          startsAt: slot,
          guestName: fd.name,
          guestEmail: fd.email,
          guestPhone: fd.phone,
          notes: fd.notes,
          insuranceType: fd.insurance || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Appointment confirmed", "Check your email for the details and management link.");
        onConfirm({ id: data.id, cancelToken: data.cancelToken });
      } else {
        toast.error("Could not book", data.error ?? "Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required minLength={2} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" placeholder="+880 ..." required />
          </div>
        </div>
        <div>
          <Label htmlFor="insurance">Insurance (optional)</Label>
          <Input id="insurance" name="insurance" placeholder="e.g. Pragati Life" />
        </div>
        <div>
          <Label htmlFor="notes">Reason for visit (optional)</Label>
          <Textarea id="notes" name="notes" rows={4} placeholder="A brief note helps the doctor prepare." />
        </div>

        <div className="flex items-center justify-between gap-2 border-t pt-4">
          <Button variant="ghost" onClick={onBack} type="button">
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <Button type="submit" variant="gradient" disabled={loading}>
            {loading ? "Confirming…" : "Confirm booking"}
          </Button>
        </div>
      </div>

      <aside className="rounded-2xl border bg-secondary/40 p-5">
        <h3 className="font-semibold">Booking summary</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Doctor</dt>
            <dd className="font-medium">{doctor.title} {doctor.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Service</dt>
            <dd className="font-medium">{service.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Date</dt>
            <dd className="font-medium">{formatDateLong(new Date(slot))}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Time</dt>
            <dd className="font-medium">{formatTime(new Date(slot))}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Duration</dt>
            <dd className="font-medium">{service.durationMinutes} minutes</dd>
          </div>
          <div className="border-t pt-3">
            <dt className="text-muted-foreground">Total</dt>
            <dd className="text-lg font-semibold">{formatBDT(service.price)}</dd>
          </div>
        </dl>
      </aside>
    </form>
  );
}

function ConfirmationView({
  doctor,
  service,
  slot,
  cancelToken,
}: {
  doctor: DoctorLite;
  service: ServiceLite;
  slot: string;
  cancelToken: string;
}) {
  return (
    <div className="text-center py-6">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-500/10 text-emerald-500"
      >
        <Check className="size-10" />
      </motion.div>
      <h2 className="mt-6 font-display text-3xl font-semibold">You're booked!</h2>
      <p className="mt-2 text-muted-foreground">
        We've emailed your confirmation. You can manage this booking any time using the link below.
      </p>

      <div className="mx-auto mt-8 max-w-md rounded-2xl border bg-card p-5 text-left text-sm">
        <p className="font-semibold">{service.name}</p>
        <p className="text-muted-foreground">with {doctor.title} {doctor.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")}</p>
        <p className="mt-3 flex items-center gap-2"><CalendarDays className="size-4" />{formatDateLong(new Date(slot))}</p>
        <p className="flex items-center gap-2"><Clock className="size-4" />{formatTime(new Date(slot))}</p>
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><User className="size-3.5" />Manage:
          <a className="underline" href={`/manage/${cancelToken}`}>/manage/{cancelToken.slice(0, 8)}…</a>
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        <Button asChild variant="outline">
          <a href="/">Back to home</a>
        </Button>
        <Button asChild variant="gradient">
          <a href="/blog">Read while you wait</a>
        </Button>
      </div>
    </div>
  );
}
