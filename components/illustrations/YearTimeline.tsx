import { getTranslations } from "next-intl/server";
import { delay } from "./svg";

/**
 * The FAQ "when are EREs registered?": electricity delivered in a year can be registered until 1 March of the next
 * year; the year-end closing follows on 1 April. Plays when the <details> opens (illustrations.css), not on scroll.
 *
 * To scale at 13 units per month: the delivery year runs from 8 to 164 and the next year starts at 166, so 1 March
 * sits at 192 and 1 April at 205. The axis stops at 1 May (218) and trails off.
 */
export default async function YearTimeline() {
  const t = await getTranslations("Illustrations.yearTimeline");

  return (
    <svg viewBox="0 0 300 76" className="ill-svg ill-tl mt-1 max-w-[22rem]" role="img" aria-labelledby="ill-tijdlijn-t">
      <title id="ill-tijdlijn-t">{t("title")}</title>
      <path pathLength={1} d="M8 34H218" className="tl-axis stroke-(--grid)" />
      <path d="M222 34H246" strokeDasharray="2 4" className="stroke-(--grid)" />
      <rect x="8" y="30" width="156" height="8" rx="4" className="tl-seg fill-(--ill-soft) stroke-accent" />
      <text x="8" y="20">
        {t("delivered")}
      </text>
      <path d="M166 22V42" strokeDasharray="2 3" className="stroke-muted" />
      <text x="172" y="20">
        {t("nextYear")}
      </text>
      {/* The two deadlines are a month apart, so their labels hang off opposite sides of their dots. */}
      <g textAnchor="end">
        <circle cx="192" cy="34" r="4" className="tl-dot fill-accent" />
        <text x="189" y="56">
          {t("registerBy")}
        </text>
        <text x="189" y="69" className="t-strong">
          {t("march")}
        </text>
      </g>
      <g>
        <circle cx="205" cy="34" r="4" className="tl-dot fill-fg" style={delay(650)} />
        <text x="208" y="56">
          {t("closing")}
        </text>
        <text x="208" y="69" className="t-strong">
          {t("april")}
        </text>
      </g>
    </svg>
  );
}
