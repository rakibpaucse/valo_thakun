import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const appt = await prisma.appointment.findUnique({ where: { cancelToken: token } });
  if (!appt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (appt.status === "CANCELLED") return NextResponse.json({ ok: true });
  await prisma.appointment.update({
    where: { id: appt.id },
    data: { status: "CANCELLED" },
  });
  return NextResponse.json({ ok: true });
}
