import { DAY_MS } from "./time";

// ISO weeks, as the price feed numbers them. No server-only imports here, so client components can use it too.

/** "week 38 · 2026", the same in both languages. */
export function weekLabel({ week, year }: { week: number; year: number }) {
  return `week ${week} · ${year}`;
}

/** Monday of an ISO week, in UTC milliseconds. ISO week 1 is the week that contains 4 January. */
export function isoWeekMonday(year: number, week: number): number {
  const january4 = Date.UTC(year, 0, 4);
  const daysSinceMonday = (new Date(january4).getUTCDay() + 6) % 7;
  return january4 + ((week - 1) * 7 - daysSinceMonday) * DAY_MS;
}
