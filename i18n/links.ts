// Every external link in the explainer, with the language of the page it opens and the site it belongs to. The
// site names ("de NEa", "Wikipedia") and the "in Dutch" notes are translated in messages/<locale>.json → Links.

export type Site = "nea" | "wikipedia" | "cbs" | "rvo" | "radar" | "joulo" | "overheid";

export type Link = {
  url: string;
  /** Language of the linked page: a card adds "(in Dutch)" or "(Engelstalig)" when it differs from the page's. */
  lang: "nl" | "en";
  site: Site;
};

/** A link with a version for each page language, where the same thing is explained in both languages. */
type LocalizedLink = { nl: Link; en: Link };

const dutch = (site: Site, url: string): Link => ({ url, lang: "nl", site });
const english = (site: Site, url: string): Link => ({ url, lang: "en", site });

const NEA_ERE = "https://www.emissieautoriteit.nl/regelgeving/hernieuwbare-energie-voor-vervoer-eres";
const NEA_NEWS = "https://www.emissieautoriteit.nl/actueel/nieuws/2026";

/**
 * The sources behind the explainer's claims, all fact-checked, in the order of the sources list. Their labels are
 * in messages/<locale>.json → Sources.
 */
export const sources = {
  neaEres: dutch("nea", `${NEA_ERE}/wat-is-de-brandstoftransitie-vervoer/eres`),
  neaFuelTransition: dutch("nea", `${NEA_ERE}/wat-is-de-brandstoftransitie-vervoer`),
  neaRed3Changes: dutch("nea", `${NEA_ERE}/ontwikkelingen/belangrijkste-red3-veranderingen`),
  neaYearEnd2025: dutch("nea", `${NEA_NEWS}/04/14/eerste-resultaten-jaarafsluiting-2025`),
  neaHbeToEre: dutch("nea", `${NEA_NEWS}/03/05/overgang-hbe-naar-ere-regels-en-bepalingen`),
  neaObligations: dutch("nea", `${NEA_ERE}/brandstoftransitieverplichtingen`),
  neaLandSector: dutch("nea", `${NEA_ERE}/brandstoftransitieverplichtingen/brandstofleveringen-sector-land`),
  neaRegisteringElectricity: dutch("nea", `${NEA_ERE}/inboeken-hernieuwbare-energie-vervoer/inboeken-elektriciteit`),
  neaRegistrationProviders: dutch("nea", `${NEA_ERE}/inboeken-hernieuwbare-energie-vervoer/inboekdienstverleners`),
  neaPrivateIndividuals: dutch(
    "nea",
    "https://www.emissieautoriteit.nl/documenten/2026/02/02/inboeken-elektriciteit-particulieren",
  ),
  neaSecondaryAllocationPoint: dutch(
    "nea",
    "https://www.emissieautoriteit.nl/vraag-en-antwoord/faq-he/ik-lever-elektriciteit-vanaf-een-secundair-allocatiepunt-kan-ik-inboeker-worden",
  ),
  environmentalManagementAct: dutch("overheid", "https://wetten.overheid.nl/BWBR0003245/"),
  staatsblad2026_117: dutch("overheid", "https://zoek.officielebekendmakingen.nl/stb-2026-117.html"),
  staatsblad2026_137: dutch("overheid", "https://zoek.officielebekendmakingen.nl/stb-2026-137.html"),
  rijksoverheidChargePointIncome: dutch(
    "overheid",
    "https://www.rijksoverheid.nl/vraag-en-antwoord/energie-thuis/kan-ik-geld-verdienen-met-mijn-eigen-laadpaal",
  ),
  radarHomeCharging: dutch(
    "radar",
    "https://radar.avrotros.nl/artikel/geld-verdienen-met-je-elektrische-auto-thuis-opladen-zo-werkt-de-ere-regeling-62972",
  ),
  jouloTrading: dutch("joulo", "https://joulo.nl/handel-in-ere"),
  jouloPriceFeed: dutch("joulo", "https://developer.joulo.nl/guides/ere-price-feed"),
  jouloYieldFeed: dutch("joulo", "https://developer.joulo.nl/guides/ere-opbrengst-feed"),
  jouloGreenPremium: english("joulo", "https://joulo.nl/en/blog/why-the-ere-price-rose-7-percent"),
} satisfies Record<string, Link>;

export type SourceId = keyof typeof sources;

/**
 * Background reading for terms (not sources of claims): pages a general reader can follow, in the page language
 * where one exists. Raw legal texts (EUR-Lex and the like) are left out on purpose.
 */
const glossary = {
  co2Equivalent: {
    nl: dutch("wikipedia", "https://nl.wikipedia.org/wiki/Koolstofdioxide-equivalent"),
    en: english("wikipedia", "https://en.wikipedia.org/wiki/Global_warming_potential#Carbon_dioxide_equivalent"),
  },
  overTheCounter: {
    nl: dutch("wikipedia", "https://nl.wikipedia.org/wiki/Over-the-counter_(financieel)"),
    en: english("wikipedia", "https://en.wikipedia.org/wiki/Over-the-counter_(finance)"),
  },
  gridOperator: {
    nl: dutch("wikipedia", "https://nl.wikipedia.org/wiki/Netbeheerder"),
    en: english("wikipedia", "https://en.wikipedia.org/wiki/Distribution_network_operator"),
  },
  nea: {
    nl: dutch("nea", "https://www.emissieautoriteit.nl/"),
    en: english("nea", "https://www.emissionsauthority.nl/"),
  },
  // No English versions of these two.
  legalFramework: dutch("rvo", "https://www.rvo.nl/onderwerpen/bio-energie/vervoer"),
  renewableShare: dutch(
    "cbs",
    "https://www.cbs.nl/nl-nl/longread/rapportages/2025/hernieuwbare-energie-in-nederland-2024/samenvatting",
  ),
} satisfies Record<string, Link | LocalizedLink>;

/**
 * What each term in the explainer links to. In the messages a term is a tag around its words, e.g.
 * "<ereUnit>ERE (emissiereductie-eenheid)</ereUnit>", and its one-line explanation is Terms.ereUnit.
 */
export const termLinks = {
  // Part 01: what is an ERE
  ereUnit: sources.neaEres,
  co2Equivalent: glossary.co2Equivalent,
  red3: sources.neaRed3Changes,
  annualObligation: sources.neaYearEnd2025,
  fuelTransitionObligation: sources.neaObligations,
  hbeConversion: sources.neaHbeToEre,
  // Part 02: why EREs exist
  transportEmissions: sources.neaFuelTransition,
  red3Directive: sources.neaRed3Changes,
  fuelSuppliers: sources.neaObligations,
  landSector: sources.neaLandSector,
  nea: glossary.nea,
  rev: sources.neaFuelTransition,
  // Part 03: earning EREs by charging
  ereE: sources.neaRegisteringElectricity,
  publicChargePoints: sources.radarHomeCharging,
  registrationProviders: sources.neaRegistrationProviders,
  homeChargingConditions: sources.neaPrivateIndividuals,
  midCertified: sources.neaPrivateIndividuals,
  gridOperator: glossary.gridOperator,
  // Part 04: how the price is set
  joulo: sources.jouloTrading,
  overTheCounter: glossary.overTheCounter,
  priceFeed: sources.jouloPriceFeed,
  greenPremium: sources.jouloGreenPremium,
  // Part 05: what it earns
  neaFormula: sources.neaRegisteringElectricity,
  cbs: glossary.renewableShare,
  fossilReference: sources.neaRed3Changes,
  radar: sources.radarHomeCharging,
  // FAQ
  noSelfRegistration: sources.neaPrivateIndividuals,
  minimumVolume: sources.neaRegisteringElectricity,
  connectionRegister: sources.neaSecondaryAllocationPoint,
  providerRequirements: sources.neaRegistrationProviders,
  registrationDeadline: sources.neaRegisteringElectricity,
  environmentalAct: glossary.legalFramework,
  red3Law: sources.neaRed3Changes,
} satisfies Record<string, Link | LocalizedLink>;

export type TermId = keyof typeof termLinks;

/** The link for a term on a page in the given language ("nl" or "en"). */
export function termLink(id: TermId, language: "nl" | "en"): Link {
  const link: Link | LocalizedLink = termLinks[id];
  return "url" in link ? link : link[language];
}
