// Compute available appointment slots for a doctor on a given date.
// Inputs: working hours (per weekday), existing appointments, time-off, slot overrides.
// Output: list of {start, end} slot windows.

type Range = { start: Date; end: Date };

function setHM(date: Date, hm: string) {
  const [h, m] = hm.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

function overlaps(a: Range, b: Range) {
  return a.start < b.end && b.start < a.end;
}

export type SlotInputs = {
  date: Date; // any time on the target day
  weekday: number; // 0..6
  workingHours: { weekday: number; startTime: string; endTime: string }[];
  appointments: { startsAt: Date; endsAt: Date; status: string }[];
  timeOff: { startsAt: Date; endsAt: Date }[];
  overrides: { date: Date; startTime: string; endTime: string; isOpen: boolean }[];
  durationMinutes: number;
  bufferMinutes: number;
  stepMinutes?: number; // slot granularity, default 15
  now?: Date;
};

export function computeSlots(input: SlotInputs): Range[] {
  const step = input.stepMinutes ?? 15;
  const day = new Date(input.date);
  day.setHours(0, 0, 0, 0);

  const dayWindows = input.workingHours
    .filter((w) => w.weekday === input.weekday)
    .map((w) => ({ start: setHM(day, w.startTime), end: setHM(day, w.endTime) }));

  // overrides may add/remove windows for the day
  const sameDay = input.overrides.filter((o) => sameYMD(new Date(o.date), day));
  const opens = sameDay.filter((o) => o.isOpen).map((o) => ({ start: setHM(day, o.startTime), end: setHM(day, o.endTime) }));
  const blocks = sameDay.filter((o) => !o.isOpen).map((o) => ({ start: setHM(day, o.startTime), end: setHM(day, o.endTime) }));

  const windows = [...dayWindows, ...opens];

  // exclude time off
  const offRanges: Range[] = input.timeOff
    .filter((t) => new Date(t.startsAt) <= setHM(day, "23:59") && new Date(t.endsAt) >= setHM(day, "00:00"))
    .map((t) => ({ start: new Date(t.startsAt), end: new Date(t.endsAt) }));

  // existing appointments (CONFIRMED + PENDING) block slots
  const taken: Range[] = input.appointments
    .filter((a) => a.status === "CONFIRMED" || a.status === "PENDING")
    .map((a) => ({ start: new Date(a.startsAt), end: new Date(a.endsAt) }));

  const blockedAll = [...offRanges, ...taken, ...blocks];
  const slots: Range[] = [];
  const now = input.now ?? new Date();
  const minStart = sameYMD(day, now) ? new Date(now.getTime() + 30 * 60 * 1000) : day; // 30-min lead time
  const durationMs = (input.durationMinutes + input.bufferMinutes) * 60 * 1000;

  for (const win of windows) {
    let cursor = new Date(Math.max(win.start.getTime(), minStart.getTime()));
    while (cursor.getTime() + durationMs <= win.end.getTime()) {
      const slot = { start: new Date(cursor), end: new Date(cursor.getTime() + input.durationMinutes * 60 * 1000) };
      const conflict = blockedAll.some((b) => overlaps(slot, b));
      if (!conflict) slots.push(slot);
      cursor = new Date(cursor.getTime() + step * 60 * 1000);
    }
  }
  return slots;
}

function sameYMD(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function nextAvailableDays(opts: { from: Date; count: number }) {
  const out: Date[] = [];
  const d = new Date(opts.from);
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < opts.count; i++) {
    out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}
