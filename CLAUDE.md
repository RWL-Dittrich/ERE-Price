# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

"ERE prijs" is a single-page Next.js 16 site showing the current and historic weekly Dutch ERE (emissiereductie-eenheid) market price, with an illustrated, fact-checked explainer about EREs. It will be hosted at https://ere.robindittrich.nl and self-hosted with `next start`. The site is bilingual (Dutch at `/nl`, English at `/en`) with next-intl. Code and comments are English.

Never run `git commit` or `git push` in this repo: the owner commits.

## Commands

```bash
npm run dev     # dev server, http://localhost:3000
npm run build   # production build; prerenders /nl and /en-GB and FETCHES the live Joulo feed (fails if joulo.nl is unreachable)
npm start       # production server
npm run lint    # eslint (flat config, next core-web-vitals + typescript)
npx tsc --noEmit
npx next typegen               # regenerate route types (LayoutProps, next/root-params) after moving routes
node i18n/messages.check.ts    # self-check: en-GB.json has the same keys, placeholders and tags as nl.json
node lib/chart-axes.check.ts   # self-check: chart axis ticks
```

There is no test suite. After any change:

- `npm run build` must list `/nl` and `/en-GB` as static (`○`) with Revalidate `1h` and Expire `1w` (also in `.next/prerender-manifest.json`: `initialRevalidateSeconds: 3600`, `initialExpireSeconds: 604800`). If a route turns dynamic, caching is broken.
- After changing text, run `node i18n/messages.check.ts`.
- For UI or motion changes, check the running page in a browser: /nl and /en, light and dark, 390px and desktop widths, and with `prefers-reduced-motion: reduce` emulated.

## Layout of the code

```
messages/          nl.json and en-GB.json: ALL user-facing text, as ICU messages
i18n/              next-intl setup: routing.ts, request.ts (named formats), links.ts, messages.check.ts
global.d.ts        next-intl type config (typed keys, locales and format names)
proxy.ts           next-intl middleware: "/" → /nl or /en, NEXT_LOCALE cookie
app/[locale]/      layout.tsx (root layout: <html lang>, metadata, NextIntlClientProvider, footer), page.tsx, error.tsx
lib/ere.ts         the price feed: getErePrices(), summarize()
lib/week.ts        weekLabel(), isoWeekMonday() (client-safe)
lib/earnings.ts    ERE_PER_KWH, EXAMPLE_FEE
lib/chart-axes.ts  y-axis and month ticks for the chart
components/        SiteHeader, Hero, SiteFooter, Explainer, Term, TipChip, LangSwitch, usePopover
  chart/           PriceChart (client) with RangeToggle, PriceTooltip, PriceTable, ranges.ts
  illustrations/   the explainer's SVG plates and the EarningsCalculator
  motion/          MotionRoot, stagger(), useInView()
```

`app/[locale]/page.tsx` fetches the prices once and renders `SiteHeader`, `Hero`, `PriceChart`, `Explainer` and, last, `MotionRoot`. The header is in the page rather than the layout because its link targets `#uitleg`, which only exists on the page.

## Languages (next-intl)

- **All user-facing text lives in `messages/<locale>.json`**, never in components, and there is no per-language code. A component reads text with `getTranslations("Namespace")` (server) or `useTranslations("Namespace")` (client), and formats numbers and dates with `getFormatter()` / `useFormatter()` and the named formats in `i18n/request.ts` (`price`, `axisPrice`, `wholeEuros`, `integer`, `decimal`, `percent`; `date`, `month`, `updated`).
- **Message syntax is ICU MessageFormat:**
  - Variable parts are `{placeholders}`.
  - Two-line SVG labels use `\n`; split them with `lines()` from `components/illustrations/svg.tsx`.
  - Messages that contain tags are rendered with `t.rich()`.
- `messages/nl.json` is the reference:
  - `global.d.ts` types every key against it, so `t("Hero.titel")` is a compile error.
  - `i18n/messages.check.ts` checks that `en-GB.json` has the same keys, placeholders and tags. TypeScript does not check that file.
  - Keys must not contain dots.
- **Locales:** `nl` and `en-GB`. English is en-GB for British number and date formats, but its URL is `/en` (`localePrefix.prefixes` in `i18n/routing.ts`; the middleware rewrites `/en` to the `/en-GB` page). Use `localePath(locale)` for URLs and `languageOf(locale)` ("nl"/"en") for comparing languages.
- **Routing:** the middleware in `proxy.ts` (Next 16's name for middleware) sends `/` to the `NEXT_LOCALE` cookie's locale, or else to the best match for Accept-Language. Every non-Dutch language, and a missing header, gets English (the default locale). The cookie (one year) is set when a visitor views a language other than their browser's. `LangSwitch` uses plain `<a>` links so the request passes the middleware.
- `i18n/request.ts` reads the locale from `next/root-params`, so pages stay static without `setRequestLocale`.
- **Client components** only receive the namespaces listed in `CLIENT_NAMESPACES` in the layout (`Chart`, `Calculator`, `Links`, `Error`). A client component that needs another namespace must be added there.

## Data and caching (`lib/ere.ts`)

- `getErePrices()` fetches `https://joulo.nl/api/ere-price?weeks_back=104` (the feed's maximum).
- The project uses Next 16 Cache Components (`cacheComponents: true` in `next.config.ts`, which is wrapped by the next-intl plugin). Caching is therefore `"use cache"` plus `cacheLife({ revalidate: 1 hour, expire: 1 week })`. Route-segment `export const revalidate` does not exist in this mode.
- `getErePrices()` deliberately **throws** on any upstream failure: an HTTP error, `ok: false`, a missing current week or history, or the 10 s timeout. A failed refresh is never cached, so the last good page keeps being served. `error.tsx` shows only after the cache entry has expired.
- The feed always returns HTTP 200; a failure is signalled by `ok: false` in the body.
- Feed quirks:
  - The current week may be missing from the history. `mergeWeeks()` adds it without duplicates.
  - Prices are entered by hand each week and weeks can be skipped. A malformed history row is dropped rather than failing the refresh.
  - Each week gets `monday`, the UTC milliseconds of its ISO-week Monday (`isoWeekMonday()`), which is the chart's x-axis.
- `summarize()` computes the hero's figures: the previous quote, the change, the 52-week high and low, and the spread.
- `lib/ere.ts` imports `next/cache`, so client components may only import types from it. Client-safe helpers live in `lib/week.ts`, `lib/time.ts` and `lib/earnings.ts`.

## Chart (`components/chart/`)

- recharts is the only charting dependency. The chart draws the mid-price line plus a bid–offer band.
- `ranges.ts` defines the 3M/6M/1J/2J ranges; their labels are under `Chart.ranges.<key>`. `availableRanges()` offers a range only once the history reaches past the previous one, so 2J stays hidden while the feed has ≤ 52 weeks.
- The y-axis ticks and domain come from `priceAxis()`, the month ticks from `monthTicks()` (`lib/chart-axes.ts`).
- The series draw in once the plot is on screen (`useInView`). Recharts calls `PriceTooltip` through an arrow function so it renders as a component and may use hooks.
- The plot is `aria-hidden` with `accessibilityLayer={false}`. The figcaption summary and `PriceTable` are the accessible alternative.

## Explainer

- `components/Explainer.tsx` holds the structure: parts, illustrations, conditions list, value card, FAQ and sources. The text is under `Explainer`, `Terms` and `Sources` in the messages.
- Every claim was fact-checked against primary sources (NEa, overheid, Joulo). Do not add facts that a listed source does not back. The English text says exactly the same as the Dutch; change a fact in both files.
- **Terms** are tags in the text, e.g. `"<ereUnit>ERE (emissiereductie-eenheid)</ereUnit>"`.
  - `Explainer` turns every tag into a `<Term>` (`components/Term.tsx`): a real link with a hover/focus/tap card.
  - The card holds the tip `Terms.<id>` and a "Lees meer bij …" link.
  - On touch, tapping the term only toggles its card; only the card's link opens the page.
  - A tip may only restate what the text or its source says.
- **Links** live in `i18n/links.ts`, never in the messages:
  - `sources` holds the fact-checked sources, in the order of the sources list; their labels are under `Sources.labels`.
  - `termLinks` maps every term id to a source or a glossary page. Glossary pages have a version per language where one exists.
  - Each link knows its page language and site. The card's site name (`Links.sites`) and the "(in Dutch)" / "(Engelstalig)" note in cards and the sources list follow from that.
  - Pick pages a general reader can follow: EUR-Lex and other raw legal texts are kept out of the running text on purpose.
  - Adding a term: add the tag in both message files, `Terms.<id>` in both, and the id in `termLinks`.
- `components/usePopover.ts` holds the open/close behaviour shared by `Term` and `TipChip`: hover, focus, Escape, and a press outside.
- `ERE_PER_KWH = 0.3327` (`lib/earnings.ts`) is the NEa factor for electricity delivered in **2026**, and it changes every year. The explainer text and `YieldFormula`'s labels spell the formula out too, so update all of them together.

## Illustrations (`components/illustrations/`)

- There is one SVG plate per explainer part, built on `Plate` in `svg.tsx`: a 256-unit-wide viewBox with a `<title>`/`<desc>`. The labels are under `Illustrations.<plate>`.
- Labels must fit their spot in both languages, so check /nl and /en after changing one. Labels may only restate what the text beside them says.
- Animation timing is set per element with `delay(ms)` (the `--d` variable) and the `a-*` classes in `illustrations.css`, which `Explainer.tsx` imports.

## Motion system (no animation library, by design)

- The attribute contract is documented in README.md ("Animaties"). The CSS lives in `app/globals.css` and `components/illustrations/illustrations.css`.
- `components/motion/MotionRoot.tsx` sets `html[data-motion="on"]` after hydration. It turns `data-reveal` into `data-inview` and drives `data-countup` and `data-spotlight`. It is rendered at the end of the page, not in the layout, because it writes into page content that must already be hydrated.
- The authored markup is the final state:
  - Every hidden or start state must sit behind `html[data-motion="on"]` and `prefers-reduced-motion: no-preference`, so the page is complete without JS, in print, and with reduced motion.
  - The one exception is the hero intro (`.hero-in`). It is gated on `html[data-js]`, which the inline script in the layout sets, and it finishes on its own.
- Animate only `opacity`, the individual `translate`/`scale`/`rotate` properties and `stroke-dashoffset`, never `transform`. An element gets at most one animation role.
- Hover effects use `@media (hover: hover)` and have a matching `:focus-visible` style.
- Each `.hero-in` row is its own stacking context, so a popup inside one (like the `TipChip` tooltips) needs `relative z-10` on the row itself.
- `stagger(index)` sets `--i`, the stagger index, registered with `@property` as non-inheriting.

## Styling

- Tailwind v4 with no config file.
- Theme tokens are CSS variables on `:root` in `app/globals.css`, redefined under `prefers-color-scheme: dark`:
  - colors: `--page`, `--card`, `--popover`, `--fg`, `--muted`, `--line`, `--grid`, `--accent`, `--band`, `--up`, `--down`, `--spot`, `--glow`;
  - motion: `--m-ease-*`, `--m-dur-2..5`, `--m-stagger`, `--m-reveal-y`;
  - layout: `--header-h`.
- Colors are exposed to Tailwind through `@theme inline` (`bg-card`, `text-muted`, …). Use the tokens rather than raw colors so both themes work.
- Custom CSS goes inside `@layer components`, so Tailwind utilities always win over it.

## Constraints

- External links open in a new tab (`target="_blank" rel="noopener"`) and carry an sr-only `Links.newTab` note. Use `Term` in the explainer or `ExternalLink` in `SiteFooter`, or copy the pattern. In-page anchors (`#uitleg`, `#bronnen`; the ids are the same in both languages) stay in the same tab.
- **Attribution is required** (Joulo data is CC BY 4.0). Keep the citation with its links in the footer: "Bron: Joulo, ERE-marktprijs per week (joulo.nl/status), CC BY 4.0" on /nl and "Source: Joulo, ERE market price per week (joulo.nl/status), CC BY 4.0" on /en.
- Prices are € per ERE, not per kWh. Bid and offer come from the LRE-E spot market; mid = (bid + offer) / 2.
- Before using a Next.js API, check `node_modules/next/dist/docs/` (see AGENTS.md). For example, `error.tsx` receives `retry` (stable since 16.3).
