"use client";

import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import type { Range, RangeKey } from "./ranges";

/** The 3M / 6M / 1J period buttons. A pill slides behind the selected one (.range-pill in globals.css). */
export default function RangeToggle({
  ranges,
  selected,
  onSelect,
}: {
  ranges: Range[];
  selected: RangeKey;
  onSelect: (key: RangeKey) => void;
}) {
  const t = useTranslations("Chart");
  const pillPosition = {
    "--seg-i": ranges.findIndex((range) => range.key === selected),
    "--seg-n": ranges.length,
  } as CSSProperties;

  return (
    <div
      role="group"
      aria-label={t("rangeGroup")}
      className="relative grid auto-cols-fr grid-flow-col rounded-lg border border-line bg-card p-1 text-sm"
    >
      <span aria-hidden className="range-pill" style={pillPosition} />
      {ranges.map((range) => (
        <button
          key={range.weeks}
          type="button"
          aria-pressed={range.key === selected}
          onClick={() => onSelect(range.key)}
          className="relative min-w-11 rounded-md px-3 py-2 font-medium text-muted transition-[color,scale] duration-(--m-dur-2) pointer-coarse:min-h-11 hover:not-aria-pressed:text-fg focus-visible:not-aria-pressed:text-fg active:scale-95 aria-pressed:text-card"
        >
          {t(`ranges.${range.key}.label`)}
          <span className="sr-only"> ({t(`ranges.${range.key}.name`)})</span>
        </button>
      ))}
    </div>
  );
}
