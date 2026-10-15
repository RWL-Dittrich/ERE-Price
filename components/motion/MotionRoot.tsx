"use client";

import { useEffect } from "react";
import { useFormatter } from "next-intl";

/**
 * Drives the motion contract in globals.css: reveals (data-reveal → data-inview), count-ups (data-countup) and the
 * card spotlight (data-spotlight). If this never runs, everything simply stays visible and still.
 */
export default function MotionRoot() {
  const format = useFormatter();

  useEffect(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stop = new AbortController();
    const formatPrice = (euro: number) => format.number(euro, "price");

    const markInView = (element: HTMLElement, animate: boolean) => {
      element.setAttribute("data-inview", "");
      const target = Number(element.dataset.countup);
      if (animate && !reducedMotion && element.dataset.countup && Number.isFinite(target)) {
        countUp(element, target, formatPrice, stop.signal);
      }
    };

    // No margin: a block reveals as soon as any of it is on screen, so nothing resting near the bottom edge stays
    // hidden, and a count-up starts as its number scrolls in instead of after it was already shown at its value.
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        markInView(entry.target as HTMLElement, true);
      }
    });
    // ponytail: one-shot query; add a MutationObserver if content ever streams in later.
    // Skips what an earlier run already marked (Fast Refresh), so nothing counts twice.
    for (const element of document.querySelectorAll<HTMLElement>(":is([data-reveal], [data-countup]):not([data-inview])")) {
      // Already seen (on screen or scrolled past) before motion was armed: keep it as rendered.
      if (element.getBoundingClientRect().top < innerHeight) markInView(element, false);
      else observer.observe(element);
    }
    document.documentElement.dataset.motion = "on";

    // Spotlight: the card under the mouse gets the pointer position as --mx / --my, once per frame.
    let frame = 0;
    let lastMove: PointerEvent | null = null;
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      lastMove = event;
      frame ||= requestAnimationFrame(() => {
        frame = 0;
        const card = (lastMove?.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
        if (!card || !lastMove) return;
        const box = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${lastMove.clientX - box.left}px`);
        card.style.setProperty("--my", `${lastMove.clientY - box.top}px`);
      });
    };
    document.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      observer.disconnect();
      stop.abort();
      // Nothing reveals without the observer, so stop hiding (e.g. the layout's footer when error.tsx takes over).
      delete document.documentElement.dataset.motion;
      document.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, [format]);

  return null;
}

/**
 * Counts a price up from 85% of its value (ease-out-quart, 1100ms = --m-dur-5), so a glance mid-count never shows
 * a price far from the real one. Writes the server-rendered text node React owns rather than replacing it via
 * textContent, so a later React update still lands on screen. Aborting jumps to the final value.
 */
function countUp(element: HTMLElement, target: number, formatPrice: (euro: number) => string, signal: AbortSignal) {
  const text = element.firstChild;
  if (!(text instanceof Text)) return;
  const start = performance.now();
  const tick = (now: number) => {
    const progress = signal.aborted ? 1 : Math.min(1, (now - start) / 1100);
    const easedOut = 1 - (1 - progress) ** 4;
    text.data = formatPrice(target * (0.85 + 0.15 * easedOut));
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
