"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Shared "navigation in flight" hook.
 *
 * Listens for clicks on internal links in CAPTURE PHASE so the handler fires
 * BEFORE Next.js Link's onClick (which calls e.preventDefault to take over
 * navigation). Bubble-phase handlers see e.defaultPrevented === true and
 * skip the event — that was the bug behind "nothing happens on click".
 *
 * Returns `pending` (true while navigating) and the click position so
 * components like CursorSpinner can seed their position on first paint.
 *
 * `minVisibleMs` (default 350) keeps the pending state visible for at least
 * that long even on instant local navigations, so the user always sees
 * "yes, your click registered".
 */
export function useNavPending(minVisibleMs = 350) {
  const pathname = usePathname();
  const search = useSearchParams();
  const [pending, setPending] = React.useState(false);
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);
  const startedAtRef = React.useRef(0);

  React.useEffect(() => {
    function onClickCapture(e: MouseEvent) {
      // Modifier or non-primary clicks → let the browser handle them
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;

      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      if (anchor.getAttribute("target") === "_blank") return;
      if (anchor.hasAttribute("download")) return;
      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      let url: URL;
      try {
        url = new URL(href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return;
      // Same-page nav: ignore
      if (url.pathname === location.pathname && url.search === location.search) return;

      // Fire feedback
      startedAtRef.current = performance.now();
      setPos({ x: e.clientX, y: e.clientY });
      setPending(true);
    }

    // CAPTURE: runs before Link's bubble-phase preventDefault
    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, []);

  // When the URL settles, schedule pending = false (respecting min duration).
  React.useEffect(() => {
    if (!pending) return;
    const elapsed = performance.now() - startedAtRef.current;
    const remaining = Math.max(0, minVisibleMs - elapsed);
    const t = setTimeout(() => setPending(false), remaining);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search?.toString()]);

  return { pending, pos };
}
