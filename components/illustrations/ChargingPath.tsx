import { getTranslations } from "next-intl/server";
import { Plate, arrowheadDown, arrowheadRight, delay, lines } from "./svg";

const SUPPLY_CABLE = "M62 92H120";
const CAR_CABLE = "M148 80C166 80 170 88 188 88";

/**
 * Part 03: home → charge point with MID meter → car; the measured kWh go, with an authorisation, to the
 * registration service provider, who registers them as ERE-E.
 *
 * Each data-part group lights up while the matching condition (li[data-key]) in the text is hovered; see
 * illustrations.css.
 */
export default async function ChargingPath() {
  const t = await getTranslations("Illustrations.chargingPath");
  const gridConnection = lines(t("gridConnection"));
  const chargePoint = lines(t("chargePoint"));
  // The provider pill holds one or two centred lines.
  const provider = lines(t("provider"));
  const providerFirstLineY = 218 - 7 * (provider.length - 1);

  return (
    <Plate id="ill-laden" height={340} title={t("title")} description={t("description")}>
      <g data-part="grid">
        <g className="a-pop" style={delay(150)}>
          <path d="M12 64L40 40L68 64" className="stroke-muted" />
          <rect x="18" y="64" width="44" height="40" className="fill-page stroke-muted" />
          <rect x="34" y="84" width="12" height="20" className="stroke-muted" />
          <text x="4" y="120">
            {gridConnection[0]}
          </text>
          <text x="4" y="133">
            {gridConnection[1]}
          </text>
        </g>
      </g>
      <g data-part="meter">
        <g className="a-pop" style={delay(240)}>
          <rect x="120" y="44" width="28" height="60" rx="6" className="fill-page stroke-muted" />
          <rect x="125" y="52" width="18" height="12" rx="2" className="fill-(--ill-soft) stroke-accent" />
          <text x="134" y="120" textAnchor="middle">
            {chargePoint[0]}
          </text>
          <text x="134" y="133" textAnchor="middle">
            {chargePoint[1]}
          </text>
        </g>
      </g>
      <g data-part="car">
        <g className="a-pop" style={delay(320)}>
          <path
            d="M188 98V86Q188 79 195 78L207 77L217 67Q220 64 225 64H237Q242 64 245 68L250 76Q252 79 252 83V98Z"
            className="fill-page stroke-muted"
          />
          <path d="M211 77L219 69H236L241 77Z" className="stroke-muted" />
          <circle cx="202" cy="100" r="7" className="fill-page stroke-muted" />
          <circle cx="238" cy="100" r="7" className="fill-page stroke-muted" />
          <text x="220" y="124" textAnchor="middle">
            {t("car")}
          </text>
        </g>
      </g>
      <g data-part="cable">
        <path pathLength={1} d={SUPPLY_CABLE} className="a-draw stroke-muted" style={delay(410, { "--dur": "390ms" })} />
        <path pathLength={1} d={CAR_CABLE} className="a-draw stroke-muted" style={delay(710, { "--dur": "390ms" })} />
        {/* Current flowing through both cables (.flow). */}
        <g className="a-fade" style={delay(1050)}>
          {[SUPPLY_CABLE, CAR_CABLE].map((cable) => (
            <path key={cable} d={cable} strokeDasharray="3 9" className="flow stroke-accent stroke-2" />
          ))}
        </g>
      </g>
      {/* Above the supply cable: above the car cable it read as a meter between the charge point and the car. */}
      <g data-part="loose">
        <g className="a-fade" style={delay(1140)}>
          <text x="91" y="30" textAnchor="middle">
            {t("separateMeter")}
          </text>
          <rect x="80" y="36" width="22" height="14" rx="3" strokeDasharray="2 2" className="stroke-muted" />
          <path d="M86 39L96 47M96 39L86 47" className="stroke-muted" />
        </g>
      </g>
      <g data-part="kwh">
        <g className="a-slide" style={delay(1180, { "--from": "0 -6px" })}>
          <path d="M134 141V194" strokeDasharray="2 4" className="stroke-accent" />
          <text x="140" y="160">
            {t("measuredKwh")}
          </text>
        </g>
      </g>
      <g data-part="mandate" style={delay(1350)}>
        <circle cx="48" cy="144" r="2" className="a-fade fill-muted" />
        <path d="M48 147V196" strokeDasharray="2 3" className="a-fade stroke-muted" />
        {/* The document is centred on the pill (y 214), so the arrow runs straight across the gap. */}
        <g className="a-pop">
          <path d="M39 199H52L60 207V226Q60 229 57 229H39Q36 229 36 226V202Q36 199 39 199Z" className="fill-page stroke-muted" />
          <path d="M52 199V207H60M41 212H55M41 217H55M41 222H50" className="stroke-muted" />
        </g>
        <text x="48" y="246" textAnchor="middle" className="a-fade">
          {t("authorisation")}
        </text>
        <g className="a-fade" style={delay(1480)}>
          <path d="M62 214H83" className="stroke-accent" />
          <path d={arrowheadRight(89, 214)} className="fill-accent" />
        </g>
      </g>
      <g data-part="provider">
        <g className="a-pop" style={delay(1570)}>
          <rect x="88" y="196" width="148" height="36" rx="18" className="fill-page stroke-accent" />
          {provider.map((line, i) => (
            <text key={line} x="162" y={providerFirstLineY + 14 * i} textAnchor="middle" className="t-strong">
              {line}
            </text>
          ))}
        </g>
      </g>
      <g data-part="ere">
        <path pathLength={1} d="M162 232V281" className="a-draw stroke-accent" style={delay(1740, { "--dur": "300ms" })} />
        <path d={arrowheadDown(162, 286)} className="a-pop fill-accent" style={delay(2000)} />
        <text x="168" y="262" className="a-fade" style={delay(1830)}>
          {t("registers")}
        </text>
        <g className="glow">
          <g className="a-pop" style={delay(2000)}>
            <rect x="126" y="288" width="72" height="26" rx="13" className="fill-accent" />
            <text x="162" y="305" textAnchor="middle" className="t-on-accent">
              ERE-E
            </text>
          </g>
        </g>
      </g>
      <g data-part="self">
        <path d="M46 144H12V301H122" strokeDasharray="3 4" className="a-fade stroke-muted" style={delay(2090)} />
        <g className="a-pop" style={delay(2170)}>
          <circle cx="12" cy="275" r="7" className="fill-card stroke-muted" />
          <path d="M9.5 272.5L14.5 277.5M14.5 272.5L9.5 277.5" className="stroke-muted" />
        </g>
        <text x="18" y="326" className="a-fade" style={delay(2210)}>
          {t("noSelfRegistration")}
        </text>
      </g>
    </Plate>
  );
}
