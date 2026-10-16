import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { termLinks } from "@/i18n/links";
import { localePath } from "@/i18n/routing";
import { FEED_URL, type ErePrices } from "@/lib/ere";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { weekLabel } from "@/lib/week";
import { FAQ_IDS } from "./Explainer";

/**
 * JSON-LD for search engines: the site, the weekly prices as a Dataset (for Google Dataset Search) and the FAQ.
 * Check it with https://search.google.com/test/rich-results after a change.
 */
export default async function StructuredData({ prices }: { prices: ErePrices }) {
  const locale = await getLocale();
  const t = await getTranslations("Meta");
  const tFaq = await getTranslations("Explainer.faq");
  const format = await getFormatter();
  const pageUrl = `${SITE_URL}${localePath(locale)}`;
  const isoDate = (ms: number) => new Date(ms).toISOString().slice(0, 10);
  // The answers' term tags become their plain words; the live price fills in like in Explainer.
  const faqValues = {
    ...Object.fromEntries(Object.keys(termLinks).map((id) => [id, (words: string) => words])),
    price: format.number(prices.current.mid, "price"),
    week: weekLabel(prices.current),
  };
  const perEre = (name: string) => ({ "@type": "PropertyValue", name, unitText: "EUR per ERE" });
  const keywords = t("keywords").split(", ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: t("alternateNames").split(", "),
        description: t("description"),
        url: SITE_URL,
        inLanguage: ["nl", "en-GB"],
      },
      {
        "@type": "Dataset",
        name: t("dataset.name"),
        description: t("dataset.description"),
        keywords,
        url: pageUrl,
        inLanguage: locale,
        isAccessibleForFree: true,
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: { "@type": "Organization", name: "Joulo", url: "https://joulo.nl" },
        spatialCoverage: { "@type": "Country", name: "NL" },
        temporalCoverage: `${isoDate(prices.weeks[0].monday)}/${isoDate(prices.current.monday)}`,
        ...(Number.isNaN(Date.parse(prices.updatedAt)) ? {} : { dateModified: prices.updatedAt }),
        variableMeasured: [perEre("bid"), perEre("offer"), perEre("mid")],
        distribution: { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: FEED_URL },
      },
      {
        "@type": "FAQPage",
        url: pageUrl,
        inLanguage: locale,
        mainEntity: FAQ_IDS.map((id) => ({
          "@type": "Question",
          name: tFaq(`${id}.question`),
          acceptedAnswer: { "@type": "Answer", text: tFaq.markup(`${id}.answer`, faqValues) },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // "<" escaped, so no text in the data can close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
