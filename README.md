# ⚡ ERE Index

Website met de actuele en historische ERE-marktprijs in Nederland (bied, laat en midden per emissiereductie-eenheid, per week), plus uitleg over ERE's voor wie thuis een elektrische auto laadt.

## Talen

De site is tweetalig: Nederlands op `/nl`, Engels op `/en`, met [next-intl](https://next-intl.dev). De middleware in `proxy.ts` stuurt `/` door naar de laatst gekozen taal (cookie `NEXT_LOCALE`) of anders naar de taal van de browser: Nederlands bij een Nederlandstalige browser, anders Engels. Rechtsboven in de header staat een NL/EN-schakelaar.

Alle teksten staan als ICU-berichten in `messages/nl.json` en `messages/en-GB.json`; componenten bevatten zelf geen tekst. Begrippen in de uitleg zijn tags in de tekst (`<ereUnit>…</ereUnit>`); hun links staan in `i18n/links.ts`. `nl.json` is leidend; `node i18n/messages.check.ts` controleert of `en-GB.json` dezelfde sleutels, placeholders en tags heeft.

## Data

Prijzen komen uit de [Joulo ERE-prijsfeed](https://developer.joulo.nl/guides/ere-price-feed) (`https://joulo.nl/api/ere-price`).

Bron: Joulo, ERE-marktprijs per week ([joulo.nl/status](https://joulo.nl/status)), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). De bronvermelding staat in de footer van de site en moet blijven staan.

## Caching

`getErePrices()` in `lib/ere.ts` gebruikt `"use cache"` met `cacheLife({ revalidate: 1 uur, expire: 1 week })`. Is de pagina ouder dan een uur, dan krijgt het eerstvolgende verzoek nog de bestaande versie en wordt de pagina op de achtergrond opnieuw opgebouwd; zonder bezoekers wordt er dus niets opgehaald. Bij een storing bij Joulo blijft de laatste goede versie tot een week bruikbaar. Pas daarna verschijnt de foutpagina (`app/[locale]/error.tsx`).

De site is bedoeld voor self-hosting met één `next start`-proces:

- de `"use cache"`-data staat in het geheugen van het Node-proces (standaard cache handler) en is na een herstart weg;
- de vooraf gerenderde pagina (ISR) staat op schijf in `.next/` en blijft na een herstart bewaard.

`next build` rendert beide talen statisch vooraf (`/nl` en `/en-GB`, dat de middleware op `/en` aanbiedt) en heeft daarvoor netwerktoegang tot joulo.nl nodig.

## Animaties

Animaties zijn CSS, aangestuurd door één klein clientcomponent en zonder animatiebibliotheek: `components/motion/MotionRoot.tsx` (in beeld komen, optellen, spotlight). Het contract staat in `app/globals.css` en MotionRoot; de grafiek tekent zich in zodra hij in beeld komt (`useInView` in `components/chart/PriceChart.tsx`).

- `html[data-js]` (inline script in `app/[locale]/layout.tsx`) start alleen de CSS-intro van de hero; `html[data-motion="on"]` (MotionRoot, na hydratie) mag pas daarna iets verbergen.
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

Bij elke push naar `main` bouwt `.github/workflows/docker.yml` de `Dockerfile` en zet het image als `ghcr.io/rwl-dittrich/ere-price:latest` (en `:sha-<commit>`) in de GitHub Container Registry. Draaien: `docker run -p 3000:3000 ghcr.io/rwl-dittrich/ere-price`.
