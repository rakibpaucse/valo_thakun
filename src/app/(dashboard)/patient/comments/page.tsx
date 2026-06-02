import Link from "next/link";
import { requireUser } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { relativeTime } from "@/lib/utils";

export const metadata = { title: "My comments" };

export default async function MyCommentsPage() {
  const { email } = await requireUser();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const comments = await prisma.comment.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    include: { post: { select: { title: true, slug: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold">My comments</h1>
      {comments.length === 0 ? (
        <Card className="p-6 text-sm text-muted-foreground">You haven't commented on any posts yet.</Card>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id}>
              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <Link href={`/blog/${c.post.slug}`} className="font-medium hover:text-primary">
                    {c.post.title}
                  </Link>
                  <Badge variant={c.status === "APPROVED" ? "success" : c.status === "PENDING" ? "warning" : "destructive"}>
                    {c.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">{relativeTime(c.createdAt)}</p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
