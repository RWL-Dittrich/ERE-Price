"use client";

import { useEffect } from "react";
import { fmt } from "@/lib/format";
import { isLang } from "@/lib/i18n";

// Drives the motion contract in globals.css: reveals (data-reveal -> data-inview), count-ups, card spotlight.
// If this never runs, everything simply stays visible and still.
export default function MotionRoot() {
  useEffect(() => {
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stop = new AbortController();
    const mark = (el: HTMLElement, play: boolean) => {
      el.setAttribute("data-inview", "");
      const to = Number(el.dataset.countup);
      if (play && !still && el.dataset.countup && Number.isFinite(to)) countUp(el, to, stop.signal);
    };
    // No margin: a block reveals as soon as any of it is on screen, so nothing resting near the bottom edge stays
    // hidden, and a count-up starts as its number scrolls in instead of after it was already shown at its value.
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        mark(e.target as HTMLElement, true);
      }
    });
    // ponytail: one-shot query; add a MutationObserver if content ever streams in later.
    // Skips what an earlier run already marked (Fast Refresh), so nothing counts twice.
    for (const el of document.querySelectorAll<HTMLElement>(":is([data-reveal], [data-countup]):not([data-inview])")) {
      // Already seen (on screen or scrolled past) before motion was armed: keep it as rendered.
      if (el.getBoundingClientRect().top < innerHeight) mark(el, false);
      else io.observe(el);
    }
    document.documentElement.dataset.motion = "on";

    let frame = 0;
    let last: PointerEvent | null = null;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = e;
      frame ||= requestAnimationFrame(() => {
        frame = 0;
        const el = (last?.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
        if (!el || !last) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${last.clientX - r.left}px`);
        el.style.setProperty("--my", `${last.clientY - r.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      stop.abort();
      // Nothing reveals without the observer, so stop hiding (e.g. the layout's footer when error.tsx takes over).
      delete document.documentElement.dataset.motion;
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}

// Counts up from 85% of the value (ease-out-quart, 1100ms = --m-dur-5), so a glance mid-count never shows a price
// far from the real one. Writes the server-rendered text node React owns rather than replacing it via textContent,
// so a later React update still lands on screen. Aborting jumps to the final value.
function countUp(el: HTMLElement, to: number, signal: AbortSignal) {
  const text = el.firstChild;
  if (!(text instanceof Text)) return;
  const lang = document.documentElement.lang;
  const { eur } = fmt(isLang(lang) ? lang : "nl");
  const t0 = performance.now();
  const tick = (now: number) => {
    const p = signal.aborted ? 1 : Math.min(1, (now - t0) / 1100);
    text.data = eur(to * (0.85 + 0.15 * (1 - (1 - p) ** 4)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
