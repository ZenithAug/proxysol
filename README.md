# solProxy - AI-Native Mobile Proxy Network

[![CI/CD](https://github.com/ZenithAug/proxysol/actions/workflows/build.yml/badge.svg)](https://github.com/ZenithAug/proxysol/actions/workflows/build.yml)

**solProxy** is a decentralized mobile proxy infrastructure built for AI agents on Solana and Base. Purchase 4G/LTE proxies with crypto—no accounts, no API keys, no human intervention.

## Features

### AI-Native Architecture

- **x402 Protocol**: HTTP 402 Payment Required—agents pay with USDC on-chain
- **MCP Server**: 55+ Model Context Protocol tools for proxy control via natural language
- **~2s Settlement**: Blockchain-secured payments with instant proxy access

### Mobile Proxy Network

- **Real 4G/LTE Devices**: Physical mobile devices on carrier networks
- **10+ Countries**: Global coverage with rotating IPs
- **<60s Setup**: From payment to proxy in under a minute
- **10-100 Mbps**: High-speed mobile bandwidth

### $PROXY Token Economy

- **Solana & Base**: Multi-chain token for proxy payments
- **Minimum $0.375**: Low barrier for AI agent transactions
- **Stake & Earn**: Peer marketplace for bandwidth providers

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: GSAP + ScrollTrigger for scroll-driven experiences
- **3D Effects**: CSS 3D transforms + WebGL-ready
- **Blockchain**: Solana (x402 payments) + Base

## Quick Start

```bash
# Clone repository
git clone git@github.com:ZenithAug/proxysol.git
cd proxysol

# Install dependencies
npm ci

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/          # UI components
│   ├── ui/             # shadcn/ui base
│   ├── GlossCard.tsx   # 3D gloss cards
│   └── NeonButton.tsx  # Metallic buttons
├── sections/           # Page sections
│   ├── Hero.tsx        # Landing hero
│   ├── AINative.tsx    # AI features showcase
│   ├── MCPServer.tsx   # MCP chat interface
│   ├── PeerMarket.tsx  # Earning tiers
│   ├── TokenEconomy.tsx # $PROXY token
│   └── ...
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
├── index.css           # Global styles + Tailwind
└── App.tsx             # Root component
```

## Key Components

### GlossCard

Reusable glossy 3D card with border and gloss overlay effects.

```tsx
<GlossCard className="w-full h-72" neon>
  <h2>Premium Proxy</h2>
  <p>High-speed 4G/LTE access</p>
</GlossCard>
```

### NeonButton

Metallic button with cyan glow animation.

```tsx
<NeonButton variant="primary">Get solProxy</NeonButton>
```

## Mobile Responsiveness

- **Pinned Sections**: Desktop uses `h-screen` with scroll animations
- **Mobile Flow**: Switches to `min-h-screen` with natural scroll
- **Touch Scrolling**: `-webkit-overflow-scrolling: touch` for smooth iOS/Android
- **Menu**: Fixed-position mobile menu with `max-h-[calc(100vh-4rem)]`

## CI/CD

GitHub Actions workflow includes:

- **Build**: TypeScript compilation + Vite build
- **Lint**: ESLint checks
- **Mobile Check**: Validates responsive Tailwind classes

## MCP Server Integration

Control proxies via natural language with 55+ tools:

```typescript
// Example MCP tool usage
const tools = [
  "create_proxy_port",
  "rotate_ip_address",
  "check_proxy_status",
  "get_bandwidth_usage",
];
```

Supported AI clients: Claude, Cursor, Cline

## x402 Protocol

Payment flow for AI agents:

1. **Request**: Agent requests proxy access
2. **Payment**: USDC transfer on Solana (~2s)
3. **Settlement**: Blockchain confirmation
4. **Access**: Instant proxy credentials

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing`
5. Open Pull Request

## Privacy & Security

- **SSH Authentication**: Git operations via SSH (no IP exposure)
- **VPN Compatible**: Works with Mullvad, ProtonVPN, etc.
- **No KYC**: Anonymous proxy purchases
- **Blockchain Security**: On-chain payment verification

## License

MIT License - see LICENSE file for details

## Links

- **Live Site**: [solproxy.io](https://solproxy.io)
- **Documentation**: [docs.solproxy.io](https://docs.solproxy.io)
- **x402 Protocol**: [x402.org](https://x402.org)
- **Telegram**: [t.me/sol_proxy](https://t.me/sol_proxy)

---

**Powered by Solana & Base**
