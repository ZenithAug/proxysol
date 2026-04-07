import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Wifi, Clock, Headphones } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const cardCRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cardA = cardARef.current;
    const cardB = cardBRef.current;
    const cardC = cardCRef.current;
    const headline = headlineRef.current;
    const cta = ctaRef.current;

    if (!section || !cardA || !cardB || !cardC || !headline || !cta) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    const ctx = gsap.context(() => {
      // Load animation timeline
      const loadTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (isDesktop) {
        // Desktop: full 3D entrance animations
        loadTl.fromTo(
          cardA,
          { x: "-60vw", rotateY: 18, opacity: 0 },
          { x: 0, rotateY: 0, opacity: 1, duration: 0.9 },
        );
        loadTl.fromTo(
          cardB,
          { x: "40vw", rotateY: -12, opacity: 0 },
          { x: 0, rotateY: 0, opacity: 1, duration: 0.8 },
          0.15,
        );
        loadTl.fromTo(
          cardC,
          { y: "60vh", rotateX: -10, opacity: 0 },
          { y: 0, rotateX: 0, opacity: 1, duration: 0.8 },
          0.25,
        );
      } else {
        // Mobile: simple fade-up (no heavy 3D transforms)
        loadTl.fromTo(
          [cardA, cardB, cardC],
          { y: 32, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.1 },
        );
      }

      // Headline words stagger
      const words = headline.querySelectorAll(".word");
      loadTl.fromTo(
        words,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05 },
        isDesktop ? 0.45 : 0.25,
      );

      // CTA buttons
      loadTl.fromTo(
        cta.children,
        { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1 },
        isDesktop ? 0.7 : 0.45,
      );

      // Scroll-driven exit: desktop only (pin causes mobile scroll jank)
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
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned flex items-center justify-center"
      style={{ zIndex: 10 }}
    >
      {/* Ambient Glow */}
      <div
        className="ambient-glow ambient-glow-purple"
        style={{
          left: "18vw",
          top: "30vh",
          width: "46vw",
          height: "46vw",
        }}
      />

      <div className="relative w-full min-h-full lg:h-full px-6 lg:px-12 pt-20 pb-10 lg:pb-0">
        <div className="relative w-full h-auto lg:h-full flex flex-col lg:flex-row items-center justify-center gap-6">
          {/* Card A - Main Hero Card */}
          <div
            ref={cardARef}
            className="gloss-card gloss-card-neon w-full lg:w-[62vw] h-auto lg:h-[72vh] p-6 lg:p-10 flex flex-col justify-between"
            style={{ willChange: "auto" }}
          >
            {/* Top Section */}
            <div>
              {/* Live Badge */}
              <div className="live-badge mb-6">
                <span className="live-dot" />
                <span>Live</span>
              </div>

              {/* Headline */}
              <div ref={headlineRef} className="space-y-2 mb-6">
                <h1 className="font-display font-bold text-4xl lg:text-6xl xl:text-7xl text-text-primary leading-none">
                  <span className="word inline-block">AI-native mobile</span>
                </h1>
                <h1 className="font-display font-bold text-3xl lg:text-5xl xl:text-6xl text-gradient leading-none">
                  <span className="word inline-block">proxy infrastructure.</span>
                </h1>
              </div>

              {/* Subheadline */}
              <p className="text-text-secondary text-base lg:text-lg max-w-2xl leading-relaxed">
                Real 4G/5G carrier IPs, instant endpoint activation, MCP control,
                and token-backed access recovery. Built for agents, automation,
                and high-trust traffic at scale.
              </p>
            </div>

            {/* Bottom Section */}
            <div>
              {/* CTAs */}
              <div ref={ctaRef} className="flex flex-wrap gap-4 mb-4">
                <a
                  href="https://t.me/sol_proxy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neon-button-primary"
                >
                  Start free
                </a>
                <a href="#mcp-server" className="neon-button">
                  Explore MCP flow
                </a>
              </div>

              {/* Microcopy */}
              <p className="text-text-secondary text-sm mb-4">
                For builders:{" "}
                <a href="#ai-native" className="text-cyan hover:underline font-mono text-xs transition-colors">x402 / MCP →</a>
                {" • "}
                Starting at{" "}
                <span className="text-cyan font-semibold">$36/mo</span>
              </p>

              {/* Micro-proof bar */}
              <div className="flex flex-wrap gap-2">
                {[
                  "10+ countries",
                  "<60s setup",
                  "Real carrier IPs",
                  "~2s token settlement",
                  "Claim-link recovery",
                ].map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-text-secondary text-xs font-mono"
                  >
                    <span className="w-1 h-1 rounded-full bg-cyan opacity-70 flex-shrink-0" />
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 w-full lg:w-auto">
            {/* Card B - Status Card */}
            <div
              ref={cardBRef}
              className="gloss-card w-full lg:w-[24vw] h-auto lg:h-[22vh] p-6"
              style={{ willChange: "auto" }}
            >
              <h3 className="font-display font-semibold text-lg text-text-primary mb-4">
                Network Operational
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="stat-chip">
                  <span className="stat-chip-value text-cyan">4G/5G</span>
                  <span className="stat-chip-label">Carrier Pools</span>
                </div>
                <div className="stat-chip">
                  <span className="stat-chip-value text-cyan">15+</span>
                  <span className="stat-chip-label">Countries</span>
                </div>
                <div className="stat-chip">
                  <span className="stat-chip-value text-cyan">95%</span>
                  <span className="stat-chip-label">Uptime</span>
                </div>
              </div>
            </div>

            {/* Card C - Feature Card */}
            <div
              ref={cardCRef}
              className="gloss-card w-full lg:w-[24vw] h-auto lg:h-[46vh] p-6"
              style={{ willChange: "auto" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-cyan" />
                </div>
                <h3 className="font-display font-semibold text-lg text-text-primary">
                  Infrastructure
                </h3>
              </div>

              <p className="text-text-secondary text-sm mb-6">
                Production-ready endpoints for browser automation, scraping,
                verification, and agent workflows on real carrier networks.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Wifi className="w-4 h-4 text-cyan" />
                  <span className="text-sm text-text-secondary">
                    Rotating carrier pools
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-cyan" />
                  <span className="text-sm text-text-secondary">
                    Dashboard + MCP control
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-cyan" />
                  <span className="text-sm text-text-secondary">
                    Instant activation
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Headphones className="w-4 h-4 text-cyan" />
                  <span className="text-sm text-text-secondary">
                    Secure claim recovery
                  </span>
                </div>
              </div>

              {/* Phone Image */}
              <div className="mt-6 flex justify-center">
                <img
                  src="/phone-device.png"
                  alt="Mobile Device"
                  className="w-32 h-auto object-contain opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
