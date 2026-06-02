import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";

const Schema = z.object({
  name: z.string().min(2).optional(),
  title: z.string().min(2).optional(),
  headline: z.string().min(2).optional(),
  bio: z.string().min(10).optional(),
  yearsExperience: z.coerce.number().int().min(0).max(80).optional(),
  consultationFee: z.coerce.number().int().min(0).optional(),
  languages: z.string().optional(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  isAcceptingNew: z.boolean().optional(),
  isMain: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;
  const { id } = await ctx.params;

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const doc = await prisma.doctor.findUnique({ where: { id } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const {
    name, title, headline, bio, yearsExperience, consultationFee,
    languages, phone, whatsapp, isAcceptingNew, isMain,
  } = parsed.data;

  await prisma.$transaction(async (tx) => {
    if (name) await tx.user.update({ where: { id: doc.userId }, data: { name } });
    if (isMain === true) {
      await tx.doctor.updateMany({ where: { id: { not: id } }, data: { isMain: false } });
    }
    await tx.doctor.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(headline !== undefined && { headline }),
        ...(bio !== undefined && { bio }),
        ...(yearsExperience !== undefined && { yearsExperience }),
        ...(consultationFee !== undefined && { consultationFee }),
        ...(languages !== undefined && { languages }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(whatsapp !== undefined && { whatsapp: whatsapp || null }),
        ...(isAcceptingNew !== undefined && { isAcceptingNew }),
        ...(isMain !== undefined && { isMain }),
      },
    });
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;
  const { id } = await ctx.params;

  const doc = await prisma.doctor.findUnique({ where: { id }, select: { userId: true } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Soft check: refuse if doctor has upcoming appointments
  const upcoming = await prisma.appointment.count({
    where: { doctorId: id, startsAt: { gte: new Date() }, status: { in: ["CONFIRMED", "PENDING"] } },
  });
  if (upcoming > 0) {
    return NextResponse.json(
      { error: `Cannot delete — ${upcoming} upcoming appointment(s). Cancel those first.` },
      { status: 409 },
    );
  }

  // Cascading via schema relations
  await prisma.user.delete({ where: { id: doc.userId } });
  return NextResponse.json({ ok: true });
}
