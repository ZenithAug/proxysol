import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, Server, Globe, Wallet, Calculator, ChevronDown } from "lucide-react";

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
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { q: "Is KYC required?", a: "No. You only need a Solana or Base wallet with USDC." },
    { q: "Do you use API keys?", a: "No. We use the x402 protocol (HTTP 402 Payment Required). You pay on-request directly from your wallet." },
    { q: "What payment methods are supported?", a: "USDC on Solana and Base. $PROXY token payments are optional." },
    { q: "How long does setup take?", a: "Less than 60 seconds. Connect your wallet, pick a country, and start requesting." },
    { q: "Is there 24/7 support?", a: "Yes. Reach out to us via Telegram anytime." }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const cardA = cardARef.current;
    const cardB = cardBRef.current;
    const cardC = cardCRef.current;

    if (!section || !cardA || !cardB || !cardC) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    const ctx = gsap.context(() => {
      if (isDesktop) {
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
      } else {
        // Mobile: simple scroll-triggered fade-up
        gsap.fromTo(
          [cardA, cardB, cardC],
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
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
            className="gloss-card w-full lg:w-[40vw] h-auto lg:h-[72vh] p-6 lg:p-10 flex flex-col justify-center overflow-y-auto custom-scrollbar"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-6 h-6 text-purple" />
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-purple">
                FAQ & Earnings
              </span>
            </div>

            <h2 className="font-display font-bold text-3xl lg:text-5xl text-text-primary mb-6 leading-tight shrink-0">
              Answers &
              <br />
              <span className="text-gradient">Peer Network</span>
            </h2>

            <div className="space-y-3 flex-grow pb-4">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className={`border ${openFaq === i ? 'border-purple/30 bg-purple/5' : 'border-white/5 bg-bg-primary/50'} rounded-xl transition-colors overflow-hidden`}
                >
                  <button 
                    className="w-full text-left p-4 flex justify-between items-center gap-4"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="text-text-primary text-sm font-semibold pr-4">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-180 text-purple' : ''}`} />
                  </button>
                  <div 
                    className={`px-4 pb-4 text-text-secondary text-sm overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0 pb-0'}`}
                  >
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 w-full lg:w-auto">
            {/* Card B - Tiers Card */}
            <div
              ref={cardBRef}
              className="gloss-card w-full lg:w-[44vw] h-auto lg:h-[34vh] p-6"
              style={{ willChange: "auto" }}
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
              style={{ willChange: "auto" }}
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
