import type { Copy } from "../Explainer";
import Term from "../Term";
import { E, S } from "./links";

// Fact-checked against the sources in links.ts. en.tsx says exactly the same in English; change both together.
export const nl: Copy = {
  title: "Wat zijn ERE's?",
  intro: [
    "Uitleg over emissiereductie-eenheden voor wie thuis een elektrische auto laadt, en voor iedereen die wil weten waar de prijs hierboven over gaat. Wijs een onderstreept begrip aan voor een korte uitleg en een link naar de bron; alle bronnen staan",
    "onderaan",
  ],
  parts: {
    what: {
      title: "Wat is een ERE?",
      caption: "1 ERE = 1 kg CO₂-eq reductie ten opzichte van de fossiele referentie. Bij de overgang werd 1 HBE 46 ERE.",
      body: (
        <>
          <p>
            Een{" "}
            <Term href={S.eres} tip="Een verhandelbare eenheid die staat voor 1 kg CO₂-equivalent aan emissiereductie in de keten.">
              ERE (emissiereductie-eenheid)
            </Term>{" "}
            staat voor 1 kilogram{" "}
            <Term
              href={E.co2eq}
              tip="Maat om broeikasgassen te vergelijken: de hoeveelheid CO₂ die evenveel opwarming veroorzaakt."
            >
              CO₂-equivalent
            </Term>{" "}
            aan emissiereductie in de keten, gemeten ten opzichte van een Europees vastgestelde fossiele
            referentiewaarde. ERE&apos;s zijn verhandelbare eenheden.
          </p>
          <p>
            Met de invoering van{" "}
            <Term href={S.red3} tip="De herziene Europese richtlijn voor hernieuwbare energie. Nederland voert die sinds 2026 uit met ERE's.">
              RED III
            </Term>{" "}
            in 2026 vervingen ERE&apos;s de hernieuwbare brandstofeenheden (HBE&apos;s). 2025 was het laatste jaar met
            een{" "}
            <Term href={S.jaarafsluiting} tip="Het systeem tot en met 2025: brandstofleveranciers leverden elk jaar verhandelbare HBE's in.">
              jaarverplichting
            </Term>{" "}
            met verhandelbare HBE&apos;s; op 1 januari 2026 ging de{" "}
            <Term
              href={S.plichten}
              tip="De verplichting voor brandstofleveranciers sinds 1 januari 2026, uitgedrukt in ERE's."
            >
              brandstoftransitieverplichting (BTV)
            </Term>{" "}
            met ERE&apos;s in. Resterende HBE&apos;s zijn na de jaarafsluiting over 2025 op 1 mei 2026{" "}
            <Term href={S.overgang} tip="Op 1 mei 2026 werd elke resterende HBE omgezet in 46 ERE van hetzelfde soort.">
              omgezet naar ERE&apos;s
            </Term>{" "}
            van hetzelfde soort, tegen 1&nbsp;HBE&nbsp;=&nbsp;46&nbsp;ERE.
          </p>
        </>
      ),
    },
    why: {
      title: "Waarom bestaan ERE's?",
      caption:
        "Leveranciers van hernieuwbare energie krijgen ERE's; brandstofleveranciers kopen ze en op 1 april worden ze afgeschreven. De verplichting in de sector land stijgt elk jaar.",
      body: (
        <>
          <p>
            Het systeem moet de{" "}
            <Term
              href={S.btv}
              tip="Het doel van de brandstoftransitie vervoer: minder CO₂-uitstoot door hernieuwbare energie in vervoer."
            >
              CO₂-uitstoot van vervoer omlaag brengen
            </Term>{" "}
            en voert de{" "}
            <Term
              href={S.red3}
              tip="Richtlijn (EU) 2023/2413, de herziene Europese richtlijn hernieuwbare energie. De NEa zet de gevolgen voor vervoer op een rij."
            >
              Europese richtlijn RED III
            </Term>{" "}
            uit. Bedrijven die hernieuwbare energie aan vervoer leveren, krijgen 1 ERE per kilogram
            ketenemissiereductie, en die ERE&apos;s zijn verhandelbaar.
          </p>
          <p>
            <Term
              href={S.plichten}
              tip="Bedrijven die per jaar 500.000 liter of meer brandstof aan een vervoerssector leveren. Zij moeten ERE's inleveren."
            >
              Brandstofleveranciers
            </Term>{" "}
            die per jaar 500.000 liter of meer leveren aan een vervoerssector (land, binnenvaart of zeevaart), hebben
            daar een brandstoftransitieverplichting, uitgedrukt in ERE&apos;s. Elk jaar op 1 april worden de benodigde
            ERE&apos;s van hun rekening in het Register Energie Vervoer (REV) afgeschreven; een beperkt deel mag worden
            gespaard.
          </p>
          <p>
            In de{" "}
            <Term
              href={S.land}
              tip="Vervoer over land. Hier stijgt de verplichte ketenemissiereductie van 14,4% in 2026 naar 28,4% in 2030."
            >
              sector land
            </Term>{" "}
            loopt de verplichte ketenemissiereductie op van 14,4% in 2026 via 16,5% (2027), 23,1% (2028) en 25,6%
            (2029) naar 28,4% in 2030. Alleen ERE&apos;s uit de sector land (LRE&apos;s) tellen daarvoor mee. Voor ERE-E
            uit elektriciteit geldt geen minimum of maximum.
          </p>
          <p>
            De{" "}
            <Term href={E.nea} tip="Marktmeester en toezichthouder voor ERE's; beheert het Register Energie Vervoer.">
              Nederlandse Emissieautoriteit (NEa)
            </Term>{" "}
            is marktmeester en toezichthouder en beheert het{" "}
            <Term
              href={S.btv}
              tip="Register Energie Vervoer: hier staan de ERE-rekeningen van verplichte bedrijven, inboekers en handelaren."
            >
              REV
            </Term>
            . Alleen verplichte bedrijven, inboekers en handelaren hebben daar een rekening.
          </p>
        </>
      ),
    },
    earn: {
      title: "Hoe verdien je ERE's met laden?",
      caption:
        "Jij laadt, de inboekdienstverlener boekt in: met jouw machtiging, op basis van de gemeten kWh bij de laadpaal.",
      body: (
        <>
          <p>
            Elektriciteit heeft een eigen soort ERE: de{" "}
            <Term href={S.inboeken} tip="De ERE voor elektriciteit die aan vervoer is geleverd, zoals stroom om een elektrische auto te laden.">
              ERE-E
            </Term>
            . Die ontstaat door stroom die aan vervoer is geleverd in te boeken. Eerder ging de opbrengst vooral naar
            exploitanten van{" "}
            <Term
              href={S.radar}
              tip="Bij openbaar laden boekt de partij met de netaansluiting in, niet de EV-rijder. Tot 2026 ging de opbrengst vooral daarheen."
            >
              openbare laadpalen
            </Term>
            . Sinds 2026 mogen{" "}
            <Term
              href={S.idv}
              tip="Bedrijven die namens jou de geladen stroom inboeken bij de NEa. Daarvoor geef je ze een machtiging."
            >
              inboekdienstverleners
            </Term>{" "}
            ook het laden van huishoudens met een eigen laadpaal inboeken, zodat ook particulieren opbrengst kunnen
            krijgen.
          </p>
          <p>
            Zelf inboeken mag je als particulier niet; een inboekdienstverlener doet dat voor je, met een machtiging.{" "}
            <Term
              href={S.particulieren}
              tip="Het NEa-document met de eisen voor particulieren die hun laadstroom laten inboeken."
            >
              Voorwaarden voor thuisladen
            </Term>
            :
          </p>
        </>
      ),
    },
    price: {
      title: "Hoe komt de prijs tot stand?",
      caption:
        "Geen beurs maar onderhandse handel; de middenprijs is het gemiddelde van bied en laat. Onderaan wisselt dure olie met goedkope: hoe goedkoper de olie, hoe groter de groene premie, en volgens Joulo kan de ERE-prijs daardoor stijgen.",
      body: (
        <>
          <p>
            Er is geen beurs voor ERE&apos;s.{" "}
            <Term
              href={S.handel}
              tip="Joulo boekt laadsessies van klanten in en is zelf marktpartij. De prijzen op deze site komen ook van Joulo."
            >
              Volgens Joulo
            </Term>{" "}
            worden ze{" "}
            <Term href={E.otc} tip="Over-the-counter: handel rechtstreeks tussen twee partijen, niet via een beurs.">
              onderhands (OTC)
            </Term>{" "}
            verhandeld tussen koper en verkoper, vaak via brokers die wekelijks een marktupdate publiceren.
          </p>
          <p>
            De prijzen op deze site komen uit de wekelijkse{" "}
            <Term
              href={S.feed}
              tip="Open data van Joulo: elke week de bied-, laat- en middenprijs per ERE, onder licentie CC BY 4.0."
            >
              ERE-prijsfeed van Joulo
            </Term>
            : bied- en laatprijzen in euro per ERE, elke week handmatig ingevoerd op basis van de LRE-E-spotmarkt. De
            middenprijs is het gemiddelde van bied en laat. Het is een prijs per ERE, niet per kWh.
          </p>
          <p>
            De vraag groeit doordat de verplichting elk jaar stijgt. Volgens Joulo, zelf marktpartij, volgt de
            ERE-prijs de{" "}
            <Term
              href={S.premie}
              hrefLang="en"
              tip="Het kostenverschil tussen fossiele en hernieuwbare brandstof. Volgens Joulo volgt de ERE-prijs dit verschil."
            >
              ‘groene premie’
            </Term>
            : het kostenverschil tussen fossiele en hernieuwbare brandstof. Goedkopere olie kan de ERE-prijs daardoor
            juist opdrijven. Het is een jonge, dunne markt met flinke schommelingen van week tot week.
          </p>
        </>
      ),
    },
    value: {
      title: "Wat levert het op?",
      caption: "Van 1 kWh naar 0,3327 ERE, en wie er betaalt: brandstofleveranciers via de markt, niet de overheid.",
      body: (
        <p>
          Voor stroom uit het net die in 2026 is geleverd,{" "}
          <Term href={S.inboeken} tip="De NEa-pagina over inboeken van elektriciteit, met de rekenregel voor ERE-E.">
            rekent de NEa
          </Term>
          : ERE-E = kWh × 0,505 × 183&nbsp;g/MJ × 3,6&nbsp;MJ/kWh ÷ 1000. Dat is 0,3327 ERE per kWh.
        </p>
      ),
      note: (
        <>
          0,505 is het aandeel hernieuwbare stroom in Nederland van twee jaar vóór het leverjaar, vastgesteld door het{" "}
          <Term
            href={E.cbs}
            tip="Centraal Bureau voor de Statistiek. Het CBS stelt het aandeel hernieuwbare stroom in Nederland vast."
          >
            CBS
          </Term>{" "}
          (50,5%). Dit getal verandert dus elk jaar. 183&nbsp;g/MJ is de{" "}
          <Term
            href={S.red3}
            tip="De uitstoot waartegen de besparing wordt gemeten: 183 g/MJ voor elektriciteit, 94 g/MJ voor biobrandstoffen."
          >
            fossiele referentiewaarde
          </Term>{" "}
          voor elektriciteit; voor biobrandstoffen en hernieuwbare brandstoffen is dat 94&nbsp;g/MJ. De
          vermenigvuldigingsfactor 4 die voor HBE&apos;s gold, bestaat niet meer.
        </>
      ),
      after: (
        <>
          Er is geen vaste prijs voor ERE&apos;s. De inboekdienstverlener krijgt de ERE&apos;s en kan de opbrengst met
          je delen. Sommige aanbieders houden 10 tot 30% in, andere rekenen een vast abonnement.{" "}
          <Term href={S.radar} tip="Het consumentenprogramma van AVROTROS. Schreef in september 2026 over de ERE-regeling.">
            Radar
          </Term>{" "}
          noemde in september 2026 een uitbetaling van 7 tot 10 cent per kWh, afhankelijk van de markt. Het is geen
          subsidie van de overheid: brandstofleveranciers betalen via de markt.
        </>
      ),
    },
  },
  conditions: {
    meter: (
      <>
        Je laadpaal heeft een ingebouwde{" "}
        <Term
          href={S.particulieren}
          tip="Een kWh-meter die voldoet aan de Europese richtlijn voor meetinstrumenten (MID, 2014/32/EU). De NEa eist er een in de laadpaal."
        >
          MID-gecertificeerde
        </Term>{" "}
        kWh-meter. Een laadpaal zonder MID-meter telt alleen als de{" "}
        <Term href={E.netbeheerder} tip="Het bedrijf dat het elektriciteitsnet in jouw regio beheert.">
          netbeheerder
        </Term>{" "}
        een splitsing heeft gemaakt waarachter alleen de laadpaal stroom verbruikt.
      </>
    ),
    loose:
      "Een losse, externe MID-meter volstaat niet: sinds januari 2026 moet die in de laadpaal zitten. Alleen bedrijven die al vóór 2026 inboekten, krijgen in 2026 een overgangsjaar; particulieren niet.",
    grid: "Je bent eigenaar van de netaansluiting op je adres.",
    kwh: "Alleen de gemeten kWh bij de laadpaal tellen, en daarvan alleen het netgemiddelde aandeel hernieuwbare stroom.",
    provider:
      "Je meldt je bij één inboekdienstverlener tegelijk aan, met een contract van minimaal één heel kalenderjaar.",
  },
  card: {
    label: "Indicatief, bruto per kWh thuisladen in 2026",
    perKwh: "per kWh",
    text: (mid, net) =>
      `Huidige middenprijs ${mid} per ERE × 0,3327 ERE per kWh, vóór kosten van de inboekdienstverlener. Bij bijvoorbeeld 20% kosten blijft ongeveer ${net} per kWh over.`,
  },
  faqTitle: "Veelgestelde vragen",
  faq: {
    self: {
      q: "Kan ik zelf ERE's inboeken?",
      a: (
        <>
          Nee.{" "}
          <Term href={S.particulieren} tip="Particulieren hebben altijd een inboekdienstverlener nodig.">
            Particulieren mogen niet zelf inboeken
          </Term>
          . Een zelfstandige inboeker heeft een KvK-inschrijving nodig en moet{" "}
          <Term href={S.inboeken} tip="De ondergrens voor een zelfstandige inboeker, naast een KvK-inschrijving.">
            minimaal 2 miljoen kWh
          </Term>{" "}
          per jaar inboeken. Als particulier heb je dus een inboekdienstverlener nodig.
        </>
      ),
    },
    public: {
      q: "Krijg ik ERE's als ik openbaar laad?",
      a: (
        <>
          Niet zelf. Alleen de partij die in het{" "}
          <Term
            href={S.secundair}
            tip="Het landelijke register van alle energieaansluitingen, bijgehouden door de netbeheerders."
          >
            Centraal Aansluitingenregister (CAR)
          </Term>{" "}
          als afnemer van de (primaire) netaansluiting staat, mag inboeken; een secundair allocatiepunt alleen is niet
          genoeg. Dat is een wettelijke eis. Bij openbaar laden boekt dus de partij met de aansluiting in, niet de
          EV-rijder.
        </>
      ),
    },
    provider: {
      q: "Waar let ik op bij een inboekdienstverlener?",
      a: (
        <>
          Een{" "}
          <Term
            href={S.idv}
            tip="Boekt stroom in voor anderen. Eis: 2 miljoen kWh per jaar of 200 machtigingen, met een jaarlijkse controle."
          >
            inboekdienstverlener
          </Term>{" "}
          moet minimaal 2 miljoen kWh per jaar kunnen inboeken of ten minste 200 machtigingen hebben, en een
          onafhankelijke verificateur controleert elk jaar of alles klopt. De NEa keurt inboekdienstverleners niet
          goed, accrediteert ze niet en beantwoordt geen vragen van particulieren. Een machtiging geldt voor één of meer
          volledige kalenderjaren en wordt niet automatisch verlengd.{" "}
          <Term href={S.radar} tip="Het consumentenprogramma van AVROTROS. Schreef in september 2026 over de ERE-regeling.">
            Radar
          </Term>{" "}
          waarschuwt voor contracten van langer dan twee jaar.
        </>
      ),
    },
    when: {
      q: "Wanneer worden ERE's ingeboekt?",
      a: (
        <>
          Stroom die in een jaar is geleverd, kan{" "}
          <Term href={S.inboeken} tip="Inboeken over een jaar kan tot 1 maart; op 1 april volgt de jaarafsluiting.">
            tot 1 maart
          </Term>{" "}
          van het jaar erna worden ingeboekt. Op 1 april volgt de jaarafsluiting; ERE&apos;s boven de spaarlimiet
          vervallen dan.
        </>
      ),
    },
    law: {
      q: "Wat is de wettelijke basis?",
      a: (
        <>
          In Nederland de{" "}
          <Term
            href={E.rvo}
            tip="De Nederlandse wet waarvan titel 9.7 en 9.8 de regels voor energie in vervoer bevatten. RVO legt het stelsel uit."
          >
            Wet milieubeheer
          </Term>{" "}
          (titel 9.7, Hernieuwbare energie vervoer, en titel 9.8, Raffinagereductie vervoersbrandstoffen), het Besluit
          energie vervoer en de Regeling energie vervoer; Europees{" "}
          <Term href={S.red3} tip="De herziene Europese richtlijn hernieuwbare energie. De NEa legt uit wat er voor vervoer verandert.">
            Richtlijn (EU) 2023/2413 (RED III)
          </Term>
          . De wet van 1 april 2026 die de Wet milieubeheer en de Wet op de accijns aanpast, en het besluit van 19 mei
          2026 dat het Besluit energie vervoer aanpast (Stb. 2026, 117), zijn op 20 juni 2026 in werking getreden met
          terugwerkende kracht tot 1 januari 2026 (Stb. 2026, 137; één bepaling van de wet uitgezonderd). De officiële
          teksten staan bij de bronnen.
        </>
      ),
    },
  },
  sourcesTitle: "Bronnen",
  sources: [
    ["NEa – ERE's", S.eres],
    ["NEa – Wat is de brandstoftransitie vervoer?", S.btv],
    ["NEa – Belangrijkste RED III-veranderingen", S.red3],
    ["NEa – Eerste resultaten jaarafsluiting 2025", S.jaarafsluiting],
    ["NEa – Overgang HBE naar ERE: regels en bepalingen", S.overgang],
    ["NEa – Brandstoftransitieverplichtingen", S.plichten],
    ["NEa – Brandstofleveringen sector land", S.land],
    ["NEa – Inboeken elektriciteit", S.inboeken],
    ["NEa – Inboekdienstverleners", S.idv],
    ["NEa – Inboeken elektriciteit door particulieren", S.particulieren],
    ["NEa – Inboeken vanaf een secundair allocatiepunt", S.secundair],
    ["Wet milieubeheer (wetten.overheid.nl)", S.wm],
    ["Staatsblad 2026, 117 – wijziging Besluit energie vervoer", S.stb117],
    ["Staatsblad 2026, 137 – inwerkingtreding", S.stb137],
    ["Rijksoverheid – Kan ik geld verdienen met mijn eigen laadpaal?", S.rijksoverheid],
    ["Radar – Geld verdienen met je elektrische auto thuis opladen", S.radar],
    ["Joulo – Handel in ERE", S.handel],
    ["Joulo – ERE-prijsfeed", S.feed],
    ["Joulo – ERE-opbrengst-feed", S.opbrengst],
    ["Joulo – Why the ERE price rose 7% (Engels)", S.premie],
  ],
};
