import { getFormatter, getTranslations } from "next-intl/server";
import { Plate, arrowheadDown, arrowheadRight, delay, lines } from "./svg";

/** Required supply-chain emission reduction in the land sector, in percent per year. */
const OBLIGATION_RAMP = [
  { year: 2026, percent: 14.4 },
  { year: 2027, percent: 16.5 },
  { year: 2028, percent: 23.1 },
  { year: 2029, percent: 25.6 },
  { year: 2030, percent: 28.4 },
];
/** Bar scale: a 30% bar would be 120 plate units tall. */
const SCALE_PERCENT = 30;
const SCALE_HEIGHT = 120;
const BASELINE_Y = 408;

/** Part 02: EREs in the register, traded to fuel suppliers, deducted on 1 April; and the rising obligation. */
export default async function ObligationFlow() {
  const t = await getTranslations("Illustrations.obligationFlow");
  const format = await getFormatter();
  const renewable = lines(t("renewable"));
  const fuelSupplier = lines(t("fuelSupplier"));

  return (
    <Plate id="ill-plicht" height={440} title={t("title")} description={t("description")}>
      {/* Top: the register */}
      <rect x="0.75" y="0.75" width="254.5" height="210" rx="14" className="a-fade stroke-(--grid)" style={delay(150)} />
      <text x="14" y="22" className="t-strong">
        {t("register")}
      </text>
      <text x="14" y="37">
        {t("managedBy")}
      </text>
      <g className="a-pop" style={delay(300)}>
        <rect x="14" y="56" width="104" height="96" rx="10" className="fill-page stroke-muted" />
        <text x="22" y="74">
          {t("account")}
        </text>
        <text x="22" y="89" className="t-strong">
          {renewable[0]}
        </text>
        <text x="22" y="103" className="t-strong">
          {renewable[1]}
        </text>
        <text x="22" y="119">
          {t("perKg")}
        </text>
      </g>
      <g className="a-pop" style={delay(400)}>
        <rect x="138" y="56" width="104" height="96" rx="10" className="fill-page stroke-muted" />
        <text x="146" y="74">
          {t("account")}
        </text>
        <text x="146" y="89" className="t-strong">
          {fuelSupplier[0]}
        </text>
        <text x="146" y="103" className="t-strong">
          {fuelSupplier[1]}
        </text>
        <text x="146" y="119">
          {t("volume")}
        </text>
      </g>
      {/* Three EREs leave the left account (dashed outlines stay behind) and slide into the right one. */}
      <g className="a-fade" style={delay(1500)}>
        {[28, 44, 60].map((cx) => (
          <circle key={cx} cx={cx} cy="136" r="6" strokeDasharray="2 2" className="stroke-accent" />
        ))}
      </g>
      <g className="a-fade" style={delay(600)}>
        <path d="M120 136H131" className="stroke-accent" />
        <path d={arrowheadRight(135, 136)} className="fill-accent" />
      </g>
      <g className="glow">
        {[152, 168, 184].map((cx, i) => (
          <circle
            key={cx}
            cx={cx}
            cy="136"
            r="6"
            className="a-slide fill-accent"
            style={delay(650 + i * 70, { "--from": "-124px 0", "--dur": "700ms" })}
          />
        ))}
      </g>
      <text x="128" y="170" textAnchor="middle" className="a-fade" style={delay(700)}>
        {t("trade")}
      </text>
      <path pathLength={1} d="M190 152V178" className="a-draw stroke-muted" style={delay(1600, { "--dur": "300ms" })} />
      <path d={arrowheadDown(190, 183)} className="a-pop fill-muted" style={delay(1900)} />
      <text x="190" y="198" textAnchor="middle" className="a-fade" style={delay(1700)}>
        {t("deducted")}
      </text>

      {/* Bottom: the obligation ramp */}
      <text x="1.5" y="244" className="t-eyebrow">
        {t("obligation")}
      </text>
      <text x="0" y="259">
        {t("obligationNote")}
      </text>
      <path d={`M8 ${BASELINE_Y}H248`} className="stroke-(--grid)" />
      {OBLIGATION_RAMP.map(({ year, percent }, i) => {
        const x = 16 + 48 * i;
        const height = (percent / SCALE_PERCENT) * SCALE_HEIGHT;
        const barDelay = 1000 + 90 * i;
        return (
          <g key={year} className="ramp-bar" textAnchor="middle">
            <g className="a-rise" style={delay(barDelay)}>
              <rect
                x={x}
                y={BASELINE_Y - height}
                width="32"
                height={height}
                rx="3"
                className="fill-(--ill-soft) stroke-accent"
              />
            </g>
            <text x={x + 16} y={BASELINE_Y - height - 8} className="t-strong a-fade" style={delay(barDelay + 400)}>
              {format.number(percent / 100, "percent")}
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
