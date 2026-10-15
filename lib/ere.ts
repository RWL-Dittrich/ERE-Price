import { cacheLife } from "next/cache";

export type EreWeek = {
  year: number; // ISO year
  week: number; // ISO week
  bid: number;
  offer: number;
  mid: number;
  date: number; // Monday of the ISO week, UTC ms
};

export type EreData = {
  current: EreWeek & { updatedAt: string };
  weeks: EreWeek[]; // oldest first, includes current
};

const FEED = "https://joulo.nl/api/ere-price?weeks_back=104";
const DAY = 864e5;

// ISO week 1 is the week containing 4 January.
export function isoWeekMonday(year: number, week: number): number {
  const jan4 = Date.UTC(year, 0, 4);
  const dow = (new Date(jan4).getUTCDay() + 6) % 7; // Monday = 0
  return jan4 + ((week - 1) * 7 - dow) * DAY;
}

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

function toWeek(row: unknown): EreWeek {
  const r = (row ?? {}) as Record<string, unknown>;
  const { year, week_number: week, bid_eur: bid, offer_eur: offer, mid_eur } = r;
  if (!isNum(year) || !isNum(week) || !isNum(bid) || !isNum(offer)) {
    throw new Error(`ERE feed: invalid row ${JSON.stringify(row)}`);
  }
  const mid = isNum(mid_eur) ? mid_eur : (bid + offer) / 2;
  return { year, week, bid, offer, mid, date: isoWeekMonday(year, week) };
}

// Throws on any upstream failure so the cache keeps serving the last good result.
export async function getEre(): Promise<EreData> {
  "use cache";
  // Refresh hourly in the background; a stale entry survives up to a week of upstream outage.
  cacheLife({ revalidate: 3600, expire: 7 * 24 * 3600 });

  const res = await fetch(FEED, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`ERE feed: HTTP ${res.status}`);
  const body = await res.json();
  if (body?.ok !== true || !Array.isArray(body.history) || typeof body.current?.updated_at !== "string") {
    throw new Error(`ERE feed: ${body?.message ?? "unexpected response"}`);
  }

  const current = toWeek(body.current);
  // Rows are entered by hand; skip a bad history row rather than failing every refresh.
  const history: EreWeek[] = body.history.flatMap((r: unknown) => {
    try {
      return [toWeek(r)];
    } catch {
      return [];
    }
  });
  const byWeek = new Map<string, EreWeek>();
  for (const w of [...history, current]) byWeek.set(`${w.year}-${w.week}`, w);

  return {
    current: { ...current, updatedAt: body.current.updated_at },
    weeks: [...byWeek.values()].sort((a, b) => a.date - b.date),
  };
}
