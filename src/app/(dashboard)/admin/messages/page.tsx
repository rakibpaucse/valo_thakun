import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { relativeTime } from "@/lib/utils";

export const metadata = { title: "Admin · Messages" };

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold">Contact messages</h1>
      <ul className="space-y-3">
        {messages.length === 0 && (
          <Card className="p-6 text-sm text-muted-foreground">No messages yet.</Card>
        )}
        {messages.map((m) => (
          <Card key={m.id} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{m.subject}</p>
                <p className="text-xs text-muted-foreground">
                  From <span className="font-medium text-foreground">{m.name}</span> · {m.email}
                  {m.phone && <> · {m.phone}</>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!m.read && <Badge variant="warning">unread</Badge>}
                <span className="text-xs text-muted-foreground">{relativeTime(m.createdAt)}</span>
              </div>
            </div>
            <p className="mt-3 text-sm">{m.message}</p>
          </Card>
        ))}
      </ul>
    </div>
  );
}
