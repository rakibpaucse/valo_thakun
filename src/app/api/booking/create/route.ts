import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendAppointmentConfirmation, sendAppointmentSms } from "@/lib/email";

const Schema = z.object({
  doctorSlug: z.string(),
  serviceSlug: z.string(),
  startsAt: z.string(),
  guestName: z.string().min(2).optional(),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().min(7).optional(),
  notes: z.string().optional(),
  insuranceType: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const data = parsed.data;

  const session = await auth();

  const [doctor, service] = await Promise.all([
    prisma.doctor.findUnique({ where: { slug: data.doctorSlug }, include: { user: true } }),
    prisma.service.findUnique({ where: { slug: data.serviceSlug } }),
  ]);
  if (!doctor || !service) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const startsAt = new Date(data.startsAt);
  const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60 * 1000);

  // collision check
  const collision = await prisma.appointment.findFirst({
    where: {
      doctorId: doctor.id,
      status: { in: ["CONFIRMED", "PENDING"] },
      AND: [{ startsAt: { lt: endsAt } }, { endsAt: { gt: startsAt } }],
    },
  });
  if (collision) return NextResponse.json({ error: "Slot is no longer available" }, { status: 409 });

  // resolve patient
  let patientId: string | null = null;
  if (session?.user?.email) {
    const patient = await prisma.patient.findFirst({
      where: { user: { email: session.user.email } },
    });
    if (patient) patientId = patient.id;
  }

  if (!patientId && (!data.guestName || !data.guestEmail)) {
    return NextResponse.json(
      { error: "Guest bookings require name and email" },
      { status: 400 },
    );
  }

  const appt = await prisma.appointment.create({
    data: {
      doctorId: doctor.id,
      serviceId: service.id,
      patientId,
      startsAt,
      endsAt,
      status: "CONFIRMED",
      notes: data.notes,
      insuranceType: data.insuranceType,
      guestName: patientId ? null : data.guestName,
      guestEmail: patientId ? null : data.guestEmail,
      guestPhone: patientId ? null : data.guestPhone,
    },
  });

  const cancelUrl = `${req.nextUrl.origin}/manage/${appt.cancelToken}`;
  await sendAppointmentConfirmation({
    to: data.guestEmail ?? session?.user?.email ?? "unknown@example.com",
    patientName: data.guestName ?? session?.user?.name ?? "Patient",
    doctorName: doctor.user.name,
    serviceName: service.name,
    startsAt,
    cancelUrl,
  });
  if (data.guestPhone) {
    await sendAppointmentSms(
      data.guestPhone,
      `Your appointment with ${doctor.user.name} on ${startsAt.toLocaleString()} is confirmed.`,
    );
  }

  return NextResponse.json({ ok: true, id: appt.id, cancelToken: appt.cancelToken, cancelUrl });
}
