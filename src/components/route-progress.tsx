"use client";

import * as React from "react";
import { useNavPending } from "@/lib/use-nav-pending";

/**
 * Top-of-page progress bar.
 * Visibly thick (4px) periwinkle with a glow + indeterminate shimmer.
 * Driven by the shared useNavPending hook (capture-phase click detection).
 */
export function RouteProgress() {
  const { pending } = useNavPending();
  const [progress, setProgress] = React.useState(0);
  const tickRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    if (pending) {
      setProgress(18);
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) return p;
          const inc = (100 - p) * 0.08;
          return p + Math.max(0.5, inc);
        });
      }, 140);
    } else {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      // Finishing animation
      setProgress(100);
      const t = setTimeout(() => setProgress(0), 280);
      return () => clearTimeout(t);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [pending]);

  if (progress === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[300] h-1 overflow-hidden"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-iris-600 shadow-[0_0_18px_3px_hsl(var(--primary)/0.55)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div
        className="absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/85 to-transparent animate-shimmer"
        style={{ opacity: progress < 95 ? 0.7 : 0 }}
      />
    </div>
  );
}
