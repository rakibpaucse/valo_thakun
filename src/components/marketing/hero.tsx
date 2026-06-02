"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  ShieldCheck,
  Star,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

/**
 * Calm editorial hero, centered.
 *  • Huge mixed-weight Fraunces typography with line-by-line kinetic reveal.
 *  • Ambient backdrop: drifting blob mesh + slow concentric pulse rings.
 *  • One primary CTA + one quiet text link.
 *  • Bilingual eyebrow (ভালো থাকুন) — cultural signature.
 *  • Trust strip + soft scroll hint at the bottom.
 */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[92vh] flex-col justify-center overflow-hidden">
      <AmbientBackdrop />

      <div className="container relative z-10 flex flex-col items-center pt-24 pb-16 text-center md:pt-28 md:pb-20">
        {/* Eyebrow — bilingual */}
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-iris-200 bg-white/85 px-3.5 py-1.5 text-xs font-medium text-iris-700 shadow-soft backdrop-blur"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-iris-500 opacity-50" />
            <span className="relative inline-flex size-1.5 rounded-full bg-iris-500" />
          </span>
          <span className="font-display italic">ভালো থাকুন</span>
          <span className="text-iris-700/45">·</span>
          <span>A practice of careful doctors</span>
        </motion.span>

        {/* Massive editorial headline */}
        <h1 className="mt-8 max-w-5xl font-display text-[2.85rem] font-semibold leading-[0.95] tracking-tightest text-ink-900 sm:text-6xl md:text-7xl lg:text-[7.25rem]">
          <RevealLine delay={0.08}>Better Health,</RevealLine>
          <RevealLine delay={0.18}>
            <span className="font-light text-iris-700">Together.</span>
          </RevealLine>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-xl text-base leading-relaxed text-ink-700/80 sm:text-lg"
        >
          Cardiology, dermatology, pediatrics, psychiatry and orthopedics —
          under one roof in Dhaka, with the time and attention every visit
          deserves.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.68, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-5"
        >
          <Button asChild size="xl">
            <Link href="/book">
              <Calendar className="size-5" />
              Book appointment
            </Link>
          </Button>
          <Link
            href="/about"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 underline-offset-[6px] hover:text-iris-700 hover:underline"
          >
            How we work
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-ink-700/70"
        >
          <span className="flex items-center gap-1.5">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-ink-900">4.9</span>
            <span>·</span>
            <span>1,200+ patients</span>
          </span>
          <span aria-hidden className="text-ink-300">
            ·
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-iris-600" />
            BMDC registered
          </span>
          <span aria-hidden className="text-ink-300">
            ·
          </span>
          <span className="flex items-center gap-1.5">
            <Stethoscope className="size-3.5 text-iris-600" />
            22+ years
          </span>
        </motion.div>
      </div>

      {/* Soft scroll hint */}
      <ScrollHint />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

function RevealLine({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function ScrollHint() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center"
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink-700/55">
        Scroll
      </span>
      <ChevronDown
        className="mt-1.5 size-4 text-ink-700/55"
        style={{ animation: "scroll-bob 2.4s ease-in-out infinite" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Ambient backdrop — gradient + drifting blobs + pulse rings           */

function AmbientBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"
    >
      {/* Base canvas + soft top tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-mist-200/55 via-background to-background" />

      {/* Drifting blobs — slow parallax */}
      <div
        className="absolute -top-40 -left-32 size-[42rem] rounded-full bg-iris-200/45 blur-3xl"
        style={{ animation: "blob-drift-1 22s ease-in-out infinite" }}
      />
      <div
        className="absolute -bottom-40 -right-40 size-[44rem] rounded-full bg-mist-300/55 blur-3xl"
        style={{ animation: "blob-drift-2 26s ease-in-out infinite" }}
      />
      <div
        className="absolute top-40 right-1/3 size-[24rem] rounded-full bg-iris-100/60 blur-3xl"
        style={{ animation: "blob-drift-1 30s ease-in-out infinite reverse" }}
      />

      {/* Concentric pulse rings — slow, behind type */}
      <PulseRings />

      {/* Subtle dotted matrix masked to a vertical band */}
      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--primary) / 0.6) 1px, transparent 1.4px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 55%, black 5%, transparent 75%)",
        }}
      />
    </div>
  );
}

function PulseRings() {
  // 5 staggered rings — slow, subtle, infinitely expanding
  return (
    <div className="absolute left-1/2 top-1/2">
      {[0, 1.6, 3.2, 4.8, 6.4].map((delay, i) => (
        <span
          key={i}
          className="absolute left-0 top-0 block size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-iris-400/35"
          style={{
            animation: "pulse-ring 8s ease-out infinite",
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}
