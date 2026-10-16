"use client";

import { useId, type ReactNode } from "react";
import { usePopover } from "./usePopover";

/**
 * A price chip in the hero ("Bied € 0,360") with a short explanation underneath, shown on hover, focus or tap
 * (see usePopover). A tap opens rather than toggles: touch browsers that focus the button on tap would otherwise
 * open and close it in one go.
 *
 * align="end" anchors the explanation to the chip's right edge, for a chip too far right to fit a 14rem box on a
 * phone. bare drops the chip's outline, for a tip on a word in a line of text.
 */
export default function TipChip({
  label,
  value,
  tip,
  align = "start",
  bare = false,
}: {
  label: string;
  value?: ReactNode;
  tip: ReactNode;
  align?: "start" | "end";
  bare?: boolean;
}) {
  const tooltipId = useId();
  const { open, setOpen, props: popoverProps } = usePopover();

  return (
    <span {...popoverProps} className="relative">
      <button
        type="button"
        aria-describedby={tooltipId}
        onClick={() => setOpen(true)}
        className={
          bare
            ? "group rounded-sm"
            : "rounded-full border border-line bg-card px-3 py-1 transition-colors hover:border-accent focus-visible:border-accent"
        }
      >
        <span
          className={`text-muted underline decoration-dotted underline-offset-4 ${bare ? "transition-colors group-hover:decoration-accent group-focus-visible:decoration-accent" : ""}`}
        >
          {label}
        </span>
        {value && (
          <>
            {" "}
            <span className="font-medium">{value}</span>
          </>
        )}
      </button>
      {/* pt-2 instead of a margin: no gap, so the pointer can cross from the chip onto the text without leaving it. */}
      <span
        role="tooltip"
        id={tooltipId}
        data-open={open ? "" : undefined}
        className={`${align === "end" ? "right-0" : "left-0"} invisible absolute top-full z-20 translate-y-1 pt-2 opacity-0 transition-[opacity,translate,visibility] duration-(--m-dur-2) ease-(--m-ease-out) data-open:visible data-open:translate-y-0 data-open:opacity-100`}
      >
        <span className="block w-56 rounded-lg border border-line bg-popover px-3 py-2 text-xs leading-relaxed text-fg shadow-lg">
          {tip}
        </span>
      </span>
    </span>
  );
}
