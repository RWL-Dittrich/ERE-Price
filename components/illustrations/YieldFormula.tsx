import { getLang } from "@/lib/lang.server";
import { Plate, d, headDown } from "./svg";

// NEa formula for electricity delivered in 2026, one stage per factor (mirrors ERE_PER_KWH in Explainer.tsx).
// `at` = when the traveler (d 300ms, 1100ms ease-in-out over 152 units) reaches the stage.
const stages = [
  { y: 76, factor: { nl: "× 0,505", en: "× 0.505" }, sub: { nl: "aandeel hernieuwbaar (CBS)", en: "renewable share (CBS)" }, at: 670 },
  { y: 114, factor: { nl: "× 183 g/MJ", en: "× 183 g/MJ" }, sub: { nl: "fossiele referentie", en: "fossil reference" }, at: 810 },
  { y: 152, factor: { nl: "× 3,6 MJ/kWh", en: "× 3.6 MJ/kWh" }, at: 910 },
  { y: 182, factor: { nl: "÷ 1000", en: "÷ 1,000" }, at: 1030 },
];

const pills = [
  { y: 278, label: { nl: "brandstofleveranciers", en: "fuel suppliers" }, tone: "fill-page stroke-muted", at: 1500 },
  { y: 334, label: { nl: "inboekdienstverlener", en: "registration service provider" }, tone: "fill-page stroke-accent", at: 1750 },
  { y: 416, label: { nl: "jij", en: "you" }, tone: "fill-(--ill-soft) stroke-accent", at: 2100 },
];

const T = {
  nl: {
    title: "Wat een kWh oplevert",
    desc: "Voor stroom geleverd in 2026: 1 kWh × 0,505 (aandeel hernieuwbare stroom, CBS) × 183 g/MJ (fossiele referentiewaarde) × 3,6 MJ/kWh ÷ 1000 = 0,3327 ERE. De factor 4 van HBE's bestaat niet meer. Brandstofleveranciers betalen via de markt; de inboekdienstverlener kan de opbrengst met jou delen en houdt soms 10 tot 30% in of rekent een abonnement. Het is geen subsidie.",
    delivered: "STROOM GELEVERD IN 2026",
    result: "0,3327 ERE",
    gone: "bestaat niet meer",
    market: "GEEN SUBSIDIE · VIA DE MARKT",
    pay: "betalen via de markt",
    share: ["kan opbrengst delen", "houdt soms 10–30% in,", "of rekent een abonnement"],
  },
  en: {
    title: "What a kWh yields",
    desc: "For electricity delivered in 2026: 1 kWh × 0.505 (renewable share of electricity, CBS) × 183 g/MJ (fossil reference value) × 3.6 MJ/kWh ÷ 1,000 = 0.3327 ERE. The HBE multiplier of 4 no longer exists. Fuel suppliers pay via the market; the registration service provider can share the proceeds with you and sometimes keeps 10 to 30% or charges a subscription. It is not a subsidy.",
    delivered: "ELECTRICITY DELIVERED IN 2026",
    result: "0.3327 ERE",
    gone: "no longer exists",
    market: "NO SUBSIDY · VIA THE MARKET",
    pay: "pay via the market",
    share: ["can share the proceeds", "sometimes keeps 10–30%,", "or charges a subscription"],
  },
};

export default async function YieldFormula() {
  const lang = await getLang();
  const t = T[lang];
  return (
    <Plate id="ill-opbrengst" height={452} title={t.title} desc={t.desc}>
      {/* Plate A: the NEa formula */}
      <text x="0" y="11" className="t-eyebrow">
        {t.delivered}
      </text>
      <g className="a-pop" style={d(150)}>
        <rect x="0.75" y="26" width="62.5" height="26" rx="13" className="fill-page stroke-muted" />
        <text x="32" y="43" textAnchor="middle" className="t-strong">
          1 kWh
        </text>
      </g>
      <path pathLength={1} d="M32 52V204" className="a-draw stroke-(--grid) stroke-2" style={d(200, { "--dur": "900ms" })} />
      {stages.map(({ y, factor, sub, at }) => (
        <g key={y} style={d(at)}>
          <circle cx="32" cy={y} r="4" className="fill-card stroke-accent" />
          <circle cx="32" cy={y} r="4" className="a-pop fill-accent" />
          <text x="48" y={y + 4} className="t-strong a-fade">
            {factor[lang]}
          </text>
          {sub && (
            <text x="48" y={y + 18} className="a-fade">
              {sub[lang]}
            </text>
          )}
        </g>
      ))}
      <circle cx="32" cy="52" r="5" className="traveler fill-accent" style={d(300)} />
      <g className="glow">
        <g className="a-pop" style={d(1250)}>
          <rect x="0" y="204" width="104" height="28" rx="14" className="fill-accent" />
          <text x="52" y="222" textAnchor="middle" className="t-on-accent">
            {t.result}
          </text>
        </g>
      </g>
      {/* Beside the result, so it reads as the old HBE multiplier rather than a note on ÷ 1000. */}
      <g className="a-fade" style={d(1450)}>
        <text x="116" y="214">
          × 4 (HBE)
        </text>
        <path d="M112 210H166" className="stroke-muted" />
        <text x="116" y="228">
          {t.gone}
        </text>
      </g>
      <path d="M0 244H256" className="stroke-(--grid)" />

      {/* Plate B: who pays */}
      <text x="0" y="263" className="t-eyebrow">
        {t.market}
      </text>
      {pills.map(({ y, label, tone, at }) => (
        <g key={y} className="a-pop" style={d(at)}>
          <rect x="0.75" y={y} width="183.25" height="30" rx="15" className={tone} />
          <text x="14" y={y + 19} className="t-strong">
            {label[lang]}
          </text>
        </g>
      ))}
      <path pathLength={1} d="M30 308V327" className="a-draw stroke-accent" style={d(1600, { "--dur": "300ms" })} />
      <path d={headDown(30, 332)} className="a-pop fill-accent" style={d(1870)} />
      <text x="40" y="324" className="a-fade" style={d(1650)}>
        {t.pay}
      </text>
      <path pathLength={1} d="M30 364V409" className="a-draw stroke-accent" style={d(1850, { "--dur": "350ms" })} />
      <path d={headDown(30, 414)} className="a-pop fill-accent" style={d(2150)} />
      <g className="a-fade" style={d(1950)}>
        {t.share.map((line, i) => (
          <text key={i} x="40" y={380 + 13 * i}>
            {line}
          </text>
        ))}
      </g>
    </Plate>
  );
}
