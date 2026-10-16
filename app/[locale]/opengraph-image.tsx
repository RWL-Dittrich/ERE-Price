import type { Locale } from "next-intl";
import { ImageResponse } from "next/og";
import { getFormatter, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ERE_PER_KWH } from "@/lib/earnings";
import { getErePrices } from "@/lib/ere";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { weekLabel } from "@/lib/week";

// The share preview (WhatsApp, LinkedIn, X, …): this week's price on the dark theme. Rebuilt with the page's cache.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The dark theme from globals.css: an ImageResponse can't read CSS variables.
const PAGE = "#0b0f0d";
const FG = "#e9efeb";
const MUTED = "#9aa69f";
const ACCENT = "#16a34a";

async function figures(locale: Locale) {
  const { current } = await getErePrices();
  const format = await getFormatter({ locale });
  return {
    week: weekLabel(current),
    price: format.number(current.mid, "price"),
    perKwh: format.number(current.mid * ERE_PER_KWH, "price"),
  };
}

// Prerendered per locale, like the page, instead of drawn on every request.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// One alt for both languages: generateImageMetadata runs before the locale is known, so it can't translate.
export const alt = `${SITE_NAME}: ERE-prijs per week / ERE price per week`;

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.image" });
  const tHero = await getTranslations({ locale, namespace: "Hero" });
  const { week, price, perKwh } = await figures(locale);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: PAGE,
        color: FG,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 44, fontWeight: 700 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill={ACCENT} />
            <path d="M18 5 8 18h7l-1 9 10-13h-7z" fill="#fff" />
          </svg>
          {SITE_NAME}
        </div>
        <div style={{ display: "flex", fontSize: 34, color: ACCENT }}>{week}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 38, color: MUTED }}>{tHero("title")}</div>
        {/* Bottom-aligned with line-height 1: the image renderer has no baseline alignment. */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 28, margin: "20px 0 28px" }}>
          <div style={{ display: "flex", fontSize: 168, lineHeight: 1, letterSpacing: -4 }}>{price}</div>
          <div style={{ display: "flex", fontSize: 48, lineHeight: 1, color: MUTED, paddingBottom: 6 }}>
            {tHero("perEre")}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 42 }}>{t("perKwh", { perKwh })}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: MUTED }}>
        <div style={{ display: "flex" }}>{new URL(SITE_URL).host}</div>
        <div style={{ display: "flex" }}>{t("source")}</div>
      </div>
    </div>,
    size,
  );
}
