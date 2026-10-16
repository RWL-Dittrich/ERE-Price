"use client";

import Script from "next/script";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { GA_ID } from "@/lib/site";

/**
 * Google Analytics, only after consent: until "Accept", no Google script loads and no cookie is set (basic consent
 * mode). The choice is kept in localStorage; ConsentSettings in the footer reopens the banner. Rendered by the
 * layout only when GA_ID is set.
 */

type Choice = "granted" | "denied";
const STORAGE_KEY = "ere-consent";
const OPEN_EVENT = "ere:consent-open";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Fallback for blocked storage: the choice then lasts until the tab is closed.
let memory: Choice | null = null;
const listeners = new Set<() => void>();

function readChoice(): Choice | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "granted" || stored === "denied") return stored;
  } catch {}
  return memory;
}

function saveChoice(choice: Choice) {
  memory = choice;
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {}
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Withdrawn consent: stop GA in this page and delete the cookies it set (_ga, _ga_<id>). */
function stopAnalytics() {
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
  const domain = `.${location.hostname.replace(/^www\./, "")}`;
  for (const cookie of document.cookie.split("; ")) {
    const name = cookie.split("=")[0];
    if (!name.startsWith("_ga")) continue;
    document.cookie = `${name}=; max-age=0; path=/`;
    document.cookie = `${name}=; max-age=0; path=/; domain=${domain}`;
  }
}

const buttonClass =
  "rounded-full border border-line px-4 py-2 font-medium transition-colors hover:border-accent focus-visible:border-accent";

export default function Analytics() {
  const t = useTranslations("Consent");
  // "pending" on the server and during hydration, so the static page never contains the banner.
  const choice = useSyncExternalStore(subscribe, readChoice, () => "pending" as const);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const choose = (next: Choice) => {
    if (next === "denied") stopAnalytics();
    // Accepting again after a decline in the same page: the scripts already ran, so only consent changes.
    else window.gtag?.("consent", "update", { analytics_storage: "granted" });
    saveChoice(next);
    setReopened(false);
  };

  return (
    <>
      {choice === "granted" && (
        <>
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
window.gtag = function () { dataLayer.push(arguments); };
gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
gtag("js", new Date());
gtag("config", "${GA_ID}", { allow_google_signals: false, allow_ad_personalization_signals: false });`}
          </Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        </>
      )}
      {(choice === null || reopened) && (
        // Not a modal: the page stays usable. Both buttons look the same, so declining is as easy as accepting.
        <section
          aria-label={t("label")}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-xl border border-line bg-popover p-4 text-sm shadow-lg"
        >
          <p className="leading-relaxed">{t("text")}</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => choose("granted")} className={buttonClass}>
              {t("accept")}
            </button>
            <button type="button" onClick={() => choose("denied")} className={buttonClass}>
              {t("decline")}
            </button>
          </div>
        </section>
      )}
    </>
  );
}

/** The footer's "Cookie-instellingen": reopens the banner, so consent can be withdrawn as easily as it was given. */
export function ConsentSettings({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className="underline underline-offset-2 hover:text-fg focus-visible:text-fg"
    >
      {label}
    </button>
  );
}
