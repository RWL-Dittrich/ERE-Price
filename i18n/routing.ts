import type { Locale } from "next-intl";
import { defineRouting } from "next-intl/routing";

/** The URL prefix of each locale: English is en-GB (British number and date formats), but lives at /en. */
const prefixes = { nl: "/nl", "en-GB": "/en" } as const;

/**
 * Locales and URLs.
 *
 * The middleware in proxy.ts sends "/" to the locale in the NEXT_LOCALE cookie, or else to the best match for the
 * browser's Accept-Language header. Every language other than Dutch falls back to English (the default locale).
 */
export const routing = defineRouting({
  locales: ["nl", "en-GB"],
  defaultLocale: "en-GB",
  localePrefix: { mode: "always", prefixes },
  // Set when a visitor picks a language that differs from their browser's; kept for a year.
  localeCookie: { maxAge: 60 * 60 * 24 * 365 },
  // No hreflang Link header from the middleware: it would say "en-GB" and x-default "/", contradicting the page's
  // own <link rel="alternate"> tags (hreflang "en", x-default "/en") in app/[locale]/layout.tsx.
  alternateLinks: false,
});

/** The page's path for a locale: "/nl" or "/en". */
export function localePath(locale: Locale): string {
  return prefixes[locale];
}

/** The language of a locale without its region: "nl" or "en". */
export function languageOf(locale: Locale): "nl" | "en" {
  return locale === "nl" ? "nl" : "en";
}

/** Each language's name in that language, for the language switch. */
export const localeNames: Record<Locale, string> = { nl: "Nederlands", "en-GB": "English" };
