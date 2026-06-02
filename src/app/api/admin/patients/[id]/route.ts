import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";

const Schema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  insuranceType: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;
  const { id } = await ctx.params;

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const patient = await prisma.patient.findUnique({ where: { id } });
  if (!patient) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { name, phone, dateOfBirth, gender, insuranceType, notes } = parsed.data;

  await prisma.$transaction(async (tx) => {
    if (name) await tx.user.update({ where: { id: patient.userId }, data: { name } });
    await tx.patient.update({
      where: { id },
      data: {
        ...(phone !== undefined && { phone: phone || null }),
        ...(gender !== undefined && { gender: gender || null }),
        ...(insuranceType !== undefined && { insuranceType: insuranceType || null }),
        ...(notes !== undefined && { notes: notes || null }),
        ...(dateOfBirth !== undefined && { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null }),
      },
    });
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;
  const { id } = await ctx.params;

  const patient = await prisma.patient.findUnique({ where: { id }, select: { userId: true } });
  if (!patient) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Soft check: refuse if patient has upcoming appointments
  const upcoming = await prisma.appointment.count({
    where: { patientId: id, startsAt: { gte: new Date() }, status: { in: ["CONFIRMED", "PENDING"] } },
  });
  if (upcoming > 0) {
    return NextResponse.json(
      { error: `Cannot delete — ${upcoming} upcoming appointment(s). Cancel those first.` },
      { status: 409 },
    );
  }

  await prisma.user.delete({ where: { id: patient.userId } });
  return NextResponse.json({ ok: true });
}
