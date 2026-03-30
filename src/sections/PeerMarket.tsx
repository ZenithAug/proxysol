import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, Server, Globe, Wallet, Calculator } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const tiers = [
  {
    name: "Shared Tier",
    description: "Pool rotation every 5 min",
    price: "$4",
    unit: "/GB",
    icon: Users,
    color: "cyan",
  },
  {
    name: "Private Tier",
    description: "Dedicated device assignment",
    price: "$8",
    unit: "/GB",
    icon: Server,
    color: "purple",
  },
  {
    name: "Peer Network",
    description: "Community-contributed bandwidth",
    price: "$0.25",
    unit: "/GB",
    icon: Globe,
    color: "teal",
  },
];

const calculatorOptions = [
  { label: "Light Usage", gb: 10, earnings: 2.5 },
  { label: "Medium Usage", gb: 100, earnings: 25 },
  { label: "Heavy Usage", gb: 1000, earnings: 250 },
];

const PeerMarket = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const cardCRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState(1);

  useEffect(() => {
    const section = sectionRef.current;
    const cardA = cardARef.current;
    const cardB = cardBRef.current;
    const cardC = cardCRef.current;

    if (!section || !cardA || !cardB || !cardC) return;

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
        0.05,
      );

      scrollTl.fromTo(
        cardC,
        { y: "45vh", opacity: 0 },
        { y: 0, opacity: 1, ease: "none" },
        0.1,
      );

      // Tier rows stagger
      const tierRows = cardB.querySelectorAll(".tier-row");
      scrollTl.fromTo(
        tierRows,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.02, ease: "none" },
        0.12,
      );

      // Calculator values
      const calcValues = cardC.querySelectorAll(".calc-value");
      scrollTl.fromTo(
        calcValues,
        { scale: 0.98, opacity: 0 },
        { scale: 1, opacity: 1, ease: "none" },
        0.18,
      );

      // SETTLE (30% - 70%): Hold position

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
        cardC,
        { y: 0, opacity: 1 },
        { y: "18vh", opacity: 0, ease: "power2.in" },
        0.7,
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="peer-market"
      className="section-pinned flex items-center justify-center"
      style={{ zIndex: 50 }}
    >
      {/* Ambient Glow */}
      <div
        className="ambient-glow ambient-glow-purple"
        style={{
          left: "50vw",
          top: "30vh",
          width: "40vw",
          height: "40vw",
        }}
      />

      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
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
                Peer Marketplace
              </span>
            </div>

            <h2 className="font-display font-bold text-3xl lg:text-5xl text-text-primary mb-6 leading-tight">
              Earn USDC
              <br />
              <span className="text-gradient">Passively</span>
            </h2>

            <p className="text-text-secondary text-base lg:text-lg leading-relaxed mb-8">
              Run a proxy agent on your devices and earn USDC automatically. Our
              network pays $0.02-0.25/GB for shared bandwidth.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-cyan" />
                </div>
                <span className="text-text-secondary">
                  Instant USDC Payouts
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple/10 flex items-center justify-center">
                  <span className="text-purple text-xs font-bold">SOL</span>
                </div>
                <span className="text-text-secondary">Solana Wallet</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
                  <span className="text-teal text-xs font-bold">API</span>
                </div>
                <span className="text-text-secondary">Simple Registration</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 w-full lg:w-auto">
            {/* Card B - Tiers Card */}
            <div
              ref={cardBRef}
              className="gloss-card w-full lg:w-[44vw] h-auto lg:h-[34vh] p-6"
              style={{ willChange: "transform, opacity" }}
            >
              <h3 className="font-display font-semibold text-lg text-text-primary mb-4">
                Earning Tiers
              </h3>

              <div className="space-y-3">
                {tiers.map((tier, index) => {
                  const Icon = tier.icon;
                  const colorClass =
                    tier.color === "cyan"
                      ? "text-cyan bg-cyan/10"
                      : tier.color === "purple"
                        ? "text-purple bg-purple/10"
                        : "text-teal bg-teal/10";

                  return (
                    <div
                      key={index}
                      className="tier-row flex items-center justify-between p-3 rounded-xl bg-bg-primary/50 border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-text-primary text-sm font-medium">
                            {tier.name}
                          </p>
                          <p className="text-text-secondary text-xs">
                            {tier.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-display font-bold ${colorClass.split(" ")[0]}`}
                        >
                          {tier.price}
                        </p>
                        <p className="text-text-secondary text-xs">
                          {tier.unit}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card C - Calculator Card */}
            <div
              ref={cardCRef}
              className="gloss-card w-full lg:w-[44vw] h-auto lg:h-[34vh] p-6"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="w-5 h-5 text-cyan" />
                <h3 className="font-display font-semibold text-lg text-text-primary">
                  Earnings Calculator
                </h3>
              </div>

              <div className="flex gap-2 mb-6">
                {calculatorOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(index)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedOption === index
                        ? "bg-cyan/20 border border-cyan/40 text-cyan"
                        : "bg-bg-primary/50 border border-white/5 text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="calc-value flex items-center justify-between p-4 rounded-xl bg-bg-primary/50 border border-cyan/20">
                <div>
                  <p className="text-text-secondary text-sm">
                    {calculatorOptions[selectedOption].gb} GB/month
                  </p>
                  <p className="text-text-secondary text-xs">
                    $0.25/GB × {calculatorOptions[selectedOption].gb} GB
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-cyan">
                    ${calculatorOptions[selectedOption].earnings}
                  </p>
                  <p className="text-text-secondary text-xs">/mo</p>
                </div>
              </div>

              <p className="text-text-secondary text-xs mt-4 text-center">
                Payments settled within 24-48h via USDC
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PeerMarket;
