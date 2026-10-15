import { getLang } from "@/lib/lang.server";
import { Plate, d, headRight } from "./svg";

// 1 HBE = 46 ERE: 5 full rows of 8 plus 6.
const coins = Array.from({ length: 46 }, (_, k) => ({ k, cx: 138 + (k % 8) * 14, cy: 206 + Math.floor(k / 8) * 14 }));

const T = {
  nl: {
    title: "Wat een ERE is",
    desc: "Een ERE staat voor 1 kilogram CO₂-equivalent emissiereductie in de keten, ten opzichte van de fossiele referentiewaarde. Resterende HBE's zijn op 1 mei 2026 omgezet: 1 HBE werd 46 ERE.",
    unit: "EENHEID",
    fossil: ["fossiele", "referentie"],
    renewable: ["hernieuwbare", "energie"],
    reduction: "reductie",
    conversion: "OVERGANG 2026",
    until: "t/m 2025",
    date: "1 mei 2026",
    result: "46 ERE",
  },
  en: {
    title: "What an ERE is",
    desc: "An ERE stands for 1 kilogram of CO₂-equivalent emission reduction across the supply chain, relative to the fossil reference value. Remaining HBEs were converted on 1 May 2026: 1 HBE became 46 EREs.",
    unit: "UNIT",
    fossil: ["fossil", "reference"],
    renewable: ["renewable", "energy"],
    reduction: "reduction",
    conversion: "CONVERSION 2026",
    until: "through 2025",
    date: "1 May 2026",
    result: "46 EREs",
  },
};

export default async function EreUnit() {
  const t = T[await getLang()];
  return (
    <Plate id="ill-ere" height={320} title={t.title} desc={t.desc}>
      {/* Plate A: the unit */}
      <text x="0" y="11" className="t-eyebrow">
        {t.unit}
      </text>
      <path pathLength={1} d="M8 120H248" className="a-draw stroke-(--grid)" style={d(150)} />
      <g className="a-rise" style={d(250)}>
        <rect x="16" y="40" width="52" height="80" rx="3" strokeDasharray="4 3" className="stroke-muted" />
      </g>
      <g className="a-rise" style={d(400)}>
        <rect x="84" y="84" width="52" height="36" rx="3" className="fill-(--ill-soft) stroke-accent" />
      </g>
      <g className="a-fade" style={d(600)} textAnchor="middle">
        <text x="42" y="136">
          {t.fossil[0]}
        </text>
        <text x="42" y="149">
          {t.fossil[1]}
        </text>
        <text x="110" y="136">
          {t.renewable[0]}
        </text>
        <text x="110" y="149">
          {t.renewable[1]}
        </text>
      </g>
      <path d="M68 40H150M136 84H146" strokeDasharray="2 3" className="a-fade stroke-muted" style={d(850)} />
      <g className="glow">
        <path
          pathLength={1}
          d="M146 40h6M149 40V84M146 84h6"
          className="a-draw stroke-accent"
          style={d(900, { "--dur": "var(--m-dur-3)" })}
        />
        <text x="160" y="56" className="t-accent a-fade" style={d(1050)}>
          {t.reduction}
        </text>
        <g className="a-pop" style={d(1150)}>
          <rect x="160" y="64" width="56" height="22" rx="11" className="fill-accent" />
          <text x="188" y="79" textAnchor="middle" className="t-on-accent">
            1 ERE
          </text>
        </g>
      </g>
      <text x="160" y="102" className="a-fade" style={d(1250)}>
        per kg CO₂-eq
      </text>
      <path d="M0 164H256" className="stroke-(--grid)" />

      {/* Plate B: the 2026 conversion */}
      <text x="0" y="187" className="t-eyebrow">
        {t.conversion}
      </text>
      <g className="a-pop" style={d(700)}>
        <rect x="8" y="212" width="56" height="56" rx="12" className="fill-page stroke-muted" />
        <text x="36" y="245" textAnchor="middle" className="t-strong">
          1 HBE
        </text>
      </g>
      <text x="36" y="290" textAnchor="middle" className="a-fade" style={d(800)}>
        {t.until}
      </text>
      <path pathLength={1} d="M74 240H122" className="a-draw stroke-accent" style={d(900, { "--dur": "380ms" })} />
      <path d={headRight(126, 240)} className="a-pop fill-accent" style={d(1280)} />
      <text x="99" y="230" textAnchor="middle" className="a-fade" style={d(950)}>
        {t.date}
      </text>
      {coins.map(({ k, cx, cy }) => (
        <circle key={k} cx={cx} cy={cy} r="4" className="a-pop fill-accent" style={d(1100 + k * 12)} />
      ))}
      <text x="187" y="300" textAnchor="middle" className="t-strong a-fade" style={d(1750)}>
        {t.result}
      </text>
    </Plate>
  );
}
