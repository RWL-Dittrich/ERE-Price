import { getFormatter, getTranslations } from "next-intl/server";
import { summarize, type ErePrices } from "@/lib/ere";
import { weekLabel } from "@/lib/week";
import { stagger } from "./motion/stagger";
import TipChip from "./TipChip";

/** The current price, its change since the previous quote, bid and offer, and three key figures. */
export default async function Hero({ prices }: { prices: ErePrices }) {
  const t = await getTranslations("Hero");
  const format = await getFormatter();
  const { current } = prices;
  const { previous, change, high, low, spread } = summarize(prices);
  const updatedAt = new Date(prices.updatedAt);

  // The arrow carries the direction (also for screen readers), so the amounts are shown unsigned.
  const [arrow, direction, colors] =
    change > 0
      ? ["▲", t("change.up"), "bg-up/12 text-up"]
      : change < 0
        ? ["▼", t("change.down"), "bg-down/12 text-down"]
        : ["=", t("change.unchanged"), "bg-muted/12 text-muted"];

  return (
    <section aria-labelledby="prijs-titel" className="hero relative isolate pt-10 sm:pt-14">
      {/* .hero-in plays the hero's intro, one row after the other (stagger). */}
      <p className="hero-in flex items-center gap-2 text-sm font-medium text-accent" style={stagger(0)}>
        <span aria-hidden className="live-dot size-2 rounded-full bg-accent" />
        {weekLabel(current)}
      </p>
      <h1 id="prijs-titel" className="hero-in mt-3 text-base font-medium text-muted" style={stagger(1)}>
        {t("title")}
      </h1>
      <p className="hero-in mt-1 flex flex-wrap items-baseline gap-x-3" style={stagger(2)}>
        <span className="text-6xl font-semibold tracking-tight sm:text-7xl">{format.number(current.mid, "price")}</span>
        <span className="text-lg text-muted">{t("perEre")}</span>
      </p>
      {previous && (
        <p className="hero-in mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm" style={stagger(3)}>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium tabular-nums ${colors}`}>
            <span role="img" aria-label={direction} className="text-xs">
              {arrow}
            </span>
            {format.number(Math.abs(change), "price")} ({format.number(Math.abs(change / previous.mid), "percent")})
          </span>
          <span className="text-muted">{t("comparedTo", { week: weekLabel(previous) })}</span>
        </p>
      )}
      {/* z-10: every .hero-in row is its own stacking context, so the chip tooltips must lift the whole row. */}
      <div className="hero-in relative z-10 mt-5 flex flex-wrap gap-2 text-sm" style={stagger(4)}>
        <TipChip label={t("bid.label")} value={format.number(current.bid, "price")} tip={t("bid.tip")} />
        <TipChip label={t("offer.label")} value={format.number(current.offer, "price")} align="end" tip={t("offer.tip")} />
      </div>
      {!Number.isNaN(updatedAt.getTime()) && (
        <p className="hero-in mt-4 text-xs text-muted" style={stagger(5)}>
          {t("updated", { date: format.dateTime(updatedAt, "updated") })}
        </p>
      )}

      <dl className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
        <KeyFigure label={t("high")} value={high.mid} shown={format.number(high.mid, "price")} note={weekLabel(high)} order={6} />
        <KeyFigure label={t("low")} value={low.mid} shown={format.number(low.mid, "price")} note={weekLabel(low)} order={7} />
        <KeyFigure label={t("spread")} value={spread} shown={format.number(spread, "price")} note={t("spreadNote")} order={8} />
      </dl>
    </section>
  );
}

/** A key figure card. Its value counts up when it scrolls into view (data-countup, see MotionRoot). */
function KeyFigure({
  label,
  value,
  shown,
  note,
  order,
}: {
  label: string;
  value: number;
  /** `value`, formatted. */
  shown: string;
  note: string;
  order: number;
}) {
  return (
    <div data-spotlight="" className="hero-in rounded-xl border border-line bg-card p-3 sm:p-4" style={stagger(order)}>
      <dt className="text-xs text-muted">{label}</dt>
      <dd data-countup={value} className="mt-1 text-base font-semibold tracking-tight tabular-nums sm:text-xl">
        {shown}
      </dd>
      <dd className="mt-0.5 text-xs text-muted">{note}</dd>
    </div>
  );
}
