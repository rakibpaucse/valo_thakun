"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useNavPending } from "@/lib/use-nav-pending";
import { cn } from "@/lib/utils";

/**
 * Page-area transition wrapper.
 *  • Dims the current content + shows a centered EKG-pulse pill the moment
 *    a link is clicked (capture phase via useNavPending).
 *  • loading.tsx skeleton streams underneath while data loads.
 *  • Minimum visible duration in the hook so the feedback never flashes.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { pending } = useNavPending();

  return (
    <div className="relative isolate">
      <div
        key={pathname}
        className={cn(
          "transition-[opacity,filter] duration-200 ease-out animate-[page-fade_0.18s_ease-out]",
          pending && "opacity-35 blur-[1px] pointer-events-none select-none",
        )}
      >
        {children}
      </div>

      {pending && (
        <div
          aria-hidden
          className="pointer-events-none fixed left-1/2 top-1/2 z-[280] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="flex items-center gap-3 rounded-full border border-iris-200 bg-white/95 px-5 py-3 shadow-[0_24px_64px_-16px_rgba(91,101,220,0.45)] backdrop-blur-xl animate-[fade-in-up_0.16s_ease-out]">
            <PulseBadge />
            <span className="font-medium text-sm text-ink-900">Loading</span>
            <PulseDots />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Visuals ──────────────────────────────────────────────────────── */

function PulseBadge() {
  return (
    <span className="relative grid size-8 place-items-center">
      {/* Soft heartbeat halo */}
      <span className="absolute inset-0 rounded-full bg-iris-500/20 animate-[heartbeat_1.2s_ease-in-out_infinite]" />
      <span className="absolute inset-[6px] rounded-full bg-iris-50" />
      {/* EKG pulse path */}
      <svg
        viewBox="0 0 32 16"
        fill="none"
        className="relative size-5 text-iris-600 overflow-visible"
        aria-hidden
      >
        <path
          d="M0 8 L8 8 L11 2 L15 14 L19 8 L32 8"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={64}
          strokeDasharray={64}
          style={{
            strokeDashoffset: 64,
            animation: "pulse-draw 1.4s cubic-bezier(0.22,1,0.36,1) infinite",
          }}
        />
      </svg>
    </span>
  );
}

function PulseDots() {
  return (
    <span className="inline-flex translate-y-[1px] gap-0.5">
      {[0, 0.18, 0.36].map((d, i) => (
        <span
          key={i}
          className="inline-block size-1 rounded-full bg-iris-600"
          style={{
            animation: "heartbeat 1.2s ease-in-out infinite",
            animationDelay: `${d}s`,
          }}
        />
      ))}
    </span>
  );
}
