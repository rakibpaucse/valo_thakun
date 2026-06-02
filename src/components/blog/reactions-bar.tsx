"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EMOJIS = ["❤️", "👍", "🔥", "💡"];

export function ReactionsBar({
  postId,
  initialCounts,
}: {
  postId: string;
  initialCounts: Record<string, number>;
}) {
  const [counts, setCounts] = React.useState<Record<string, number>>(() => ({ ...initialCounts }));
  const [active, setActive] = React.useState<Set<string>>(new Set());

  async function react(emoji: string) {
    if (active.has(emoji)) return;
    setActive((s) => new Set(s).add(emoji));
    setCounts((c) => ({ ...c, [emoji]: (c[emoji] ?? 0) + 1 }));
    await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, emoji }),
    }).catch(() => {});
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-2 rounded-2xl border bg-secondary/40 p-3">
      <span className="text-sm font-medium text-muted-foreground">Found this useful?</span>
      <div className="ml-auto flex items-center gap-1.5">
        {EMOJIS.map((emoji) => {
          const has = active.has(emoji);
          return (
            <motion.button
              key={emoji}
              onClick={() => react(emoji)}
              whileTap={{ scale: 1.4 }}
              className={cn(
                "flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-all hover:-translate-y-0.5",
                has ? "border-primary bg-primary/10" : "bg-card",
              )}
            >
              <span className="text-base leading-none">{emoji}</span>
              <span className="text-xs font-medium">{counts[emoji] ?? 0}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
