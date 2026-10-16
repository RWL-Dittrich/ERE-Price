import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Language routing by next-intl (see i18n/routing.ts): redirects "/" to /nl or /en, maps /en to the en-GB
// locale, and remembers a chosen language in the NEXT_LOCALE cookie. The pages themselves stay static.
export default createMiddleware(routing);

export const config = {
  // Every page path, but not Next.js internals, files with an extension (icon.svg, robots.txt, sitemap.xml) or the
  // share image: Next links it as /en-GB/opengraph-image, which the middleware would redirect to a broken URL.
  matcher: "/((?!api|_next|_vercel|.*opengraph-image|.*\\..*).*)",
};
