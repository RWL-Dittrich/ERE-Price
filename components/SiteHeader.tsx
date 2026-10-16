import { getLocale, getTranslations } from "next-intl/server";
import { localePath } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/site";
import LangSwitch from "./LangSwitch";

const navLink =
  "flex items-center rounded-full px-2.5 py-1.5 text-sm sm:px-3 text-muted transition-colors hover:bg-card hover:text-fg focus-visible:bg-card focus-visible:text-fg";

/**
 * Sticky header: logo, links to the explainer and the calculator, language switch. Rendered by the page (see
 * app/[locale]/page.tsx). On a phone the links shrink to "Uitleg" and a calculator icon, so the row fits at 360px.
 */
export default async function SiteHeader() {
  const homePath = localePath(await getLocale());
  const t = await getTranslations("Header");

  return (
    <header className="site-header">
      <div className="mx-auto flex h-(--header-h) w-full max-w-4xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href={homePath} className="logo flex items-center gap-2 font-semibold tracking-tight">
          <svg aria-hidden viewBox="0 0 32 32" className="size-7">
            <rect width="32" height="32" rx="8" fill="var(--accent)" />
            <path d="M18 5 8 18h7l-1 9 10-13h-7z" fill="#fff" />
          </svg>
          {SITE_NAME}
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          <a href="#uitleg" className={navLink}>
            <span className="sm:hidden">{t("explainerLinkShort")}</span>
            <span className="max-sm:hidden">{t("explainerLink")}</span>
          </a>
          <a href="#rekenhulp" className={navLink}>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5 sm:hidden"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <path d="M8 6h8M16 14v4M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
            </svg>
            <span className="max-sm:sr-only">{t("calculatorLink")}</span>
          </a>
          <LangSwitch />
        </div>
      </div>
    </header>
  );
}
