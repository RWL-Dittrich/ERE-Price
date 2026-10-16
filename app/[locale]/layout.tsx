import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Geist } from "next/font/google";
import Analytics from "@/components/Analytics";
import SiteFooter from "@/components/SiteFooter";
import { localePath, routing } from "@/i18n/routing";
import { GA_ID, SITE_URL } from "@/lib/site";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/** The message namespaces that client components read; the rest (mostly the explainer) stays on the server. */
const CLIENT_NAMESPACES = ["Chart", "Calculator", "Links", "Error", "Consent"] as const;

/** One static page per locale: /nl and /en. "/" itself is redirected by proxy.ts. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** The fallback metadata. The page replaces the title and description with ones that carry the current price. */
export async function generateMetadata(): Promise<Metadata> {
  const path = localePath(await getLocale());
  const t = await getTranslations("Meta");
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    // Google ignores keywords; Bing gives them a little weight.
    keywords: t("keywords").split(", "),
    // x-default points at a real page (English, the default locale), not at "/", which only redirects.
    alternates: { canonical: path, languages: { nl: "/nl", en: "/en", "x-default": "/en" } },
    // X falls back to the og: title, description and image.
    twitter: { card: "summary_large_image" },
  };
}

// Matches --page in globals.css.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f0d" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const messages = await getMessages();
  const clientMessages = Object.fromEntries(CLIENT_NAMESPACES.map((namespace) => [namespace, messages[namespace]]));

  return (
    <html lang={locale} className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Marks JS before first paint; gates only the self-completing hero intro in globals.css. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js=''" }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        {/* Locale, formats and time zone come from i18n/request.ts; only the client namespaces are sent along. */}
        <NextIntlClientProvider messages={clientMessages}>
          {children}
          <SiteFooter />
          {GA_ID && <Analytics />}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
