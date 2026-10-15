"use client";

import { useId, useLayoutEffect, useRef, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Link } from "@/i18n/links";
import { languageOf } from "@/i18n/routing";
import { usePopover } from "./usePopover";

/** The card keeps at least this distance from the left and right edges of the viewport. */
const VIEWPORT_MARGIN = 16;

type Point = { x: number; y: number };

/**
 * A term in the explainer text: a real link to its source (so it works without JavaScript), plus a card with a
 * one-line explanation and a "Lees meer bij …" link.
 *
 * - Mouse and keyboard: the card opens on hover or focus (see usePopover).
 * - Touch: tapping the term only opens or closes the card. The page opens from the card's own link, never from a
 *   tap on the term, so a tap never sends someone off the site by surprise.
 *
 * When the linked page is in another language than this page (e.g. a Dutch-only NEa page on /en), the card says
 * so, "Read more at the NEa (in Dutch)", and the links carry hrefLang.
 */
export default function Term({ link, tip, children }: { link: Link; tip: string; children: ReactNode }) {
  const t = useTranslations("Links");
  const otherLanguage = link.lang !== languageOf(useLocale()) ? link.lang : undefined;
  const descriptionId = useId();
  const { open, setOpen, props: popoverProps } = usePopover();

  const termRef = useRef<HTMLAnchorElement>(null);
  const cardRef = useRef<HTMLSpanElement>(null);
  // Where the pointer met the term, to put the card under the line that was pointed at.
  const pointer = useRef<Point | null>(null);
  // A touch tap in progress, and whether the card was open when it started.
  const touchTap = useRef<{ wasOpen: boolean } | null>(null);

  const readMore = t("readMore", { site: t(`sites.${link.site}`) });
  const languageNote = otherLanguage ? ` (${t(`inLanguage.${otherLanguage}`)})` : "";

  useLayoutEffect(() => {
    if (!open || !termRef.current || !cardRef.current) return;
    placeCard(cardRef.current, termRef.current, pointer.current);
    pointer.current = null;
  }, [open]);

  return (
    <span {...popoverProps} className="relative">
      <a
        ref={termRef}
        href={link.url}
        hrefLang={otherLanguage}
        target="_blank"
        rel="noopener"
        aria-describedby={descriptionId}
        onPointerEnter={(event) => (pointer.current = { x: event.clientX, y: event.clientY })}
        onPointerDown={(event) => {
          pointer.current = { x: event.clientX, y: event.clientY };
          // Read at pointerdown, before a tap-induced focus has opened the card.
          touchTap.current = event.pointerType === "mouse" ? null : { wasOpen: open };
        }}
        onClick={(event) => {
          if (touchTap.current) {
            event.preventDefault();
            setOpen(!touchTap.current.wasOpen);
          }
          touchTap.current = null;
        }}
        className="underline decoration-accent decoration-dotted underline-offset-4 transition-colors hover:text-accent hover:decoration-solid focus-visible:text-accent focus-visible:decoration-solid"
      >
        {children}
      </a>
      {/* pt-2 / pb-2 instead of a gap: the pointer can cross from the term onto the card without leaving it.
          Fades only (no slide), so the position placeCard() measures is where the card ends up. */}
      <span
        ref={cardRef}
        data-open={open ? "" : undefined}
        className="invisible absolute top-0 left-0 z-30 pt-2 opacity-0 transition-[opacity,visibility] duration-(--m-dur-2) ease-(--m-ease-out) data-open:visible data-open:opacity-100 data-up:pt-0 data-up:pb-2"
      >
        <span className="block w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-line bg-popover p-3 text-left text-xs leading-relaxed font-normal text-fg shadow-lg">
          {/* The term's description, so it carries the new-tab notice for screen readers too. */}
          <span id={descriptionId} className="block">
            {tip}
            <span className="sr-only"> ({t("newTab")})</span>
          </span>
          <a
            href={link.url}
            hrefLang={otherLanguage}
            target="_blank"
            rel="noopener"
            className="mt-2 inline-flex items-center gap-1 font-medium text-accent underline-offset-2 hover:underline focus-visible:underline"
          >
            {readMore}
            {languageNote}
            <span aria-hidden>↗</span>
            <span className="sr-only">({t("newTab")})</span>
          </a>
        </span>
      </span>
    </span>
  );
}

/**
 * Puts the card under the line of the term that the pointer is on (a term can wrap over two lines), or above it
 * when there is no room below, and keeps it inside the viewport. Runs before paint; the margins shift the card
 * from its default spot at the top left of the term.
 */
function placeCard(card: HTMLElement, term: HTMLElement, pointer: Point | null) {
  const lines = [...term.getClientRects()];
  if (!lines.length) return;
  const line = (pointer && lines.find((rect) => isOnLine(rect, pointer))) ?? lines[0];

  card.style.margin = "0px";
  card.removeAttribute("data-up");
  let box = card.getBoundingClientRect();

  const fitsBelow = line.bottom + box.height <= innerHeight;
  const fitsAbove = line.top - box.height > 0;
  if (!fitsBelow && fitsAbove) {
    card.setAttribute("data-up", ""); // swaps the top padding for bottom padding
    box = card.getBoundingClientRect();
  }

  const viewportWidth = document.documentElement.clientWidth;
  const left = Math.min(Math.max(line.left, VIEWPORT_MARGIN), viewportWidth - VIEWPORT_MARGIN - box.width);
  const top = card.hasAttribute("data-up") ? line.top - box.height : line.bottom;
  card.style.marginLeft = `${left - box.left}px`;
  card.style.marginTop = `${top - box.top}px`;
}

/** With a 2px tolerance, for a pointer resting right on the edge of a line. */
function isOnLine(line: DOMRect, point: Point) {
  const tolerance = 2;
  return (
    point.x >= line.left - tolerance &&
    point.x <= line.right + tolerance &&
    point.y >= line.top - tolerance &&
    point.y <= line.bottom + tolerance
  );
}
