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
});

export async function PATCH(req: NextRequest) {
  const guard = await requireRole(["DOCTOR"]);
  if (guard instanceof NextResponse) return guard;

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body", details: parsed.error.format() }, { status: 400 });

  const {
    name, title, headline, bio, yearsExperience, consultationFee,
    languages, phone, whatsapp, isAcceptingNew,
  } = parsed.data;

  await prisma.$transaction(async (tx) => {
    if (name) await tx.user.update({ where: { id: guard.id }, data: { name } });
    await tx.doctor.update({
      where: { userId: guard.id },
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
      },
    });
  });

  return NextResponse.json({ ok: true });
}
