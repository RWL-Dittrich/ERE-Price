"use client";

import type { CSSProperties } from "react";

/** A row of buttons of which one is pressed (3M / 6M / 1J, ERE / kWh). A pill slides behind it (.segment-pill in globals.css). */
export default function Segmented<Key extends string>({
  label,
  options,
  selected,
  onSelect,
}: {
  /** The group's accessible name. */
  label: string;
  /** `srLabel` is read after the visible label, e.g. "3M (3 maanden)". */
  options: { key: Key; label: string; srLabel?: string }[];
  selected: Key;
  onSelect: (key: Key) => void;
}) {
  const pillPosition = {
    "--seg-i": options.findIndex((option) => option.key === selected),
    "--seg-n": options.length,
  } as CSSProperties;

  return (
    <div
      role="group"
      aria-label={label}
      className="relative grid auto-cols-fr grid-flow-col rounded-lg border border-line bg-card p-1 text-sm"
    >
      <span aria-hidden className="segment-pill" style={pillPosition} />
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          aria-pressed={option.key === selected}
          onClick={() => onSelect(option.key)}
          className="relative min-w-11 rounded-md px-3 py-2 font-medium text-muted transition-[color,scale] duration-(--m-dur-2) pointer-coarse:min-h-11 hover:not-aria-pressed:text-fg focus-visible:not-aria-pressed:text-fg active:scale-95 aria-pressed:text-card"
        >
          {option.label}
          {option.srLabel && <span className="sr-only"> ({option.srLabel})</span>}
        </button>
      ))}
    </div>
  );
}
