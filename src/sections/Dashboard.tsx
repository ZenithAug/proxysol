import { useState, useEffect, useCallback } from 'react';
import { useAppStore, type UserProxyDetails } from '../stores/useAppStore';
import {
  Copy, Check, Terminal, Shield, RefreshCw, Zap, Database,
  ExternalLink, LogOut, ChevronRight, Activity, Bot, AlertTriangle,
  CheckCircle2, Clock, ArrowRight, Key, Link2
} from 'lucide-react';

// ── Copyable credential field ─────────────────────────────────────────────
function CredField({ label, value, secret }: { label: string; value: string; secret?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-mono uppercase tracking-widest text-zinc-500">{label}</label>
      <div className="flex items-center gap-0 group">
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-l-lg px-4 py-3 font-mono text-sm text-zinc-300 overflow-hidden">
          {secret && !revealed ? '•'.repeat(Math.min(value.length, 24)) : value}
        </div>
        {secret && (
          <button
            onClick={() => setRevealed(r => !r)}
            className="bg-zinc-900 border-t border-b border-zinc-800 px-3 py-3 text-zinc-500 hover:text-zinc-300 transition-colors text-xs"
          >
            {revealed ? 'hide' : 'show'}
          </button>
        )}
        <button
          onClick={copy}
          className="bg-zinc-800/80 border border-zinc-700 rounded-r-lg px-4 py-3 hover:bg-zinc-700 transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
        </button>
      </div>
    </div>
  );
}

// ── x402 Terminal Simulation ──────────────────────────────────────────────
type LogLine = { type: 'cmd' | 'info' | 'error' | 'success' | 'warn' | 'pay'; text: string; delay: number };

function buildScript(proxy: UserProxyDetails): LogLine[] {
  return [
    { type: 'cmd',  text: `$ curl -x ${proxy.endpoint}:${proxy.port} https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`, delay: 0 },
    { type: 'info', text: '  → Connecting to proxy gateway…', delay: 600 },
    { type: 'error',text: '  ← HTTP/1.1 402 Payment Required', delay: 1300 },
    { type: 'info', text: '  ← X-Payment-Network: solana', delay: 1400 },
    { type: 'info', text: '  ← X-Payment-Address: 7JvxZ1mF7QdM9Bz...MockAddr', delay: 1500 },
    { type: 'info', text: '  ← X-Payment-Rate: 0.001 USDC / MB', delay: 1600 },
    { type: 'info', text: '  ← X-Payment-Protocol: Tempo-MPP-v1', delay: 1700 },
    { type: 'warn', text: '', delay: 1900 },
    { type: 'warn', text: '  [x402] Agent intercepting 402 — initiating micropayment…', delay: 2000 },
    { type: 'pay',  text: '  [x402] Sending 0.001 USDC via Tempo MPP…', delay: 2600 },
    { type: 'pay',  text: `  [x402] TX broadcast → ${proxy.txSignature.slice(0, 20)}…`, delay: 3000 },
    { type: 'success', text: '  [x402] Payment confirmed (1 block, ~400ms)', delay: 3800 },
    { type: 'success', text: '  [x402] Macaroon minted → mpp_mac_' + proxy.username.slice(3, 9) + '…', delay: 4000 },
    { type: 'warn', text: '', delay: 4200 },
    { type: 'cmd',  text: `$ curl -x ${proxy.endpoint}:${proxy.port} \\`, delay: 4300 },
    { type: 'cmd',  text: `       -H "X-402-Token: mpp_mac_${proxy.username.slice(3, 9)}…" \\`, delay: 4400 },
    { type: 'cmd',  text: '       https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd', delay: 4500 },
    { type: 'info', text: '  → Retrying with x402 token…', delay: 5100 },
    { type: 'success', text: '  ← HTTP/1.1 200 OK', delay: 5800 },
    { type: 'success', text: '  ← X-Proxy-IP: 104.28.xx.xx  X-Remaining-MB: 4.999', delay: 5900 },
    { type: 'info', text: '  ← Content-Type: application/json', delay: 6000 },
    { type: 'success', text: '  {"solana":{"usd":148.32}}', delay: 6300 },
    { type: 'warn', text: '', delay: 6600 },
    { type: 'success', text: '  ✓ Agent request complete — 0.001 USDC deducted.', delay: 6700 },
  ];
}

function AgentTerminal({ proxy }: { proxy: UserProxyDetails }) {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const { agentTokenBalance, deductAgentBalance } = useAppStore();

  const runDemo = useCallback(() => {
    if (running) return;
    setLines([]);
    setDone(false);
    setRunning(true);
    const script = buildScript(proxy);
    script.forEach((line) => {
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (line === script[script.length - 1]) {
          setRunning(false);
          setDone(true);
          deductAgentBalance(1); // 1 micro-USDC
        }
      }, line.delay);
    });
  }, [proxy, running, deductAgentBalance]);

  const colorMap: Record<string, string> = {
    cmd: 'text-zinc-100',
    info: 'text-zinc-400',
    error: 'text-red-400 font-semibold',
    success: 'text-emerald-400',
    warn: 'text-yellow-400',
    pay: 'text-cyan-400 font-semibold',
  };

  return (
    <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950">
      {/* Terminal header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/70"></div>
          </div>
          <span className="font-mono text-xs text-zinc-500">x402-agent-terminal — bash</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            Balance: {agentTokenBalance} µUSDC
          </span>
          <button
            onClick={runDemo}
            disabled={running}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-lg transition-all ${
              running
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black'
            }`}
          >
            {running ? (
              <><Activity className="w-3 h-3 animate-pulse" /> Running…</>
            ) : done ? (
              <><RefreshCw className="w-3 h-3" /> Run Again</>
            ) : (
              <><Zap className="w-3 h-3" /> Run x402 Demo</>
            )}
          </button>
        </div>
      </div>

      {/* Terminal body */}
      <div className="font-mono text-sm p-5 h-80 overflow-y-auto space-y-0.5 leading-relaxed">
        {lines.length === 0 && !running && (
          <p className="text-zinc-600 italic">
            Press <span className="text-cyan-500 not-italic font-semibold">Run x402 Demo</span> to simulate an AI agent making a micropayment through the proxy gateway.
          </p>
        )}
        {lines.map((line, i) => (
          <div key={i} className={`whitespace-pre-wrap ${colorMap[line.type]}`}>
            {line.text || '\u00A0'}
          </div>
        ))}
        {running && (
          <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-0.5 align-middle" />
        )}
      </div>

      {done && (
        <div className="border-t border-zinc-800 px-5 py-3 bg-emerald-950/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Agent request completed — <strong>0.001 USDC</strong> paid via Tempo MPP x402</span>
          </div>
          <div className="text-xs text-zinc-500 font-mono">latency: ~6.3s</div>
        </div>
      )}
    </div>
  );
}

// ── IP Rotation Component ────────────────────────────────────────────────
function IPCard({ proxy }: { proxy: UserProxyDetails }) {
  const [rotating, setRotating] = useState(false);
  const [currentIP, setCurrentIP] = useState('104.28.34.12');
  const [history, setHistory] = useState<string[]>([]);

  const rotate = () => {
    if (rotating) return;
    setRotating(true);
    setTimeout(() => {
      const newIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 255)}`;
      setHistory(prev => [currentIP, ...prev.slice(0, 2)]);
      setCurrentIP(newIP);
      setRotating(false);
    }, 1200);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          Active Endpoint
        </h3>
        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
          ● LIVE
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Exit IP</p>
            <p className="font-mono text-white text-lg">{rotating ? '···.···.···.···' : currentIP}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 mb-1">Region</p>
            <p className="text-sm text-zinc-300">🇺🇸 US-East</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-zinc-900 rounded-lg px-3 py-2 border border-zinc-800">
            <span className="text-zinc-500">Host: </span><span className="text-zinc-300">{proxy.endpoint}</span>
          </div>
          <div className="bg-zinc-900 rounded-lg px-3 py-2 border border-zinc-800">
            <span className="text-zinc-500">Port: </span><span className="text-zinc-300">{proxy.port}</span>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-zinc-600 uppercase tracking-wider">Previous IPs</p>
          {history.map((ip, i) => (
            <p key={i} className="text-xs font-mono text-zinc-600 flex items-center gap-2">
              <Clock className="w-3 h-3" /> {ip}
            </p>
          ))}
        </div>
      )}

      <button
        onClick={rotate}
        disabled={rotating}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
          rotating
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/20 hover:border-purple-400/40'
        }`}
      >
        <RefreshCw className={`w-4 h-4 ${rotating ? 'animate-spin' : ''}`} />
        {rotating ? 'Rotating…' : 'Rotate IP'}
      </button>
    </div>
  );
}

// ── Code Snippet ─────────────────────────────────────────────────────────
function CodeSnippet({ proxy }: { proxy: UserProxyDetails }) {
  const [copied, setCopied] = useState(false);
  const code = `import httpx

PROXY = "http://${proxy.username}:${proxy.password}@${proxy.endpoint}:${proxy.port}"

async def agent_fetch(url: str) -> dict:
    """
    x402-aware fetch — automatically pays Tempo MPP invoices.
    """
    async with httpx.AsyncClient(proxy=PROXY) as client:
        r = await client.get(url)
        if r.status_code == 402:
            invoice = r.headers.get("X-Payment-Address")
            await pay_tempo_mpp(invoice)          # your payment fn
            token = await get_macaroon(invoice)
            r = await client.get(url, headers={"X-402-Token": token})
        return r.json()`;

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
          <Key className="w-4 h-4 text-cyan-400" />
          Python — x402 Agent Integration
        </div>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          {copied ? <><Check className="w-3 h-3 text-emerald-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      <pre className="p-5 text-xs font-mono text-zinc-400 leading-relaxed overflow-x-auto">
        <code className="whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────
export function Dashboard() {
  const {
    hasPurchased,
    proxyDetails,
    resetPurchase,
    agentTokenBalance,
    activeDashboardTab,
    setDashboardTab,
    navigateToLanding,
  } = useAppStore();

  // Avoid a blank screen while payment/session state settles.
  useEffect(() => {
    if (!proxyDetails) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [proxyDetails]);

  if (!proxyDetails) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white pt-16 lg:pt-20">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center px-6 py-12">
          <div className="w-full rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-cyan-500/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-cyan-400" />
            </div>
            <h1 className="mb-2 text-xl font-semibold text-white">
              {hasPurchased ? 'Finishing dashboard activation...' : 'Dashboard unavailable'}
            </h1>
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-zinc-400">
              {hasPurchased
                ? 'Your payment went through, and we are preparing your proxy session now. If this screen stays here, head back to pricing and try again once.'
                : 'There is no active proxy session attached to this dashboard yet. Start from pricing to create one.'}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => navigateToLanding(hasPurchased ? 'hero' : 'pricing')}
                className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-sm font-medium text-cyan transition-colors hover:bg-cyan-500/20"
              >
                {hasPurchased ? 'Back to main site' : 'Go to pricing'}
              </button>
              {hasPurchased && (
                <button
                  type="button"
                  onClick={resetPurchase}
                  className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-red-500/30 hover:text-red-400"
                >
                  Reset session
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const usedPct = (proxyDetails.dataUsedGb / proxyDetails.dataLimitGb) * 100;

  return (
    <div
      id="dashboard-overview"
      className="min-h-screen bg-zinc-950 text-white pt-16 lg:pt-20"
    >
      {/* Top bar */}
      <div className="border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl sticky top-16 lg:top-20 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-semibold text-white text-sm">SolProxy Dashboard</h1>
              <p className="text-xs text-zinc-500 font-mono">
                {proxyDetails.tier} Plan · {proxyDetails.userId} · {proxyDetails.username}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigateToLanding('hero')}
              className="hidden md:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-3 h-3 rotate-180" />
              Main site
            </button>
            <a
              href="https://t.me/sol_proxy"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Support
            </a>
            <button
              onClick={resetPurchase}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
            >
              <LogOut className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ── Stats Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Database, label: 'Data Used', value: `${proxyDetails.dataUsedGb} GB`, sub: `of ${proxyDetails.dataLimitGb} GB`, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            { icon: Activity, label: 'Agent Balance', value: `${agentTokenBalance} µUSDC`, sub: 'Tempo MPP credit', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { icon: Shield, label: 'Status', value: 'Active', sub: 'All systems go', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: Zap, label: 'Plan', value: proxyDetails.tier, sub: 'Mobile residential', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          ].map(({ icon: Icon, label, value, sub, color, bg }) => (
            <div key={label} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-xs text-zinc-500 mb-1">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Bandwidth bar ─────────────────────────────────────────── */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-zinc-300">Bandwidth Usage</span>
            <span className="text-xs text-zinc-500 font-mono">{proxyDetails.dataUsedGb.toFixed(2)} / {proxyDetails.dataLimitGb} GB</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-700"
              style={{ width: `${Math.max(usedPct, 1)}%` }}
            />
          </div>
          <p className="text-xs text-zinc-600 mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-yellow-500/60" />
            Traffic never expires — purchases stack
          </p>
        </div>

        {/* ── Tab navigation ─────────────────────────────────────────── */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800 w-fit">
          {(['credentials', 'agent', 'code'] as const).map((tab) => {
            const labels = { credentials: '🔑 Credentials', agent: '🤖 Agent x402 Pay', code: '</> Code' };
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setDashboardTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeDashboardTab === tab
                    ? 'bg-zinc-700 text-white shadow'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* ── Tab panels ─────────────────────────────────────────────── */}
        {activeDashboardTab === 'credentials' && (
          <div
            id="dashboard-credentials"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            {/* Left: Credentials */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-5">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Proxy Credentials
              </h2>
              <CredField label="Host" value={proxyDetails.endpoint} />
              <CredField label="Port" value={proxyDetails.port} />
              <CredField label="Username" value={proxyDetails.username} />
              <CredField label="Password / x402 Token" value={proxyDetails.password} secret />
              <div className="pt-2 border-t border-zinc-800 space-y-1">
                <p className="text-xs text-zinc-500">Connection string</p>
                <CredField
                  label=""
                  value={`http://${proxyDetails.username}:${proxyDetails.password}@${proxyDetails.endpoint}:${proxyDetails.port}`}
                  secret
                />
              </div>
            </div>

            {/* Right: IP Card + Tx receipt */}
            <div className="space-y-4">
              <IPCard proxy={proxyDetails} />

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-cyan-400" />
                  Access & Recovery
                </h3>
                <div className="space-y-4">
                  <CredField label="Wallet" value={proxyDetails.walletAddress} />
                  <CredField label="Access Token" value={proxyDetails.accessToken} secret />
                  <CredField label="Claim Link" value={proxyDetails.claimUrl} />
                </div>
                <p className="text-xs leading-relaxed text-zinc-500">
                  Use the claim link or access token in another browser to reopen this exact dashboard session.
                </p>
              </div>

              {/* Transaction receipt */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Purchase Receipt
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  {[
                    { k: 'User', v: proxyDetails.userId },
                    { k: 'Dashboard', v: proxyDetails.dashboardId.slice(0, 18) + '…' },
                    { k: 'Wallet', v: `${proxyDetails.walletAddress.slice(0, 8)}…${proxyDetails.walletAddress.slice(-6)}` },
                    { k: 'Plan', v: proxyDetails.tier },
                    { k: 'Data', v: `${proxyDetails.dataLimitGb} GB` },
                    { k: 'Network', v: 'Solana' },
                    { k: 'TX', v: proxyDetails.txSignature.slice(0, 24) + '…' },
                    { k: 'Claim', v: `${proxyDetails.accessToken.slice(0, 16)}…` },
                    { k: 'Purchased', v: new Date(proxyDetails.purchasedAt).toLocaleString() },
                  ].map(({ k, v }) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-zinc-600">{k}</span>
                      <span className="text-zinc-400">{v}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={`https://solscan.io/tx/${proxyDetails.txSignature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-cyan-500 hover:text-cyan-400 transition-colors"
                >
                  View on Solscan <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {activeDashboardTab === 'agent' && (
          <div id="dashboard-agent" className="space-y-6">
            {/* Explainer */}
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-white mb-1">How x402 Agentic Payments Work</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    When an AI agent sends a request through your proxy without a payment token, the gateway responds with{' '}
                    <code className="text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">HTTP 402 Payment Required</code>{' '}
                    and embeds a <span className="text-cyan-400 font-mono">Tempo MPP</span> invoice in the response headers. The agent
                    autonomously pays the invoice on-chain, receives a cryptographic Macaroon token, and re-sends the request — all without human input.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                    {['Agent sends request', '402 + invoice', 'Agent pays Tempo MPP', 'Macaroon minted', '200 OK'].map((step, i, arr) => (
                      <>
                        <span key={step} className={`px-2 py-1 rounded-full border font-mono ${
                          i === 0 ? 'border-zinc-700 text-zinc-400' :
                          i === 1 ? 'border-red-500/30 text-red-400' :
                          i === 2 ? 'border-yellow-500/30 text-yellow-400' :
                          i === 3 ? 'border-cyan-500/30 text-cyan-400' :
                          'border-emerald-500/30 text-emerald-400'
                        }`}>{step}</span>
                        {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-zinc-700" />}
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal */}
            <AgentTerminal proxy={proxyDetails} />

            {/* Notes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {[
                { title: 'Payment Rate', body: '0.001 USDC / MB · Pay exactly for what you use. No monthly commitment for agents.', color: 'text-cyan-400' },
                { title: 'Token Lifetime', body: 'Macaroon tokens are valid per-session. Each agent request may trigger a fresh 402 if the token expires.', color: 'text-yellow-400' },
                { title: 'Latency Impact', body: 'First request: ~400ms overhead for payment. Subsequent requests with valid token: <2ms overhead.', color: 'text-purple-400' },
              ].map(({ title, body, color }) => (
                <div key={title} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-1">
                  <p className={`text-xs font-semibold uppercase tracking-wider ${color}`}>{title}</p>
                  <p className="text-zinc-400 text-xs leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeDashboardTab === 'code' && (
          <div id="dashboard-code" className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <ChevronRight className="w-4 h-4 text-zinc-600" />
              Python SDK snippet — drop into any AI agent that supports HTTP streaming
            </div>
            <CodeSnippet proxy={proxyDetails} />
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <h3 className="font-semibold text-white text-sm mb-3">Environment Variables</h3>
              <div className="space-y-2 font-mono text-xs">
                {[
                  ['SOLPROXY_HOST', proxyDetails.endpoint],
                  ['SOLPROXY_PORT', proxyDetails.port],
                  ['SOLPROXY_USER', proxyDetails.username],
                  ['SOLPROXY_PASS', proxyDetails.password],
                  ['SOLPROXY_WALLET', proxyDetails.walletAddress],
                  ['SOLPROXY_CLAIM_TOKEN', proxyDetails.accessToken],
                  ['SOLPROXY_CLAIM_URL', proxyDetails.claimUrl],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2">
                    <span className="text-yellow-400/80">{k}</span>
                    <span className="text-zinc-600">=</span>
                    <span className="text-zinc-300 truncate">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
