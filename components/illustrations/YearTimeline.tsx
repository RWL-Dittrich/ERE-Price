import { getLang } from "@/lib/lang.server";
import { d } from "./svg";

const T = {
  nl: {
    title: "Inboeken tot 1 maart, jaarafsluiting op 1 april",
    delivered: "stroom geleverd",
    nextYear: "jaar erna",
    registerBy: "inboeken tot",
    march: "1 maart",
    closing: "jaarafsluiting",
    april: "1 april",
  },
  en: {
    title: "Register by 1 March, year-end closing on 1 April",
    delivered: "electricity delivered",
    nextYear: "next year",
    registerBy: "register by",
    march: "1 March",
    closing: "year-end closing",
    april: "1 April",
  },
};

// FAQ "Wanneer worden ERE's ingeboekt?": plays when the <details> opens (illustrations.css), not on scroll.
// To scale at 13 units per month: the delivery year runs 8–164, the next year starts at 166, so 1 maart sits at
// 192 and 1 april at 205. The axis stops at 1 mei (218) and trails off.
export default async function YearTimeline() {
  const t = T[await getLang()];
  return (
    <svg viewBox="0 0 300 76" className="ill-svg ill-tl mt-1 max-w-[22rem]" role="img" aria-labelledby="ill-tijdlijn-t">
      <title id="ill-tijdlijn-t">{t.title}</title>
      <path pathLength={1} d="M8 34H218" className="tl-axis stroke-(--grid)" />
      <path d="M222 34H246" strokeDasharray="2 4" className="stroke-(--grid)" />
      <rect x="8" y="30" width="156" height="8" rx="4" className="tl-seg fill-(--ill-soft) stroke-accent" />
      <text x="8" y="20">
        {t.delivered}
      </text>
      <path d="M166 22V42" strokeDasharray="2 3" className="stroke-muted" />
      <text x="172" y="20">
        {t.nextYear}
      </text>
      {/* The two deadlines are a month apart, so their labels hang off opposite sides of their dots. */}
      <g textAnchor="end">
        <circle cx="192" cy="34" r="4" className="tl-dot fill-accent" />
        <text x="189" y="56">
          {t.registerBy}
        </text>
        <text x="189" y="69" className="t-strong">
          {t.march}
        </text>
      </g>
      <g>
        <circle cx="205" cy="34" r="4" className="tl-dot fill-fg" style={d(650)} />
        <text x="208" y="56">
          {t.closing}
        </text>
        <text x="208" y="69" className="t-strong">
          {t.april}
        </text>
      </g>
    </svg>
  );
}
