"use client";

import { useId, useLayoutEffect, useRef, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { dict, type Lang } from "@/lib/i18n";
import { useLang } from "./LangProvider";
import { usePopover } from "./usePopover";

// Names the site a link goes to, for "Lees meer bij …" / "Read more at …".
const SITES: Record<Lang, Record<string, string>> = {
  nl: {
    "www.emissieautoriteit.nl": "de NEa",
    "www.emissionsauthority.nl": "de NEa",
    "nl.wikipedia.org": "Wikipedia",
    "en.wikipedia.org": "Wikipedia",
    "www.cbs.nl": "het CBS",
    "www.rvo.nl": "RVO",
    "radar.avrotros.nl": "Radar",
    "joulo.nl": "Joulo",
    "developer.joulo.nl": "Joulo",
  },
  en: {
    "www.emissieautoriteit.nl": "the NEa",
    "www.emissionsauthority.nl": "the NEa",
    "nl.wikipedia.org": "Wikipedia",
    "en.wikipedia.org": "Wikipedia",
    "www.cbs.nl": "CBS",
    "www.rvo.nl": "RVO",
    "radar.avrotros.nl": "Radar",
    "joulo.nl": "Joulo",
    "developer.joulo.nl": "Joulo",
  },
};
const GUTTER = 16;

// A term in the running text: a real link (so it works without JS), plus a card with a one-line explanation and a
// "Lees meer" link that opens on hover or keyboard focus (see usePopover). On touch, tapping the term only opens or
// closes the card; the page itself opens only from the card's "Lees meer" link.
// hrefLang: the language of the linked page, when it differs from this page's (e.g. a Dutch-only NEa page on /en);
// the card then says so ("Read more at the NEa (in Dutch)").
export default function Term({
  href,
  hrefLang,
  tip,
  children,
}: {
  href: string;
  hrefLang?: Lang;
  tip: string;
  children: ReactNode;
}) {
  const id = useId();
  const { open, setOpen, props } = usePopover();
  const anchor = useRef<HTMLAnchorElement>(null);
  const card = useRef<HTMLSpanElement>(null);
  const tap = useRef<{ touch: boolean; wasOpen: boolean } | null>(null);
  // Where the pointer met the term: a term can wrap over two lines, and the card goes under the line being pointed at.
  const at = useRef<{ x: number; y: number } | null>(null);
  const lang = useLang();
  const host = new URL(href).hostname;
  const site = SITES[lang][host] ?? host;
  const t = dict[lang];
  const otherLang = hrefLang && hrefLang !== lang ? ` (${t.inLang[hrefLang]})` : "";

  // Place the card under the pointed-at line of the term (or above it when there is no room below), kept inside the
  // viewport. Direct DOM writes, measured before paint; margins shift it from its default spot in the layout.
  useLayoutEffect(() => {
    const el = card.current;
    const rects = anchor.current ? [...anchor.current.getClientRects()] : [];
    if (!open || !el || !rects.length) return;
    const p = at.current;
    const line =
      (p && rects.find((r) => p.x >= r.left - 2 && p.x <= r.right + 2 && p.y >= r.top - 2 && p.y <= r.bottom + 2)) ??
      rects[0];
    at.current = null;
    el.style.margin = "0px";
    el.removeAttribute("data-up");
    let c = el.getBoundingClientRect();
    if (line.bottom + c.height > innerHeight && line.top - c.height > 0) {
      el.setAttribute("data-up", "");
      c = el.getBoundingClientRect();
    }
    const vw = document.documentElement.clientWidth;
    const left = Math.min(Math.max(line.left, GUTTER), vw - GUTTER - c.width);
    const top = el.hasAttribute("data-up") ? line.top - c.height : line.bottom;
    el.style.marginLeft = `${left - c.left}px`;
    el.style.marginTop = `${top - c.top}px`;
  }, [open]);

  return (
    <span {...props} className="relative">
      <a
        ref={anchor}
        href={href}
        hrefLang={hrefLang}
        target="_blank"
        rel="noopener"
        aria-describedby={id}
        onPointerEnter={(e: PointerEvent) => (at.current = { x: e.clientX, y: e.clientY })}
        onPointerDown={(e: PointerEvent) => {
          at.current = { x: e.clientX, y: e.clientY };
          tap.current = { touch: e.pointerType !== "mouse", wasOpen: open };
        }}
        onClick={(e: MouseEvent) => {
          // Touch: the term toggles its card and never opens a tab. wasOpen is read at pointerdown, before a
          // tap-induced focus has opened the card, so a tap on an open card's term closes it.
          if (tap.current?.touch) {
            e.preventDefault();
            setOpen(!tap.current.wasOpen);
          }
          tap.current = null;
        }}
        className="underline decoration-accent decoration-dotted underline-offset-4 transition-colors hover:text-accent hover:decoration-solid focus-visible:text-accent focus-visible:decoration-solid"
      >
        {children}
      </a>
      {/* pt-2 / pb-2 instead of a gap: the pointer can cross from the term onto the card without leaving it.
          Fades only (no slide), so the measured position above is where it ends up. */}
      <span
        ref={card}
        data-open={open ? "" : undefined}
        className="invisible absolute top-0 left-0 z-30 pt-2 opacity-0 transition-[opacity,visibility] duration-(--m-dur-2) ease-(--m-ease-out) data-open:visible data-open:opacity-100 data-up:pt-0 data-up:pb-2"
      >
        <span className="block w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-line bg-popover p-3 text-left text-xs leading-relaxed font-normal text-fg shadow-lg">
          {/* The description the term announces, so it carries the new-tab notice for screen readers too. */}
          <span id={id} className="block">
            {tip}
            <span className="sr-only"> ({t.newTab})</span>
          </span>
          <a
            href={href}
            hrefLang={hrefLang}
            target="_blank"
            rel="noopener"
            className="mt-2 inline-flex items-center gap-1 font-medium text-accent underline-offset-2 hover:underline focus-visible:underline"
          >
            {t.readMore} {site}
            {otherLang}
            <span aria-hidden>↗</span>
            <span className="sr-only">({t.newTab})</span>
          </a>
        </span>
      </span>
    </span>
  );
}
