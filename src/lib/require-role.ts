import { NextResponse } from "next/server";
import { auth } from "./auth";
import { prisma } from "./prisma";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
};

/**
 * Returns the authenticated user — or a NextResponse to be returned by the
 * route handler if unauthenticated or the wrong role.
 *
 * Usage:
 *   const guard = await requireRole(["ADMIN"]);
 *   if (guard instanceof NextResponse) return guard;
 *   const user = guard;
 */
export async function requireRole(
  allowed: ("PATIENT" | "DOCTOR" | "ADMIN")[],
): Promise<SessionUser | NextResponse> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, image: true, role: true },
  });
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const role = dbUser.role as SessionUser["role"];
  if (!allowed.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return { ...dbUser, role };
}
