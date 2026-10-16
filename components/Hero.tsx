import { getFormatter, getTranslations } from "next-intl/server";
import { ERE_PER_KWH } from "@/lib/earnings";
import { summarize, type ErePrices } from "@/lib/ere";
import { weekLabel } from "@/lib/week";
import { stagger } from "./motion/stagger";
import TipChip from "./TipChip";
import { ByUnit, UnitToggle, type Unit } from "./unit";

/**
 * The current price, its change since the previous quote, bid and offer, and three key figures. Every price is
 * rendered both per ERE and per kWh; UnitToggle picks which one shows.
 */
export default async function Hero({ prices }: { prices: ErePrices }) {
  const t = await getTranslations("Hero");
  const format = await getFormatter();
  const { current } = prices;
  const { previous, change, high, low, spread } = summarize(prices);
  const updatedAt = new Date(prices.updatedAt);
  const euros = (amount: number) => format.number(amount, "price");
  /** A price per ERE, shown per ERE or converted to per kWh. */
  const price = (ere: number) => <ByUnit ere={euros(ere)} kwh={euros(ere * ERE_PER_KWH)} />;
  const erePerKwh = format.number(ERE_PER_KWH, "decimal");

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
      <div className="hero-in flex items-center justify-between gap-3" style={stagger(0)}>
        <p className="flex items-center gap-2 text-sm font-medium text-accent">
          <span aria-hidden className="live-dot size-2 rounded-full bg-accent" />
          {weekLabel(current)}
        </p>
        <UnitToggle label={t("unitGroup")} units={{ ere: t("units.ere"), kwh: t("units.kwh") }} />
      </div>
      <h1 id="prijs-titel" className="hero-in mt-3 text-base font-medium text-muted" style={stagger(1)}>
        {t("title")}
      </h1>
      {/* z-20 and z-10: every .hero-in row is its own stacking context, so a row with tooltips must lift itself, and
          the per-kWh tooltip here must also clear the chip row below. */}
      <p className="hero-in relative z-20 mt-1 flex flex-wrap items-baseline gap-x-3" style={stagger(2)}>
        <span className="text-6xl font-semibold tracking-tight sm:text-7xl">{price(current.mid)}</span>
        <span className="text-lg text-muted">
          <ByUnit
            ere={t("perEre")}
            kwh={<TipChip bare align="end" label={t("perKwh.label")} tip={t("perKwh.tip", { erePerKwh })} />}
          />
        </span>
      </p>
      {previous && (
        <p className="hero-in mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm" style={stagger(3)}>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium tabular-nums ${colors}`}>
            <span role="img" aria-label={direction} className="text-xs">
              {arrow}
            </span>
            {price(Math.abs(change))} ({format.number(Math.abs(change / previous.mid), "percent")})
          </span>
          <span className="text-muted">{t("comparedTo", { week: weekLabel(previous) })}</span>
        </p>
      )}
      <div className="hero-in relative z-10 mt-5 flex flex-wrap gap-2 text-sm" style={stagger(4)}>
        <TipChip
          label={t("bid.label")}
          value={price(current.bid)}
          tip={<ByUnit ere={t("bid.tip")} kwh={t("bid.tipKwh", { erePerKwh })} />}
        />
        <TipChip
          label={t("offer.label")}
          value={price(current.offer)}
          align="end"
          tip={<ByUnit ere={t("offer.tip")} kwh={t("offer.tipKwh", { erePerKwh })} />}
        />
      </div>
      {!Number.isNaN(updatedAt.getTime()) && (
        <p className="hero-in mt-4 text-xs text-muted" style={stagger(5)}>
          {t("updated", { date: format.dateTime(updatedAt, "updated") })}
        </p>
      )}

      <dl className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
        <KeyFigure label={t("high")} value={high.mid} format={euros} note={weekLabel(high)} order={6} />
        <KeyFigure label={t("low")} value={low.mid} format={euros} note={weekLabel(low)} order={7} />
        <KeyFigure label={t("spread")} value={spread} format={euros} note={t("spreadNote")} order={8} />
      </dl>
    </section>
  );
}

/** A key figure card. Its value counts up when it scrolls into view (data-countup, see MotionRoot). */
function KeyFigure({
  label,
  value,
  format,
  note,
  order,
}: {
  label: string;
  /** Per ERE. */
  value: number;
  format: (amount: number) => string;
  note: string;
  order: number;
}) {
  // Keyed by unit: a switch mounts a fresh <dd>, so a count-up still running on the old one can't overwrite it.
  const figure = (amount: number, unit: Unit) => (
    <dd key={unit} data-countup={amount} className="mt-1 text-base font-semibold tracking-tight tabular-nums sm:text-xl">
      {format(amount)}
    </dd>
  );
  return (
    <div data-spotlight="" className="hero-in rounded-xl border border-line bg-card p-3 sm:p-4" style={stagger(order)}>
      <dt className="text-xs text-muted">{label}</dt>
      <ByUnit ere={figure(value, "ere")} kwh={figure(value * ERE_PER_KWH, "kwh")} />
      <dd className="mt-0.5 text-xs text-muted">{note}</dd>
    </div>
  );
}
