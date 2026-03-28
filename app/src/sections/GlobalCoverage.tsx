import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Filter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const countries = [
  { name: 'Germany', code: 'DE', devices: 50, flag: '🇩🇪' },
  { name: 'United Kingdom', code: 'UK', devices: 30, flag: '🇬🇧' },
  { name: 'France', code: 'FR', devices: 25, flag: '🇫🇷' },
  { name: 'United States', code: 'US', devices: 20, flag: '🇺🇸', carriers: 'AT&T • Verizon • T-Mobile' },
  { name: 'Netherlands', code: 'NL', devices: 15, flag: '🇳🇱' },
  { name: 'Spain', code: 'ES', devices: 12, flag: '🇪🇸' },
  { name: 'Italy', code: 'IT', devices: 10, flag: '🇮🇹' },
  { name: 'Poland', code: 'PL', devices: 8, flag: '🇵🇱' },
  { name: 'Austria', code: 'AT', devices: 6, flag: '🇦🇹' },
  { name: 'Belgium', code: 'BE', devices: 5, flag: '🇧🇪' },
  { name: 'Japan', code: 'JP', devices: 8, flag: '🇯🇵' },
  { name: 'Singapore', code: 'SG', devices: 6, flag: '🇸🇬' },
  { name: 'Brazil', code: 'BR', devices: 5, flag: '🇧🇷' },
  { name: 'Canada', code: 'CA', devices: 7, flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', devices: 6, flag: '🇦🇺' },
];

const GlobalCoverage = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const map = mapRef.current;
    const list = listRef.current;

    if (!section || !headline || !map || !list) return;

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

      // Map card reveal
      gsap.fromTo(
        map,
        { x: '10vw', rotateY: -6, opacity: 0 },
        {
          x: 0,
          rotateY: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: map,
            start: 'top 80%',
            end: 'top 45%',
            scrub: 0.5,
          },
        }
      );

      // Country list reveal
      gsap.fromTo(
        list,
        { y: '6vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: list,
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
      id="coverage"
      className="section-flowing py-20 lg:py-32"
      style={{ zIndex: 60 }}
    >
      <div className="w-full px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Column - Headline */}
          <div ref={headlineRef} className="lg:w-[40vw]">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan mb-4 block">
              Global Infrastructure
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-5xl text-text-primary mb-6 leading-tight">
              Global Coverage,<br />
              <span className="text-gradient">Local IPs</span>
            </h2>
            <p className="text-text-secondary text-base lg:text-lg leading-relaxed mb-8">
              Real mobile IPs from local carriers in 15+ countries. 
              Choose country when creating endpoint. Filter by carrier.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan/10 border border-cyan/20">
                <MapPin className="w-4 h-4 text-cyan" />
                <span className="text-sm text-cyan">15+ Countries</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple/10 border border-purple/20">
                <Filter className="w-4 h-4 text-purple" />
                <span className="text-sm text-purple">Carrier Filter</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-[44vw] space-y-6">
            {/* Map Card */}
            <div
              ref={mapRef}
              className="gloss-card p-0 overflow-hidden"
              style={{ willChange: 'transform, opacity' }}
            >
              <img
                src="/world-map.png"
                alt="Global Network Coverage"
                className="w-full h-64 lg:h-80 object-cover"
              />
            </div>

            {/* Country List */}
            <div
              ref={listRef}
              className="gloss-card p-6"
              style={{ willChange: 'transform, opacity' }}
            >
              <h3 className="font-display font-semibold text-lg text-text-primary mb-4">
                Available Locations
              </h3>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {countries.map((country, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-bg-primary/50 border border-white/5 hover:border-cyan/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{country.flag}</span>
                      <div>
                        <p className="text-text-primary text-sm">{country.name}</p>
                        {country.carriers && (
                          <p className="text-text-secondary text-xs">{country.carriers}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-cyan text-sm font-mono">
                      {country.devices}+
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalCoverage;
