import { hasLocale, type Formats } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { routing } from "./routing";

/**
 * Named formats, used as format.number(value, "price") and format.dateTime(date, "date").
 * Numeric dates are formatted in UTC, so the server and the browser render the same string.
 */
export const formats = {
  number: {
    /** A price per ERE: "€ 0,365" / "€0.365". */
    price: { style: "currency", currency: "EUR", minimumFractionDigits: 3, maximumFractionDigits: 3 },
    /** A chart axis label: "€ 0,35". */
    axisPrice: { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 },
    /** A rounded amount: "€ 304". */
    wholeEuros: { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 },
    /** "2.500" / "2,500". */
    integer: { maximumFractionDigits: 0 },
    /** Up to four decimals: "0,3327". */
    decimal: { maximumFractionDigits: 4 },
    /** A fraction as a percentage: 0.068 → "6,8%". */
    percent: { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 },
  },
  dateTime: {
    /** "08-06-2026" / "08/06/2026". */
    date: { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" },
    /** "jun 26" / "Jun 26". */
    month: { month: "short", year: "2-digit", timeZone: "UTC" },
    /** "12 oktober 2026 om 09:03": Dutch local time, for server-rendered text only. */
    updated: { dateStyle: "long", timeStyle: "short" },
  },
} satisfies Formats;

export default getRequestConfig(async ({ locale: override }) => {
  // The locale comes from the [locale] route segment, unless a caller passes one explicitly.
  const locale = override ?? (await rootParams.locale());
  if (!hasLocale(routing.locales, locale)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    formats,
    timeZone: "Europe/Amsterdam",
  };
});
