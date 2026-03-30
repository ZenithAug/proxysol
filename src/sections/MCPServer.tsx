import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const chatMessages = [
  {
    type: "user" as const,
    content: "Create a shared proxy in Germany",
  },
  {
    type: "ai" as const,
    content: "Port created successfully!",
    details: {
      http: "de.solproxy.io:8080",
      socks5: "de.solproxy.io:1080",
      country: "Germany",
      carrier: "Vodafone",
    },
  },
  {
    type: "user" as const,
    content: "Rotate the IP now",
  },
  {
    type: "ai" as const,
    content: "IP rotated! New IP: 185.xxx.xxx.xxx",
  },
];

const MCPServer = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();

      try {
        const result = document.execCommand("copy");
        return result;
      } catch (err) {
        console.error("Failed to copy text:", err);
        return false;
      } finally {
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error("Copy operation failed:", err);
      return false;
    }
  };

  const handleCopy = async (text: string, key: string) => {
    const didCopy = await copyText(text);
    if (!didCopy) return;

    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

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

        // Message bubbles stagger
        const bubbles = cardB.querySelectorAll(".chat-bubble");
        bubbles.forEach((bubble, index) => {
          scrollTl.fromTo(
            bubble,
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, ease: "none" },
            0.08 + index * 0.04,
          );
        });

        // Result block
        const resultBlock = cardB.querySelector(".result-block");
        if (resultBlock) {
          scrollTl.fromTo(
            resultBlock,
            { scale: 0.96, opacity: 0 },
            { scale: 1, opacity: 1, ease: "none" },
            0.22,
          );
        }

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
              Let AI assistants like Claude, Cursor, and Cline manage your
              mobile proxy infrastructure through natural language.
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
                Claude Code
              </span>
              <span className="ml-auto text-xs text-text-secondary">
                Online
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-bubble flex gap-3 ${
                    message.type === "user" ? "flex-row-reverse" : ""
                  }`}
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
                        : "bg-cyan/5 border border-cyan/20 text-text-primary"
                    }`}
                  >
                    <p>{message.content}</p>
                    {"details" in message && message.details && (
                      <div className="result-block mt-3 p-3 rounded-xl bg-bg-primary/50 border border-cyan/20">
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">HTTP:</span>
                            <div className="flex items-center gap-2">
                              <code className="text-cyan">
                                {message.details.http}
                              </code>
                              <button
                                type="button"
                                aria-label="Copy HTTP endpoint"
                                onClick={() => {
                                  void handleCopy(message.details.http, "http");
                                }}
                                className="text-text-secondary hover:text-cyan transition-colors"
                              >
                                {copied === "http" ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">SOCKS5:</span>
                            <div className="flex items-center gap-2">
                              <code className="text-cyan">
                                {message.details.socks5}
                              </code>
                              <button
                                type="button"
                                aria-label="Copy SOCKS5 endpoint"
                                onClick={() => {
                                  void handleCopy(
                                    message.details.socks5,
                                    "socks5",
                                  );
                                }}
                                className="text-text-secondary hover:text-cyan transition-colors"
                              >
                                {copied === "socks5" ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">
                              Country:
                            </span>
                            <span className="text-text-primary">
                              {message.details.country}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">
                              Carrier:
                            </span>
                            <span className="text-text-primary">
                              {message.details.carrier}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-primary/50 border border-white/5">
                <span className="text-text-secondary text-sm">
                  Type a command...
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
