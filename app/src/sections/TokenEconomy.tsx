import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Globe, Wallet, FileCode, Check, Vote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const tokenMetrics = [
  { icon: Cpu, value: "300", label: "Active Devices", color: "cyan" },
  { icon: Globe, value: "15+", label: "Countries", color: "purple" },
  { icon: Wallet, value: "2", label: "Payment Networks", color: "teal" },
  { icon: FileCode, value: "402", label: "Payment Protocol", color: "cyan" },
];

const phases = [
  {
    number: 1,
    title: "Live Network",
    description: "Mobile proxies, MCP server, x402 protocol operational",
    status: "live",
    icon: Check,
  },
  {
    number: 2,
    title: "Payment Discounts",
    description: "$PROXY holders get 10-30% off proxy purchases",
    status: "coming",
    icon: Wallet,
  },
  {
    number: 3,
    title: "Peer Marketplace",
    description: "Earnings boosted up to 50% for stakers",
    status: "coming",
    icon: Cpu,
  },
  {
    number: 4,
    title: "Governance",
    description: "Vote on network parameters and resource allocation",
    status: "coming",
    icon: Vote,
  },
];

const TokenEconomy = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cardA = cardARef.current;
    const cardB = cardBRef.current;
    const coin = coinRef.current;

    if (!section || !cardA || !cardB || !coin) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=130%",
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        cardA,
        { x: "-55vw", opacity: 0 },
        { x: 0, opacity: 1, ease: "none" },
        0,
      );

      scrollTl.fromTo(
        cardB,
        { x: "55vw", opacity: 0 },
        { x: 0, opacity: 1, ease: "none" },
        0,
      );

      // Coin 3D rotation entrance
      scrollTl.fromTo(
        coin,
        { rotateY: -90, scale: 0.85, opacity: 0 },
        { rotateY: 0, scale: 1, opacity: 1, ease: "none" },
        0.08,
      );

      // Phase list stagger
      const phaseItems = cardB.querySelectorAll(".phase-item");
      scrollTl.fromTo(
        phaseItems,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.02, ease: "none" },
        0.12,
      );

      // SETTLE (30% - 70%): Hold position with coin rotation loop
      // Note: Continuous rotation is handled by CSS animation

      // EXIT (70% - 100%)
      scrollTl.fromTo(
        cardA,
        { x: 0, opacity: 1 },
        { x: "-18vw", opacity: 0, ease: "power2.in" },
        0.7,
      );

      scrollTl.fromTo(
        cardB,
        { x: 0, opacity: 1 },
        { x: "18vw", opacity: 0, ease: "power2.in" },
        0.7,
      );

      scrollTl.fromTo(
        coin,
        { rotateY: 0, opacity: 1 },
        { rotateY: 45, opacity: 0, ease: "power2.in" },
        0.7,
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="token"
      className="section-pinned flex items-center justify-center"
      style={{ zIndex: 90 }}
    >
      {/* Ambient Glow */}
      <div
        className="ambient-glow ambient-glow-purple"
        style={{
          left: "25vw",
          top: "25vh",
          width: "50vw",
          height: "50vw",
        }}
      />

      <div className="relative w-full min-h-full lg:h-full px-6 lg:px-12 pt-20 pb-10 lg:pb-0">
        <div className="relative w-full h-auto lg:h-full flex flex-col lg:flex-row items-center justify-center gap-6">
          {/* Card A - Headline Card */}
          <div
            ref={cardARef}
            className="gloss-card w-full lg:w-[40vw] h-auto lg:h-[72vh] p-6 lg:p-10 flex flex-col justify-center"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-purple" />
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-purple">
                Economic Layer
              </span>
            </div>

            <h2 className="font-display font-bold text-3xl lg:text-5xl text-text-primary mb-6 leading-tight">
              $PROXY
              <br />
              <span className="text-gradient">Token</span>
            </h2>

            <p className="text-text-secondary text-base lg:text-lg leading-relaxed mb-8">
              Powering the AI Agent Economy. Real devices on real networks,
              powered by blockchain payments on Solana and Base.
            </p>

            {/* Token Metrics */}
            <div className="grid grid-cols-2 gap-4">
              {tokenMetrics.map((metric, index) => {
                const Icon = metric.icon;
                const colorClass =
                  metric.color === "cyan"
                    ? "text-cyan bg-cyan/10"
                    : metric.color === "purple"
                      ? "text-purple bg-purple/10"
                      : "text-teal bg-teal/10";

                return (
                  <div
                    key={index}
                    className="text-center p-4 rounded-xl bg-bg-primary/50 border border-white/5"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${colorClass}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <p
                      className={`text-2xl font-display font-bold ${colorClass.split(" ")[0]}`}
                    >
                      {metric.value}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {metric.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card B - Token Card */}
          <div
            ref={cardBRef}
            className="gloss-card w-full lg:w-[44vw] h-auto lg:h-[72vh] p-6 flex flex-col"
            style={{ willChange: "transform, opacity" }}
          >
            {/* 3D Coin */}
            <div className="flex justify-center mb-6">
              <div
                ref={coinRef}
                className="relative w-32 h-32"
                style={{
                  willChange: "transform, opacity",
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
              >
                <img
                  src="/token-coin.png"
                  alt="$PROXY Token"
                  className="w-full h-full object-contain animate-spin-slow"
                  style={{
                    filter: "drop-shadow(0 0 30px rgba(168, 85, 247, 0.5))",
                  }}
                />
              </div>
            </div>

            <h3 className="font-display font-semibold text-lg text-text-primary mb-4 text-center">
              Token Utility Phases
            </h3>

            {/* Phase List */}
            <div className="space-y-3 flex-1">
              {phases.map((phase, index) => {
                const Icon = phase.icon;
                const isLive = phase.status === "live";

                return (
                  <div
                    key={index}
                    className={`phase-item flex items-center gap-4 p-3 rounded-xl border ${
                      isLive
                        ? "bg-cyan/5 border-cyan/20"
                        : "bg-bg-primary/50 border-white/5"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isLive
                          ? "bg-cyan/20 text-cyan"
                          : "bg-white/5 text-text-secondary"
                      }`}
                    >
                      {isLive ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            isLive ? "text-text-primary" : "text-text-secondary"
                          }`}
                        >
                          Phase {phase.number}: {phase.title}
                        </span>
                        {isLive && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan/20 text-cyan text-xs">
                            LIVE
                          </span>
                        )}
                      </div>
                      <p className="text-text-secondary text-xs">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status */}
            <div className="mt-4 p-3 rounded-xl bg-bg-primary/50 border border-white/5 text-center">
              <p className="text-text-secondary text-sm">
                <span className="text-cyan font-semibold">Phase 1: LIVE</span>
                <span className="mx-2">•</span>
                <span>Phases 2-4: Coming Soon</span>
              </p>
            </div>

            <button className="metallic-button w-full mt-4">
              Learn About $PROXY
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenEconomy;
