# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

"ERE prijs" is a single-page Next.js 16 site showing the current and historic weekly Dutch ERE (emissiereductie-eenheid) market price, with an illustrated, fact-checked explainer about EREs. It will be hosted at https://ere.robindittrich.nl and self-hosted with `next start`. The site is bilingual: Dutch at `/nl`, English at `/en`. Every user-facing string needs both languages. Code and comments are English.

## Commands

```bash
npm run dev     # dev server, http://localhost:3000
npm run build   # production build; prerenders /nl and /en and FETCHES the live Joulo feed (fails if joulo.nl is unreachable)
npm start       # production server
npm run lint    # eslint (flat config, next core-web-vitals + typescript)
npx tsc --noEmit
npx next typegen          # regenerate route types (PageProps/LayoutProps, next/root-params) after moving routes
node lib/i18n.check.ts    # self-check for Accept-Language detection
```

There is no test suite. After any change:

- `npm run build` must still list `/nl` and `/en` as static (`○`). The route table does not print revalidate columns for `[lang]` routes, so check `.next/prerender-manifest.json`: `routes["/nl"]` and `routes["/en"]` need `initialRevalidateSeconds: 3600` and `initialExpireSeconds: 604800`. If a route turns dynamic, or those values are missing, caching is broken.
- For UI or motion changes, also check the running page in a browser: light and dark, 390px and desktop widths, and with `prefers-reduced-motion: reduce` emulated.

## Architecture

Data flows one way:

- `lib/ere.ts` provides the data.
- `app/[lang]/page.tsx` is a server component that renders the site header (with the NL/EN `LangSwitch`), the hero, `components/EreChart.tsx` (client) and `components/Explainer.tsx` (server). It renders `MotionRoot` last.
- `app/[lang]/layout.tsx` is the root layout. It holds only `<html lang>`/`<head>`, `generateStaticParams`, `generateMetadata` (with hreflang alternates) and the viewport export, the `LangProvider`, and the footer. `app/globals.css` and `app/icon.svg` stay at the app root.

**Languages**

- `proxy.ts` (Next 16's name for middleware) handles `/` and `/nl`, `/en`:
  - `/` gets a 307 redirect to the `lang` cookie if it is set, otherwise to the result of `detectLang(Accept-Language)`. A Dutch browser gets nl, any other language gets en, and no header at all (crawlers) gets nl.
  - Visiting `/nl` or `/en` sets the cookie. That is how the switch "remembers" a choice.
  - `LangSwitch` uses plain `<a>` links, not `next/link`, so the request passes the proxy and `<html lang>` is swapped.
- `lib/i18n.ts` holds `LANGS`, `Lang`, `isLang`, `LOCALE` (nl-NL / en-GB), `detectLang`, and `dict` with the short shared UI strings. Long copy lives next to its component, in both languages.
- Server components read the language with `await getLang()` (`lib/lang.server.ts`, which wraps `next/root-params`). Client components use `useLang()` from `components/LangProvider.tsx`, or receive `lang` as a prop (`EreChart`).
- `Term` takes `hrefLang` when the linked page's language differs from the page's. The card then says "(in Dutch)" or "(Engelstalig)". Most sources are Dutch-only.

**Data and caching (`lib/ere.ts`)**

- `getEre()` fetches `https://joulo.nl/api/ere-price?weeks_back=104`.
- The project uses Next 16 Cache Components (`cacheComponents: true` in `next.config.ts`). Caching is therefore `"use cache"` plus `cacheLife({ revalidate: 3600, expire: 1 week })`. Route-segment `export const revalidate` does not exist in this mode.
- `getEre()` deliberately **throws** on any upstream failure: an HTTP error, `ok: false`, a bad response shape, or the 10 s timeout. Nothing bad is cached, so the last good page keeps being served. `app/error.tsx` shows only after the cache entry has expired.
- The feed always returns HTTP 200. A failure is signalled by `ok: false` in the body.

**Feed quirks handled in `getEre()`**

- `current` may be missing from `history`. It is merged in, deduplicated by ISO year + week.
- Prices are entered by hand each week and weeks can be skipped. A malformed history row is dropped rather than failing the whole refresh.
- Each week gets `date`, the UTC milliseconds of its ISO-week Monday (`isoWeekMonday`). The chart uses `date` as its x-axis.

**Formatting (`lib/format.ts`)**

- `fmt(lang)` returns `{ eur, pct, date }`. Prices are € with 3 decimals, in nl-NL (€ 0,365) or en-GB (€0.365) style. Other `Intl` formatters use `LOCALE[lang]`. `MotionRoot`'s count-up reads `<html lang>`.
- Anything rendered by a client component uses numeric dates with `timeZone: "UTC"`, so server and client output match and hydration does not break.
- Only server-only text (e.g. "Laatst bijgewerkt" / "Last updated" in `page.tsx`) uses `Europe/Amsterdam` and month names.

**Chart (`components/EreChart.tsx`)**

- recharts, the only added runtime dependency.
- Mid-price line plus bid–offer band.
- 3M/6M/1J/2J range toggle. A range button appears only once the history reaches past the previous range, so 2J stays hidden while the feed has ≤ 52 weeks.
- Y-axis ticks and domain are computed manually.
- The series draw in when the plot enters view, via the chart's own IntersectionObserver.
- The plot is `aria-hidden` with `accessibilityLayer={false}`. The figcaption summary and the "Toon gegevens als tabel" table are the accessible alternative.

**Explainer (`components/Explainer.tsx` + `components/explainer/`)**

- `Explainer.tsx` is the only copy of the structure: the parts, illustrations, conditions list, value card, FAQ and sources. It defines the `Copy` type.
- `components/explainer/nl.tsx` and `en.tsx` each export a `Copy`: text, paragraphs and inline `Term`s only. Change a fact in both files.
- `components/explainer/links.ts` holds the link maps (see below).
- Every claim was fact-checked against primary sources (NEa, overheid, Joulo), listed in the sources list of each `Copy`. Do not add facts that are not backed by a listed source. The English text says exactly the same as the Dutch.
- `ERE_PER_KWH = 0.3327` is the NEa factor for electricity delivered in **2026** (0.505 CBS renewable share × 183 g/MJ × 3.6 / 1000). It changes every year.
- `FEE = 0.2` is an example inboekdienstverlener fee. It is used in the copy and in `EarningsCalc`.
- Link targets live in `links.ts`:
  - `S` holds the fact-checked sources, which also feed the "Bronnen" / "Sources" list. These are Dutch pages, so English Terms pointing at them set `hrefLang="nl"`.
  - `E` holds background explanations (Wikipedia, CBS, RVO, NEa home) that are linked inline only.
  - `E_EN` holds the English replacements used on /en (English Wikipedia, emissionsauthority.nl).
  - Pick pages a general reader can follow: EUR-Lex and other raw legal texts were removed from the running text on purpose.
- Terms in the text are wrapped in `components/Term.tsx`. Each Term is a real link with a hover/focus/tap card holding a one-line `tip` and a "Lees meer bij …" link. On touch, tapping the term only toggles its card and never navigates; only the card's "Lees meer" link opens the page. The site name comes from the `SITES` hostname map in `Term.tsx`, so a new domain needs an entry there. A `tip` may only restate what the text or its source says.
- `components/usePopover.ts` holds the shared open/close behaviour for `Term` and `TipChip`: mouse hover, keyboard focus, Escape, and tap elsewhere to close.

**Illustrations (`components/illustrations/`)**

- There is one SVG plate per explainer part, built on `Plate` in `svg.tsx`: a 256-unit-wide viewBox with a `<title>`/`<desc>` in the page language. There is also the interactive `EarningsCalc` (kWh/year slider). Labels exist in both languages and must fit the 256-unit width in both, so check both /nl and /en after changing one.
- Labels in a plate may only restate what the text beside it says.
- `YieldFormula.tsx` repeats the NEa formula behind `ERE_PER_KWH`. When the yearly factor changes, update both.
- Animation timing is set per element with the `d()` helper (`--d` delay) and the `a-*` classes in `illustrations.css`. `Explainer.tsx` imports that stylesheet.

**Motion system (no animation library, by design; illustrations play once when scrolled into view, with no replay control)**

- The attribute contract is documented in README.md ("Animaties"). The CSS lives in `app/globals.css` and `components/illustrations/illustrations.css`.
- `components/motion/MotionRoot.tsx` sets `html[data-motion="on"]` after hydration. It turns `data-reveal` into `data-inview` and drives `data-countup` and `data-spotlight`.
- `MotionRoot` is rendered at the end of `page.tsx`, not in the layout. It writes into page content, and that content must already be hydrated.
- The authored markup is the final state. Every hidden or start state must sit behind `html[data-motion="on"]` and `prefers-reduced-motion: no-preference`, so the page is complete without JS, in print, and with reduced motion. The one exception is the hero intro (`.hero-in`). It is gated on `html[data-js]`, which an inline script in `layout.tsx` sets, and it finishes on its own.
- Animate only `opacity`, the individual `translate`/`scale`/`rotate` properties and `stroke-dashoffset`, never `transform`. An element gets at most one animation role: a reveal, an `a-*` primitive, or a toggle state.
- Hover effects use `@media (hover: hover)` and have a matching `:focus-visible` style.
- Each `.hero-in` row is its own stacking context, so a popup inside one (like the `TipChip` tooltips on Bied/Laat) needs `relative z-10` on the row itself, not just on the popup.
- `--i` is the stagger index. It is registered with `@property` as non-inheriting, set inline with the `at()`/`i()` helpers.

**Styling**

- Tailwind v4 with no config file.
- Theme tokens are CSS variables on `:root` in `app/globals.css`, redefined under `prefers-color-scheme: dark`:
  - colors: `--page`, `--card`, `--popover`, `--fg`, `--muted`, `--line`, `--grid`, `--accent`, `--band`, `--up`, `--down`, `--spot`, `--glow`;
  - motion: `--m-ease-*`, `--m-dur-2..5`, `--m-stagger`, `--m-reveal-y`;
  - layout: `--header-h`.
- Colors are exposed to Tailwind through `@theme inline` (`bg-card`, `text-muted`, `text-up`, …). Use the tokens rather than raw colors so both themes work. `--accent` was contrast-validated against `--card`.
- Custom CSS goes inside `@layer components`, so Tailwind utilities always win over it.

## Constraints

- External links open in a new tab (`target="_blank" rel="noopener"`) and carry an sr-only `dict[lang].newTab` note. Use `Term` in the explainer, `Out` in the layout, or copy the pattern. In-page anchors (`#uitleg`, `#bronnen`; the ids are the same in both languages) stay in the same tab.
- **Attribution is required** (Joulo data is CC BY 4.0). Keep the citation with its links in the footer: "Bron: Joulo, ERE-marktprijs per week (joulo.nl/status), CC BY 4.0" on /nl and "Source: Joulo, ERE market price per week (joulo.nl/status), CC BY 4.0" on /en.
- Prices are € per ERE, not per kWh. Bid and offer come from the LRE-E spot market; mid = (bid + offer) / 2.
- Before using a Next.js API, check `node_modules/next/dist/docs/` (see AGENTS.md). For example, `error.tsx` receives `retry` (stable since 16.3).
