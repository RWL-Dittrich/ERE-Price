import { getTranslations } from "next-intl/server";
import { Plate, arrowheadRight, delay, lines } from "./svg";

/** 1 HBE = 46 ERE, drawn as 46 coins: five full rows of 8, plus 6. */
const coins = Array.from({ length: 46 }, (_, i) => ({ i, cx: 138 + (i % 8) * 14, cy: 206 + Math.floor(i / 8) * 14 }));

/** Part 01: what one ERE stands for, and the conversion from HBEs in 2026. */
export default async function EreUnit() {
  const t = await getTranslations("Illustrations.ereUnit");
  const fossil = lines(t("fossil"));
  const renewable = lines(t("renewable"));

  return (
    <Plate id="ill-ere" height={320} title={t("title")} description={t("description")}>
      {/* Top: the unit */}
      <text x="0" y="11" className="t-eyebrow">
        {t("unit")}
      </text>
      <path pathLength={1} d="M8 120H248" className="a-draw stroke-(--grid)" style={delay(150)} />
      <g className="a-rise" style={delay(250)}>
        <rect x="16" y="40" width="52" height="80" rx="3" strokeDasharray="4 3" className="stroke-muted" />
      </g>
      <g className="a-rise" style={delay(400)}>
        <rect x="84" y="84" width="52" height="36" rx="3" className="fill-(--ill-soft) stroke-accent" />
      </g>
      <g className="a-fade" style={delay(600)} textAnchor="middle">
        <text x="42" y="136">
          {fossil[0]}
        </text>
        <text x="42" y="149">
          {fossil[1]}
        </text>
        <text x="110" y="136">
          {renewable[0]}
        </text>
        <text x="110" y="149">
          {renewable[1]}
        </text>
      </g>
      <path d="M68 40H150M136 84H146" strokeDasharray="2 3" className="a-fade stroke-muted" style={delay(850)} />
      <g className="glow">
        <path
          pathLength={1}
          d="M146 40h6M149 40V84M146 84h6"
          className="a-draw stroke-accent"
          style={delay(900, { "--dur": "var(--m-dur-3)" })}
        />
        <text x="160" y="56" className="t-accent a-fade" style={delay(1050)}>
          {t("reduction")}
        </text>
        <g className="a-pop" style={delay(1150)}>
          <rect x="160" y="64" width="56" height="22" rx="11" className="fill-accent" />
          <text x="188" y="79" textAnchor="middle" className="t-on-accent">
            1 ERE
          </text>
        </g>
      </g>
      <text x="160" y="102" className="a-fade" style={delay(1250)}>
        per kg CO₂-eq
      </text>
      <path d="M0 164H256" className="stroke-(--grid)" />

      {/* Bottom: the 2026 conversion */}
      <text x="0" y="187" className="t-eyebrow">
        {t("conversion")}
      </text>
      <g className="a-pop" style={delay(700)}>
        <rect x="8" y="212" width="56" height="56" rx="12" className="fill-page stroke-muted" />
        <text x="36" y="245" textAnchor="middle" className="t-strong">
          1 HBE
        </text>
      </g>
      <text x="36" y="290" textAnchor="middle" className="a-fade" style={delay(800)}>
        {t("until")}
      </text>
      <path pathLength={1} d="M74 240H122" className="a-draw stroke-accent" style={delay(900, { "--dur": "380ms" })} />
      <path d={arrowheadRight(126, 240)} className="a-pop fill-accent" style={delay(1280)} />
      <text x="99" y="230" textAnchor="middle" className="a-fade" style={delay(950)}>
        {t("date")}
      </text>
      {coins.map(({ i, cx, cy }) => (
        <circle key={i} cx={cx} cy={cy} r="4" className="a-pop fill-accent" style={delay(1100 + i * 12)} />
      ))}
      <text x="187" y="300" textAnchor="middle" className="t-strong a-fade" style={delay(1750)}>
        {t("result")}
      </text>
    </Plate>
  );
}
