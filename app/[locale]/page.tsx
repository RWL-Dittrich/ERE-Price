import PriceChart from "@/components/chart/PriceChart";
import Explainer from "@/components/Explainer";
import Hero from "@/components/Hero";
import MotionRoot from "@/components/motion/MotionRoot";
import SiteHeader from "@/components/SiteHeader";
import { getErePrices } from "@/lib/ere";

export default async function HomePage() {
  const prices = await getErePrices();

  return (
    <>
      {/* The header lives here, not in the layout: its explainer link targets #uitleg, which only exists on this page. */}
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-6">
        <Hero prices={prices} />
        <PriceChart weeks={prices.weeks} />
        <Explainer midPrice={prices.current.mid} />
      </main>

      {/* After the content, not in the layout: the page can hydrate after the layout, and MotionRoot writes into this
          content (data-inview, count-up text), which must be hydrated by then. */}
      <MotionRoot />
    </>
  );
}
