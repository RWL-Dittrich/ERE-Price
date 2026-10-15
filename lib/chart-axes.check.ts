// Self-check for the chart axes. Run: node lib/chart-axes.check.ts
import assert from "node:assert/strict";
import { monthTicks, priceAxis } from "./chart-axes.ts";

const cents = (value: number) => Math.round(value * 100);

for (const prices of [
  [0.36, 0.49], // wide range: 5-cent steps
  [0.36, 0.37], // narrow range: 2-cent steps
  [0.35, 0.35], // a flat line
  [0.35, 0.55, 0.42], // a low on a tick (float error case)
  [0.4275, 0.435, 0.42],
]) {
  const { ticks, domain } = priceAxis(prices);
  assert.ok(ticks.length >= 2, `at least two ticks for ${prices}`);
  assert.ok(Math.min(...prices) > domain[0] && Math.max(...prices) < domain[1], `data inside the domain for ${prices}`);
  assert.ok(ticks[0] >= domain[0] && ticks[ticks.length - 1] <= domain[1], `ticks inside the domain for ${prices}`);
  for (const tick of ticks) assert.equal(tick, cents(tick) / 100, `${tick} is a whole cent`);
  const steps = new Set(ticks.slice(1).map((tick, i) => cents(tick) - cents(ticks[i])));
  assert.equal(steps.size, 1, `even steps for ${prices}`);
}

// 2026-01-05 to 2026-04-20, every month: 1 Feb, 1 Mar, 1 Apr.
const jan5 = Date.UTC(2026, 0, 5);
const apr20 = Date.UTC(2026, 3, 20);
assert.deepEqual(monthTicks(jan5, apr20, 1), [Date.UTC(2026, 1, 1), Date.UTC(2026, 2, 1), Date.UTC(2026, 3, 1)]);
assert.deepEqual(monthTicks(jan5, apr20, 2), [Date.UTC(2026, 1, 1), Date.UTC(2026, 3, 1)]);
// Across a year boundary.
assert.deepEqual(monthTicks(Date.UTC(2025, 10, 20), Date.UTC(2026, 1, 2), 1), [
  Date.UTC(2025, 11, 1),
  Date.UTC(2026, 0, 1),
  Date.UTC(2026, 1, 1),
]);

console.log("chart axes ok");
