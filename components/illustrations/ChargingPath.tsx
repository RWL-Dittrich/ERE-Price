import { getLang } from "@/lib/lang.server";
import { Plate, d, headDown, headRight } from "./svg";

// data-part groups light up while the matching condition (li[data-key]) in the text is hovered; see illustrations.css.
const cables = ["M62 92H120", "M148 80C166 80 170 88 188 88"];

const T = {
  nl: {
    title: "Thuisladen en ERE-E",
    desc: "Stroom gaat van jouw netaansluiting via de laadpaal met ingebouwde MID-meter naar de auto. De gemeten kWh gaan, met jouw machtiging, naar een inboekdienstverlener, die ze inboekt als ERE-E. Zelf inboeken mag niet, en een losse externe meter volstaat niet.",
    grid: ["jouw", "netaansluiting"],
    meter: ["laadpaal met", "MID-meter"],
    car: "auto",
    loose: "losse meter",
    kwh: "gemeten kWh",
    mandate: "machtiging",
    // One line per entry; the pill fits two.
    provider: ["inboekdienstverlener"],
    register: "inboeken",
    self: "niet zelf inboeken",
  },
  en: {
    title: "Charging at home and ERE-E",
    desc: "Electricity flows from your grid connection through the charge point with its built-in MID meter to the car. The measured kWh go, with your authorisation, to a registration service provider, which registers them as ERE-E. You may not register them yourself, and a separate external meter is not enough.",
    grid: ["your", "grid connection"],
    meter: ["charge point with", "MID meter"],
    car: "car",
    loose: "separate meter",
    kwh: "measured kWh",
    mandate: "authorisation",
    provider: ["registration", "service provider"],
    register: "registers",
    self: "no self-registration",
  },
};

export default async function ChargingPath() {
  const t = T[await getLang()];
  return (
    <Plate id="ill-laden" height={340} title={t.title} desc={t.desc}>
      <g data-part="grid">
        <g className="a-pop" style={d(150)}>
          <path d="M12 64L40 40L68 64" className="stroke-muted" />
          <rect x="18" y="64" width="44" height="40" className="fill-page stroke-muted" />
          <rect x="34" y="84" width="12" height="20" className="stroke-muted" />
          <text x="4" y="120">
            {t.grid[0]}
          </text>
          <text x="4" y="133">
            {t.grid[1]}
          </text>
        </g>
      </g>
      <g data-part="meter">
        <g className="a-pop" style={d(240)}>
          <rect x="120" y="44" width="28" height="60" rx="6" className="fill-page stroke-muted" />
          <rect x="125" y="52" width="18" height="12" rx="2" className="fill-(--ill-soft) stroke-accent" />
          <text x="134" y="120" textAnchor="middle">
            {t.meter[0]}
          </text>
          <text x="134" y="133" textAnchor="middle">
            {t.meter[1]}
          </text>
        </g>
      </g>
      <g data-part="car">
        <g className="a-pop" style={d(320)}>
          <path
            d="M188 98V86Q188 79 195 78L207 77L217 67Q220 64 225 64H237Q242 64 245 68L250 76Q252 79 252 83V98Z"
            className="fill-page stroke-muted"
          />
          <path d="M211 77L219 69H236L241 77Z" className="stroke-muted" />
          <circle cx="202" cy="100" r="7" className="fill-page stroke-muted" />
          <circle cx="238" cy="100" r="7" className="fill-page stroke-muted" />
          <text x="220" y="124" textAnchor="middle">
            {t.car}
          </text>
        </g>
      </g>
      <g data-part="cable">
        <path pathLength={1} d={cables[0]} className="a-draw stroke-muted" style={d(410, { "--dur": "390ms" })} />
        <path pathLength={1} d={cables[1]} className="a-draw stroke-muted" style={d(710, { "--dur": "390ms" })} />
        <g className="a-fade" style={d(1050)}>
          {cables.map((c) => (
            <path key={c} d={c} strokeDasharray="3 9" className="flow stroke-accent stroke-2" />
          ))}
        </g>
      </g>
      {/* Over the supply cable: above the car cable it read as a meter between laadpaal and auto. */}
      <g data-part="loose">
        <g className="a-fade" style={d(1140)}>
          <text x="91" y="30" textAnchor="middle">
            {t.loose}
          </text>
          <rect x="80" y="36" width="22" height="14" rx="3" strokeDasharray="2 2" className="stroke-muted" />
          <path d="M86 39L96 47M96 39L86 47" className="stroke-muted" />
        </g>
      </g>
      <g data-part="kwh">
        <g className="a-slide" style={d(1180, { "--from": "0 -6px" })}>
          <path d="M134 141V194" strokeDasharray="2 4" className="stroke-accent" />
          <text x="140" y="160">
            {t.kwh}
          </text>
        </g>
      </g>
      <g data-part="mandate" style={d(1350)}>
        <circle cx="48" cy="144" r="2" className="a-fade fill-muted" />
        <path d="M48 147V196" strokeDasharray="2 3" className="a-fade stroke-muted" />
        {/* Document centred on the pill (y 214) so the arrow runs straight across the gap. */}
        <g className="a-pop">
          <path d="M39 199H52L60 207V226Q60 229 57 229H39Q36 229 36 226V202Q36 199 39 199Z" className="fill-page stroke-muted" />
          <path d="M52 199V207H60M41 212H55M41 217H55M41 222H50" className="stroke-muted" />
        </g>
        <text x="48" y="246" textAnchor="middle" className="a-fade">
          {t.mandate}
        </text>
        <g className="a-fade" style={d(1480)}>
          <path d="M62 214H83" className="stroke-accent" />
          <path d={headRight(89, 214)} className="fill-accent" />
        </g>
      </g>
      <g data-part="provider">
        <g className="a-pop" style={d(1570)}>
          <rect x="88" y="196" width="148" height="36" rx="18" className="fill-page stroke-accent" />
          {t.provider.map((line, i) => (
            <text key={line} x="162" y={218 - 7 * (t.provider.length - 1) + 14 * i} textAnchor="middle" className="t-strong">
              {line}
            </text>
          ))}
        </g>
      </g>
      <g data-part="ere">
        <path pathLength={1} d="M162 232V281" className="a-draw stroke-accent" style={d(1740, { "--dur": "300ms" })} />
        <path d={headDown(162, 286)} className="a-pop fill-accent" style={d(2000)} />
        <text x="168" y="262" className="a-fade" style={d(1830)}>
          {t.register}
        </text>
        <g className="glow">
          <g className="a-pop" style={d(2000)}>
            <rect x="126" y="288" width="72" height="26" rx="13" className="fill-accent" />
            <text x="162" y="305" textAnchor="middle" className="t-on-accent">
              ERE-E
            </text>
          </g>
        </g>
      </g>
      <g data-part="self">
        <path d="M46 144H12V301H122" strokeDasharray="3 4" className="a-fade stroke-muted" style={d(2090)} />
        <g className="a-pop" style={d(2170)}>
          <circle cx="12" cy="275" r="7" className="fill-card stroke-muted" />
          <path d="M9.5 272.5L14.5 277.5M14.5 272.5L9.5 277.5" className="stroke-muted" />
        </g>
        <text x="18" y="326" className="a-fade" style={d(2210)}>
          {t.self}
        </text>
      </g>
    </Plate>
  );
}
