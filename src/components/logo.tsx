import { cn } from "@/lib/utils";

/**
 * Brand mark + wordmark for "Valo Thakun" (ভালো থাকুন · "stay well").
 * - Mark: italic V monogram with a heart-pulse line in a periwinkle squircle
 * - Wordmark: Plus Jakarta Sans, semibold, tight tracking — reads as a real logotype
 */

export function LogoMark({ className }: { className?: string }) {
  return (
    // <svg
    //   viewBox="0 0 40 40"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    //   className={className}
    //   aria-hidden
    // >
    //   <rect width="40" height="40" rx="12" fill="currentColor" />
    //   <circle cx="31" cy="9" r="2.5" fill="white" fillOpacity="0.35" />
    //   <path
    //     d="M9.6 11 L13.6 11 L19 23 L24.4 11 L28.4 11 L21.4 27.5 C 20.7 29 19.3 29 18.6 27.5 Z"
    //     fill="white"
    //   />
    //   <path
    //     d="M11 31 L14 31 L15.5 28.4 L18.5 33.6 L20.5 31 L29 31"
    //     stroke="white"
    //     strokeOpacity="0.85"
    //     strokeWidth="1.6"
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    //   />
    // </svg>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="3em"
      height="3em"
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
    >
      <title>Valo Thakun logo</title>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6 9a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3zm6.19 11.276c0-4.294 2.78-8.276 6.59-8.276c2.643 0 4.604 1.787 5.815 4.32c1.21-2.533 3.171-4.32 5.815-4.32c3.809 0 6.59 3.983 6.59 8.276C37 29.466 24.595 36 24.595 36s-8.265-4.09-11.303-10.805h3.774l1.674-2.927L20.696 29l4.58-5.79h4.685A1.03 1.03 0 0 0 31 22.187a1.03 1.03 0 0 0-1.039-1.022H24.26l-2.691 3.403l-2.2-7.569l-3.518 6.153h-3.287c-.24-.92-.375-1.88-.375-2.877m.364 2.876H10v2.043h3.285z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
  size = "md",
}: {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: { mark: "size-7", word: "text-[15px]", gap: "gap-2" },
    md: { mark: "size-10", word: "text-[18px]", gap: "gap-2" },
    // md: { mark: "size-9", word: "text-[19px]", gap: "gap-2.5" },
    lg: { mark: "size-11", word: "text-[24px]", gap: "gap-3" },
  }[size];

  return (
    <span className={cn("inline-flex items-center", sizes.gap, className)}>
      <span className={cn("text-iris-600", sizes.mark)}>
        <LogoMark className="h-full w-full" />
      </span>
      {showWordmark && (
        <span
          className={cn(
            "font-brand font-bold leading-none tracking-[-0.025em] text-ink-900",
            sizes.word,
          )}
        >
          Valo<span className="text-iris-600">.</span>Thakun
        </span>
      )}
    </span>
  );
}
