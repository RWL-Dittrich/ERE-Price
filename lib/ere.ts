import { cacheLife } from "next/cache";
import { HOUR_S, WEEK_MS } from "./time";
import { isoWeekMonday } from "./week";

// The weekly ERE market price, from Joulo's open price feed (https://developer.joulo.nl/guides/ere-price-feed).

/** One weekly quote, in euros per ERE. */
export type EreWeek = {
  /** ISO week-numbering year. */
  year: number;
  /** ISO week number (1–53). */
  week: number;
  /** Monday of the week, in UTC milliseconds: the chart's x-axis. */
  monday: number;
  bid: number;
  offer: number;
  mid: number;
};

export type ErePrices = {
  current: EreWeek;
  /** When Joulo entered the current week (ISO 8601). */
  updatedAt: string;
  /** Every week with a quote, oldest first, including the current one. */
  weeks: EreWeek[];
};

/** The 104 weeks of history are the most the feed returns. */
const FEED_URL = "https://joulo.nl/api/ere-price?weeks_back=104";
const FEED_TIMEOUT_MS = 10_000;

/** A week as the feed sends it. Typed as unknown: it is outside data and gets checked before use. */
type FeedWeek = {
  year?: unknown;
  week_number?: unknown;
  bid_eur?: unknown;
  offer_eur?: unknown;
  mid_eur?: unknown;
  updated_at?: unknown;
};

type FeedResponse = {
  ok?: unknown;
  message?: unknown;
  current?: FeedWeek;
  history?: unknown;
};

/**
 * The current price and its history, cached on the server. Refreshed in the background once an hour; when the
 * feed is down, the last good result keeps being served for up to a week.
 *
 * Throws on any upstream failure, so a failed refresh is never cached and the last good page stays up.
 */
export async function getErePrices(): Promise<ErePrices> {
  "use cache";
  cacheLife({ revalidate: HOUR_S, expire: 7 * 24 * HOUR_S });

  const feed = await fetchFeed();

  const current = parseWeek(feed.current);
  const updatedAt = feed.current?.updated_at;
  if (!current || typeof updatedAt !== "string") throw new Error("ERE feed: no valid current week");
  if (!Array.isArray(feed.history)) throw new Error("ERE feed: no history");

  // Prices are entered by hand, so a malformed history row is skipped instead of failing the whole refresh.
  const history = feed.history.map(parseWeek).filter((week) => week !== null);

  return { current, updatedAt, weeks: mergeWeeks(history, current) };
}

async function fetchFeed(): Promise<FeedResponse> {
  const response = await fetch(FEED_URL, { signal: AbortSignal.timeout(FEED_TIMEOUT_MS) });
  if (!response.ok) throw new Error(`ERE feed: HTTP ${response.status}`);

  const feed: FeedResponse = await response.json();
  // The feed answers HTTP 200 even when it fails; ok: false and a message say so.
  if (feed.ok !== true) throw new Error(`ERE feed: ${typeof feed.message === "string" ? feed.message : "unexpected response"}`);
  return feed;
}

/** A checked week, or null when a field is missing or not a number. */
function parseWeek(row: FeedWeek | undefined): EreWeek | null {
  const { year, week_number: week, bid_eur: bid, offer_eur: offer, mid_eur: mid } = row ?? {};
  if (!isNumber(year) || !isNumber(week) || !isNumber(bid) || !isNumber(offer)) return null;

  return {
    year,
    week,
    monday: isoWeekMonday(year, week),
    bid,
    offer,
    mid: isNumber(mid) ? mid : (bid + offer) / 2,
  };
}

/** The feed may leave the current week out of its history: add it, without duplicates, sorted oldest first. */
function mergeWeeks(history: EreWeek[], current: EreWeek): EreWeek[] {
  const byWeek = new Map(history.map((week) => [week.monday, week]));
  byWeek.set(current.monday, current);
  return [...byWeek.values()].sort((a, b) => a.monday - b.monday);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export type EreSummary = {
  /** The latest quote before the current week; weeks without a quote are skipped. */
  previous: EreWeek | undefined;
  /** Mid price change since `previous`, in euros (0 when there is no previous week). */
  change: number;
  /** The highest and lowest mid price over the 52 weeks up to and including the current week. */
  high: EreWeek;
  low: EreWeek;
  /** Offer minus bid, this week. */
  spread: number;
};

/** The figures in the page's hero. */
export function summarize({ current, weeks }: ErePrices): EreSummary {
  const previous = weeks.filter((week) => week.monday < current.monday).at(-1);
  // Never empty: it includes the current week.
  const lastYear = weeks.filter((week) => week.monday > current.monday - 52 * WEEK_MS && week.monday <= current.monday);

  return {
    previous,
    change: previous ? current.mid - previous.mid : 0,
    high: lastYear.reduce((high, week) => (week.mid > high.mid ? week : high)),
    low: lastYear.reduce((low, week) => (week.mid < low.mid ? week : low)),
    spread: current.offer - current.bid,
  };
}
