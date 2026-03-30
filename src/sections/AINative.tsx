import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Terminal, Wallet, Key, Clock } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const AINative = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const cardCRef = useRef<HTMLDivElement>(null);

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
          { x: "-55vw", rotateY: 20, opacity: 0 },
          { x: 0, rotateY: 0, opacity: 1, ease: "none" },
          0,
        );
        scrollTl.fromTo(
          cardB,
          { x: "55vw", rotateY: -16, opacity: 0 },
          { x: 0, rotateY: 0, opacity: 1, ease: "none" },
          0.05,
        );
        scrollTl.fromTo(
          cardC,
          { y: "45vh", rotateX: 10, opacity: 0 },
          { y: 0, rotateX: 0, opacity: 1, ease: "none" },
          0.1,
        );

        // Metrics chips stagger
        const metricsB = cardB.querySelectorAll(".metric-chip");
        const metricsC = cardC.querySelectorAll(".metric-chip");
        scrollTl.fromTo(
          metricsB,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.02, ease: "none" },
          0.15,
        );
        scrollTl.fromTo(
          metricsC,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.02, ease: "none" },
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
      id="ai-native"
      className="section-pinned flex items-center justify-center"
      style={{ zIndex: 20 }}
    >
      {/* Ambient Glow */}
      <div
        className="ambient-glow ambient-glow-cyan"
        style={{
          left: "50vw",
          top: "20vh",
          width: "40vw",
          height: "40vw",
        }}
      />

      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)
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
            style={{ willChange: "auto" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-cyan" />
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-cyan">
                AI-Native
              </span>
            </div>

            <h2 className="font-display font-bold text-3xl lg:text-5xl text-text-primary mb-6 leading-tight">
              Built for
              <br />
              <span className="text-gradient">AI Agents</span>
            </h2>

            <p className="text-text-secondary text-base lg:text-lg leading-relaxed mb-8">
              Infrastructure for autonomous systems. No accounts. No API keys.
              No human intervention.
            </p>

            <div className="flex items-center gap-4">
              <img
                src="/token-coin.png"
                alt="Token"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-text-primary font-semibold">
                  Powered by $PROXY
                </p>
                <p className="text-text-secondary text-sm">Solana & Base</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 w-full lg:w-auto">
            {/* Card B - x402 Protocol */}
            <div
              ref={cardBRef}
              className="gloss-card w-full lg:w-[44vw] h-auto lg:h-[34vh] p-6"
              style={{ willChange: "auto" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-purple" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-text-primary">
                    x402 Protocol
                  </h3>
                  <p className="text-text-secondary text-xs">
                    HTTP 402 Payment Required
                  </p>
                </div>
              </div>

              <p className="text-text-secondary text-sm mb-6">
                Agents purchase proxies with USDC on-chain. Settlement in ~2
                seconds. No registration, no KYC, no approval process.
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="metric-chip flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan/5 border border-cyan/20">
                  <Clock className="w-4 h-4 text-cyan" />
                  <span className="text-sm text-text-primary">
                    ~2s settlement
                  </span>
                </div>
                <div className="metric-chip flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan/5 border border-cyan/20">
                  <Wallet className="w-4 h-4 text-cyan" />
                  <span className="text-sm text-text-primary">
                    $0.375 min buy
                  </span>
                </div>
                <div className="metric-chip flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan/5 border border-cyan/20">
                  <Key className="w-4 h-4 text-cyan" />
                  <span className="text-sm text-text-primary">0 API keys</span>
                </div>
              </div>
            </div>

            {/* Card C - MCP Server */}
            <div
              ref={cardCRef}
              className="gloss-card w-full lg:w-[44vw] h-auto lg:h-[34vh] p-6"
              style={{ willChange: "auto" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal/20 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-text-primary">
                    MCP Server
                  </h3>
                  <p className="text-text-secondary text-xs">
                    Model Context Protocol
                  </p>
                </div>
              </div>

              <p className="text-text-secondary text-sm mb-6">
                Control proxy infrastructure through natural language. Create
                ports, rotate IPs, monitor status — all through conversation.
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="metric-chip flex items-center gap-2 px-3 py-2 rounded-lg bg-teal/5 border border-teal/20">
                  <Terminal className="w-4 h-4 text-teal" />
                  <span className="text-sm text-text-primary">
                    55 MCP tools
                  </span>
                </div>
                <div className="metric-chip flex items-center gap-2 px-3 py-2 rounded-lg bg-teal/5 border border-teal/20">
                  <Cpu className="w-4 h-4 text-teal" />
                  <span className="text-sm text-text-primary">
                    Claude/Cursor/Cline
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AINative;
