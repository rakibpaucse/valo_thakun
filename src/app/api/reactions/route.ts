import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const Schema = z.object({
  postId: z.string(),
  emoji: z.string().min(1).max(8),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const session = await auth();
  const userId = session?.user
    ? (await prisma.user.findUnique({ where: { email: session.user.email! } }))?.id
    : undefined;

  await prisma.reaction.create({
    data: { postId: parsed.data.postId, emoji: parsed.data.emoji, userId },
  });
  return NextResponse.json({ ok: true });
}
