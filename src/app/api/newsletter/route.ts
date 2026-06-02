import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const Schema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  await prisma.newsletterSignup.upsert({
    where: { email: parsed.data.email },
    update: { source: parsed.data.source ?? "unknown" },
    create: parsed.data,
  });
  return NextResponse.json({ ok: true });
}
