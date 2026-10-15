import { getLocale, getTranslations } from "next-intl/server";
import { languageOf, localeNames, localePath, routing } from "@/i18n/routing";

/**
 * The NL / EN switch in the header. Plain links rather than next/link: a full page load passes the middleware,
 * which remembers the choice (NEXT_LOCALE cookie) for the next visit to "/", and swaps <html lang>.
 */
export default async function LangSwitch() {
  const currentLocale = await getLocale();
  const t = await getTranslations("Header");

  return (
    <nav aria-label={t("languageSwitch")} className="flex rounded-full border border-line bg-card p-0.5 text-xs font-medium">
      {routing.locales.map((locale) => (
        <a
          key={locale}
          href={localePath(locale)}
          hrefLang={languageOf(locale)}
          lang={languageOf(locale)}
          aria-current={locale === currentLocale ? "page" : undefined}
          className="grid min-w-9 place-items-center rounded-full px-2.5 py-1 text-muted uppercase transition-colors pointer-coarse:min-h-9 hover:text-fg focus-visible:text-fg aria-[current=page]:bg-fg aria-[current=page]:text-card"
        >
          {languageOf(locale)}
          <span className="sr-only"> ({localeNames[locale]})</span>
        </a>
      ))}
    </nav>
  );
}
