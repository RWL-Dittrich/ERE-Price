// Axis ticks for the price chart, as plain functions so they can be checked on their own (chart-axes.check.ts).

/**
 * The y-axis for euro prices: ticks on whole cents, 2 or 5 cents apart, inside a domain that reaches a fifth of a
 * step past the data. That way the two-decimal tick labels are exact and the line never touches the plot edge.
 * Always at least two ticks.
 */
export function priceAxis(prices: number[]): { ticks: number[]; domain: [number, number] } {
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const step = high - low > 0.1 ? 0.05 : 0.02;
  const padding = step / 5;

  // The epsilon absorbs floating-point error: 0.35 / 0.05 is 6.999…, not 7.
  const EPSILON = 1e-9;
  const firstTick = Math.ceil((low - padding) / step - EPSILON);
  const lastTick = Math.max(Math.floor((high + padding) / step + EPSILON), firstTick + 1);

  const ticks = Array.from({ length: lastTick - firstTick + 1 }, (_, i) => Number(((firstTick + i) * step).toFixed(2)));
  const domain: [number, number] = [Math.min(low - padding, ticks[0]), Math.max(high + padding, ticks[ticks.length - 1])];
  return { ticks, domain };
}

/** The first day of every `everyMonths`-th month after `from`, up to `to` (UTC milliseconds). */
export function monthTicks(from: number, to: number, everyMonths: number): number[] {
  const start = new Date(from);
  const ticks: number[] = [];
  for (let month = start.getUTCMonth() + 1; ; month += everyMonths) {
    const tick = Date.UTC(start.getUTCFullYear(), month, 1);
    if (tick > to) return ticks;
    ticks.push(tick);
  }
}
