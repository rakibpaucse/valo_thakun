import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const Schema = z.object({
  postId: z.string(),
  body: z.string().min(2).max(2000),
  guestName: z.string().min(2).optional(),
  parentId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const session = await auth();
  const authorId = session?.user
    ? (await prisma.user.findUnique({ where: { email: session.user.email! } }))?.id
    : undefined;

  const c = await prisma.comment.create({
    data: {
      postId: parsed.data.postId,
      body: parsed.data.body,
      guestName: authorId ? null : parsed.data.guestName,
      parentId: parsed.data.parentId,
      authorId,
      // simple word filter — anything containing obvious spam markers stays PENDING
      status: /https?:\/\/|viagra|casino/i.test(parsed.data.body) ? "PENDING" : "APPROVED",
    },
  });
  return NextResponse.json({ ok: true, id: c.id, status: c.status });
}
