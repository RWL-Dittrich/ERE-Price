import type { formats } from "./i18n/request";
import type { routing } from "./i18n/routing";
import type messages from "./messages/nl.json";

// Type-checks translation keys, locales and format names: t("Hero.titel") or format.number(x, "prise") is a
// compile error. messages/nl.json is the reference; i18n/messages.check.ts checks the other locales against it.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
    Formats: typeof formats;
  }
}
