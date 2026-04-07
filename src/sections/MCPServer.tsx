import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bot, User } from "lucide-react";
import { useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const chatMessages = [
  {
    type: "user" as const,
    content: "curl -x us-east.solproxy.io:7777 https://api.target.com/data",
  },
  {
    type: "ai" as const,
    isError: true,
    content: "HTTP 402 Payment Required",
    details: {
      invoice: "mpp_inv_9xk2...",
      rate: "0.001 USDC / MB",
      gateway: "Tempo MPP",
    },
  },
  {
    type: "user" as const,
    content: "Automating micropayment via Tempo... Paid.",
  },
  {
    type: "ai" as const,
    content: "Payment verified. Macaroon token minted.",
  },
  {
    type: "user" as const,
    content: "Retrying with x402 Token attached...",
  },
  {
    type: "ai" as const,
    content: "HTTP 200 OK",
    details: {
      bytes: "1.4 MB",
      latency: "42ms",
    },
  },
];

const MCPServer = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const [sequenceIndex, setSequenceIndex] = useState(0);

  useEffect(() => {
    const delays = [1000, 1500, 800, 2000, 1500, 800, 2000, 1500, 800, 3000, 4000];
    let current = 0;
    let timer: ReturnType<typeof setTimeout>;

    const next = () => {
      current = (current + 1) % delays.length;
      setSequenceIndex(current);
      timer = setTimeout(next, delays[current]);
    };

    timer = setTimeout(next, delays[0]);
    return () => clearTimeout(timer);
  }, []);

  const visibleMessagesCount = 
    sequenceIndex >= 10 ? 6 :
    sequenceIndex >= 8 ? 5 :
    sequenceIndex >= 7 ? 4 :
    sequenceIndex >= 5 ? 3 :
    sequenceIndex >= 4 ? 2 :
    sequenceIndex >= 2 ? 1 : 0;

  const inputText = 
    sequenceIndex === 1 ? "curl -x us-east.proxy..." :
    sequenceIndex === 4 ? "Paying invoice..." :
    sequenceIndex === 7 ? "Retrying with token..." :
    (sequenceIndex === 2 || sequenceIndex === 5 || sequenceIndex === 8) ? "" :
    "Agent listening...";



  useEffect(() => {
    const section = sectionRef.current;
    const cardA = cardARef.current;
    const cardB = cardBRef.current;

    if (!section || !cardA || !cardB) return;

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
          { x: "-55vw", rotateY: 18, opacity: 0 },
          { x: 0, rotateY: 0, opacity: 1, ease: "none" },
          0,
        );
        scrollTl.fromTo(
          cardB,
          { x: "55vw", rotateY: -18, opacity: 0 },
          { x: 0, rotateY: 0, opacity: 1, ease: "none" },
          0,
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
      } else {
        // Mobile: simple scroll-triggered fade-up
        gsap.fromTo(
          [cardA, cardB],
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
      id="mcp-server"
      className="section-pinned flex items-center justify-center"
      style={{ zIndex: 40 }}
    >
      {/* Ambient Glow */}
      <div
        className="ambient-glow ambient-glow-cyan"
        style={{
          left: "30vw",
          top: "20vh",
          width: "50vw",
          height: "50vw",
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
                <Bot className="w-6 h-6 text-cyan" />
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-cyan">
                MCP Integration
              </span>
            </div>

            <h2 className="font-display font-bold text-3xl lg:text-5xl text-text-primary mb-6 leading-tight">
              AI-Controlled
              <br />
              <span className="text-gradient">solProxy Network</span>
            </h2>

            <p className="text-text-secondary text-base lg:text-lg leading-relaxed mb-8">
              Let Claude, Cursor, or Cline manage your mobile proxy
              infrastructure through natural language. 55 MCP tools. Create
              endpoints, rotate IPs, monitor status — no dashboard needed.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center">
                  <span className="text-cyan text-sm font-bold">55</span>
                </div>
                <span className="text-text-secondary">MCP Tools Available</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-purple" />
                </div>
                <span className="text-text-secondary">
                  Works with Claude, Cursor, Cline
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
                  <span className="text-teal text-xs font-bold">USDC</span>
                </div>
                <span className="text-text-secondary">
                  Crypto & Card Payments
                </span>
              </div>
            </div>
          </div>

          {/* Card B - Chat Card */}
          <div
            ref={cardBRef}
            className="gloss-card w-full lg:w-[44vw] h-auto lg:h-[72vh] p-6 flex flex-col"
            style={{ willChange: "auto" }}
          >
            {/* Chat Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan" />
              </div>
              <span className="font-display font-semibold text-text-primary">
                Agentic Proxy Flow (x402)
              </span>
              <span className="ml-auto text-xs text-text-secondary">
                Online
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto mt-2">
              {chatMessages.map((message, index) => {
                const isVisible = index < visibleMessagesCount;
                return (
                  <div
                    key={index}
                    className={`chat-bubble flex gap-3 transition-all duration-500 ${
                      message.type === "user" ? "flex-row-reverse" : ""
                    } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute pointer-events-none"}`}
                  >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.type === "user" ? "bg-purple/10" : "bg-cyan/10"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="w-4 h-4 text-purple" />
                    ) : (
                      <Bot className="w-4 h-4 text-cyan" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                      message.type === "user"
                        ? "bg-purple/10 border border-purple/20 text-text-primary"
                        : "isError" in message && message.isError
                        ? "bg-red-500/10 border border-red-500/20 text-red-100"
                        : "bg-cyan/5 border border-cyan/20 text-text-primary"
                    }`}
                  >
                    <p>{message.content}</p>
                    {"details" in message && message.details && (
                      <div className="result-block mt-3 p-3 rounded-xl bg-bg-primary/50 border border-cyan/20">
                        <div className="space-y-2 text-xs">
                          {Object.entries(message.details).map(([k, v]) => (
                            <div key={k} className="flex items-center justify-between">
                              <span className="text-text-secondary capitalize">{k}:</span>
                              <span className="text-cyan">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-primary/50 border border-white/5 transition-all w-full min-h-[46px]">
                <span className={`text-sm ${inputText === "Agent listening..." ? "text-text-secondary" : "text-text-primary"}`}>
                  {inputText}
                  {(sequenceIndex === 1 || sequenceIndex === 4) && (
                    <span className="animate-pulse inline-block -ml-[2px]">_</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MCPServer;
