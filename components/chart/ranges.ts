import type { EreWeek } from "@/lib/ere";
import { WEEK_MS } from "@/lib/time";

/** The chart's period buttons. Month labels on the x-axis are thinned out on longer ranges, so they fit on a phone. */
export const RANGES = [
  { key: "3m", weeks: 13, tickEveryMonths: 1 },
  { key: "6m", weeks: 26, tickEveryMonths: 1 },
  { key: "1y", weeks: 52, tickEveryMonths: 2 },
  { key: "2y", weeks: 104, tickEveryMonths: 4 },
] as const;

export type Range = (typeof RANGES)[number];
export type RangeKey = Range["key"];

export const DEFAULT_RANGE: RangeKey = "1y";

/** The ranges worth offering: each one only once the history reaches past the one before it, so no two buttons show the same data. */
export function availableRanges(weeks: EreWeek[]): Range[] {
  const span = weeks[weeks.length - 1].monday - weeks[0].monday;
  return RANGES.filter((range, i) => i === 0 || span >= RANGES[i - 1].weeks * WEEK_MS);
}

/** The weeks inside a range, counted back from the latest week. */
export function weeksInRange(weeks: EreWeek[], range: Range): EreWeek[] {
  const latest = weeks[weeks.length - 1].monday;
  return weeks.filter((week) => week.monday > latest - range.weeks * WEEK_MS);
}
