import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "./components/Navigation";
import Hero from "./sections/Hero";
import AINative from "./sections/AINative";
import WhyMobile from "./sections/WhyMobile";
import MCPServer from "./sections/MCPServer";
import PeerMarket from "./sections/PeerMarket";
import GlobalCoverage from "./sections/GlobalCoverage";
import LiveStats from "./sections/LiveStats";
import Pricing from "./sections/Pricing";
import TokenEconomy from "./sections/TokenEconomy";
import FinalCTA from "./sections/FinalCTA";
import { Dashboard } from "./sections/Dashboard";
import { useAppStore } from "./stores/useAppStore";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

interface PinnedRange {
  start: number;
  end: number;
  center: number;
}

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const snapTriggerRef = useRef<ScrollTrigger | null>(null);
  const { hasPurchased } = useAppStore();

  useEffect(() => {
    // Only enable snap behaviour on desktop (lg breakpoint = 1024px)
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) return;

    const setupGlobalSnap = () => {
      if (snapTriggerRef.current) {
        snapTriggerRef.current.kill();
        snapTriggerRef.current = null;
      }

      const pinned = ScrollTrigger.getAll()
        .filter((st: ScrollTrigger) => st.vars.pin)
        .sort((a: ScrollTrigger, b: ScrollTrigger) => a.start - b.start);

      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges: PinnedRange[] = pinned.map((st: ScrollTrigger) => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center:
          (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      snapTriggerRef.current = ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              (r: PinnedRange) =>
                value >= r.start - 0.02 && value <= r.end + 0.02,
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest: number, r: PinnedRange) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0,
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: "power2.out",
        },
      });
    };

    const timer = setTimeout(setupGlobalSnap, 500);

    return () => {
      clearTimeout(timer);
      if (snapTriggerRef.current) {
        snapTriggerRef.current.kill();
        snapTriggerRef.current = null;
      }
      ScrollTrigger.getAll().forEach((st: ScrollTrigger) => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative bg-bg-primary min-h-screen">
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Vignette */}
      <div className="vignette" />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="relative">
        {hasPurchased ? (
          <Dashboard />
        ) : (
          <>
            <Hero />
            <AINative />
            <WhyMobile />
            <MCPServer />
            <PeerMarket />
            <GlobalCoverage />
            <LiveStats />
            <Pricing />
            <TokenEconomy />
            <FinalCTA />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
