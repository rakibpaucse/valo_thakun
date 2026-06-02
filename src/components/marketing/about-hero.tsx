"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity, Award, CalendarDays, MapPin, ShieldCheck, Star,
  Stethoscope, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Editorial split-screen hero for the /about page.
 *  • Left: kinetic headline (line-by-line reveal), tagline, credential strip, CTAs
 *  • Right: a "credential collage" — floating cards + decorative pulse SVG
 *  • Background: animated mist/iris blobs, dotted matrix, concentric rings
 */
export function AboutHero({
  yearsOfCare,
  doctorCount,
  specialtyCount,
  founded,
}: {
  yearsOfCare: number;
  doctorCount: number;
  specialtyCount: number;
  founded: number;
}) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      <BackgroundDecor />

      <div className="container relative grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
        {/* LEFT — copy */}
        <div className="relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 rounded-full border border-iris-200 bg-white/80 px-3 py-1 text-xs font-medium text-iris-700 shadow-soft backdrop-blur"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-iris-500 opacity-50" />
              <span className="relative inline-flex size-1.5 rounded-full bg-iris-500" />
            </span>
            About the practice
          </motion.span>

          <h1 className="mt-7 font-display text-[3.25rem] font-semibold leading-[0.95] tracking-tightest text-ink-900 md:text-7xl lg:text-[5.25rem]">
            <RevealLine delay={0.05}>A practice</RevealLine>
            <RevealLine delay={0.12}>
              <span className="italic font-light text-ink-700">built for the parts</span>
            </RevealLine>
            <RevealLine delay={0.20}>
              <span className="italic font-light text-ink-700">of medicine</span>
            </RevealLine>
            <RevealLine delay={0.28}>
              that rarely <span className="text-iris-600">get time.</span>
            </RevealLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-ink-700/80"
          >
            <span className="font-medium text-ink-900">Valo Thakun</span>{" "}
            <span className="font-display italic">(ভালো থাকুন · stay well)</span> —
            a multi-specialty practice in Dhaka. A small team of careful doctors
            and a tightly built platform, together designed to make booking,
            visiting, and following up feel calm.
          </motion.p>

          {/* Credential strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 grid grid-cols-3 max-w-md gap-6 border-y border-ink-100 py-5"
          >
            <CredItem label="Founded" value={String(founded)} />
            <CredItem label="Practice in" value="Dhaka, BD" />
            <CredItem label="Regulated by" value="BMDC" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="xl">
              <Link href="/doctors">
                <Users className="size-5" />
                Meet the team
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/book">
                <CalendarDays className="size-5" />
                Book a visit
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* RIGHT — credential collage */}
        <CredentialCollage
          yearsOfCare={yearsOfCare}
          doctorCount={doctorCount}
          specialtyCount={specialtyCount}
        />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

function RevealLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function CredItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-ink-700/55">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-semibold text-ink-900">{value}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
function BackgroundDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-mist-200/60 via-background to-background" />

      {/* Soft blobs */}
      <div className="absolute -top-40 -right-32 size-[44rem] rounded-full bg-iris-200/40 blur-3xl" />
      <div className="absolute top-32 -left-40 size-[32rem] rounded-full bg-mist-300/55 blur-3xl" />

      {/* Dot matrix masked to ellipse on the right */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--primary) / 0.55) 1px, transparent 1.4px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse at 75% 55%, black 5%, transparent 60%)",
        }}
      />

      {/* Concentric dashed rings — bottom right */}
      <svg
        className="absolute -bottom-32 -right-10 hidden text-iris-300/60 md:block"
        width="360"
        height="360"
        viewBox="0 0 360 360"
        fill="none"
      >
        {[60, 100, 140, 180, 220].map((r) => (
          <circle
            key={r}
            cx="180"
            cy="180"
            r={r}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 7"
          />
        ))}
      </svg>

      {/* Heart-pulse line — top center, animated draw */}
      <svg
        className="absolute top-16 left-1/2 hidden -translate-x-1/2 text-iris-400/45 lg:block"
        width="320"
        height="60"
        viewBox="0 0 320 60"
        fill="none"
      >
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, delay: 0.4, ease: "easeOut" }}
          d="M0 30 L70 30 L82 8 L102 52 L120 30 L320 30"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
function CredentialCollage({
  yearsOfCare,
  doctorCount,
  specialtyCount,
}: {
  yearsOfCare: number;
  doctorCount: number;
  specialtyCount: number;
}) {
  return (
    <div className="relative mx-auto h-[28rem] w-full max-w-md lg:max-w-none lg:h-[34rem]">
      {/* Iris halo backdrop */}
      <div
        aria-hidden
        className="absolute inset-x-4 inset-y-2 -z-10 rounded-[3rem] bg-gradient-to-br from-iris-100 via-mist-200/80 to-iris-50"
      />

      {/* Big number tablet — top right */}
      <motion.div
        initial={{ opacity: 0, y: 16, rotate: 0 }}
        animate={{ opacity: 1, y: 0, rotate: 4 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-0 top-0 w-[15rem] rounded-3xl border border-ink-100 bg-card p-5 shadow-lift animate-float"
        style={{ animationDelay: "1s" }}
      >
        <div className="flex items-center justify-between text-ink-700/65">
          <span className="text-[10px] font-medium uppercase tracking-[0.16em]">
            Years of care
          </span>
          <Activity className="size-4 text-iris-600" />
        </div>
        <p className="mt-2 font-display text-6xl font-semibold leading-none text-ink-900">
          {yearsOfCare}
          <span className="text-iris-600">+</span>
        </p>
        <p className="mt-2 text-xs text-ink-700/70">
          combined practice experience across the team
        </p>
      </motion.div>

      {/* BMDC seal card — middle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, rotate: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: -3 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-2 top-40 w-[18rem] rounded-3xl border border-ink-100 bg-card p-5 shadow-lift animate-float"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-iris-50 text-iris-700">
            <Award className="size-6" />
          </span>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-ink-700/55">
              Certification
            </p>
            <p className="font-display text-base font-semibold text-ink-900">
              BMDC registered
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-ink-100 pt-4 text-xs">
          <div>
            <p className="text-ink-700/55">Specialists</p>
            <p className="mt-0.5 font-semibold text-ink-900">{doctorCount} doctors</p>
          </div>
          <div>
            <p className="text-ink-700/55">Specialties</p>
            <p className="mt-0.5 font-semibold text-ink-900">{specialtyCount} fields</p>
          </div>
        </div>
      </motion.div>

      {/* Rating chip — bottom right */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="absolute bottom-12 right-4 inline-flex items-center gap-2.5 rounded-2xl border border-ink-100 bg-card px-4 py-3 shadow-lift animate-float"
        style={{ animationDelay: "1.5s" }}
      >
        <span className="grid size-9 place-items-center rounded-xl bg-amber-50">
          <Star className="size-5 fill-amber-400 text-amber-400" />
        </span>
        <div>
          <p className="font-display text-base font-semibold leading-none text-ink-900">4.9</p>
          <p className="mt-1 text-[10px] text-ink-700/65">1,200+ patient reviews</p>
        </div>
      </motion.div>

      {/* Location pill — top left */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute left-0 top-6 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink-900 shadow-soft animate-float"
        style={{ animationDelay: "0.2s" }}
      >
        <MapPin className="size-3.5 text-iris-600" />
        Banani, Dhaka
      </motion.div>

      {/* Stethoscope pulse chip — bottom left */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="absolute bottom-0 left-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink-900 shadow-soft animate-float"
        style={{ animationDelay: "2s" }}
      >
        <span className="grid size-5 place-items-center rounded-full bg-mint-500">
          <Stethoscope className="size-3 text-white" />
        </span>
        Accepting new patients
      </motion.div>

      {/* Faint privacy stamp — center back */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.18, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 grid place-items-center"
      >
        <div className="grid size-44 place-items-center rounded-full border-2 border-dashed border-iris-400 text-iris-500">
          <ShieldCheck className="size-12" />
        </div>
      </motion.div>
    </div>
  );
}
