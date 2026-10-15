import { NextResponse, type NextRequest } from "next/server";
import { detectLang, isLang } from "@/lib/i18n";

const COOKIE = "lang";

// "/" redirects to /nl or /en: the language last viewed (cookie), else the browser's language. Viewing /nl or /en
// (also via the language switch) remembers that choice. The pages themselves stay static.
export function proxy(request: NextRequest) {
  const segment = request.nextUrl.pathname.split("/")[1];
  if (isLang(segment)) {
    const response = NextResponse.next();
    if (request.cookies.get(COOKIE)?.value !== segment) {
      response.cookies.set(COOKIE, segment, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return response;
  }
  const saved = request.cookies.get(COOKIE)?.value;
  const lang = isLang(saved) ? saved : detectLang(request.headers.get("accept-language"));
  return NextResponse.redirect(new URL(`/${lang}`, request.url));
}

export const config = { matcher: ["/", "/nl", "/en"] };
