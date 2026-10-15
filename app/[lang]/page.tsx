import type { CSSProperties } from "react";
import EreChart from "@/components/EreChart";
import Explainer from "@/components/Explainer";
import LangSwitch from "@/components/LangSwitch";
import MotionRoot from "@/components/motion/MotionRoot";
import TipChip from "@/components/TipChip";
import { getEre } from "@/lib/ere";
import { fmt, weekLabel } from "@/lib/format";
import { LOCALE, dict } from "@/lib/i18n";
import { getLang } from "@/lib/lang.server";

const WEEK = 7 * 864e5;

// Stagger index for the CSS hero intro (globals.css .hero-in).
const at = (i: number) => ({ "--i": i }) as CSSProperties;

function Stat({ label, value, shown, note, i }: { label: string; value: number; shown: string; note: string; i: number }) {
  return (
    <div data-spotlight="" className="hero-in rounded-xl border border-line bg-card p-3 sm:p-4" style={at(i)}>
      <dt className="text-xs text-muted">{label}</dt>
      <dd data-countup={value} className="mt-1 text-base font-semibold tracking-tight tabular-nums sm:text-xl">
        {shown}
      </dd>
      <dd className="mt-0.5 text-xs text-muted">{note}</dd>
    </div>
  );
}

export default async function Home() {
  const lang = await getLang();
  const t = dict[lang];
  const h = t.hero;
  const { eur, pct } = fmt(lang);
  const updatedFmt = new Intl.DateTimeFormat(LOCALE[lang], {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  });

  const { current, weeks } = await getEre();
  const prev = weeks.filter((w) => w.date < current.date).at(-1);
  // Includes current (merged into weeks), so never empty.
  const year = weeks.filter((w) => w.date > current.date - 52 * WEEK && w.date <= current.date);
  const hi = year.reduce((a, b) => (b.mid > a.mid ? b : a));
  const lo = year.reduce((a, b) => (b.mid < a.mid ? b : a));
  const diff = prev ? current.mid - prev.mid : 0;
  // The arrow carries the direction (also for screen readers), so the amounts are shown unsigned.
  const [arrow, dir, tone] =
    diff > 0
      ? ["▲", h.up, "bg-up/12 text-up"]
      : diff < 0
        ? ["▼", h.down, "bg-down/12 text-down"]
        : ["=", h.flat, "bg-muted/12 text-muted"];
  const updated = new Date(current.updatedAt);
  const spread = current.offer - current.bid;

  return (
    <>
      {/* Here rather than in the root layout: the #uitleg target only exists on this page. */}
      <header className="site-header">
        <div className="mx-auto flex h-(--header-h) w-full max-w-4xl items-center justify-between gap-3 px-4 sm:px-6">
          <a href={`/${lang}`} className="logo flex items-center gap-2 font-semibold tracking-tight">
            <svg aria-hidden viewBox="0 0 32 32" className="size-7">
              <rect width="32" height="32" rx="8" fill="var(--accent)" />
              <path d="M18 5 8 18h7l-1 9 10-13h-7z" fill="#fff" />
            </svg>
            ERE prijs
          </a>
          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href="#uitleg"
              className="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-card hover:text-fg focus-visible:bg-card focus-visible:text-fg"
            >
              {t.header.explainer}
            </a>
            <LangSwitch lang={lang} label={t.header.language} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-6">
        <section aria-labelledby="prijs-titel" className="hero relative isolate pt-10 sm:pt-14">
          <p className="hero-in flex items-center gap-2 text-sm font-medium text-accent" style={at(0)}>
            <span aria-hidden className="live-dot size-2 rounded-full bg-accent" />
            {weekLabel(current)}
          </p>
          <h1 id="prijs-titel" className="hero-in mt-3 text-base font-medium text-muted" style={at(1)}>
            {h.title}
          </h1>
          <p className="hero-in mt-1 flex flex-wrap items-baseline gap-x-3" style={at(2)}>
            <span className="text-6xl font-semibold tracking-tight sm:text-7xl">{eur(current.mid)}</span>
            <span className="text-lg text-muted">{h.perEre}</span>
          </p>
          {prev && (
            <p className="hero-in mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm" style={at(3)}>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium tabular-nums ${tone}`}
              >
                <span role="img" aria-label={dir} className="text-xs">
                  {arrow}
                </span>
                {eur(Math.abs(diff))} ({pct(Math.abs(diff / prev.mid))})
              </span>
              <span className="text-muted">
                {h.vs} {weekLabel(prev)}
              </span>
            </p>
          )}
          {/* z-10: .hero-in rows are separate stacking contexts, so the chip tooltips must lift the whole row. */}
          <div className="hero-in relative z-10 mt-5 flex flex-wrap gap-2 text-sm" style={at(4)}>
            <TipChip label={h.bid} value={eur(current.bid)} tip={h.bidTip} />
            <TipChip label={h.offer} value={eur(current.offer)} align="end" tip={h.offerTip} />
          </div>
          {!Number.isNaN(updated.getTime()) && (
            <p className="hero-in mt-4 text-xs text-muted" style={at(5)}>
              {h.updated} {updatedFmt.format(updated)}
            </p>
          )}

          <dl className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
            <Stat label={h.high} value={hi.mid} shown={eur(hi.mid)} note={weekLabel(hi)} i={6} />
            <Stat label={h.low} value={lo.mid} shown={eur(lo.mid)} note={weekLabel(lo)} i={7} />
            <Stat label={h.spread} value={spread} shown={eur(spread)} note={h.spreadNote} i={8} />
          </dl>
        </section>

        <EreChart weeks={weeks} lang={lang} />

        <Explainer midEur={current.mid} />
      </main>
      {/* In the page, after the content, not in the layout: the page can hydrate after the layout, and MotionRoot
          writes data-inview (and count-up text) into this content, which must already be hydrated by then. */}
      <MotionRoot />
    </>
  );
}
