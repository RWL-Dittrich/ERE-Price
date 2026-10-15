import { fmt } from "@/lib/format";
import { getLang } from "@/lib/lang.server";
import { Plate, d, headDown, headRight } from "./svg";

// Required chain emission reduction, sector land (%); bar height = value / 30 × 120.
const ramp = [
  ["2026", 14.4],
  ["2027", 16.5],
  ["2028", 23.1],
  ["2029", 25.6],
  ["2030", 28.4],
] as const;

const T = {
  nl: {
    title: "Hoe de verplichting werkt",
    desc: "In het Register Energie Vervoer (REV), beheerd door de NEa, krijgt een leverancier van hernieuwbare energie 1 ERE per kilogram reductie. ERE's worden verhandeld naar brandstofleveranciers die 500.000 liter of meer per jaar leveren; op 1 april worden ze afgeschreven. Verplichte ketenemissiereductie in de sector land: 14,4% in 2026, 16,5% in 2027, 23,1% in 2028, 25,6% in 2029 en 28,4% in 2030; alleen LRE's tellen mee.",
    register: "Register Energie Vervoer (REV)",
    nea: "beheer en toezicht: NEa",
    account: "rekening",
    renewable: ["hernieuwbare", "energie"],
    fuel: ["brandstof-", "leverancier"],
    perKg: "1 ERE per kg",
    volume: "≥ 500.000 l/jaar",
    trade: "handel",
    surrender: "1 april: afgeschreven",
    obligation: "VERPLICHTING SECTOR LAND",
    obligationSub: "ketenemissiereductie · alleen LRE's",
  },
  en: {
    title: "How the obligation works",
    desc: "In the Register Energie Vervoer (REV, Energy for Transport Register), managed by the NEa, a supplier of renewable energy receives 1 ERE per kilogram of reduction. EREs are traded to fuel suppliers that supply 500,000 litres or more per year; on 1 April they are deducted. Required supply-chain emission reduction in the land sector: 14.4% in 2026, 16.5% in 2027, 23.1% in 2028, 25.6% in 2029 and 28.4% in 2030; only LREs count.",
    register: "Register Energie Vervoer (REV)",
    nea: "managed and supervised by the NEa",
    account: "account",
    renewable: ["renewable", "energy"],
    fuel: ["fuel", "supplier"],
    perKg: "1 ERE per kg",
    volume: "≥ 500,000 l/yr",
    trade: "trade",
    surrender: "1 April: deducted",
    obligation: "OBLIGATION · LAND SECTOR",
    obligationSub: "supply-chain emission reduction · LREs only",
  },
};

export default async function ObligationFlow() {
  const lang = await getLang();
  const t = T[lang];
  return (
    <Plate id="ill-plicht" height={440} title={t.title} desc={t.desc}>
      {/* Plate A: the register */}
      <rect x="0.75" y="0.75" width="254.5" height="210" rx="14" className="a-fade stroke-(--grid)" style={d(150)} />
      <text x="14" y="22" className="t-strong">
        {t.register}
      </text>
      <text x="14" y="37">
        {t.nea}
      </text>
      <g className="a-pop" style={d(300)}>
        <rect x="14" y="56" width="104" height="96" rx="10" className="fill-page stroke-muted" />
        <text x="22" y="74">
          {t.account}
        </text>
        <text x="22" y="89" className="t-strong">
          {t.renewable[0]}
        </text>
        <text x="22" y="103" className="t-strong">
          {t.renewable[1]}
        </text>
        <text x="22" y="119">
          {t.perKg}
        </text>
      </g>
      <g className="a-pop" style={d(400)}>
        <rect x="138" y="56" width="104" height="96" rx="10" className="fill-page stroke-muted" />
        <text x="146" y="74">
          {t.account}
        </text>
        <text x="146" y="89" className="t-strong">
          {t.fuel[0]}
        </text>
        <text x="146" y="103" className="t-strong">
          {t.fuel[1]}
        </text>
        <text x="146" y="119">
          {t.volume}
        </text>
      </g>
      <g className="a-fade" style={d(1500)}>
        {[28, 44, 60].map((cx) => (
          <circle key={cx} cx={cx} cy="136" r="6" strokeDasharray="2 2" className="stroke-accent" />
        ))}
      </g>
      <g className="a-fade" style={d(600)}>
        <path d="M120 136H131" className="stroke-accent" />
        <path d={headRight(135, 136)} className="fill-accent" />
      </g>
      <g className="glow">
        {[152, 168, 184].map((cx, i) => (
          <circle
            key={cx}
            cx={cx}
            cy="136"
            r="6"
            className="a-slide fill-accent"
            style={d(650 + i * 70, { "--from": "-124px 0", "--dur": "700ms" })}
          />
        ))}
      </g>
      <text x="128" y="170" textAnchor="middle" className="a-fade" style={d(700)}>
        {t.trade}
      </text>
      <path pathLength={1} d="M190 152V178" className="a-draw stroke-muted" style={d(1600, { "--dur": "300ms" })} />
      <path d={headDown(190, 183)} className="a-pop fill-muted" style={d(1900)} />
      <text x="190" y="198" textAnchor="middle" className="a-fade" style={d(1700)}>
        {t.surrender}
      </text>

      {/* Plate B: the obligation ramp */}
      <text x="1.5" y="244" className="t-eyebrow">
        {t.obligation}
      </text>
      <text x="0" y="259">
        {t.obligationSub}
      </text>
      <path d="M8 408H248" className="stroke-(--grid)" />
      {ramp.map(([year, v], i) => {
        const x = 16 + 48 * i;
        const h = (v / 30) * 120;
        const bar = 1000 + 90 * i;
        return (
          <g key={year} className="ramp-bar" textAnchor="middle">
            <g className="a-rise" style={d(bar)}>
              <rect x={x} y={408 - h} width="32" height={h} rx="3" className="fill-(--ill-soft) stroke-accent" />
            </g>
            <text x={x + 16} y={408 - h - 8} className="t-strong a-fade" style={d(bar + 400)}>
              {fmt(lang).pct(v / 100)}
            </text>
            <text x={x + 16} y="426">
              {year}
            </text>
          </g>
        );
      })}
    </Plate>
  );
}
