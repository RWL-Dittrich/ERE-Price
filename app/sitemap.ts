import type { MetadataRoute } from "next";
import { getErePrices } from "@/lib/ere";
import { SITE_URL } from "@/lib/site";

/** Both language versions of the one page, each listing the other (hreflang). Last modified: the latest quote. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { updatedAt } = await getErePrices();
  const lastModified = Number.isNaN(Date.parse(updatedAt)) ? undefined : updatedAt;
  const languages = { nl: `${SITE_URL}/nl`, en: `${SITE_URL}/en`, "x-default": SITE_URL };

  return [`${SITE_URL}/nl`, `${SITE_URL}/en`].map((url) => ({
    url,
    lastModified,
    changeFrequency: "weekly",
    alternates: { languages },
  }));
}
