import type { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { languageOf } from "@/i18n/routing";

const LINKEDIN_URL = "https://nl.linkedin.com/in/robin-dittrich-b43b92195";
const GITHUB_URL = "https://github.com/RWL-Dittrich";

/** Data attribution (required by Joulo's CC BY 4.0 licence) and the maker's credit. */
export default async function SiteFooter() {
  const language = languageOf(await getLocale());
  const t = await getTranslations("Footer");
  const newTab = (await getTranslations("Links"))("newTab");

  return (
    <footer data-reveal="fade" className="mt-20 border-t border-line">
      <div className="mx-auto w-full max-w-4xl space-y-2 px-4 py-8 text-sm text-muted sm:px-6">
        <p>
          {t("source")} (
          <ExternalLink href="https://joulo.nl/status" newTab={newTab}>
            joulo.nl/status
          </ExternalLink>
          ),{" "}
          <ExternalLink href={`https://creativecommons.org/licenses/by/4.0/deed.${language}`} newTab={newTab}>
            CC BY 4.0
          </ExternalLink>
        </p>
        <p>
          {t("prices")}{" "}
          <ExternalLink href="https://developer.joulo.nl/guides/ere-price-feed" newTab={newTab}>
            {t("priceFeed")}
          </ExternalLink>
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-4">
          <p>
            {t("madeWith")}{" "}
            <span aria-hidden className="text-accent">
              ♥
            </span>
            <span className="sr-only">{t("love")}</span> {t("by")} Robin Dittrich
          </p>
          <div className="-mr-2 flex items-center">
            <IconLink href={LINKEDIN_URL} label={`${t("linkedin")} (${newTab})`} icon={<LinkedInIcon />} />
            <IconLink href={GITHUB_URL} label={`${t("github")} (${newTab})`} icon={<GitHubIcon />} />
          </div>
        </div>
      </div>
    </footer>
  );
}

/** A text link to another site: opens in a new tab and says so to screen readers. */
function ExternalLink({ href, newTab, children }: { href: string; newTab: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-fg focus-visible:text-fg">
      {children}
      <span className="sr-only"> ({newTab})</span>
    </a>
  );
}

/** An icon-only link to another site, named for screen readers and 44px tall on touch screens. */
function IconLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-full text-muted transition-colors pointer-coarse:size-11 hover:bg-card hover:text-fg focus-visible:bg-card focus-visible:text-fg"
    >
      {icon}
    </a>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4.5" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4.5" fill="currentColor">
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .3" />
    </svg>
  );
}
