import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Mail, MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  Product: [
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'MCP Server', href: '#mcp-server', isNew: true },
    { label: 'x402 Protocol', href: '#token' },
    { label: 'Live Stats', href: '#stats' },
  ],
  Resources: [
    { label: 'Glossary', href: '#' },
    { label: 'Setup Guides', href: '#' },
    { label: 'Use Cases', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
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
        { y: '8vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cta,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 0.5,
          },
        }
      );

      // Footer reveal
      gsap.fromTo(
        footer,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            end: 'top 70%',
            scrub: 0.5,
          },
        }
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
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan/10 flex items-center justify-center">
              <Zap className="w-8 h-8 text-cyan" />
            </div>
          </div>

          <h2 className="font-display font-bold text-3xl lg:text-5xl text-text-primary mb-4 leading-tight">
            Ready to Get Real<br />
            <span className="text-gradient">Mobile IPs?</span>
          </h2>

          <p className="text-text-secondary text-base lg:text-lg max-w-2xl mx-auto mb-8">
            Join 150+ businesses using solProxy to run clean mobile traffic at scale.
            Start scraping, verifying, and automating at scale.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a href="#pricing" className="neon-button-primary text-lg px-10 py-4">
              Get solProxy
            </a>
          </div>

          <p className="text-text-secondary text-sm">
            Starting at <span className="text-cyan font-semibold">$36/mo</span> • 
            No contracts • Cancel anytime • Instant activation
          </p>
        </div>

        {/* Footer */}
        <footer
          ref={footerRef}
          className="border-t border-white/5 pt-12"
          style={{ willChange: 'opacity' }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Logo Column */}
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logo.jpg"
                  alt="solProxy"
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <span className="font-mono text-lg font-medium tracking-wider text-text-primary">
                  SOLPROXY
                </span>
              </div>
              <p className="text-text-secondary text-sm mb-6 max-w-sm">
                Premium 4G/5G mobile network access for professionals. 
                Real devices on real carrier networks.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-bg-secondary border border-white/5 flex items-center justify-center text-text-secondary hover:text-cyan hover:border-cyan/30 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-bg-secondary border border-white/5 flex items-center justify-center text-text-secondary hover:text-cyan hover:border-cyan/30 transition-colors"
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
                        className="text-text-secondary text-sm hover:text-cyan transition-colors flex items-center gap-2"
                      >
                        {link.label}
                        {'isNew' in link && link.isNew && (
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
