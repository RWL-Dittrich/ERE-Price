import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { LangProvider } from "@/components/LangProvider";
import { LANGS, dict } from "@/lib/i18n";
import { getLang } from "@/lib/lang.server";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const { title, description, ogLocale } = dict[lang].meta;
  return {
    metadataBase: new URL("https://ere.robindittrich.nl"),
    title,
    description,
    alternates: { canonical: `/${lang}`, languages: { nl: "/nl", en: "/en", "x-default": "/" } },
    openGraph: { title, description, url: `/${lang}`, siteName: "ERE prijs", locale: ogLocale, type: "website" },
  };
}

// Matches --page in globals.css.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f0d" },
  ],
};

// External link: opens in a new tab, so visitors keep this page.
function Out({ href, note, children }: { href: string; note: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-fg focus-visible:text-fg">
      {children}
      <span className="sr-only"> ({note})</span>
    </a>
  );
}

// Icon-only external link (footer credit): named for screen readers, 44px tall on touch.
function IconOut({ href, label, path }: { href: string; label: string; path: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-full text-muted transition-colors pointer-coarse:size-11 hover:bg-card hover:text-fg focus-visible:bg-card focus-visible:text-fg"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-4.5" fill="currentColor">
        <path d={path} />
      </svg>
    </a>
  );
}

const GITHUB =
  "M12 .3a12 12 0 0 0-3.8 23.38c.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .3";
const LINKEDIN =
  "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z";

// Root layout, one per language (/nl, /en; "/" is redirected by proxy.ts). The site header lives in page.tsx: its
// explainer link targets #uitleg, which only exists there. MotionRoot lives there too (see the comment at its use).
export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await getLang();
  const t = dict[lang];
  const f = t.footer;

  return (
    <html lang={lang} className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Marks JS before first paint; gates only the self-completing hero intro in globals.css. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js=''" }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <LangProvider lang={lang}>
          {children}

          <footer data-reveal="fade" className="mt-20 border-t border-line">
            <div className="mx-auto w-full max-w-4xl space-y-2 px-4 py-8 text-sm text-muted sm:px-6">
              <p>
                {f.source} (
                <Out href="https://joulo.nl/status" note={t.newTab}>
                  joulo.nl/status
                </Out>
                ),{" "}
                <Out href={`https://creativecommons.org/licenses/by/4.0/deed.${lang}`} note={t.newTab}>
                  CC BY 4.0
                </Out>
              </p>
              <p>
                {f.prices}{" "}
                <Out href="https://developer.joulo.nl/guides/ere-price-feed" note={t.newTab}>
                  {f.feed}
                </Out>
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-4">
                <p>
                  {f.madeWith}{" "}
                  <span aria-hidden className="text-accent">
                    ♥
                  </span>
                  <span className="sr-only">{f.love}</span> {f.by} Robin Dittrich
                </p>
                <div className="-mr-2 flex items-center">
                  <IconOut
                    href="https://nl.linkedin.com/in/robin-dittrich-b43b92195"
                    label={`${f.linkedin} (${t.newTab})`}
                    path={LINKEDIN}
                  />
                  <IconOut href="https://github.com/RWL-Dittrich" label={`${f.github} (${t.newTab})`} path={GITHUB} />
                </div>
              </div>
            </div>
          </footer>
        </LangProvider>
      </body>
    </html>
  );
}
