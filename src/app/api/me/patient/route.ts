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
});

export async function PATCH(req: NextRequest) {
  const guard = await requireRole(["PATIENT"]);
  if (guard instanceof NextResponse) return guard;

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { name, phone, dateOfBirth, gender, insuranceType } = parsed.data;

  await prisma.$transaction(async (tx) => {
    if (name) {
      await tx.user.update({ where: { id: guard.id }, data: { name } });
    }
    await tx.patient.update({
      where: { userId: guard.id },
      data: {
        phone: phone ?? null,
        gender: gender ?? null,
        insuranceType: insuranceType ?? null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      },
    });
  });

  return NextResponse.json({ ok: true });
}
