import { LANGS, type Lang } from "@/lib/i18n";

const NAMES: Record<Lang, string> = { nl: "Nederlands", en: "English" };

// NL/EN switch in the header. Plain links, not next/link: a full load passes the proxy, which remembers the choice
// for the next visit to "/", and swaps <html lang>.
export default function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  return (
    <nav aria-label={label} className="flex rounded-full border border-line bg-card p-0.5 text-xs font-medium">
      {LANGS.map((l) => (
        <a
          key={l}
          href={`/${l}`}
          hrefLang={l}
          lang={l}
          aria-current={l === lang ? "page" : undefined}
          className="grid min-w-9 place-items-center rounded-full px-2.5 py-1 text-muted uppercase transition-colors pointer-coarse:min-h-9 hover:text-fg focus-visible:text-fg aria-[current=page]:bg-fg aria-[current=page]:text-card"
        >
          {l}
          <span className="sr-only"> ({NAMES[l]})</span>
        </a>
      ))}
    </nav>
  );
}
