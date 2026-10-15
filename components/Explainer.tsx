import type { CSSProperties, ReactNode } from "react";
import { fmt } from "@/lib/format";
import { dict, type Lang } from "@/lib/i18n";
import { getLang } from "@/lib/lang.server";
import { en } from "./explainer/en";
import { nl } from "./explainer/nl";
import ChargingPath from "./illustrations/ChargingPath";
import EarningsCalc from "./illustrations/EarningsCalc";
import EreUnit from "./illustrations/EreUnit";
import ObligationFlow from "./illustrations/ObligationFlow";
import PriceFormation from "./illustrations/PriceFormation";
import YearTimeline from "./illustrations/YearTimeline";
import YieldFormula from "./illustrations/YieldFormula";
import "./illustrations/illustrations.css";

// NEa formula for grid electricity delivered in 2026: 0.505 × 183 g/MJ × 3.6 MJ/kWh / 1000.
// 0.505 (CBS renewable share, two years before delivery year) changes every year.
const ERE_PER_KWH = 0.3327;
// Example fee of an inboekdienstverlener, used in the copy ("Bij bijvoorbeeld 20% kosten") and the calculator.
const FEE = 0.2;

const link = "underline underline-offset-2 hover:text-fg focus-visible:text-fg";
// Stagger index for the reveal contract (data-reveal) in app/globals.css.
const i = (n: number) => ({ "--i": n }) as CSSProperties;

// A part's body is its paragraphs (<p> elements); the layout around it is shared.
type PartCopy = { title: string; caption: string; body: ReactNode };

// The explainer text in one language (components/explainer/nl.tsx and en.tsx). Links come from explainer/links.ts.
export type Copy = {
  title: string;
  // Intro text up to the in-page link to the sources, and that link's text.
  intro: [string, string];
  parts: {
    what: PartCopy;
    why: PartCopy;
    earn: PartCopy;
    price: PartCopy;
    // Part 05 continues after its body: the small formula note, the value card, then `after`.
    value: PartCopy & { note: ReactNode; after: ReactNode };
  };
  // Home-charging conditions in part 03, by data-key: hovering one lights up its part of ChargingPath.
  conditions: Record<"meter" | "loose" | "grid" | "kwh" | "provider", ReactNode>;
  card: { label: string; perKwh: string; text: (mid: string, net: string) => string };
  faqTitle: string;
  faq: Record<"self" | "public" | "provider" | "when" | "law", { q: string; a: ReactNode }>;
  sourcesTitle: string;
  sources: [label: string, href: string][];
};

const COPY: Record<Lang, Copy> = { nl, en };

// Heading, illustrated plate and text. Mobile: stacked in that order; lg: the plate sits (sticky) beside the text.
// The plate column is 18.125rem = 256px of drawing + p-4 + 1px borders, so the 256-wide viewBox renders 1:1.
// Rows auto/1fr: the plate spans both, and its extra height goes to the text row, not between heading and text.
function Part({
  n,
  p,
  illustration,
  children,
}: {
  n: string;
  p: PartCopy;
  illustration: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="ill-part grid gap-x-12 gap-y-5 lg:grid-cols-[minmax(0,1fr)_18.125rem] lg:grid-rows-[auto_1fr]">
      <header data-reveal="" className="lg:col-start-1 lg:row-start-1">
        <p className="text-xs font-semibold tracking-wider text-accent tabular-nums">{n}</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight">{p.title}</h3>
      </header>
      <figure
        data-reveal=""
        data-spotlight=""
        style={i(1)}
        className="ill ill-sticky w-full max-w-[22rem] self-start rounded-2xl border border-line bg-card p-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none"
      >
        {illustration}
        <figcaption className="mt-3 text-xs leading-relaxed text-muted">{p.caption}</figcaption>
      </figure>
      <div data-reveal="" style={i(2)} className="max-w-prose space-y-3 leading-relaxed lg:col-start-1 lg:row-start-2">
        {p.body}
        {children}
      </div>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: ReactNode }) {
  return (
    <details data-disclosure="row">
      <summary className="min-h-11 px-4 py-3 font-medium transition-colors hover:text-accent focus-visible:text-accent">
        {q}
      </summary>
      <div className="space-y-3 px-4 pb-4 text-sm leading-relaxed text-muted">{children}</div>
    </details>
  );
}

export default async function Explainer({ midEur }: { midEur: number }) {
  const lang = await getLang();
  const c = COPY[lang];
  const { eur } = fmt(lang);
  const gross = midEur * ERE_PER_KWH;

  return (
    <section id="uitleg" aria-labelledby="uitleg-titel" className="mt-16">
      <h2 id="uitleg-titel" data-reveal="" className="text-2xl font-semibold tracking-tight">
        {c.title}
      </h2>
      <p data-reveal="" style={i(1)} className="mt-3 max-w-prose leading-relaxed text-muted">
        {c.intro[0]}{" "}
        <a href="#bronnen" className={link}>
          {c.intro[1]}
        </a>
        .
      </p>

      <div className="mt-8 space-y-16 lg:space-y-24">
        <Part n="01" p={c.parts.what} illustration={<EreUnit />} />
        <Part n="02" p={c.parts.why} illustration={<ObligationFlow />} />
        <Part n="03" p={c.parts.earn} illustration={<ChargingPath />}>
          <ul className="list-disc space-y-1.5 pl-5 marker:text-muted">
            {Object.entries(c.conditions).map(([key, text]) => (
              <li key={key} data-key={key}>
                {text}
              </li>
            ))}
          </ul>
        </Part>
        <Part n="04" p={c.parts.price} illustration={<PriceFormation />} />
        <Part n="05" p={c.parts.value} illustration={<YieldFormula />}>
          <p className="text-sm text-muted">{c.parts.value.note}</p>
          <div data-spotlight="" className="rounded-xl border border-line bg-card p-4">
            <p className="text-xs text-muted">{c.card.label}</p>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
              <span data-countup={gross} className="text-3xl font-semibold tracking-tight tabular-nums">
                {eur(gross)}
              </span>
              <span className="text-muted">{c.card.perKwh}</span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{c.card.text(eur(midEur), eur(gross * (1 - FEE)))}</p>
            <EarningsCalc midEur={midEur} erePerKwh={ERE_PER_KWH} fee={FEE} />
          </div>
          <p>{c.parts.value.after}</p>
        </Part>

        <div className="max-w-prose">
          <h3 data-reveal="" className="text-lg font-semibold tracking-tight">
            {c.faqTitle}
          </h3>
          <div
            data-reveal=""
            data-spotlight=""
            style={i(1)}
            className="mt-3 divide-y divide-line rounded-xl border border-line bg-card"
          >
            {Object.entries(c.faq).map(([key, f]) => (
              <Faq key={key} q={f.q}>
                {key === "when" ? (
                  <>
                    <p>{f.a}</p>
                    <YearTimeline />
                  </>
                ) : (
                  f.a
                )}
              </Faq>
            ))}
          </div>
        </div>

        <div className="max-w-prose">
          <h3 id="bronnen" data-reveal="" className="scroll-mt-(--header-h) text-lg font-semibold tracking-tight">
            {c.sourcesTitle}
          </h3>
          <ul data-reveal="fade" style={i(1)} className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
            {c.sources.map(([label, href]) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noopener" className={link}>
                  {label}
                  <span className="sr-only"> ({dict[lang].newTab})</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
