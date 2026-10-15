"use client";

import { useFormatter, useTranslations } from "next-intl";
import type { TooltipContentProps } from "recharts";
import type { EreWeek } from "@/lib/ere";
import { weekLabel } from "@/lib/week";

/** The hover card on the chart: the week, its Monday, and offer / mid / bid in the same order as the chart. */
export default function PriceTooltip({ active, payload }: TooltipContentProps) {
  const t = useTranslations("Chart.tooltip");
  const format = useFormatter();
  if (!active || !payload?.length) return null;

  const week = payload[0].payload as EreWeek;
  return (
    <div className="rounded-lg border border-line bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-fg">{weekLabel(week)}</p>
      <p className="text-muted">{t("monday", { date: format.dateTime(week.monday, "date") })}</p>
      <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1">
        <span className="text-muted">{t("offer")}</span>
        <span className="text-right font-semibold text-fg tabular-nums">{format.number(week.offer, "price")}</span>
        <span className="flex items-center gap-1.5 text-muted">
          <span aria-hidden className="h-0.5 w-3 rounded-full bg-accent" />
          {t("mid")}
        </span>
        <span className="text-right font-semibold text-fg tabular-nums">{format.number(week.mid, "price")}</span>
        <span className="text-muted">{t("bid")}</span>
        <span className="text-right font-semibold text-fg tabular-nums">{format.number(week.bid, "price")}</span>
      </div>
    </div>
  );
}
