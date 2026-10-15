# ERE prijs

Website met de actuele en historische ERE-marktprijs in Nederland (bied, laat en midden per emissiereductie-eenheid, per week), plus uitleg over ERE's voor wie thuis een elektrische auto laadt.

## Talen

De site is tweetalig: Nederlands op `/nl`, Engels op `/en`. `proxy.ts` stuurt `/` door naar de taal van de browser (Nederlands bij een Nederlandstalige browser, anders Engels) of naar de laatst gekozen taal (cookie `lang`). Rechtsboven in de header staat een NL/EN-schakelaar.

## Data

Prijzen komen uit de [Joulo ERE-prijsfeed](https://developer.joulo.nl/guides/ere-price-feed) (`https://joulo.nl/api/ere-price`).

Bron: Joulo, ERE-marktprijs per week ([joulo.nl/status](https://joulo.nl/status)), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). De bronvermelding staat in de footer van de site en moet blijven staan.

## Caching

`getEre()` in `lib/ere.ts` gebruikt `"use cache"` met `cacheLife({ revalidate: 3600, expire: 7 * 24 * 3600 })`. Is de pagina ouder dan een uur, dan krijgt het eerstvolgende verzoek nog de bestaande versie en wordt de pagina op de achtergrond opnieuw opgebouwd; zonder bezoekers wordt er dus niets opgehaald. Bij een storing bij Joulo blijft de laatste goede versie tot een week bruikbaar. Pas daarna verschijnt de foutpagina (`app/[lang]/error.tsx`).

De site is bedoeld voor self-hosting met één `next start`-proces:

- de `"use cache"`-data staat in het geheugen van het Node-proces (standaard cache handler) en is na een herstart weg;
- de vooraf gerenderde pagina (ISR) staat op schijf in `.next/` en blijft na een herstart bewaard.

`next build` rendert `/nl` en `/en` statisch vooraf en heeft daarvoor netwerktoegang tot joulo.nl nodig.

## Animaties

Animaties zijn CSS, aangestuurd door één klein clientcomponent en zonder animatiebibliotheek: `components/motion/MotionRoot.tsx` (in beeld komen, optellen, spotlight). Het contract staat in `app/globals.css` en MotionRoot; de grafiek tekent zich in via een eigen IntersectionObserver in `components/EreChart.tsx`.

- `html[data-js]` (inline script in `app/[lang]/layout.tsx`) start alleen de CSS-intro van de hero; `html[data-motion="on"]` (MotionRoot, na hydratie) mag pas daarna iets verbergen.
- `data-reveal` (`""` of `"fade"`) laat een element inkomen zodra MotionRoot er `data-inview` op zet; `--i` bepaalt de vertraging (stagger).
- `data-spotlight` laat een kaart licht vangen onder de muis of bij toetsenbordfocus; `data-countup="<getal>"` telt een bedrag vanaf 85% op als het in beeld komt.
- `details[data-disclosure]` geeft een uitklapblok een pijltje en een open-animatie.
- `components/illustrations/illustrations.css`: de `.a-*`-bouwstenen (`a-draw`, `a-fade`, `a-pop`, …) spelen zodra de figuur `data-inview` krijgt.
- Zonder JavaScript, bij afdrukken en met `prefers-reduced-motion: reduce` staat alles direct in de eindstand; vóór hydratie ook, op de hero-intro na, die zichzelf binnen ruim een seconde afmaakt.

## Commando's

```bash
npm install
npm run dev     # ontwikkelserver op http://localhost:3000
npm run build   # productiebuild (haalt de feed op)
npm start       # productieserver
```
