"use client";

import { useId, useState, type CSSProperties } from "react";
import { useLang } from "@/components/LangProvider";
import { LOCALE } from "@/lib/i18n";

const MIN = 500;
const MAX = 10_000;

function make(locale: string) {
  return {
    kwh: new Intl.NumberFormat(locale),
    ere: new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    factor: new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }),
    eur: new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }),
  };
}
const formats = { nl: make(LOCALE.nl), en: make(LOCALE.en) };

const T = {
  nl: {
    title: "Reken het na",
    sub: "Indicatief, per jaar, voor stroom geleverd in 2026",
    label: "Thuis geladen per jaar",
    perYear: "per jaar",
    gross: "Bruto",
    net: (pct: number) => `Na ${pct}% kosten`,
    formula: "Huidige middenprijs",
    note: "Er is geen vaste prijs voor ERE's; wat je krijgt hangt af van je inboekdienstverlener en de markt.",
  },
  en: {
    title: "Work it out",
    sub: "Indicative, per year, for electricity delivered in 2026",
    label: "Charged at home per year",
    perYear: "per year",
    gross: "Gross",
    net: (pct: number) => `After ${pct}% fees`,
    formula: "Current mid price",
    note: "There is no fixed price for EREs; what you get depends on your registration service provider and the market.",
  },
};

// Indicative yearly yield: kWh × ERE per kWh × current mid price; net assumes the example fee used in the copy above.
export default function EarningsCalc({ midEur, erePerKwh, fee }: { midEur: number; erePerKwh: number; fee: number }) {
  const lang = useLang();
  const t = T[lang];
  const f = formats[lang];
  const id = useId();
  const [kwh, setKwh] = useState(2500);
  const ere = kwh * erePerKwh;
  const gross = ere * midEur;
  const rows: [string, string, boolean][] = [
    ["ERE-E", `≈ ${f.ere.format(ere)}`, false],
    [t.gross, f.eur.format(gross), false],
    [t.net(Math.round(fee * 100)), f.eur.format(gross * (1 - fee)), true],
  ];
  return (
    <div className="mt-4 border-t border-line pt-4">
      <h4 className="text-sm font-semibold">{t.title}</h4>
      <p className="text-xs text-muted">{t.sub}</p>
      <div className="mt-3 flex items-baseline justify-between gap-3 text-sm">
        <label htmlFor={id}>{t.label}</label>
        <span className="font-medium tabular-nums">{f.kwh.format(kwh)} kWh</span>
      </div>
      <input
        id={id}
        type="range"
        min={MIN}
        max={MAX}
        step={250}
        value={kwh}
        onChange={(e) => setKwh(Number(e.target.value))}
        aria-valuetext={`${f.kwh.format(kwh)} kWh ${t.perYear}`}
        className="calc-range"
        style={{ "--fill": `${((kwh - MIN) / (MAX - MIN)) * 100}%` } as CSSProperties}
      />
      {/* Atomic: each update is read with its labels, not as bare numbers. */}
      <dl aria-live="polite" aria-atomic="true" className="mt-2 grid grid-cols-3 gap-2">
        {rows.map(([label, value, strong]) => (
          <div key={label} className="rounded-lg bg-page p-3">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className={`mt-0.5 text-base font-semibold tabular-nums ${strong ? "text-accent" : ""}`}>
              <span key={value} className="calc-tick">
                {value}
              </span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        {t.formula} × {f.factor.format(erePerKwh)} ERE per kWh × kWh {t.perYear}. {t.note}
      </p>
    </div>
  );
}
