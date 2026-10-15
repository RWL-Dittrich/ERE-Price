const NEA = "https://www.emissieautoriteit.nl/regelgeving/hernieuwbare-energie-voor-vervoer-eres";
// Sources behind the claims (fact-checked), listed under "Bronnen" and linked inline from the text. All are Dutch
// pages except premie (English).
export const S = {
  eres: `${NEA}/wat-is-de-brandstoftransitie-vervoer/eres`,
  btv: `${NEA}/wat-is-de-brandstoftransitie-vervoer`,
  red3: `${NEA}/ontwikkelingen/belangrijkste-red3-veranderingen`,
  jaarafsluiting: "https://www.emissieautoriteit.nl/actueel/nieuws/2026/04/14/eerste-resultaten-jaarafsluiting-2025",
  overgang: "https://www.emissieautoriteit.nl/actueel/nieuws/2026/03/05/overgang-hbe-naar-ere-regels-en-bepalingen",
  plichten: `${NEA}/brandstoftransitieverplichtingen`,
  land: `${NEA}/brandstoftransitieverplichtingen/brandstofleveringen-sector-land`,
  inboeken: `${NEA}/inboeken-hernieuwbare-energie-vervoer/inboeken-elektriciteit`,
  idv: `${NEA}/inboeken-hernieuwbare-energie-vervoer/inboekdienstverleners`,
  particulieren: "https://www.emissieautoriteit.nl/documenten/2026/02/02/inboeken-elektriciteit-particulieren",
  secundair:
    "https://www.emissieautoriteit.nl/vraag-en-antwoord/faq-he/ik-lever-elektriciteit-vanaf-een-secundair-allocatiepunt-kan-ik-inboeker-worden",
  wm: "https://wetten.overheid.nl/BWBR0003245/",
  stb117: "https://zoek.officielebekendmakingen.nl/stb-2026-117.html",
  stb137: "https://zoek.officielebekendmakingen.nl/stb-2026-137.html",
  rijksoverheid:
    "https://www.rijksoverheid.nl/vraag-en-antwoord/energie-thuis/kan-ik-geld-verdienen-met-mijn-eigen-laadpaal",
  radar:
    "https://radar.avrotros.nl/artikel/geld-verdienen-met-je-elektrische-auto-thuis-opladen-zo-werkt-de-ere-regeling-62972",
  handel: "https://joulo.nl/handel-in-ere",
  feed: "https://developer.joulo.nl/guides/ere-price-feed",
  opbrengst: "https://developer.joulo.nl/guides/ere-opbrengst-feed",
  premie: "https://joulo.nl/en/blog/why-the-ere-price-rose-7-percent",
};
// Background explanations of terms (not sources of claims), linked inline only. Pick pages a general reader can
// follow; raw legal texts (EUR-Lex) were dropped for that reason.
export const E = {
  co2eq: "https://nl.wikipedia.org/wiki/Koolstofdioxide-equivalent",
  // RVO explains the legal framework (Wet milieubeheer 9.7/9.8, Besluit and Regeling energie vervoer, BTV) plainly.
  rvo: "https://www.rvo.nl/onderwerpen/bio-energie/vervoer",
  netbeheerder: "https://nl.wikipedia.org/wiki/Netbeheerder",
  otc: "https://nl.wikipedia.org/wiki/Over-the-counter_(financieel)",
  cbs: "https://www.cbs.nl/nl-nl/longread/rapportages/2025/hernieuwbare-energie-in-nederland-2024/samenvatting",
  nea: "https://www.emissieautoriteit.nl/",
};
// The same for English pages: English equivalents where a good one exists. RVO and CBS have none, so those stay Dutch.
export const E_EN = {
  ...E,
  co2eq: "https://en.wikipedia.org/wiki/Global_warming_potential#Carbon_dioxide_equivalent",
  netbeheerder: "https://en.wikipedia.org/wiki/Distribution_network_operator",
  otc: "https://en.wikipedia.org/wiki/Over-the-counter_(finance)",
  nea: "https://www.emissionsauthority.nl/",
};
