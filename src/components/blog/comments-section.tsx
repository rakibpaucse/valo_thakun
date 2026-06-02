"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Send, CornerDownRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { initials, relativeTime } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

type CommentLite = {
  id: string;
  body: string;
  guestName?: string | null;
  createdAt: Date | string;
  author: { id: string; name: string; image: string | null } | null;
  replies?: CommentLite[];
};

export function CommentsSection({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: CommentLite[];
}) {
  const { data: session } = useSession();
  const me = session?.user;

  const [comments, setComments] = React.useState<CommentLite[]>(initialComments);
  const [body, setBody] = React.useState("");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          body,
          // guestName ignored server-side when authenticated
          guestName: me ? undefined : name || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Comment posted", "Thanks for adding to the conversation.");
        setComments((c) => [
          {
            id: data.id,
            body,
            guestName: me ? null : name || null,
            createdAt: new Date(),
            author: me
              ? { id: (me as { id?: string }).id ?? "self", name: me.name ?? "You", image: me.image ?? null }
              : null,
            replies: [],
          },
          ...c,
        ]);
        setBody("");
      } else {
        toast.error("Could not post comment");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-12 border-t border-ink-100 pt-8">
      <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink-900">
        <MessageCircle className="size-5" /> Discussion
        <span className="text-sm font-normal text-ink-700/65">({comments.length})</span>
      </h2>

      <form onSubmit={submit} className="mt-6 space-y-3">
        {me ? (
          <div className="flex items-center gap-2.5 rounded-full bg-iris-50 px-3 py-2 text-sm">
            <Avatar className="size-7">
              {me.image && <AvatarImage src={me.image} alt={me.name ?? ""} />}
              <AvatarFallback className="bg-iris-100 text-iris-700 text-[11px]">
                {initials(me.name ?? "You")}
              </AvatarFallback>
            </Avatar>
            <span className="text-ink-700/85">
              Commenting as <span className="font-medium text-ink-900">{me.name}</span>
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-ink-200 bg-mist-50 px-3 py-2.5 text-sm text-ink-700/75">
            <span>Posting as guest —</span>
            <input
              type="text"
              placeholder="your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-ink-900 placeholder:text-ink-700/45 focus:outline-none"
            />
            <Link href="/login" className="ml-auto font-medium text-iris-700 hover:underline">
              Sign in →
            </Link>
          </div>
        )}

        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share a thought, ask a follow-up question…"
          rows={3}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={loading || !body.trim()}>
            <Send className="size-4" />
            Post comment
          </Button>
        </div>
      </form>

      <ul className="mt-8 space-y-5">
        {comments.length === 0 && (
          <li className="rounded-2xl border border-ink-100 bg-mist-50 p-6 text-center text-sm text-ink-700/65">
            No comments yet. Be the first.
          </li>
        )}
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} />
        ))}
      </ul>
    </section>
  );
}

function CommentItem({ comment, isReply = false }: { comment: CommentLite; isReply?: boolean }) {
  const name = comment.author?.name ?? comment.guestName ?? "Guest";
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={isReply ? "ml-8" : ""}
    >
      <div className="flex gap-3">
        <Avatar className="size-9 shrink-0">
          {comment.author?.image && <AvatarImage src={comment.author.image} alt={name} />}
          <AvatarFallback className="bg-iris-100 text-iris-700">{initials(name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 rounded-2xl border border-ink-100 bg-card p-4">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-ink-900">{name}</p>
            <p className="text-xs text-ink-700/55">{relativeTime(comment.createdAt)}</p>
          </div>
          <p className="mt-1 text-sm text-ink-700/85">{comment.body}</p>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <ul className="mt-3 space-y-3">
          {comment.replies.map((r) => (
            <li key={r.id} className="flex items-start gap-2 ml-12">
              <CornerDownRight className="mt-2 size-4 text-ink-700/55" />
              <CommentItem comment={r} isReply />
            </li>
          ))}
        </ul>
      )}
    </motion.li>
  );
}
