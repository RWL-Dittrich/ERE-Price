import { LOCALE, type Lang } from "./i18n";

function make(locale: string) {
  const eur = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", minimumFractionDigits: 3, maximumFractionDigits: 3 });
  const pct = new Intl.NumberFormat(locale, { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 });
  // Numeric dates render identically on server and client (no locale month names).
  const date = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
  return {
    eur: (v: number) => eur.format(v),
    pct: (v: number) => pct.format(v),
    date: (ms: number) => date.format(ms),
  };
}

const formatters = { nl: make(LOCALE.nl), en: make(LOCALE.en) };
export const fmt = (lang: Lang) => formatters[lang];

export const weekLabel = (w: { week: number; year: number }) => `week ${w.week} · ${w.year}`;
