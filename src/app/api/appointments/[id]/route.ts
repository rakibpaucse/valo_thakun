import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";

const Schema = z.object({
  notes: z.string().optional().nullable(),
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
});

// Doctor (or admin) updates notes/status for one of their appointments.
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["DOCTOR", "ADMIN"]);
  if (guard instanceof NextResponse) return guard;

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const appt = await prisma.appointment.findUnique({
    where: { id },
    include: { doctor: { select: { userId: true } } },
  });
  if (!appt) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Doctor can only edit appointments where they are the doctor
  if (guard.role === "DOCTOR" && appt.doctor.userId !== guard.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      ...(parsed.data.notes !== undefined && { notes: parsed.data.notes || null }),
      ...(parsed.data.status !== undefined && { status: parsed.data.status }),
    },
  });
  return NextResponse.json({ ok: true, appointment: { id: updated.id, notes: updated.notes, status: updated.status } });
}
