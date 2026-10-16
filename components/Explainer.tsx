import type { ReactNode } from "react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { sources, termLink, termLinks, type SourceId, type TermId } from "@/i18n/links";
import { languageOf } from "@/i18n/routing";
import { ERE_PER_KWH, EXAMPLE_FEE } from "@/lib/earnings";
import ChargingPath from "./illustrations/ChargingPath";
import EarningsCalculator from "./illustrations/EarningsCalculator";
import EreUnit from "./illustrations/EreUnit";
import ObligationFlow from "./illustrations/ObligationFlow";
import PriceFormation from "./illustrations/PriceFormation";
import YearTimeline from "./illustrations/YearTimeline";
import YieldFormula from "./illustrations/YieldFormula";
import "./illustrations/illustrations.css";
import { stagger } from "./motion/stagger";
import Term from "./Term";

/** The home-charging conditions in part 03, in reading order. Their keys match the data-parts in ChargingPath. */
const CONDITIONS = ["meter", "loose", "grid", "kwh", "provider"] as const;

const linkClass = "underline underline-offset-2 hover:text-fg focus-visible:text-fg";

/** The FAQ questions, in order, under Explainer.faq.<id>. StructuredData lists the same ones as an FAQPage. */
export const FAQ_IDS = ["self", "public", "provider", "when", "law"] as const;

/**
 * "Wat zijn ERE's?": five illustrated parts, the FAQ and the sources. The text is in messages/<locale>.json under
 * Explainer, Terms and Sources.
 *
 * Terms in the text are tags around their words, e.g. "<ereUnit>ERE (emissiereductie-eenheid)</ereUnit>". Each tag
 * becomes a <Term>: its link comes from i18n/links.ts, its one-line explanation from Terms.<id>.
 */
export default async function Explainer({ midPrice }: { midPrice: number }) {
  const t = await getTranslations("Explainer");
  const tTerms = await getTranslations("Terms");
  const tSources = await getTranslations("Sources");
  const tLinks = await getTranslations("Links");
  const format = await getFormatter();
  const language = languageOf(await getLocale());

  const termTags = Object.fromEntries(
    (Object.keys(termLinks) as TermId[]).map((id) => [
      id,
      (words: ReactNode) => (
        <Term link={termLink(id, language)} tip={tTerms(id)}>
          {words}
        </Term>
      ),
    ]),
  );
  const text = (key: Parameters<typeof t.rich>[0]) => t.rich(key, termTags);
  const paragraphs = (...keys: Parameters<typeof t.rich>[0][]) => keys.map((key) => <p key={key}>{text(key)}</p>);

  const grossPerKwh = midPrice * ERE_PER_KWH;

  return (
    <section id="uitleg" aria-labelledby="uitleg-titel" className="mt-16">
      <h2 id="uitleg-titel" data-reveal="" className="text-2xl font-semibold tracking-tight">
        {t("title")}
      </h2>
      <p data-reveal="" style={stagger(1)} className="mt-3 max-w-prose leading-relaxed text-muted">
        {t.rich("intro", {
          sources: (words) => (
            <a href="#bronnen" className={linkClass}>
              {words}
            </a>
          ),
        })}
      </p>

      <div className="mt-8 space-y-16 lg:space-y-24">
        <Part number="01" title={t("what.title")} caption={t("what.caption")} illustration={<EreUnit />}>
          {paragraphs("what.p1", "what.p2")}
        </Part>

        <Part number="02" title={t("why.title")} caption={t("why.caption")} illustration={<ObligationFlow />}>
          {paragraphs("why.p1", "why.p2", "why.p3", "why.p4")}
        </Part>

        <Part number="03" title={t("earn.title")} caption={t("earn.caption")} illustration={<ChargingPath />}>
          {paragraphs("earn.p1", "earn.p2")}
          {/* data-key: hovering a condition lights up its data-part in ChargingPath (illustrations.css). */}
          <ul className="list-disc space-y-1.5 pl-5 marker:text-muted">
            {CONDITIONS.map((condition) => (
              <li key={condition} data-key={condition}>
                {text(`earn.conditions.${condition}`)}
              </li>
            ))}
          </ul>
        </Part>

        <Part number="04" title={t("price.title")} caption={t("price.caption")} illustration={<PriceFormation />}>
          {paragraphs("price.p1", "price.p2", "price.p3")}
        </Part>

        {/* #rekenhulp: the header's calculator link lands on this part's heading. */}
        <Part id="rekenhulp" number="05" title={t("value.title")} caption={t("value.caption")} illustration={<YieldFormula />}>
          {paragraphs("value.p1")}
          {/* Each factor stays whole, so on a narrow screen the formula only breaks between factors. */}
          <p className="border-l-2 border-accent py-1 pl-4 tabular-nums">
            <span className="flex flex-wrap gap-x-1">
              {t.rich("value.formula", { part: (chunks) => <span className="whitespace-nowrap">{chunks}</span> })}
            </span>
            <span className="mt-1 block font-semibold text-accent">{t("value.formulaResult")}</span>
          </p>
          <p className="text-sm text-muted">{text("value.note")}</p>
          <div data-spotlight="" className="rounded-xl border border-line bg-card p-4">
            <p className="text-xs text-muted">{t("value.card.label")}</p>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
              <span data-countup={grossPerKwh} className="text-3xl font-semibold tracking-tight tabular-nums">
                {format.number(grossPerKwh, "price")}
              </span>
              <span className="text-muted">{t("value.card.perKwh")}</span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              {t("value.card.explanation", {
                mid: format.number(midPrice, "price"),
                net: format.number(grossPerKwh * (1 - EXAMPLE_FEE), "price"),
              })}
            </p>
            <EarningsCalculator midPrice={midPrice} />
          </div>
          {paragraphs("value.after")}
        </Part>

        <div className="max-w-prose">
          <h3 data-reveal="" className="text-lg font-semibold tracking-tight">
            {t("faq.title")}
          </h3>
          <div
            data-reveal=""
            data-spotlight=""
            style={stagger(1)}
            className="mt-3 divide-y divide-line rounded-xl border border-line bg-card"
          >
            {FAQ_IDS.map((id) => (
              <Faq key={id} question={t(`faq.${id}.question`)} answer={text(`faq.${id}.answer`)}>
                {id === "when" && <YearTimeline />}
              </Faq>
            ))}
          </div>
        </div>

        <div className="max-w-prose">
          <h3 id="bronnen" data-reveal="" className="scroll-mt-(--header-h) text-lg font-semibold tracking-tight">
            {tSources("title")}
          </h3>
          <ul data-reveal="fade" style={stagger(1)} className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
            {(Object.keys(sources) as SourceId[]).map((id) => {
              const source = sources[id];
              const languageNote = source.lang !== language ? ` (${tLinks(`inLanguage.${source.lang}`)})` : "";
              return (
                <li key={id}>
                  <a href={source.url} target="_blank" rel="noopener" className={linkClass}>
                    {tSources(`labels.${id}`)}
                    {languageNote}
                    <span className="sr-only"> ({tLinks("newTab")})</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * A numbered part: heading, illustrated plate and text. On a phone they stack in that order; from lg the plate
 * sits (sticky) beside the text.
 *
 * The plate column is 18.125rem = 256px of drawing + p-4 + 1px borders, so the 256-unit viewBox renders 1:1.
 * Grid rows auto / 1fr: the plate spans both, and its extra height goes to the text row, not between heading and text.
 */
function Part({
  id,
  number,
  title,
  caption,
  illustration,
  children,
}: {
  /** An anchor on the part's heading. */
  id?: string;
  number: string;
  title: string;
  caption: string;
  illustration: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="ill-part grid gap-x-12 gap-y-5 lg:grid-cols-[minmax(0,1fr)_18.125rem] lg:grid-rows-[auto_1fr]">
      <header id={id} data-reveal="" className="lg:col-start-1 lg:row-start-1">
        <p className="text-xs font-semibold tracking-wider text-accent tabular-nums">{number}</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight">{title}</h3>
      </header>
      <figure
        data-reveal=""
        data-spotlight=""
        style={stagger(1)}
        className="ill ill-sticky w-full max-w-[22rem] self-start rounded-2xl border border-line bg-card p-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none"
      >
        {illustration}
        <figcaption className="mt-3 text-xs leading-relaxed text-muted">{caption}</figcaption>
      </figure>
      <div data-reveal="" style={stagger(2)} className="max-w-prose space-y-3 leading-relaxed lg:col-start-1 lg:row-start-2">
        {children}
      </div>
    </div>
  );
}

/** One FAQ question, as a disclosure. `children` (e.g. an illustration) follow the answer. */
function Faq({ question, answer, children }: { question: string; answer: ReactNode; children?: ReactNode }) {
  return (
    <details data-disclosure="row">
      <summary className="min-h-11 px-4 py-3 font-medium transition-colors hover:text-accent focus-visible:text-accent">
        {question}
      </summary>
      <div className="space-y-3 px-4 pb-4 text-sm leading-relaxed text-muted">
        {/* With something after it, the answer needs its own paragraph to keep the spacing. */}
        {children ? <p>{answer}</p> : answer}
        {children}
      </div>
    </details>
  );
}
