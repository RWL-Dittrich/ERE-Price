import { getLocale, getTranslations } from "next-intl/server";
import { localePath } from "@/i18n/routing";
import LangSwitch from "./LangSwitch";

/** Sticky header: logo, link to the explainer, language switch. Rendered by the page (see app/[locale]/page.tsx). */
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
          ERE prijs
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href="#uitleg"
            className="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-card hover:text-fg focus-visible:bg-card focus-visible:text-fg"
          >
            {t("explainerLink")}
          </a>
          <LangSwitch />
        </div>
      </div>
    </header>
  );
}
