import { getTranslations } from "next-intl/server";
import { Plate, arrowheadDown, delay, lines } from "./svg";

/**
 * The NEa formula behind ERE_PER_KWH (lib/earnings.ts), one stage per factor down a vertical line, some with a
 * note underneath. `reachedAt` is when the travelling dot (starting at 300ms, 1100ms ease-in-out over 152 units)
 * reaches that stage.
 */
const FORMULA_STAGES = [
  { factor: "renewableShare", note: "renewableShareNote", y: 76, reachedAt: 670 },
  { factor: "fossilReference", note: "fossilReferenceNote", y: 114, reachedAt: 810 },
  { factor: "energy", y: 152, reachedAt: 910 },
  { factor: "grams", y: 182, reachedAt: 1030 },
] as const;

/** Who pays whom, top to bottom. */
const PAYERS = [
  { payer: "fuelSuppliers", y: 278, colors: "fill-page stroke-muted", appearsAt: 1500 },
  { payer: "provider", y: 334, colors: "fill-page stroke-accent", appearsAt: 1750 },
  { payer: "you", y: 416, colors: "fill-(--ill-soft) stroke-accent", appearsAt: 2100 },
] as const;

/** Part 05: from 1 kWh to 0.3327 ERE, and who pays for it: fuel suppliers via the market, not the government. */
export default async function YieldFormula() {
  const t = await getTranslations("Illustrations.yieldFormula");

  return (
    <Plate id="ill-opbrengst" height={452} title={t("title")} description={t("description")}>
      {/* Top: the NEa formula */}
      <text x="0" y="11" className="t-eyebrow">
        {t("delivered")}
      </text>
      <g className="a-pop" style={delay(150)}>
        <rect x="0.75" y="26" width="62.5" height="26" rx="13" className="fill-page stroke-muted" />
        <text x="32" y="43" textAnchor="middle" className="t-strong">
          1 kWh
        </text>
      </g>
      <path pathLength={1} d="M32 52V204" className="a-draw stroke-(--grid) stroke-2" style={delay(200, { "--dur": "900ms" })} />
      {FORMULA_STAGES.map((stage) => (
        <g key={stage.y} style={delay(stage.reachedAt)}>
          <circle cx="32" cy={stage.y} r="4" className="fill-card stroke-accent" />
          <circle cx="32" cy={stage.y} r="4" className="a-pop fill-accent" />
          <text x="48" y={stage.y + 4} className="t-strong a-fade">
            {t(`factors.${stage.factor}`)}
          </text>
          {"note" in stage && (
            <text x="48" y={stage.y + 18} className="a-fade">
              {t(`factors.${stage.note}`)}
            </text>
          )}
        </g>
      ))}
      <circle cx="32" cy="52" r="5" className="traveler fill-accent" style={delay(300)} />
      <g className="glow">
        <g className="a-pop" style={delay(1250)}>
          <rect x="0" y="204" width="104" height="28" rx="14" className="fill-accent" />
          <text x="52" y="222" textAnchor="middle" className="t-on-accent">
            {t("result")}
          </text>
        </g>
      </g>
      {/* Beside the result, so it reads as the old HBE multiplier rather than a note on ÷ 1000. */}
      <g className="a-fade" style={delay(1450)}>
        <text x="116" y="214">
          × 4 (HBE)
        </text>
        <path d="M112 210H166" className="stroke-muted" />
        <text x="116" y="228">
          {t("noLongerExists")}
        </text>
      </g>
      <path d="M0 244H256" className="stroke-(--grid)" />

      {/* Bottom: who pays */}
      <text x="0" y="263" className="t-eyebrow">
        {t("whoPays")}
      </text>
      {PAYERS.map(({ payer, y, colors, appearsAt }) => (
        <g key={y} className="a-pop" style={delay(appearsAt)}>
          <rect x="0.75" y={y} width="183.25" height="30" rx="15" className={colors} />
          <text x="14" y={y + 19} className="t-strong">
            {t(`payers.${payer}`)}
          </text>
        </g>
      ))}
      <path pathLength={1} d="M30 308V327" className="a-draw stroke-accent" style={delay(1600, { "--dur": "300ms" })} />
      <path d={arrowheadDown(30, 332)} className="a-pop fill-accent" style={delay(1870)} />
      <text x="40" y="324" className="a-fade" style={delay(1650)}>
        {t("payViaMarket")}
      </text>
      <path pathLength={1} d="M30 364V409" className="a-draw stroke-accent" style={delay(1850, { "--dur": "350ms" })} />
      <path d={arrowheadDown(30, 414)} className="a-pop fill-accent" style={delay(2150)} />
      <g className="a-fade" style={delay(1950)}>
        {lines(t("sharing")).map((line, i) => (
          <text key={line} x="40" y={380 + 13 * i}>
            {line}
          </text>
        ))}
      </g>
    </Plate>
  );
}
