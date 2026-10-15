import { getLang } from "@/lib/lang.server";
import { Plate, d } from "./svg";

function Person({ cx, label }: { cx: number; label: string }) {
  return (
    <>
      <circle cx={cx} cy="46" r="6" className="fill-page stroke-muted" />
      <path d={`M${cx - 12} 70A12 12 0 0 1 ${cx + 12} 70Z`} className="fill-page stroke-muted" />
      <text x={cx} y="86" textAnchor="middle">
        {label}
      </text>
    </>
  );
}

// Arrows centred on (cx, cy), so CSS can flip them about their own centre.
const arrowDown = (cx: number, cy: number) => `M${cx} ${cy - 5}V${cy + 5}M${cx - 4} ${cy + 1}L${cx} ${cy + 5}L${cx + 4} ${cy + 1}`;
const arrowUp = (cx: number, cy: number) => `M${cx} ${cy + 5}V${cy - 5}M${cx - 4} ${cy - 1}L${cx} ${cy - 5}L${cx + 4} ${cy - 1}`;

const T = {
  nl: {
    title: "Hoe de ERE-prijs ontstaat",
    desc: "ERE's worden onderhands (OTC) verhandeld tussen koper en verkoper, vaak via brokers met een wekelijkse marktupdate; er is geen beurs. De middenprijs ligt precies tussen bied en laat: (bied + laat) ÷ 2. Volgens Joulo volgt de prijs de groene premie, het kostenverschil tussen fossiele en hernieuwbare brandstof. Duurdere olie maakt dat verschil kleiner; goedkopere olie maakt het groter en kan de ERE-prijs opdrijven.",
    otc: "ONDERHANDS (OTC) · GEEN BEURS",
    buyer: "koper",
    seller: "verkoper",
    broker: "broker · wekelijkse marktupdate",
    perEre: "PRIJS PER ERE",
    lower: "lager",
    higher: "hoger",
    bid: "bied",
    offer: "laat",
    mid: "midden",
    midFormula: "(bied + laat) ÷ 2",
    premium: "GROENE PREMIE · VOLGENS JOULO",
    premiumSub: "kostenverschil fossiel en hernieuwbaar",
    fossil: "fossiel",
    renewable: "hernieuwbaar",
    oilCheap: "olie goedkoper",
    oilDear: "olie duurder",
    green: "groene premie",
    erePrice: "ERE-prijs",
    rise: "kan stijgen",
    fall: "kan dalen",
  },
  en: {
    title: "How the ERE price is formed",
    desc: "EREs are traded over the counter (OTC) between buyer and seller, often via brokers with a weekly market update; there is no exchange. The mid price lies exactly between bid and offer: (bid + offer) ÷ 2. According to Joulo, the price follows the green premium, the cost difference between fossil and renewable fuel. More expensive oil makes that difference smaller; cheaper oil makes it larger and can push the ERE price up.",
    otc: "OVER THE COUNTER · NO EXCHANGE",
    buyer: "buyer",
    seller: "seller",
    broker: "broker · weekly market update",
    perEre: "PRICE PER ERE",
    lower: "lower",
    higher: "higher",
    bid: "bid",
    offer: "offer",
    mid: "mid",
    midFormula: "(bid + offer) ÷ 2",
    premium: "GREEN PREMIUM · PER JOULO",
    premiumSub: "cost gap between fossil and renewable",
    fossil: "fossil",
    renewable: "renewable",
    oilCheap: "cheaper oil",
    oilDear: "pricier oil",
    green: "green premium",
    erePrice: "ERE price",
    rise: "can rise",
    fall: "can fall",
  },
};

// Plate C is authored in the cheap-oil state (the one the text describes); the oil-* classes in illustrations.css
// swing it to expensive oil and back when it comes into view.
export default async function PriceFormation() {
  const t = T[await getLang()];
  return (
    <Plate id="ill-prijs" height={400} title={t.title} desc={t.desc}>
      {/* Plate A: over the counter */}
      <text x="0" y="11" className="t-eyebrow">
        {t.otc}
      </text>
      <g className="a-pop" style={d(150)}>
        <Person cx={28} label={t.buyer} />
      </g>
      <g className="a-pop" style={d(230)}>
        <Person cx={228} label={t.seller} />
      </g>
      <path pathLength={1} d="M44 50Q128 18 212 50" className="a-draw stroke-accent" style={d(350, { "--dur": "600ms" })} />
      <g className="a-pop" style={d(700)}>
        <circle cx="128" cy="96" r="10" className="fill-page stroke-muted" />
        <circle cx="128" cy="93" r="2.5" className="stroke-muted" />
        <path d="M123.5 101.5A4.5 4.5 0 0 1 132.5 101.5" className="stroke-muted" />
      </g>
      <path
        d="M40 66Q80 96 116 96M140 96Q176 96 216 66"
        strokeDasharray="3 3"
        className="a-fade stroke-muted"
        style={d(750)}
      />
      <text x="128" y="120" textAnchor="middle" className="a-fade" style={d(800)}>
        {t.broker}
      </text>
      <path d="M0 130H256" className="stroke-(--grid)" />

      {/* Plate B: bid, mid, offer */}
      <text x="0" y="151" className="t-eyebrow">
        {t.perEre}
      </text>
      <path d="M16 212H240" className="stroke-(--grid)" />
      <text x="16" y="250">
        {t.lower}
      </text>
      <text x="240" y="250" textAnchor="end">
        {t.higher}
      </text>
      <g className="a-grow" style={d(300, { "--dur": "600ms" })}>
        <rect x="64" y="198" width="128" height="28" rx="4" className="fill-band" />
      </g>
      {/* Only the ticks slide out from the middle; their labels fade in once apart, so they never overlap. */}
      <path d="M64 190V234" className="a-slide stroke-fg" style={d(300, { "--from": "64px 0", "--dur": "600ms" })} />
      <path d="M192 190V234" className="a-slide stroke-fg" style={d(300, { "--from": "-64px 0", "--dur": "600ms" })} />
      <g className="a-fade" style={d(800)} textAnchor="middle">
        <text x="64" y="182" className="t-strong">
          {t.bid}
        </text>
        <text x="192" y="182" className="t-strong">
          {t.offer}
        </text>
      </g>
      <g className="glow">
        <g className="a-pop" style={d(850)}>
          <path d="M128 194V230" className="stroke-accent stroke-2" />
          <circle cx="128" cy="212" r="5" className="fill-accent" />
          <text x="128" y="182" textAnchor="middle" className="t-accent">
            {t.mid}
          </text>
        </g>
      </g>
      <circle cx="128" cy="212" r="5" className="ping stroke-accent" style={d(1000)} />
      <text x="128" y="250" textAnchor="middle" className="a-fade" style={d(1000)}>
        {t.midFormula}
      </text>

      {/* Plate C: green premium. Authored state: cheap oil (short fossil bar, tall premium, ERE price up). */}
      <path d="M0 262H256" className="stroke-(--grid)" />
      <text x="0" y="283" className="t-eyebrow">
        {t.premium}
      </text>
      <text x="0" y="298">
        {t.premiumSub}
      </text>
      <path d="M0 380H124" className="stroke-(--grid)" />
      <g className="a-rise" style={d(300)}>
        <rect x="8" y="364" width="36" height="16" className="oil-fossil fill-page stroke-muted" />
      </g>
      <g className="a-rise" style={d(400)}>
        <rect x="72" y="318" width="36" height="62" className="fill-(--ill-soft) stroke-accent" />
      </g>
      <text x="26" y="394" textAnchor="middle">
        {t.fossil}
      </text>
      <text x="90" y="394" textAnchor="middle">
        {t.renewable}
      </text>
      <g className="a-fade" style={d(800)}>
        <g className="oil-follow">
          <path d="M44 364H120" strokeDasharray="2 3" className="stroke-muted" />
          <path d="M120 364H128" className="stroke-accent" />
        </g>
        <path d="M108 318H120" strokeDasharray="2 3" className="stroke-muted" />
        <path d="M120 318H128" className="stroke-accent" />
        <path d="M124 318V364" className="oil-premium stroke-accent" />

        {/* Cause and effect, top to bottom: oil price, premium, ERE price. */}
        <path d={arrowDown(140, 313)} className="oil-arrow stroke-muted" />
        <text x="150" y="317" className="oil-b">
          {t.oilCheap}
        </text>
        <text x="150" y="317" className="oil-a">
          {t.oilDear}
        </text>
        <text x="136" y="340" className="t-accent">
          {t.green}
        </text>
        <g className="glow">
          <path d={arrowUp(140, 359)} className="oil-arrow stroke-accent stroke-2" />
        </g>
        <text x="150" y="363" className="t-strong">
          {t.erePrice}
        </text>
        <text x="150" y="377" className="oil-b">
          {t.rise}
        </text>
        <text x="150" y="377" className="oil-a">
          {t.fall}
        </text>
      </g>
    </Plate>
  );
}
