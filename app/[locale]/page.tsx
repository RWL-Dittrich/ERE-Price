import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import PriceChart from "@/components/chart/PriceChart";
import Explainer from "@/components/Explainer";
import Hero from "@/components/Hero";
import MotionRoot from "@/components/motion/MotionRoot";
import SiteHeader from "@/components/SiteHeader";
import StructuredData from "@/components/StructuredData";
import { UnitProvider } from "@/components/unit";
import { localePath } from "@/i18n/routing";
import { ERE_PER_KWH } from "@/lib/earnings";
import { getErePrices } from "@/lib/ere";
import { SITE_NAME } from "@/lib/site";
import { weekLabel } from "@/lib/week";

/** The title and description carry this week's price, so a search result answers "ERE prijs" by itself. */
export async function generateMetadata(): Promise<Metadata> {
  const { current } = await getErePrices();
  const t = await getTranslations("Meta");
  const format = await getFormatter();
  const values = {
    week: weekLabel(current),
    price: format.number(current.mid, "price"),
    perKwh: format.number(current.mid * ERE_PER_KWH, "price"),
    site: SITE_NAME,
  };
  const title = t("priceTitle", values);
  const description = t("priceDescription", values);

  return {
    title,
    description,
    // The image itself comes from opengraph-image.tsx.
    openGraph: {
      title,
      description,
      url: localePath(await getLocale()),
      siteName: SITE_NAME,
      locale: t("openGraphLocale"),
      type: "website",
    },
  };
}

export default async function HomePage() {
  const prices = await getErePrices();

  return (
    <>
      <StructuredData prices={prices} />
      {/* The header lives here, not in the layout: its links target #uitleg and #rekenhulp, which only exist on this page. */}
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-6">
        {/* The hero's ERE / kWh switch also sets the chart's unit. */}
        <UnitProvider>
          <Hero prices={prices} />
          <PriceChart weeks={prices.weeks} />
        </UnitProvider>
        <Explainer current={prices.current} />
      </main>

      {/* After the content, not in the layout: the page can hydrate after the layout, and MotionRoot writes into this
          content (data-inview, count-up text), which must be hydrated by then. */}
      <MotionRoot />
    </>
  );
}
