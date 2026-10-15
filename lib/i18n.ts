// Languages, interface strings and language detection. Long-form copy (the explainer, illustration labels) lives
// next to its component; this file holds the short strings that several components share.

export const LANGS = ["nl", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const isLang = (v: string | undefined): v is Lang => (LANGS as readonly (string | undefined)[]).includes(v);
// Number and date formatting per language: Dutch conventions, and British English (€0.365, 8 June 2026).
export const LOCALE: Record<Lang, string> = { nl: "nl-NL", en: "en-GB" };

// Picks the language for "/" from Accept-Language: the highest-q tag whose primary subtag we support. A Dutch
// device gets Dutch, any other language gets English; no header at all (e.g. a crawler) gets Dutch, the site's own.
export function detectLang(header: string | null): Lang {
  if (!header) return "nl";
  const tags = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { lang: tag.trim().toLowerCase().split("-")[0], q: q ? Number(q.slice(2)) : 1 };
    })
    .filter((t) => t.q > 0)
    .sort((a, b) => b.q - a.q);
  return tags.map((t) => t.lang).find(isLang) ?? "en";
}

export const dict = {
  nl: {
    meta: {
      title: "ERE prijs – actuele ERE-marktprijs",
      description:
        "De actuele en historische ERE-marktprijs in Nederland: bied-, laat- en middenprijs per emissiereductie-eenheid, per week; elk uur opgehaald bij Joulo.",
      ogLocale: "nl_NL",
    },
    header: { explainer: "Wat zijn ERE's?", language: "Taal" },
    hero: {
      title: "Actuele ERE-marktprijs (midden)",
      perEre: "per ERE",
      vs: "t.o.v.",
      up: "gestegen met",
      down: "gedaald met",
      flat: "ongewijzigd",
      bid: "Bied",
      offer: "Laat",
      bidTip: "Biedprijs: wat kopers op de LRE-E-spotmarkt deze week bieden voor één ERE.",
      offerTip:
        "Laatprijs (vraagprijs): wat verkopers deze week vragen voor één ERE. Het verschil met de biedprijs is de spread.",
      updated: "Laatst bijgewerkt:",
      high: "52 weken hoog",
      low: "52 weken laag",
      spread: "Spread",
      spreadNote: "laat – bied",
    },
    chart: {
      title: "Prijsverloop",
      sub: "Per week, in euro per ERE",
      period: "Periode",
      ranges: [
        { label: "3M", name: "3 maanden" },
        { label: "6M", name: "6 maanden" },
        { label: "1J", name: "1 jaar" },
        { label: "2J", name: "2 jaar" },
      ],
      mid: "Middenprijs",
      band: "Bied–laat",
      noJs: "De grafiek heeft JavaScript nodig. De gegevens staan onder ‘Toon gegevens als tabel’.",
      monday: "maandag",
      tipOffer: "laat",
      tipMid: "midden",
      tipBid: "bied",
      summary: (s: { range: string; n: number; from: string; fromWeek: string; to: string; toWeek: string; hi: string; hiWeek: string; lo: string; loWeek: string }) =>
        `Middenprijs per ERE over ${s.range} (${s.n} weken met data): van ${s.from} in ${s.fromWeek} naar ${s.to} in ${s.toWeek}. ` +
        `Hoogste ${s.hi} (${s.hiWeek}), laagste ${s.lo} (${s.loWeek}).`,
      table: "Toon gegevens als tabel",
      tableLabel: "ERE-prijs per week",
      caption: (range: string) => `ERE-prijs per week in euro over ${range}, nieuwste eerst`,
      week: "Week",
      colBid: "Bied",
      colMid: "Midden",
      colOffer: "Laat",
    },
    footer: {
      source: "Bron: Joulo, ERE-marktprijs per week",
      prices: "Prijzen in euro per ERE, wekelijks ingevoerd door Joulo; niet elke week heeft een notering. Data via de",
      feed: "Joulo ERE-prijsfeed",
      madeWith: "Gemaakt met",
      love: "liefde",
      by: "door",
      linkedin: "Robin Dittrich op LinkedIn",
      github: "Robin Dittrich op GitHub",
    },
    newTab: "opent in een nieuw tabblad",
    error: {
      title: "De ERE-prijs is even niet beschikbaar",
      body: "De prijsgegevens van Joulo konden niet worden opgehaald. Probeer het over een paar minuten opnieuw.",
      retry: "Opnieuw proberen",
    },
    readMore: "Lees meer bij",
    // Note on a "Lees meer" link whose page is in another language than this one (Term's hrefLang).
    inLang: { nl: "Nederlandstalig", en: "Engelstalig" },
  },
  en: {
    meta: {
      title: "ERE prijs – current Dutch ERE market price",
      description:
        "The current and historic ERE market price in the Netherlands: bid, offer and mid price per emission reduction unit, per week; fetched hourly from Joulo.",
      ogLocale: "en_GB",
    },
    header: { explainer: "What are EREs?", language: "Language" },
    hero: {
      title: "Current ERE market price (mid)",
      perEre: "per ERE",
      vs: "vs.",
      up: "up by",
      down: "down by",
      flat: "unchanged",
      bid: "Bid",
      offer: "Offer",
      bidTip: "Bid price: what buyers on the LRE-E spot market are bidding for one ERE this week.",
      offerTip:
        "Offer price (ask): what sellers are asking for one ERE this week. The gap with the bid price is the spread.",
      updated: "Last updated:",
      high: "52-week high",
      low: "52-week low",
      spread: "Spread",
      spreadNote: "offer – bid",
    },
    chart: {
      title: "Price history",
      sub: "Weekly, in euros per ERE",
      period: "Period",
      ranges: [
        { label: "3M", name: "3 months" },
        { label: "6M", name: "6 months" },
        { label: "1Y", name: "1 year" },
        { label: "2Y", name: "2 years" },
      ],
      mid: "Mid price",
      band: "Bid–offer",
      noJs: "The chart needs JavaScript. The data is under ‘Show data as a table’.",
      monday: "Monday",
      tipOffer: "offer",
      tipMid: "mid",
      tipBid: "bid",
      summary: (s: { range: string; n: number; from: string; fromWeek: string; to: string; toWeek: string; hi: string; hiWeek: string; lo: string; loWeek: string }) =>
        `Mid price per ERE over ${s.range} (${s.n} weeks with data): from ${s.from} in ${s.fromWeek} to ${s.to} in ${s.toWeek}. ` +
        `Highest ${s.hi} (${s.hiWeek}), lowest ${s.lo} (${s.loWeek}).`,
      table: "Show data as a table",
      tableLabel: "ERE price per week",
      caption: (range: string) => `ERE price per week in euros over ${range}, newest first`,
      week: "Week",
      colBid: "Bid",
      colMid: "Mid",
      colOffer: "Offer",
    },
    footer: {
      source: "Source: Joulo, ERE market price per week",
      prices: "Prices in euros per ERE, entered weekly by Joulo; not every week has a quote. Data via the",
      feed: "Joulo ERE price feed",
      madeWith: "Made with",
      love: "love",
      by: "by",
      linkedin: "Robin Dittrich on LinkedIn",
      github: "Robin Dittrich on GitHub",
    },
    newTab: "opens in a new tab",
    error: {
      title: "The ERE price is temporarily unavailable",
      body: "The price data from Joulo could not be fetched. Please try again in a few minutes.",
      retry: "Try again",
    },
    readMore: "Read more at",
    inLang: { nl: "in Dutch", en: "in English" },
  },
} satisfies Record<Lang, unknown>;
