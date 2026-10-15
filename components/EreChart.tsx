"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import type { EreWeek } from "@/lib/ere";
import { fmt, weekLabel } from "@/lib/format";
import { LOCALE, dict, type Lang } from "@/lib/i18n";

const WEEKS = [13, 26, 52, 104];
const WEEK = 7 * 864e5;
const axisTick = { fill: "var(--muted)", fontSize: 12 };

function Tip({ active, payload, lang }: TooltipContentProps & { lang: Lang }) {
  if (!active || !payload?.length) return null;
  const w = payload[0].payload as EreWeek;
  const c = dict[lang].chart;
  const { eur, date } = fmt(lang);
  return (
    <div className="rounded-lg border border-line bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-fg">{weekLabel(w)}</p>
      <p className="text-muted">
        {c.monday} {date(w.date)}
      </p>
      <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1">
        <span className="text-muted">{c.tipOffer}</span>
        <span className="text-right font-semibold text-fg tabular-nums">{eur(w.offer)}</span>
        <span className="flex items-center gap-1.5 text-muted">
          <span aria-hidden className="h-0.5 w-3 rounded-full bg-accent" />
          {c.tipMid}
        </span>
        <span className="text-right font-semibold text-fg tabular-nums">{eur(w.mid)}</span>
        <span className="text-muted">{c.tipBid}</span>
        <span className="text-right font-semibold text-fg tabular-nums">{eur(w.bid)}</span>
      </div>
    </div>
  );
}

export default function EreChart({ weeks, lang }: { weeks: EreWeek[]; lang: Lang }) {
  const c = dict[lang].chart;
  const { eur, date } = fmt(lang);
  const RANGES = WEEKS.map((n, i) => ({ weeks: n, ...c.ranges[i] }));
  const monthFmt = new Intl.DateTimeFormat(LOCALE[lang], { month: "short", year: "2-digit", timeZone: "UTC" });
  const axisEurFmt = new Intl.NumberFormat(LOCALE[lang], { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
  const [selected, setRange] = useState(52);
  // The series draw in once the plot is on screen (recharts skips the animation under reduced motion).
  const plot = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = plot.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const last = weeks[weeks.length - 1];
  // Only offer a range when the history reaches past the previous one, so no two buttons show the same data.
  const ranges = RANGES.filter((r, i) => i === 0 || weeks[0].date <= last.date - RANGES[i - 1].weeks * WEEK);
  const range = Math.min(selected, ranges[ranges.length - 1].weeks);
  const data = weeks
    .filter((w) => w.date > last.date - range * WEEK)
    .map((w) => ({ ...w, band: [w.bid, w.offer] }));
  const first = data[0];

  // Month ticks, thinned for longer ranges so labels fit at phone width.
  const step = range <= 26 ? 1 : range <= 52 ? 2 : 4;
  const start = new Date(first.date);
  const ticks: number[] = [];
  for (let m = start.getUTCMonth() + 1; ; m += step) {
    const t = Date.UTC(start.getUTCFullYear(), m, 1);
    if (t > last.date) break;
    ticks.push(t);
  }

  // The y domain hugs the data with a small pad; ticks are the whole-cent steps inside it (at least two), so the
  // 2-decimal labels are exact. The epsilon absorbs float error (0.35 / 0.05 = 6.99…).
  const prices = data.flatMap((w) => [w.bid, w.offer]);
  const yLo = Math.min(...prices);
  const yHi = Math.max(...prices);
  const yStep = yHi - yLo > 0.1 ? 0.05 : 0.02;
  const yPad = yStep / 5;
  const n0 = Math.ceil((yLo - yPad) / yStep - 1e-9);
  const n1 = Math.max(Math.floor((yHi + yPad) / yStep + 1e-9), n0 + 1);
  const yTicks = Array.from({ length: n1 - n0 + 1 }, (_, i) => +((n0 + i) * yStep).toFixed(2));
  const yDomain = [Math.min(yLo - yPad, yTicks[0]), Math.max(yHi + yPad, yTicks[yTicks.length - 1])];

  const hi = data.reduce((a, b) => (b.mid > a.mid ? b : a));
  const lo = data.reduce((a, b) => (b.mid < a.mid ? b : a));
  const rangeName = RANGES.find((r) => r.weeks === range)?.name ?? "";
  const summary = c.summary({
    range: rangeName,
    n: data.length,
    from: eur(first.mid),
    fromWeek: weekLabel(first),
    to: eur(last.mid),
    toWeek: weekLabel(last),
    hi: eur(hi.mid),
    hiWeek: weekLabel(hi),
    lo: eur(lo.mid),
    loWeek: weekLabel(lo),
  });

  return (
    <section aria-labelledby="verloop-titel" className="mt-12">
      <div data-reveal="" className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="verloop-titel" className="text-lg font-semibold tracking-tight">
            {c.title}
          </h2>
          <p className="text-sm text-muted">{c.sub}</p>
        </div>
        <div
          role="group"
          aria-label={c.period}
          className="relative grid auto-cols-fr grid-flow-col rounded-lg border border-line bg-card p-1 text-sm"
        >
          <span
            aria-hidden
            className="range-pill"
            style={
              { "--seg-i": ranges.findIndex((r) => r.weeks === range), "--seg-n": ranges.length } as CSSProperties
            }
          />
          {ranges.map((r) => (
            <button
              key={r.weeks}
              type="button"
              aria-pressed={range === r.weeks}
              onClick={() => setRange(r.weeks)}
              className="relative min-w-11 rounded-md px-3 py-2 font-medium text-muted transition-[color,scale] duration-(--m-dur-2) pointer-coarse:min-h-11 hover:not-aria-pressed:text-fg focus-visible:not-aria-pressed:text-fg active:scale-95 aria-pressed:text-card"
            >
              {r.label}
              <span className="sr-only"> ({r.name})</span>
            </button>
          ))}
        </div>
      </div>

      <figure
        data-reveal=""
        className="mt-4 rounded-2xl border border-line bg-card p-4 sm:p-6"
        style={{ "--i": 1 } as CSSProperties}
      >
        <div aria-hidden className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-4 rounded-full bg-accent" />
            {c.mid}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-4 rounded-sm bg-band" />
            {c.band}
          </span>
        </div>
        {/* Hidden from assistive tech: the caption below and the data table carry the same information. */}
        <div ref={plot} aria-hidden className="relative h-72">
          <noscript>
            <p className="absolute inset-0 grid place-items-center px-4 text-center text-sm text-muted">{c.noJs}</p>
          </noscript>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
              accessibilityLayer={false}
            >
              {/* Only at the labelled ticks, so no unlabelled line at the padded domain edge. */}
              <CartesianGrid vertical={false} horizontalValues={yTicks} stroke="var(--grid)" />
              <XAxis
                dataKey="date"
                type="number"
                domain={["dataMin", "dataMax"]}
                padding={{ left: 12, right: 8 }}
                ticks={ticks}
                // Drops every other month label when they would crowd, e.g. 6 months at phone width.
                interval="equidistantPreserveStart"
                minTickGap={16}
                tickFormatter={(t: number) => monthFmt.format(t)}
                tick={axisTick}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                width={56}
                domain={yDomain}
                ticks={yTicks}
                tickFormatter={(v: number) => axisEurFmt.format(v)}
                tick={axisTick}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={(p: TooltipContentProps) => <Tip {...p} lang={lang} />}
                cursor={{ stroke: "var(--muted)", strokeWidth: 1 }}
                animationDuration={180}
                wrapperStyle={{ zIndex: 20 }}
              />
              {/* Keyed by range: a range change remounts both series, so they redraw instead of morphing. */}
              {seen && (
                <Area
                  key={`band-${range}`}
                  dataKey="band"
                  stroke="none"
                  fill="var(--band)"
                  activeDot={false}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              )}
              {seen && (
                <Line
                  key={`mid-${range}`}
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

      <details
        data-disclosure=""
        data-reveal="fade"
        className="mt-3 text-sm"
        style={{ "--i": 2 } as CSSProperties}
      >
        <summary className="min-h-11 w-fit text-muted transition-colors hover:text-fg focus-visible:text-fg">
          {c.table}
        </summary>
        {/* Padding, not a margin, so the region's focus ring fits inside the clipped ::details-content box. */}
        <div className="py-1">
          <div
            tabIndex={0}
            role="region"
            aria-label={c.tableLabel}
            className="max-h-96 overflow-auto rounded-xl border border-line bg-card sm:max-w-xl"
          >
            <table className="w-full text-right tabular-nums">
              <caption className="sr-only">{c.caption(rangeName)}</caption>
              <thead className="sticky top-0 bg-card text-xs text-muted">
                <tr>
                  <th scope="col" className="px-2 py-2 text-left font-medium sm:px-3">{c.week}</th>
                  <th scope="col" className="px-2 py-2 font-medium sm:px-3">{c.colBid}</th>
                  <th scope="col" className="px-2 py-2 font-medium sm:px-3">{c.colMid}</th>
                  <th scope="col" className="px-2 py-2 font-medium sm:px-3">{c.colOffer}</th>
                </tr>
              </thead>
              <tbody>
                {[...data].reverse().map((w) => (
                  <tr key={w.date} className="border-t border-line">
                    <th scope="row" className="px-2 py-2 text-left font-normal whitespace-nowrap sm:px-3">
                      {weekLabel(w)}
                      <span className="block text-xs text-muted">{date(w.date)}</span>
                    </th>
                    <td className="px-2 py-2 sm:px-3">{eur(w.bid)}</td>
                    <td className="px-2 py-2 font-medium sm:px-3">{eur(w.mid)}</td>
                    <td className="px-2 py-2 sm:px-3">{eur(w.offer)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </section>
  );
}
