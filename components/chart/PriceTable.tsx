"use client";

import { useFormatter, useTranslations } from "next-intl";
import type { EreWeek } from "@/lib/ere";
import { weekLabel } from "@/lib/week";
import { stagger } from "../motion/stagger";
import { useUnit } from "../unit";

/** The chart's data as a table, behind a disclosure: the accessible alternative to the (aria-hidden) chart. */
export default function PriceTable({ weeks, rangeName }: { weeks: EreWeek[]; rangeName: string }) {
  const t = useTranslations("Chart.table");
  const format = useFormatter();
  const { unit } = useUnit();
  const newestFirst = [...weeks].reverse();

  return (
    <details data-disclosure="" data-reveal="fade" className="mt-3 text-sm" style={stagger(2)}>
      <summary className="min-h-11 w-fit text-muted transition-colors hover:text-fg focus-visible:text-fg">
        {t("toggle")}
      </summary>
      {/* Padding, not a margin, so the region's focus ring fits inside the clipped ::details-content box. */}
      <div className="py-1">
        <div
          tabIndex={0}
          role="region"
          aria-label={t("label", { unit })}
          className="max-h-96 overflow-auto rounded-xl border border-line bg-card sm:max-w-xl"
        >
          <table className="w-full text-right tabular-nums">
            <caption className="sr-only">{t("caption", { unit, range: rangeName })}</caption>
            <thead className="sticky top-0 bg-card text-xs text-muted">
              <tr>
                <th scope="col" className="px-2 py-2 text-left font-medium sm:px-3">{t("week")}</th>
                <th scope="col" className="px-2 py-2 font-medium sm:px-3">{t("bid")}</th>
                <th scope="col" className="px-2 py-2 font-medium sm:px-3">{t("mid")}</th>
                <th scope="col" className="px-2 py-2 font-medium sm:px-3">{t("offer")}</th>
              </tr>
            </thead>
            <tbody>
              {newestFirst.map((week) => (
                <tr key={week.monday} className="border-t border-line">
                  <th scope="row" className="px-2 py-2 text-left font-normal whitespace-nowrap sm:px-3">
                    {weekLabel(week)}
                    <span className="block text-xs text-muted">{format.dateTime(week.monday, "date")}</span>
                  </th>
                  <td className="px-2 py-2 sm:px-3">{format.number(week.bid, "price")}</td>
                  <td className="px-2 py-2 font-medium sm:px-3">{format.number(week.mid, "price")}</td>
                  <td className="px-2 py-2 sm:px-3">{format.number(week.offer, "price")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </details>
  );
}
