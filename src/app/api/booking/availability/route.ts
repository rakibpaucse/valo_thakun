import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeSlots } from "@/lib/slots";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams;
  const doctorSlug = url.get("doctor");
  const serviceSlug = url.get("service");
  const dateStr = url.get("date"); // YYYY-MM-DD

  if (!doctorSlug || !serviceSlug || !dateStr) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const [doctor, service] = await Promise.all([
    prisma.doctor.findUnique({
      where: { slug: doctorSlug },
      include: {
        workingHours: true,
        timeOff: true,
        slotOverrides: true,
      },
    }),
    prisma.service.findUnique({ where: { slug: serviceSlug } }),
  ]);
  if (!doctor || !service) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const date = new Date(`${dateStr}T00:00:00`);
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
      startsAt: { gte: dayStart, lte: dayEnd },
    },
    select: { startsAt: true, endsAt: true, status: true },
  });

  const slots = computeSlots({
    date,
    weekday: date.getDay(),
    workingHours: doctor.workingHours,
    appointments,
    timeOff: doctor.timeOff,
    overrides: doctor.slotOverrides.map((o) => ({
      date: o.date,
      startTime: o.startTime,
      endTime: o.endTime,
      isOpen: o.isOpen,
    })),
    durationMinutes: service.durationMinutes,
    bufferMinutes: service.bufferMinutes,
  });

  return NextResponse.json({
    slots: slots.map((s) => ({ start: s.start.toISOString(), end: s.end.toISOString() })),
  });
}
