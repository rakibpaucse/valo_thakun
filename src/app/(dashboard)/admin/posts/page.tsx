import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PenSquare, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin · Posts" };

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true } }, _count: { select: { comments: true, reactions: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Posts</h1>
        <Button variant="gradient">
          <PenSquare className="size-4" />
          New post
        </Button>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="pb-3">Title</th>
                <th className="pb-3">Author</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Updated</th>
                <th className="pb-3">Stats</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 font-medium">{p.title}</td>
                  <td className="py-3 text-muted-foreground">{p.author.name}</td>
                  <td className="py-3"><Badge variant={p.status === "PUBLISHED" ? "success" : "secondary"}>{p.status}</Badge></td>
                  <td className="py-3 text-muted-foreground">{formatDate(p.updatedAt)}</td>
                  <td className="py-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Eye className="size-3" /> {p.views.toLocaleString()}
                      <span>· 💬 {p._count.comments}</span>
                      <span>· ❤️ {p._count.reactions}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
