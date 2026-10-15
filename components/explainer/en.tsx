import type { Copy } from "../Explainer";
import Term from "../Term";
import { E_EN as E, S } from "./links";

// English version of nl.tsx: the same facts, no more and no less. Dutch-language link targets carry hrefLang="nl".
export const en: Copy = {
  title: "What are EREs?",
  intro: [
    "An explanation of emission reduction units for anyone who charges an electric car at home, and for anyone who wants to know what the price above is about. Point at an underlined term for a short explanation and a link to its source; all sources are listed",
    "at the bottom",
  ],
  parts: {
    what: {
      title: "What is an ERE?",
      caption:
        "1 ERE = 1 kg CO₂-eq reduction compared with the fossil reference. At the transition, 1 HBE became 46 EREs.",
      body: (
        <>
          <p>
            An{" "}
            <Term
              href={S.eres}
              hrefLang="nl"
              tip="A tradable unit representing 1 kg of CO₂ equivalent of emission reduction across the supply chain."
            >
              ERE (emissiereductie-eenheid, emission reduction unit)
            </Term>{" "}
            stands for 1 kilogram of{" "}
            <Term
              href={E.co2eq}
              tip="A measure for comparing greenhouse gases: the amount of CO₂ that causes the same amount of warming."
            >
              CO₂ equivalent
            </Term>{" "}
            of emission reduction across the supply chain, measured against a fossil reference value set at European
            level. EREs are tradable units.
          </p>
          <p>
            With the introduction of{" "}
            <Term
              href={S.red3}
              hrefLang="nl"
              tip="The revised European directive on renewable energy. The Netherlands has implemented it with EREs since 2026."
            >
              RED III
            </Term>{" "}
            in 2026, EREs replaced renewable fuel units (hernieuwbare brandstofeenheden, HBEs). 2025 was the last year
            with an{" "}
            <Term
              href={S.jaarafsluiting}
              hrefLang="nl"
              tip="The system up to and including 2025: fuel suppliers surrendered tradable HBEs every year."
            >
              annual obligation
            </Term>{" "}
            using tradable HBEs; on 1 January 2026 the{" "}
            <Term
              href={S.plichten}
              hrefLang="nl"
              tip="The obligation for fuel suppliers since 1 January 2026, expressed in EREs."
            >
              brandstoftransitieverplichting (BTV, fuel transition obligation)
            </Term>{" "}
            with EREs took effect. After the year-end closing for 2025, remaining HBEs were{" "}
            <Term
              href={S.overgang}
              hrefLang="nl"
              tip="On 1 May 2026, every remaining HBE was converted into 46 EREs of the same type."
            >
              converted into EREs
            </Term>{" "}
            of the same type on 1 May 2026, at 1&nbsp;HBE&nbsp;=&nbsp;46&nbsp;EREs.
          </p>
        </>
      ),
    },
    why: {
      title: "Why do EREs exist?",
      caption:
        "Suppliers of renewable energy receive EREs; fuel suppliers buy them, and on 1 April they are deducted. The obligation in the land sector rises every year.",
      body: (
        <>
          <p>
            The system is meant to{" "}
            <Term
              href={S.btv}
              hrefLang="nl"
              tip="The aim of the brandstoftransitie vervoer (fuel transition in transport): lower CO₂ emissions through renewable energy in transport."
            >
              bring down CO₂ emissions from transport
            </Term>{" "}
            and implements the{" "}
            <Term
              href={S.red3}
              hrefLang="nl"
              tip="Directive (EU) 2023/2413, the revised European renewable energy directive. The NEa sets out the consequences for transport."
            >
              European directive RED III
            </Term>
            . Companies that supply renewable energy to transport receive 1 ERE per kilogram of supply-chain emission
            reduction, and those EREs are tradable.
          </p>
          <p>
            <Term
              href={S.plichten}
              hrefLang="nl"
              tip="Companies that supply 500,000 litres or more of fuel a year to a transport sector. They must surrender EREs."
            >
              Fuel suppliers
            </Term>{" "}
            that supply 500,000 litres or more a year to a transport sector (land, inland shipping or maritime
            shipping) have a fuel transition obligation there, expressed in EREs. Every year on 1 April, the required
            EREs are deducted from their account in the Register Energie Vervoer (REV, Energy for Transport Register); a
            limited share may be banked.
          </p>
          <p>
            In the{" "}
            <Term
              href={S.land}
              hrefLang="nl"
              tip="Transport over land. Here the required supply-chain emission reduction rises from 14.4% in 2026 to 28.4% in 2030."
            >
              land sector
            </Term>
            , the required supply-chain emission reduction rises from 14.4% in 2026 via 16.5% (2027), 23.1% (2028) and
            25.6% (2029) to 28.4% in 2030. Only EREs from the land sector (LREs) count towards it. For ERE-E from
            electricity there is no minimum or maximum.
          </p>
          <p>
            The{" "}
            <Term
              href={E.nea}
              tip="Market master and supervisor for EREs; manages the Register Energie Vervoer (Energy for Transport Register)."
            >
              Nederlandse Emissieautoriteit (NEa, Dutch Emissions Authority)
            </Term>{" "}
            is market master and supervisor, and manages the{" "}
            <Term
              href={S.btv}
              hrefLang="nl"
              tip="Register Energie Vervoer: it holds the ERE accounts of obligated companies, registrants and traders."
            >
              REV
            </Term>
            . Only obligated companies, registrants (inboekers) and traders have an account there.
          </p>
        </>
      ),
    },
    earn: {
      title: "How do you earn EREs by charging?",
      caption:
        "You charge, the registration service provider registers: with your authorisation, based on the kWh measured at the charge point.",
      body: (
        <>
          <p>
            Electricity has its own kind of ERE: the{" "}
            <Term
              href={S.inboeken}
              hrefLang="nl"
              tip="The ERE for electricity supplied to transport, such as electricity to charge an electric car."
            >
              ERE-E
            </Term>
            . It is created by registering (inboeken) electricity supplied to transport. Previously the revenue went
            mainly to operators of{" "}
            <Term
              href={S.radar}
              hrefLang="nl"
              tip="With public charging, the party with the grid connection registers, not the EV driver. Until 2026 the revenue went mainly there."
            >
              public charge points
            </Term>
            . Since 2026,{" "}
            <Term
              href={S.idv}
              hrefLang="nl"
              tip="Companies that register the electricity you charge with the NEa on your behalf. You give them an authorisation to do so."
            >
              inboekdienstverleners (registration service providers)
            </Term>{" "}
            may also register the charging of households with their own charge point, so that private individuals can
            receive revenue too.
          </p>
          <p>
            As a private individual you may not register yourself; a registration service provider does it for you,
            with an authorisation.{" "}
            <Term
              href={S.particulieren}
              hrefLang="nl"
              tip="The NEa document with the requirements for private individuals who have their charging electricity registered."
            >
              Conditions for home charging
            </Term>
            :
          </p>
        </>
      ),
    },
    price: {
      title: "How is the price set?",
      caption:
        "No exchange but over-the-counter trading; the mid price is the average of bid and offer. At the bottom, expensive oil alternates with cheap oil: the cheaper the oil, the bigger the green premium, and according to Joulo the ERE price can rise as a result.",
      body: (
        <>
          <p>
            There is no exchange for EREs.{" "}
            <Term
              href={S.handel}
              hrefLang="nl"
              tip="Joulo registers its customers' charging sessions and is itself a market participant. The prices on this site also come from Joulo."
            >
              According to Joulo
            </Term>
            , they are traded{" "}
            <Term href={E.otc} tip="Over-the-counter: trading directly between two parties, not through an exchange.">
              over the counter (OTC)
            </Term>{" "}
            between buyer and seller, often through brokers who publish a weekly market update.
          </p>
          <p>
            The prices on this site come from the weekly{" "}
            <Term
              href={S.feed}
              hrefLang="nl"
              tip="Open data from Joulo: the bid, offer and mid price per ERE every week, under the CC BY 4.0 licence."
            >
              ERE price feed from Joulo
            </Term>
            : bid and offer prices in euros per ERE, entered by hand every week based on the LRE-E spot market. The mid
            price is the average of bid and offer. It is a price per ERE, not per kWh.
          </p>
          <p>
            Demand is growing because the obligation rises every year. According to Joulo, itself a market participant,
            the ERE price follows the{" "}
            <Term
              href={S.premie}
              tip="The cost difference between fossil and renewable fuel. According to Joulo, the ERE price follows this difference."
            >
              ‘green premium’
            </Term>
            : the cost difference between fossil and renewable fuel. Cheaper oil can therefore actually push the ERE
            price up. It is a young, thin market with sizeable swings from week to week.
          </p>
        </>
      ),
    },
    value: {
      title: "What does it earn you?",
      caption: "From 1 kWh to 0.3327 ERE, and who pays: fuel suppliers through the market, not the government.",
      body: (
        <p>
          For grid electricity delivered in 2026,{" "}
          <Term
            href={S.inboeken}
            hrefLang="nl"
            tip="The NEa page on registering electricity, with the calculation rule for ERE-E."
          >
            the NEa calculates
          </Term>
          : ERE-E = kWh × 0.505 × 183&nbsp;g/MJ × 3.6&nbsp;MJ/kWh ÷ 1000. That is 0.3327 ERE per kWh.
        </p>
      ),
      note: (
        <>
          0.505 is the share of renewable electricity in the Netherlands two years before the delivery year, as
          determined by{" "}
          <Term
            href={E.cbs}
            hrefLang="nl"
            tip="Centraal Bureau voor de Statistiek (Statistics Netherlands). CBS determines the share of renewable electricity in the Netherlands."
          >
            CBS
          </Term>{" "}
          (50.5%). So this number changes every year. 183&nbsp;g/MJ is the{" "}
          <Term
            href={S.red3}
            hrefLang="nl"
            tip="The emissions that the saving is measured against: 183 g/MJ for electricity, 94 g/MJ for biofuels."
          >
            fossil reference value
          </Term>{" "}
          for electricity; for biofuels and renewable fuels it is 94&nbsp;g/MJ. The multiplication factor of 4 that
          applied to HBEs no longer exists.
        </>
      ),
      after: (
        <>
          There is no fixed price for EREs. The registration service provider receives the EREs and can share the
          revenue with you. Some providers keep 10 to 30%, others charge a fixed subscription.{" "}
          <Term
            href={S.radar}
            hrefLang="nl"
            tip="The consumer programme of the Dutch broadcaster AVROTROS. Wrote about the ERE scheme in September 2026."
          >
            Radar
          </Term>{" "}
          mentioned a payout of 7 to 10 cents per kWh in September 2026, depending on the market. It is not a
          government subsidy: fuel suppliers pay through the market.
        </>
      ),
    },
  },
  conditions: {
    meter: (
      <>
        Your charge point has a built-in{" "}
        <Term
          href={S.particulieren}
          hrefLang="nl"
          tip="A kWh meter that meets the European Measuring Instruments Directive (MID, 2014/32/EU). The NEa requires one in the charge point."
        >
          MID-certified
        </Term>{" "}
        kWh meter. A charge point without an MID meter only counts if the{" "}
        <Term href={E.netbeheerder} tip="The company that manages the electricity grid in your area.">
          grid operator
        </Term>{" "}
        has made a split behind which only the charge point uses electricity.
      </>
    ),
    loose:
      "A separate, external MID meter is not enough: since January 2026 it has to be inside the charge point. Only companies that were already registering before 2026 get a transition year in 2026; private individuals do not.",
    grid: "You own the grid connection at your address.",
    kwh: "Only the kWh measured at the charge point count, and of those only the grid-average share of renewable electricity.",
    provider:
      "You sign up with one registration service provider at a time, with a contract of at least one full calendar year.",
  },
  card: {
    label: "Indicative, gross per kWh charged at home in 2026",
    perKwh: "per kWh",
    text: (mid, net) =>
      `Current mid price ${mid} per ERE × 0.3327 ERE per kWh, before the registration service provider's fees. With fees of 20%, for example, about ${net} per kWh is left.`,
  },
  faqTitle: "Frequently asked questions",
  faq: {
    self: {
      q: "Can I register EREs myself?",
      a: (
        <>
          No.{" "}
          <Term
            href={S.particulieren}
            hrefLang="nl"
            tip="Private individuals always need a registration service provider."
          >
            Private individuals may not register themselves
          </Term>
          . An independent registrant needs a KvK (Dutch Chamber of Commerce) registration and must register{" "}
          <Term
            href={S.inboeken}
            hrefLang="nl"
            tip="The lower limit for an independent registrant, alongside a KvK registration."
          >
            at least 2 million kWh
          </Term>{" "}
          a year. So as a private individual you need a registration service provider.
        </>
      ),
    },
    public: {
      q: "Do I get EREs when I charge in public?",
      a: (
        <>
          Not yourself. Only the party listed in the{" "}
          <Term
            href={S.secundair}
            hrefLang="nl"
            tip="The national register of all energy connections, kept by the grid operators."
          >
            Centraal Aansluitingenregister (CAR, central connection register)
          </Term>{" "}
          as the customer of the (primary) grid connection may register; a secondary allocation point alone is not
          enough. That is a legal requirement. So with public charging, the party with the connection registers, not
          the EV driver.
        </>
      ),
    },
    provider: {
      q: "What should I look for in a registration service provider?",
      a: (
        <>
          A{" "}
          <Term
            href={S.idv}
            hrefLang="nl"
            tip="Registers electricity for others. Requirement: 2 million kWh a year or 200 authorisations, with an annual check."
          >
            registration service provider
          </Term>{" "}
          must be able to register at least 2 million kWh a year or have at least 200 authorisations, and an
          independent verifier checks every year that everything is correct. The NEa does not approve or accredit
          registration service providers and does not answer questions from private individuals. An authorisation
          applies to one or more full calendar years and is not renewed automatically.{" "}
          <Term
            href={S.radar}
            hrefLang="nl"
            tip="The consumer programme of the Dutch broadcaster AVROTROS. Wrote about the ERE scheme in September 2026."
          >
            Radar
          </Term>{" "}
          warns against contracts longer than two years.
        </>
      ),
    },
    when: {
      q: "When are EREs registered?",
      a: (
        <>
          Electricity delivered in a given year can be registered{" "}
          <Term
            href={S.inboeken}
            hrefLang="nl"
            tip="Registering for a year is possible until 1 March; the year-end closing follows on 1 April."
          >
            until 1 March
          </Term>{" "}
          of the following year. The year-end closing follows on 1 April; EREs above the banking limit then expire.
        </>
      ),
    },
    law: {
      q: "What is the legal basis?",
      a: (
        <>
          In the Netherlands, the{" "}
          <Term
            href={E.rvo}
            hrefLang="nl"
            tip="The Dutch act whose titles 9.7 and 9.8 contain the rules for energy in transport. RVO (Netherlands Enterprise Agency) explains the system."
          >
            Wet milieubeheer (Environmental Management Act)
          </Term>{" "}
          (title 9.7, Hernieuwbare energie vervoer, on renewable energy for transport, and title 9.8,
          Raffinagereductie vervoersbrandstoffen, on refinery reduction for transport fuels), the Besluit energie
          vervoer (Energy for Transport Decree) and the Regeling energie vervoer (Energy for Transport Regulation); at
          European level,{" "}
          <Term
            href={S.red3}
            hrefLang="nl"
            tip="The revised European renewable energy directive. The NEa explains what changes for transport."
          >
            Directive (EU) 2023/2413 (RED III)
          </Term>
          . The act of 1 April 2026 amending the Wet milieubeheer and the Wet op de accijns (Excise Act), and the decree
          of 19 May 2026 amending the Besluit energie vervoer (Stb. 2026, 117), entered into force on 20 June 2026 with
          retroactive effect to 1 January 2026 (Stb. 2026, 137; except for one provision of the act). The official
          texts are listed under the sources.
        </>
      ),
    },
  },
  sourcesTitle: "Sources",
  sources: [
    ["NEa – EREs (in Dutch)", S.eres],
    ["NEa – What is the fuel transition in transport? (in Dutch)", S.btv],
    ["NEa – Main RED III changes (in Dutch)", S.red3],
    ["NEa – First results of the 2025 year-end closing (in Dutch)", S.jaarafsluiting],
    ["NEa – Transition from HBE to ERE: rules and provisions (in Dutch)", S.overgang],
    ["NEa – Fuel transition obligations (in Dutch)", S.plichten],
    ["NEa – Fuel deliveries in the land sector (in Dutch)", S.land],
    ["NEa – Registering electricity (in Dutch)", S.inboeken],
    ["NEa – Registration service providers (in Dutch)", S.idv],
    ["NEa – Registering electricity by private individuals (in Dutch)", S.particulieren],
    ["NEa – Registering from a secondary allocation point (in Dutch)", S.secundair],
    ["Wet milieubeheer, Environmental Management Act (wetten.overheid.nl, in Dutch)", S.wm],
    ["Staatsblad 2026, 117 – amendment of the Besluit energie vervoer (in Dutch)", S.stb117],
    ["Staatsblad 2026, 137 – entry into force (in Dutch)", S.stb137],
    ["Rijksoverheid – Can I earn money with my own charge point? (in Dutch)", S.rijksoverheid],
    ["Radar – Earning money by charging your electric car at home (in Dutch)", S.radar],
    ["Joulo – Trading in ERE (in Dutch)", S.handel],
    ["Joulo – ERE price feed (in Dutch)", S.feed],
    ["Joulo – ERE revenue feed (in Dutch)", S.opbrengst],
    ["Joulo – Why the ERE price rose 7%", S.premie],
  ],
};
