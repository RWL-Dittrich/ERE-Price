import { getTranslations } from "next-intl/server";
import { Plate, delay } from "./svg";

// Arrows centred on (cx, cy), so CSS can flip them about their own centre.
const arrowDown = (cx: number, cy: number) =>
  `M${cx} ${cy - 5}V${cy + 5}M${cx - 4} ${cy + 1}L${cx} ${cy + 5}L${cx + 4} ${cy + 1}`;
const arrowUp = (cx: number, cy: number) =>
  `M${cx} ${cy + 5}V${cy - 5}M${cx - 4} ${cy - 1}L${cx} ${cy - 5}L${cx + 4} ${cy - 1}`;

/**
 * Part 04: over-the-counter trading, bid / mid / offer, and the green premium.
 *
 * The green-premium panel is drawn in the cheap-oil state, the one the text describes. The oil-* classes in
 * illustrations.css swing it to expensive oil and back, on a loop, once it is in view.
 */
export default async function PriceFormation() {
  const t = await getTranslations("Illustrations.priceFormation");

  return (
    <Plate id="ill-prijs" height={400} title={t("title")} description={t("description")}>
      {/* Top: buyer and seller trade directly, often through a broker */}
      <text x="0" y="11" className="t-eyebrow">
        {t("overTheCounter")}
      </text>
      <g className="a-pop" style={delay(150)}>
        <Person cx={28} label={t("buyer")} />
      </g>
      <g className="a-pop" style={delay(230)}>
        <Person cx={228} label={t("seller")} />
      </g>
      <path pathLength={1} d="M44 50Q128 18 212 50" className="a-draw stroke-accent" style={delay(350, { "--dur": "600ms" })} />
      <g className="a-pop" style={delay(700)}>
        <circle cx="128" cy="96" r="10" className="fill-page stroke-muted" />
        <circle cx="128" cy="93" r="2.5" className="stroke-muted" />
        <path d="M123.5 101.5A4.5 4.5 0 0 1 132.5 101.5" className="stroke-muted" />
      </g>
      <path
        d="M40 66Q80 96 116 96M140 96Q176 96 216 66"
        strokeDasharray="3 3"
        className="a-fade stroke-muted"
        style={delay(750)}
      />
      <text x="128" y="120" textAnchor="middle" className="a-fade" style={delay(800)}>
        {t("broker")}
      </text>
      <path d="M0 130H256" className="stroke-(--grid)" />

      {/* Middle: bid, mid, offer */}
      <text x="0" y="151" className="t-eyebrow">
        {t("pricePerEre")}
      </text>
      <path d="M16 212H240" className="stroke-(--grid)" />
      <text x="16" y="250">
        {t("lower")}
      </text>
      <text x="240" y="250" textAnchor="end">
        {t("higher")}
      </text>
      <g className="a-grow" style={delay(300, { "--dur": "600ms" })}>
        <rect x="64" y="198" width="128" height="28" rx="4" className="fill-band" />
      </g>
      {/* Only the ticks slide out from the middle; their labels fade in once apart, so they never overlap. */}
      <path d="M64 190V234" className="a-slide stroke-fg" style={delay(300, { "--from": "64px 0", "--dur": "600ms" })} />
      <path d="M192 190V234" className="a-slide stroke-fg" style={delay(300, { "--from": "-64px 0", "--dur": "600ms" })} />
      <g className="a-fade" style={delay(800)} textAnchor="middle">
        <text x="64" y="182" className="t-strong">
          {t("bid")}
        </text>
        <text x="192" y="182" className="t-strong">
          {t("offer")}
        </text>
      </g>
      <g className="glow">
        <g className="a-pop" style={delay(850)}>
          <path d="M128 194V230" className="stroke-accent stroke-2" />
          <circle cx="128" cy="212" r="5" className="fill-accent" />
          <text x="128" y="182" textAnchor="middle" className="t-accent">
            {t("mid")}
          </text>
        </g>
      </g>
      <circle cx="128" cy="212" r="5" className="ping stroke-accent" style={delay(1000)} />
      <text x="128" y="250" textAnchor="middle" className="a-fade" style={delay(1000)}>
        {t("midFormula")}
      </text>

      {/* Bottom: the green premium, drawn for cheap oil (short fossil bar, tall premium, ERE price up) */}
      <path d="M0 262H256" className="stroke-(--grid)" />
      <text x="0" y="283" className="t-eyebrow">
        {t("greenPremiumHeading")}
      </text>
      <text x="0" y="298">
        {t("greenPremiumNote")}
      </text>
      <path d="M0 380H124" className="stroke-(--grid)" />
      <g className="a-rise" style={delay(300)}>
        <rect x="8" y="364" width="36" height="16" className="oil-fossil fill-page stroke-muted" />
      </g>
      <g className="a-rise" style={delay(400)}>
        <rect x="72" y="318" width="36" height="62" className="fill-(--ill-soft) stroke-accent" />
      </g>
      <text x="26" y="394" textAnchor="middle">
        {t("fossil")}
      </text>
      <text x="90" y="394" textAnchor="middle">
        {t("renewable")}
      </text>
      <g className="a-fade" style={delay(800)}>
        <g className="oil-follow">
          <path d="M44 364H120" strokeDasharray="2 3" className="stroke-muted" />
          <path d="M120 364H128" className="stroke-accent" />
        </g>
        <path d="M108 318H120" strokeDasharray="2 3" className="stroke-muted" />
        <path d="M120 318H128" className="stroke-accent" />
        <path d="M124 318V364" className="oil-premium stroke-accent" />

        {/* Cause and effect, top to bottom: oil price, green premium, ERE price. */}
        <path d={arrowDown(140, 313)} className="oil-arrow stroke-muted" />
        <text x="150" y="317" className="oil-b">
          {t("cheaperOil")}
        </text>
        <text x="150" y="317" className="oil-a">
          {t("pricierOil")}
        </text>
        <text x="136" y="340" className="t-accent">
          {t("greenPremium")}
        </text>
        <g className="glow">
          <path d={arrowUp(140, 359)} className="oil-arrow stroke-accent stroke-2" />
        </g>
        <text x="150" y="363" className="t-strong">
          {t("erePrice")}
        </text>
        <text x="150" y="377" className="oil-b">
          {t("canRise")}
        </text>
        <text x="150" y="377" className="oil-a">
          {t("canFall")}
        </text>
      </g>
    </Plate>
  );
}

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
