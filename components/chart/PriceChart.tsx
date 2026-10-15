"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { monthTicks, priceAxis } from "@/lib/chart-axes";
import type { EreWeek } from "@/lib/ere";
import { weekLabel } from "@/lib/week";
import { stagger } from "../motion/stagger";
import { useInView } from "../motion/useInView";
import PriceTable from "./PriceTable";
import PriceTooltip from "./PriceTooltip";
import RangeToggle from "./RangeToggle";
import { DEFAULT_RANGE, availableRanges, weeksInRange, type RangeKey } from "./ranges";

const axisTick = { fill: "var(--muted)", fontSize: 12 };

/** The weekly mid price as a line, with the bid–offer spread as a band around it. */
export default function PriceChart({ weeks }: { weeks: EreWeek[] }) {
  const t = useTranslations("Chart");
  const format = useFormatter();
  const price = (euro: number) => format.number(euro, "price");
  // The series draw in once the plot is on screen (recharts skips the animation under reduced motion).
  const [plotRef, plotInView] = useInView<HTMLDivElement>(0.3);

  const ranges = availableRanges(weeks);
  const [selectedKey, setSelectedKey] = useState<RangeKey>(DEFAULT_RANGE);
  // Fall back to the longest range on offer when the selected one isn't (yet) available.
  const range = ranges.find((r) => r.key === selectedKey) ?? ranges[ranges.length - 1];
  const rangeName = t(`ranges.${range.key}.name`);

  const shown = weeksInRange(weeks, range);
  const first = shown[0];
  const last = shown[shown.length - 1];
  const chartData = shown.map((week) => ({ ...week, band: [week.bid, week.offer] }));
  const xTicks = monthTicks(first.monday, last.monday, range.tickEveryMonths);
  const yAxis = priceAxis(shown.flatMap((week) => [week.bid, week.offer]));

  const high = shown.reduce((best, week) => (week.mid > best.mid ? week : best));
  const low = shown.reduce((best, week) => (week.mid < best.mid ? week : best));
  const summary = t("summary", {
    range: rangeName,
    count: shown.length,
    from: price(first.mid),
    fromWeek: weekLabel(first),
    to: price(last.mid),
    toWeek: weekLabel(last),
    high: price(high.mid),
    highWeek: weekLabel(high),
    low: price(low.mid),
    lowWeek: weekLabel(low),
  });

  return (
    <section aria-labelledby="verloop-titel" className="mt-12">
      <div data-reveal="" className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="verloop-titel" className="text-lg font-semibold tracking-tight">
            {t("title")}
          </h2>
          <p className="text-sm text-muted">{t("subtitle")}</p>
        </div>
        <RangeToggle ranges={ranges} selected={range.key} onSelect={setSelectedKey} />
      </div>

      <figure data-reveal="" className="mt-4 rounded-2xl border border-line bg-card p-4 sm:p-6" style={stagger(1)}>
        <div aria-hidden className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-4 rounded-full bg-accent" />
            {t("legendMid")}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-4 rounded-sm bg-band" />
            {t("legendBand")}
          </span>
        </div>
        {/* Hidden from assistive tech: the caption below and the data table carry the same information. */}
        <div ref={plotRef} aria-hidden className="relative h-72">
          <noscript>
            <p className="absolute inset-0 grid place-items-center px-4 text-center text-sm text-muted">{t("noScript")}</p>
          </noscript>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} accessibilityLayer={false}>
              {/* Only at the labelled ticks, so no unlabelled line at the padded domain edge. */}
              <CartesianGrid vertical={false} horizontalValues={yAxis.ticks} stroke="var(--grid)" />
              <XAxis
                dataKey="monday"
                type="number"
                domain={["dataMin", "dataMax"]}
                padding={{ left: 12, right: 8 }}
                ticks={xTicks}
                // Drops every other month label when they would crowd, e.g. 6 months at phone width.
                interval="equidistantPreserveStart"
                minTickGap={16}
                tickFormatter={(monday: number) => format.dateTime(monday, "month")}
                tick={axisTick}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                width={56}
                domain={yAxis.domain}
                ticks={yAxis.ticks}
                tickFormatter={(euro: number) => format.number(euro, "axisPrice")}
                tick={axisTick}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                // Rendered as an element (not called as a function), so PriceTooltip can use hooks.
                content={(props) => <PriceTooltip {...props} />}
                cursor={{ stroke: "var(--muted)", strokeWidth: 1 }}
                animationDuration={180}
                wrapperStyle={{ zIndex: 20 }}
              />
              {/* Keyed by range: a range change remounts both series, so they redraw instead of morphing. */}
              {plotInView && (
                <Area
                  key={`band-${range.key}`}
                  dataKey="band"
                  stroke="none"
                  fill="var(--band)"
                  activeDot={false}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              )}
              {plotInView && (
                <Line
                  key={`mid-${range.key}`}
                  dataKey="mid"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={{ r: 2, fill: "var(--accent)", strokeWidth: 0 }}
                  activeDot={{ r: 5, stroke: "var(--card)", strokeWidth: 2 }}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <figcaption className="mt-3 text-xs leading-relaxed text-muted">{summary}</figcaption>
      </figure>

      <PriceTable weeks={shown} rangeName={rangeName} />
    </section>
  );
}
