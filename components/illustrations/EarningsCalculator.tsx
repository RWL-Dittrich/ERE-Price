"use client";

import { useId, useState, type CSSProperties } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { ERE_PER_KWH, EXAMPLE_FEE } from "@/lib/earnings";

const MIN_KWH = 500;
const MAX_KWH = 10_000;
const STEP_KWH = 250;
const START_KWH = 2500;

/**
 * "Reken het na": a kWh-per-year slider with the indicative yearly yield, gross and after the example fee.
 * Yield = kWh × ERE per kWh × the current mid price.
 */
export default function EarningsCalculator({ midPrice }: { midPrice: number }) {
  const t = useTranslations("Calculator");
  const format = useFormatter();
  const sliderId = useId();
  const [kwh, setKwh] = useState(START_KWH);

  const eres = kwh * ERE_PER_KWH;
  const gross = eres * midPrice;
  const kwhText = format.number(kwh, "integer");
  const results = [
    { label: "ERE-E", value: `≈ ${format.number(eres, "integer")}`, highlight: false },
    { label: t("gross"), value: format.number(gross, "wholeEuros"), highlight: false },
    {
      label: t("net", { percent: Math.round(EXAMPLE_FEE * 100) }),
      value: format.number(gross * (1 - EXAMPLE_FEE), "wholeEuros"),
      highlight: true,
    },
  ];
  const sliderFill = { "--fill": `${((kwh - MIN_KWH) / (MAX_KWH - MIN_KWH)) * 100}%` } as CSSProperties;

  return (
    <div className="mt-4 border-t border-line pt-4">
      <h4 className="text-sm font-semibold">{t("title")}</h4>
      <p className="text-xs text-muted">{t("subtitle")}</p>
      <div className="mt-3 flex items-baseline justify-between gap-3 text-sm">
        <label htmlFor={sliderId}>{t("slider")}</label>
        <span className="font-medium tabular-nums">{kwhText} kWh</span>
      </div>
      <input
        id={sliderId}
        type="range"
        min={MIN_KWH}
        max={MAX_KWH}
        step={STEP_KWH}
        value={kwh}
        onChange={(event) => setKwh(Number(event.target.value))}
        aria-valuetext={t("kwhPerYear", { kwh: kwhText })}
        className="calc-range"
        style={sliderFill}
      />
      {/* Atomic: each update is read out with its labels, not as bare numbers. */}
      <dl aria-live="polite" aria-atomic="true" className="mt-2 grid grid-cols-3 gap-2">
        {results.map(({ label, value, highlight }) => (
          <div key={label} className="rounded-lg bg-page p-3">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className={`mt-0.5 text-base font-semibold tabular-nums ${highlight ? "text-accent" : ""}`}>
              {/* Keyed by value: a new value remounts the span, which replays its tick animation (.calc-tick). */}
              <span key={value} className="calc-tick">
                {value}
              </span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        {t("formula", { erePerKwh: format.number(ERE_PER_KWH, "decimal") })}
      </p>
    </div>
  );
}
