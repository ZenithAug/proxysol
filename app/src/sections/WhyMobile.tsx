import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, RefreshCw, MapPin, Network } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Shield,
    title: 'Unmatched Trust Scores',
    description:
      'Mobile IPs come from real carrier networks. Websites see you as a legitimate mobile user, not a bot or datacenter. Bypass anti-bot systems with ease.',
    color: 'cyan',
  },
  {
    icon: RefreshCw,
    title: 'Fresh IPs on Demand',
    description:
      'Rotate to a new IP anytime. Shared tier: every 5 minutes. Private tier: every 1 minute via airplane mode reset. Stay undetectable.',
    color: 'purple',
  },
  {
    icon: MapPin,
    title: 'Real Geo-Targeting',
    description:
      'Access content as a local. Our proxies use real carrier IPs from Germany, UK, France, USA, and 6+ more countries.',
    color: 'teal',
  },
  {
    icon: Network,
    title: 'CGNAT Advantage',
    description:
      'Carrier-Grade NAT means many real users share each IP. Platforms expect this — it\'s how mobile networks actually work.',
    color: 'cyan',
  },
];

const WhyMobile = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const cards = cardsRef.current;

    if (!section || !headline || !cards) return;

    const ctx = gsap.context(() => {
      // Headline reveal
      gsap.fromTo(
        headline,
        { x: '-10vw', opacity: 0 },
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

      // Cards stagger reveal
      const cardElements = cards.querySelectorAll('.feature-card');
      cardElements.forEach((card) => {
        gsap.fromTo(
          card,
          { x: '12vw', rotateY: -8, opacity: 0 },
          {
            x: 0,
            rotateY: 0,
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

        // Parallax effect
        gsap.fromTo(
          card,
          { y: '-2vh' },
          {
            y: '2vh',
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="section-flowing py-20 lg:py-32"
      style={{ zIndex: 30 }}
    >
      <div className="w-full px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Column - Headline */}
          <div ref={headlineRef} className="lg:w-[40vw] lg:sticky lg:top-32 lg:self-start">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan mb-4 block">
              Why Mobile Proxies
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-5xl text-text-primary mb-6 leading-tight">
              Why Mobile Proxies<br />
              <span className="text-gradient">Beat Everything Else</span>
            </h2>
            <p className="text-text-secondary text-base lg:text-lg leading-relaxed">
              Mobile IPs from real carrier networks are trusted by every website.
              Experience the highest success rates in the industry.
            </p>

            {/* Connector Line (visible on desktop) */}
            <div className="hidden lg:block mt-12 relative h-64">
              <svg
                className="absolute left-4 top-0 h-full w-4"
                viewBox="0 0 16 256"
                fill="none"
              >
                <path
                  d="M8 0V256"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="opacity-50"
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#00F0FF" />
                    <stop offset="1" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div ref={cardsRef} className="lg:w-[44vw] space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClass =
                feature.color === 'cyan'
                  ? 'text-cyan bg-cyan/10 border-cyan/20'
                  : feature.color === 'purple'
                  ? 'text-purple bg-purple/10 border-purple/20'
                  : 'text-teal bg-teal/10 border-teal/20';

              return (
                <div
                  key={index}
                  className="feature-card gloss-card p-6 lg:p-8"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-xl text-text-primary mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyMobile;
