import { notFound } from "next/navigation";
import { lang as rootLang } from "next/root-params";
import { isLang, type Lang } from "./i18n";

// The page language in any Server Component (the [lang] root segment), without passing it down as a prop.
// Client components use useLang() from components/LangProvider instead.
export async function getLang(): Promise<Lang> {
  const lang = await rootLang();
  if (!isLang(lang)) notFound();
  return lang;
}
