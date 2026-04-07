import { useState, useEffect, useRef } from "react";
import { Menu, X, Globe, ChevronRight } from "lucide-react";
import { useAppStore } from "../stores/useAppStore";
import { AccessDashboardModal } from "./AccessDashboardModal";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const tickingRef = useRef(false);
  const {
    hasPurchased,
    proxyDetails,
    currentView,
    navigateToLanding,
    navigateToDashboard,
  } = useAppStore();

  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 80);
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const openAccessModal = () => {
    closeMobileMenu();
    setIsAccessModalOpen(true);
  };
  const canAccessDashboard = hasPurchased && !!proxyDetails;
  const isDashboardView = currentView === "dashboard" && canAccessDashboard;

  const navLinks = isDashboardView
    ? [
        {
          label: "Credentials",
          onClick: () => navigateToDashboard("credentials"),
        },
        {
          label: "Agent Flow",
          onClick: () => navigateToDashboard("agent"),
        },
        {
          label: "Code",
          onClick: () => navigateToDashboard("code"),
        },
      ]
    : [
        {
          label: "How it Works",
          onClick: () => navigateToLanding("how-it-works"),
        },
        {
          label: "Pricing",
          onClick: () => navigateToLanding("pricing"),
        },
        {
          label: "MCP Server",
          onClick: () => navigateToLanding("mcp-server"),
        },
        {
          label: "FAQ",
          onClick: () => navigateToLanding("peer-market"),
        },
      ];

  const handleLogoClick = () => {
    closeMobileMenu();
    navigateToLanding("hero");
  };

  const handleCtaClick = () => {
    closeMobileMenu();
    if (isDashboardView) {
      navigateToLanding("hero");
      return;
    }
    navigateToDashboard();
  };

  return (
    <>
      <nav
        className={`nav-bar fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-bg-primary/85 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-transparent"
        }`}
        style={{ transform: "translateZ(0)" }}
      >
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button
              type="button"
              onClick={handleLogoClick}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <img
                  src="/logo.jpg"
                  alt="solProxy"
                  className="w-8 h-8 rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-lg bg-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              </div>
              <span className="font-mono text-sm font-medium tracking-wider text-text-primary">
                SOLPROXY
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={link.onClick}
                  className="relative text-sm text-text-secondary hover:text-cyan transition-colors duration-300 group py-1"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-cyan group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <button className="hidden lg:flex items-center gap-2 text-sm text-text-secondary hover:text-cyan transition-colors">
                <Globe className="w-4 h-4" />
                <span>EN</span>
              </button>

              {/* CTA Button */}
              {canAccessDashboard ? (
                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="hidden lg:block bg-cyan/10 text-cyan border border-cyan/20 px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-cyan/20 transition-all"
                >
                  {isDashboardView ? "Main Site" : "Open Dashboard"}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={openAccessModal}
                    className="hidden lg:block px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-text-secondary hover:text-cyan hover:border-cyan/20 transition-all text-sm"
                  >
                    Access dashboard
                  </button>
                  <a
                    href="https://t.me/sol_proxy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden lg:block neon-button-primary text-sm"
                  >
                    Start free
                  </a>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden relative p-2 text-text-primary rounded-lg transition-colors duration-200 hover:bg-white/5 active:scale-95"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "opacity-100 rotate-0"
                      : "opacity-0 rotate-90"
                  }`}
                >
                  <X className="w-6 h-6" />
                </span>
                <span
                  className={`flex items-center justify-center transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "opacity-0 -rotate-90"
                      : "opacity-100 rotate-0"
                  }`}
                >
                  <Menu className="w-6 h-6" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-400 ${
          isMobileMenuOpen
            ? "pointer-events-auto"
            : "pointer-events-none"
        }`}
        onClick={closeMobileMenu}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-400 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`lg:hidden fixed inset-x-0 top-0 z-[45] mobile-menu-drawer transition-transform duration-500 ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ willChange: "transform" }}
      >
        {/* Frosted panel */}
        <div className="relative bg-bg-primary/95 backdrop-blur-3xl border-b border-white/[0.08] pt-20 pb-8 px-6 overflow-hidden">
          {/* Animated accent glow line */}
          <div
            className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan to-transparent transition-opacity duration-700 ${
              isMobileMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Background ambient glow */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />

          {/* Nav Links */}
          <nav className="space-y-1 relative z-10">
            {navLinks.map((link, i) => (
              <button
                key={link.label}
                type="button"
                className={`mobile-nav-item flex items-center justify-between py-4 px-4 rounded-xl text-lg font-medium text-text-secondary hover:text-cyan hover:bg-cyan/5 active:bg-cyan/10 transition-all duration-200 group border border-transparent hover:border-white/[0.06] ${
                  isMobileMenuOpen ? "mobile-nav-in" : "mobile-nav-out"
                }`}
                style={{
                  animationDelay: isMobileMenuOpen ? `${i * 60 + 80}ms` : "0ms",
                }}
                onClick={() => {
                  closeMobileMenu();
                  link.onClick();
                }}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0" />
              </button>
            ))}
          </nav>

          {/* Divider */}
          <div className="my-6 border-t border-white/[0.06]" />

          {/* CTA Block */}
          <div
            className={`relative z-10 space-y-3 ${
              isMobileMenuOpen ? "mobile-nav-in" : "mobile-nav-out"
            }`}
            style={{
              animationDelay: isMobileMenuOpen
                ? `${navLinks.length * 60 + 120}ms`
                : "0ms",
            }}
          >
            {canAccessDashboard ? (
              <button
                type="button"
                className="block w-full text-center bg-cyan/10 text-cyan border border-cyan/20 py-4 rounded-xl text-base font-medium"
                onClick={handleCtaClick}
              >
                {isDashboardView ? "Main Site" : "Open Dashboard"}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="block w-full text-center border border-white/[0.08] bg-white/[0.03] py-4 rounded-xl text-base text-text-secondary hover:text-cyan transition-colors"
                  onClick={openAccessModal}
                >
                  Access dashboard
                </button>
                <a
                  href="https://t.me/sol_proxy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center neon-button-primary py-4 text-base"
                  onClick={closeMobileMenu}
                >
                  Start free
                </a>
              </>
            )}
            <button className="flex items-center justify-center gap-2 w-full py-3 text-sm text-text-secondary hover:text-cyan transition-colors">
              <Globe className="w-4 h-4" />
              <span>Language: EN</span>
            </button>
          </div>
        </div>
      </div>
      <AccessDashboardModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
      />
    </>
  );
};

export default Navigation;
