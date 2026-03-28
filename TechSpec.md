# solProxy — Technical Specification

## 1. Component Inventory

### shadcn/ui Components (built-in)
- `button` — CTAs (primary/secondary)
- `card` — base card wrapper (heavily styled override)
- `badge` — labels (Live, New, etc.)
- `separator` — subtle dividers

### Third-Party Registry Components
None required. All visual effects (gloss, neon, 3D) implemented via CSS + GSAP.

### Custom Components

| Component | Purpose | Props |
|-----------|---------|-------|
| `GlossCard` | Reusable glossy 3D card with border + gloss overlay | `children, className, neon?, glow?` |
| `NeonButton` | Metallic button with cyan glow | `children, variant, href?` |
| `LiveBadge` | Pulsing dot + "Live" label | - |
| `StatChip` | Mono label + value pair | `label, value` |
| `ChatBubble` | Message bubble for MCP section | `type: 'user' \| 'ai', children` |
| `Coin3D` | CSS 3D rotating coin for token section | `size` |
| `CountUp` | Animated number counter | `value, suffix?` |
| `SectionWrapper` | Handles pin/flow + ScrollTrigger setup | `pin, children, id` |

---

## 2. Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| **Global** |
| Smooth scroll | Lenis + GSAP | Lenis instance with ScrollTrigger scrollerProxy | Medium |
| Scroll snap (pinned only) | GSAP ScrollTrigger | Global snap derived from pinned ranges; flowing sections return unchanged | High |
| Grain overlay | CSS | Static PNG, `pointer-events:none`, opacity 0.08 | Low |
| **Section 1 (Hero)** |
| Card entrance (load) | GSAP timeline | `fromTo()` with translateX/Y + rotateY/X | High |
| Headline word stagger | GSAP/SplitText | Words stagger `y:24→0`, opacity `0→1` | Medium |
| Exit on scroll | ScrollTrigger | `scrub:0.6`, cards exit to sides with opacity fade | High |
| **Section 2 (AI-Native)** |
| 3-card entrance | ScrollTrigger timeline | Left card from `-55vw`, right cards from `+55vw/+45vh` | High |
| Metrics chips stagger | ScrollTrigger | Stagger `y:18→0` during entrance phase | Medium |
| Exit motion | ScrollTrigger | Reverse entrance directions, keep opacity >0.25 until 95% | High |
| **Section 3 (Why Mobile)** |
| Headline reveal | ScrollTrigger (flowing) | `translateX(-10vw)→0`, opacity `0→1` | Low |
| Feature cards stagger | ScrollTrigger (flowing) | Each card `translateX(12vw)→0`, slight parallax | Medium |
| Connector line draw | GSAP + SVG | `stroke-dashoffset` animation tied to scroll | Medium |
| **Section 4 (MCP Chat)** |
| Chat card 3D entrance | ScrollTrigger | `translateX(55vw) rotateY(-18deg)→0` | High |
| Message bubbles stagger | ScrollTrigger timeline | Sequential `y:18→0`, opacity reveals | Medium |
| Result block scale | ScrollTrigger | `scale(0.96)→1` during entrance | Low |
| **Section 5 (Peer)** |
| Tier cards entrance | ScrollTrigger | Right cards from `+55vw/+45vh` | High |
| Calculator values | ScrollTrigger | `scale(0.98)→1` with opacity | Low |
| **Section 6 (Coverage)** |
| Map dots pop | ScrollTrigger | `scale(0.6)→1` staggered | Low |
| Country list reveal | ScrollTrigger | `translateY(6vh)→0` | Low |
| **Section 7 (Stats)** |
| Number count-up | Custom JS + ScrollTrigger | Animate from 0 to target while in view | Medium |
| Grid reveal | ScrollTrigger | `translateX(12vw)→0` | Low |
| **Section 8 (Pricing)** |
| Pricing cards 3D | ScrollTrigger | `translateY(10vh) rotateX(6deg)→0` | Medium |
| Neon border pulse | CSS animation | Opacity loop 0.25→0.45, 3s | Low |
| **Section 9 (Token)** |
| Coin 3D rotation | GSAP + CSS 3D | `rotateY(-90deg)→0` entrance, slow loop in settle | High |
| Phase list stagger | ScrollTrigger | `translateY(16px)→0` stagger | Low |
| **Section 10 (CTA)** |
| Card reveal | ScrollTrigger (flowing) | `translateY(8vh)→0` | Low |
| Button pulse | CSS animation | `scale(1.02)` loop 2.5s | Low |

---

## 3. Animation Library Choices

### GSAP + ScrollTrigger (Primary)
- All scroll-driven animations
- Pinned sections with `pin: true`
- `fromTo()` for bidirectional correctness
- `scrub: 0.6` for smooth linkage

### Lenis (Optional but Recommended)
- Smooth scroll momentum
- Must integrate with ScrollTrigger via `scrollerProxy`

### CSS Animations
- Continuous loops (coin rotation, border pulse, button pulse)
- Grain overlay (static)

---

## 4. Project File Structure

```
app/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── GlossCard.tsx
│   │   ├── NeonButton.tsx
│   │   ├── LiveBadge.tsx
│   │   ├── StatChip.tsx
│   │   ├── ChatBubble.tsx
│   │   ├── Coin3D.tsx
│   │   ├── CountUp.tsx
│   │   └── Navigation.tsx
│   ├── sections/
│   │   ├── Hero.tsx         # Section 1
│   │   ├── AINative.tsx     # Section 2
│   │   ├── WhyMobile.tsx    # Section 3
│   │   ├── MCPServer.tsx    # Section 4
│   │   ├── PeerMarket.tsx   # Section 5
│   │   ├── GlobalCoverage.tsx # Section 6
│   │   ├── LiveStats.tsx    # Section 7
│   │   ├── Pricing.tsx      # Section 8
│   │   ├── TokenEconomy.tsx # Section 9
│   │   └── FinalCTA.tsx     # Section 10
│   ├── hooks/
│   │   ├── useScrollTrigger.ts
│   │   └── useCountUp.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── grain.png
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## 5. Dependencies to Install

```bash
# Animation
npm install gsap @gsap/react

# Optional smooth scroll
npm install lenis

# Fonts (Google Fonts via CDN in index.html)
# Space Grotesk, Inter, IBM Plex Mono
```

---

## 6. Key Implementation Notes

### 3D Card Effect
```css
.gloss-card {
  transform-style: preserve-3d;
  perspective: 1000px;
}
.gloss-card::before {
  /* gloss overlay */
  background: linear-gradient(135deg, rgba(255,255,255,0.14), transparent 55%);
}
```

### ScrollTrigger Setup (Pinned)
```js
ScrollTrigger.create({
  trigger: sectionRef.current,
  start: "top top",
  end: "+=130%",
  pin: true,
  scrub: 0.6,
  // animation timeline attached
});
```

### Global Snap (Pinned Sections Only)
- Collect all pinned ScrollTriggers
- Calculate snap targets from each pinned range's settle window (30%-70%)
- Flowing sections: return progress unchanged

### Performance
- Use `will-change: transform` on animated cards
- Grain overlay: `pointer-events: none`
- No blur/backdrop-filter animations
- Transform-only motion

---

## 7. Responsive Breakpoints

- Desktop: `>= 1024px` — full compositions
- Tablet: `768px - 1023px` — reduced card widths
- Mobile: `< 768px` — vertical stack, reduced 3D intensity

---

## 8. Color Tokens (Tailwind Config)

```js
colors: {
  bg: {
    primary: '#0B0C10',
    secondary: '#12131A',
  },
  accent: '#00F0FF',
  text: {
    primary: '#F5F7FF',
    secondary: '#A7B0C8',
  },
  glow: {
    purple: 'rgba(168, 85, 247, 0.35)',
    cyan: 'rgba(0, 240, 255, 0.35)',
  }
}
```
