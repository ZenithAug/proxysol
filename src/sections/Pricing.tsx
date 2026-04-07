import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Users, Server, Zap } from 'lucide-react';
import { CheckoutModal } from '../components/CheckoutModal';

gsap.registerPlugin(ScrollTrigger);

const pricingTiers = [
  {
    name: 'Starter',
    price: 90,
    originalPrice: 100,
    discount: 10,
    gb: 25,
    perGb: 3.6,
    slots: 'Silver (20 slots)',
    featured: false,
    icon: Users,
    color: 'cyan',
  },
  {
    name: 'Growth',
    price: 160,
    originalPrice: 200,
    discount: 20,
    gb: 50,
    perGb: 3.2,
    slots: 'Gold (35 slots)',
    featured: true,
    icon: Zap,
    color: 'purple',
  },
  {
    name: 'Scale',
    price: 280,
    originalPrice: 400,
    discount: 30,
    gb: 100,
    perGb: 2.8,
    slots: 'Platinum (50 slots)',
    featured: false,
    icon: Server,
    color: 'teal',
  },
];

const comparisonData = [
  { feature: 'Device Access', shared: 'Rotating pool', private: 'Dedicated modem' },
  { feature: 'IP Rotation', shared: 'Every 5 min', private: 'Every 1 min' },
  { feature: 'Price', shared: '$4/GB', private: '$8/GB' },
  { feature: 'Slots', shared: 'FREE', private: 'FREE' },
];

const Pricing = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);

  const [checkoutData, setCheckoutData] = useState<{ isOpen: boolean; tierGb: number; priceUsd: number }>({
    isOpen: false,
    tierGb: 0,
    priceUsd: 0,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const cards = cardsRef.current;
    const comparison = comparisonRef.current;

    if (!section || !headline || !cards || !comparison) return;

    const ctx = gsap.context(() => {
      // Headline reveal
      gsap.fromTo(
        headline,
        { x: '-8vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headline,
            start: 'top 80%',
            end: 'top 45%',
            scrub: 0.5,
          },
        }
      );

      // Pricing cards 3D reveal
      const cardElements = cards.querySelectorAll('.pricing-card');
      cardElements.forEach((card) => {
        gsap.fromTo(
          card,
          { y: '10vh', rotateX: 6, opacity: 0 },
          {
            y: 0,
            rotateX: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 0.5,
            },
          }
        );
      });

      // Comparison card reveal
      gsap.fromTo(
        comparison,
        { y: '8vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: comparison,
            start: 'top 85%',
            end: 'top 50%',
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
      id="pricing"
      className="section-flowing py-20 lg:py-32"
      style={{ zIndex: 80 }}
    >
      <div className="w-full px-6 lg:px-12">
        {/* Headline */}
        <div ref={headlineRef} className="text-center mb-12">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan mb-4 block">
            Simple Pricing
          </span>
          <h2 className="font-display font-bold text-3xl lg:text-5xl text-text-primary mb-4 leading-tight">
            Simple, <span className="text-gradient">Transparent</span> Pricing
          </h2>
          <p className="text-text-secondary text-base lg:text-lg max-w-2xl mx-auto">
            Shared from <span className="text-cyan font-semibold">$36/mo</span>. Private from <span className="text-cyan font-semibold">$72/mo</span>.
            Micro-buys from <span className="text-cyan font-semibold">$0.375</span> in USDC or <span className="text-cyan font-semibold">$SOLPROXY</span>.
            Unlimited bandwidth • 10–100 Mbps typical.
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
        >
          {pricingTiers.map((tier, index) => {
            const Icon = tier.icon;
            const isFeatured = tier.featured;
            const colorClass = 
              tier.color === 'cyan' ? 'text-cyan bg-cyan/10 border-cyan/20' : 
              tier.color === 'purple' ? 'text-purple bg-purple/10 border-purple/20' : 
              'text-teal bg-teal/10 border-teal/20';

            return (
              <div
                key={index}
                className={`pricing-card gloss-card p-6 lg:p-8 flex flex-col ${
                  isFeatured ? 'pricing-featured pt-12 lg:pt-14' : ''
                }`}
                style={{ willChange: 'transform, opacity' }}
              >
                {isFeatured && (
                  <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan text-bg-primary text-xs font-semibold">
                    MOST POPULAR
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-text-primary">
                    {tier.name}
                  </h3>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-display font-bold ${colorClass.split(' ')[0]}`}>
                      ${tier.price}
                    </span>
                    <span className="text-text-secondary line-through">
                      ${tier.originalPrice}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm">
                    {tier.discount}% off • {tier.gb} GB @ ${tier.perGb}/GB
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-primary/50 border border-white/5 mb-6">
                  <Check className={`w-4 h-4 ${colorClass.split(' ')[0]}`} />
                  <span className="text-sm text-text-secondary">{tier.slots}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <Check className="w-4 h-4 text-cyan" />
                    Unlocks {tier.name} tier
                  </li>
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <Check className="w-4 h-4 text-cyan" />
                    {tier.gb} GB bandwidth
                  </li>
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <Check className="w-4 h-4 text-cyan" />
                    Traffic never expires
                  </li>
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <Check className="w-4 h-4 text-cyan" />
                    24/7 support
                  </li>
                </ul>

                <button
                  onClick={() => setCheckoutData({ isOpen: true, tierGb: tier.gb, priceUsd: tier.price })}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    isFeatured
                      ? 'neon-button-primary'
                      : 'neon-button'
                  }`}
                >
                  Buy {tier.gb} GB
                </button>
              </div>
            );
          })}
        </div>

        {/* Comparison Card */}
        <div
          ref={comparisonRef}
          className="gloss-card p-6 lg:p-8"
          style={{ willChange: 'transform, opacity' }}
        >
          <h3 className="font-display font-semibold text-xl text-text-primary mb-6 text-center">
            Shared vs Private: Which is Right for You?
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Feature</th>
                  <th className="text-center py-3 px-4 text-cyan font-medium">Shared</th>
                  <th className="text-center py-3 px-4 text-purple font-medium">Private</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-white/5 last:border-0">
                    <td className="py-4 px-4 text-text-primary">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-text-secondary">{row.shared}</td>
                    <td className="py-4 px-4 text-center text-text-secondary">{row.private}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Check className="w-4 h-4 text-cyan" />
              Endpoints renew monthly
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Check className="w-4 h-4 text-cyan" />
              Bandwidth never expires
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Check className="w-4 h-4 text-cyan" />
              Pay with USDC, card, or $SOLPROXY
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Check className="w-4 h-4 text-cyan" />
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
      
      <CheckoutModal 
        isOpen={checkoutData.isOpen}
        onClose={() => setCheckoutData((prev: { isOpen: boolean; tierGb: number; priceUsd: number }) => ({ ...prev, isOpen: false }))}
        tierGb={checkoutData.tierGb}
        priceUsd={checkoutData.priceUsd}
      />
    </section>
  );
};

export default Pricing;
