import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, Globe, Clock, MessageSquare, Shield, Server, Lock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Globe, value: "15+", label: "Countries Active", color: "purple" },
  { icon: Activity, value: "<60s", label: "Setup Time", color: "cyan" },
  { icon: Clock, value: "~2s", label: "On-Chain Settlement", color: "teal" },
  { icon: MessageSquare, value: "24/7", label: "Support Response", color: "cyan" },
];

const securityFeatures = [
  {
    title: 'Network Security',
    items: ['HTTPS/SSL encryption', 'Secure authentication', 'API key management', 'Private proxy pools'],
    icon: Shield,
    color: 'cyan',
  },
  {
    title: 'Infrastructure Security',
    items: ['Dedicated infrastructure', '24/7 security monitoring', 'DDoS protection', 'Redundant failover'],
    icon: Server,
    color: 'purple',
  },
];

const StatCard = ({ 
  stat, 
  inView,
  index
}: { 
  stat: typeof stats[0]; 
  inView: boolean;
  index: number;
}) => {
  const Icon = stat.icon;
  const colorClass = 
    stat.color === 'cyan' ? 'text-cyan bg-cyan/10' : 
    stat.color === 'purple' ? 'text-purple bg-purple/10' : 
    'text-teal bg-teal/10';

  return (
    <div 
      className={`stat-card gloss-card p-6 text-center transition-all duration-700`}
      style={{ 
        opacity: inView ? 1 : 0, 
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${index * 100}ms`
      }}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className={`text-3xl lg:text-4xl font-display font-bold ${colorClass.split(' ')[0]} mb-2`}>
        {stat.value}
      </p>
      <p className="text-text-secondary text-sm">{stat.label}</p>
    </div>
  );
};

const LiveStats = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const stats = statsRef.current;
    const security = securityRef.current;

    if (!section || !headline || !stats || !security) return;

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

      // Stats grid reveal
      gsap.fromTo(
        stats,
        { x: '12vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stats,
            start: 'top 80%',
            end: 'top 45%',
            scrub: 0.5,
            onEnter: () => setStatsInView(true),
          },
        }
      );

      // Security card reveal
      gsap.fromTo(
        security,
        { y: '8vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: security,
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
      id="stats"
      className="section-flowing py-20 lg:py-32"
      style={{ zIndex: 70 }}
    >
      <div className="w-full px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Column - Headline */}
          <div ref={headlineRef} className="lg:w-[40vw]">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan mb-4 block">
              Network Facts
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-5xl text-text-primary mb-6 leading-tight">
              Honest Network<br />
              <span className="text-gradient">Claims</span>
            </h2>
            <p className="text-text-secondary text-base lg:text-lg leading-relaxed">
              Transparent infrastructure with real-time monitoring. 
              Track our network performance and reliability.
            </p>
          </div>

          {/* Right Column */}
          <div className="lg:w-[44vw] space-y-6">
            {/* Stats Grid */}
            <div
              ref={statsRef}
              className="grid grid-cols-2 gap-4"
              style={{ willChange: 'transform, opacity' }}
            >
              {stats.map((stat, idx) => (
                <StatCard 
                  key={idx} 
                  stat={stat} 
                  inView={statsInView}
                  index={idx}
                />
              ))}
            </div>

            {/* Security Card */}
            <div
              ref={securityRef}
              className="gloss-card p-6"
              style={{ willChange: 'transform, opacity' }}
            >
              <h3 className="font-display font-semibold text-lg text-text-primary mb-6">
                Security & Compliance
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {securityFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  const colorClass = 
                    feature.color === 'cyan' ? 'text-cyan bg-cyan/10' : 'text-purple bg-purple/10';

                  return (
                    <div key={index}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-display font-semibold text-text-primary">
                          {feature.title}
                        </h4>
                      </div>

                      <ul className="space-y-2">
                        {feature.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-center gap-2 text-sm text-text-secondary"
                          >
                            <Lock className="w-3 h-3 text-cyan" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveStats;
