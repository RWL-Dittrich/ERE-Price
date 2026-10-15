"use client";

import { useId } from "react";
import { usePopover } from "./usePopover";

// Hero price chip with a short explanation (see usePopover for when it opens and closes). A tap opens rather than
// toggles, because touch browsers that focus the button on tap would otherwise open and close it in one go.
// align="end" anchors the text to the chip's right edge, for a chip that sits too far right for a 14rem box on a phone.
export default function TipChip({
  label,
  value,
  tip,
  align = "start",
}: {
  label: string;
  value: string;
  tip: string;
  align?: "start" | "end";
}) {
  const id = useId();
  const { open, setOpen, props } = usePopover();

  return (
    <span {...props} className="relative">
      <button
        type="button"
        aria-describedby={id}
        onClick={() => setOpen(true)}
        className="cursor-help rounded-full border border-line bg-card px-3 py-1 transition-colors hover:border-accent focus-visible:border-accent"
      >
        <span className="text-muted underline decoration-dotted underline-offset-4">{label}</span>{" "}
        <span className="font-medium">{value}</span>
      </button>
      {/* pt-2 instead of a margin: no gap, so the pointer can cross from chip to text while staying inside. */}
      <span
        role="tooltip"
        id={id}
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
