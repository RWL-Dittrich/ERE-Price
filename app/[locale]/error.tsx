"use client";

import { useTranslations } from "next-intl";

/** Shown when the price feed has been down for longer than the cache keeps the last good page (see lib/ere.ts). */
export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = useTranslations("Error");

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 pt-10 sm:px-6 sm:pt-14">
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 max-w-prose leading-relaxed text-muted">{t("body")}</p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-6 min-h-11 rounded-lg bg-fg px-4 text-sm font-medium text-card hover:opacity-90"
      >
        {t("retry")}
      </button>
    </main>
  );
}
