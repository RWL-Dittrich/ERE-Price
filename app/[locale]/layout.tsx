import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Geist } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import { localePath, routing } from "@/i18n/routing";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/** The message namespaces that client components read; the rest (mostly the explainer) stays on the server. */
const CLIENT_NAMESPACES = ["Chart", "Calculator", "Links", "Error"] as const;

/** One static page per locale: /nl and /en. "/" itself is redirected by proxy.ts. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const path = localePath(await getLocale());
  const t = await getTranslations("Meta");
  return {
    metadataBase: new URL("https://ere.robindittrich.nl"),
    title: t("title"),
    description: t("description"),
    alternates: { canonical: path, languages: { nl: "/nl", en: "/en", "x-default": "/" } },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: path,
      siteName: "ERE prijs",
      locale: t("openGraphLocale"),
      type: "website",
    },
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
