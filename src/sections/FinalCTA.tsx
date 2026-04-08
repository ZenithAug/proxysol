import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Mail } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type FooterLink = {
  label: string;
  href: string;
  isNew?: boolean;
  external?: boolean;
};

const footerLinks: Record<string, FooterLink[]> = {
  Product: [
    { label: "How it Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "MCP Server", href: "#mcp-server", isNew: true },
    { label: "x402 Protocol", href: "#token" },
    { label: "Live Stats", href: "#stats" },
  ],
  Resources: [
    { label: "Agent Flow", href: "#ai-native" },
    { label: "Setup Guides", href: "#mcp-server" },
    { label: "FAQ", href: "#peer-market" },
  ],
  Support: [
    { label: "Telegram", href: "https://t.me/sol_proxy", external: true },
    { label: "Start Here", href: "#cta" },
  ],
};

const FinalCTA = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cta = ctaRef.current;
    const footer = footerRef.current;

    if (!section || !cta || !footer) return;

    const ctx = gsap.context(() => {
      // CTA card reveal
      gsap.fromTo(
        cta,
        { y: "8vh", opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cta,
            start: "top 85%",
            end: "top 50%",
            scrub: 0.5,
          },
        },
      );

      // Footer reveal
      gsap.fromTo(
        footer,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footer,
            start: "top 90%",
            end: "top 70%",
            scrub: 0.5,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="section-flowing py-20 lg:py-32"
      style={{ zIndex: 100 }}
    >
      <div className="w-full px-6 lg:px-12">
        {/* CTA Card */}
        <div
          ref={ctaRef}
          className="gloss-card p-8 lg:p-16 text-center mb-16"
          style={{ willChange: "transform, opacity" }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan/10 flex items-center justify-center">
              <Zap className="w-8 h-8 text-cyan" />
            </div>
          </div>

          <h2 className="font-display font-bold text-3xl lg:text-5xl text-text-primary mb-4 leading-tight">
            Ready to Give Your Agents
            <br />
            <span className="text-gradient">Real Mobile IPs?</span>
          </h2>

          <p className="text-text-secondary text-base lg:text-lg max-w-2xl mx-auto mb-8">
            SolProxy should feel like production infrastructure from first
            click to active session. Real mobile IPs, instant activation,
            wallet checkout, and recoverable dashboard access.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a
              href="https://t.me/sol_proxy"
              target="_blank"
              rel="noopener noreferrer"
              className="neon-button-primary text-lg px-10 py-4"
            >
              Start free
            </a>
          </div>

          <p className="text-text-secondary text-sm">
            Starting at <span className="text-cyan font-semibold">$36/mo</span>{" "}
            • Instant activation • Claim-link recovery • USDC checkout live
          </p>
        </div>

        {/* Footer */}
        <footer
          ref={footerRef}
          className="border-t border-white/5 pt-12"
          style={{ willChange: "opacity" }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Logo Column */}
            <div className="col-span-2 lg:col-span-2">
              <a href="#hero" className="flex items-center gap-3 mb-4 w-fit">
                <img
                  src="/logo.jpg"
                  alt="solProxy"
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <span className="font-mono text-lg font-medium tracking-wider text-text-primary">
                  SOLPROXY
                </span>
              </a>
              <p className="text-text-secondary text-sm mb-6 max-w-sm">
                AI-native 4G/5G proxy infrastructure with dashboard access,
                MCP control, and token-backed session recovery.
              </p>
              <div className="flex items-center gap-4">
                {/* Telegram */}
                <a
                  href="https://t.me/sol_proxy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-bg-secondary border border-white/5 flex items-center justify-center text-text-secondary hover:text-cyan hover:border-cyan/30 transition-colors"
                  aria-label="Telegram"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a
                  href="#pricing"
                  className="w-10 h-10 rounded-lg bg-bg-secondary border border-white/5 flex items-center justify-center text-text-secondary hover:text-cyan hover:border-cyan/30 transition-colors"
                  aria-label="Pricing"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* Email */}
                <a
                  href="https://t.me/sol_proxy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-bg-secondary border border-white/5 flex items-center justify-center text-text-secondary hover:text-cyan hover:border-cyan/30 transition-colors"
                  aria-label="Telegram Support"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-display font-semibold text-text-primary mb-4">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="text-text-secondary text-sm hover:text-cyan transition-colors flex items-center gap-2"
                      >
                        {link.label}
                        {"isNew" in link && link.isNew && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan/20 text-cyan text-xs">
                            New
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between pt-8 border-t border-white/5">
            <p className="text-text-secondary text-sm mb-4 lg:mb-0">
              © 2026 solProxy. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-text-secondary text-sm">
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                Network Operational
              </span>
              <span className="text-text-secondary text-sm">
                Powered by $PROXY on Solana
              </span>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default FinalCTA;
