import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface UserProxyDetails {
  endpoint: string;
  port: string;
  username: string;
  password: string;
  dataLimitGb: number;
  dataUsedGb: number;
  tier: string;
  txSignature: string;
  purchasedAt: string;
}

interface AppState {
  hasPurchased: boolean;
  proxyDetails: UserProxyDetails | null;
  agentTokenBalance: number;
  setPurchased: (tierGb: number, priceUsd: number) => void;
  deductAgentBalance: (amount: number) => void;
  resetPurchase: () => void;
}

const STORAGE_KEY = 'solproxy_session';

function loadFromStorage(): { hasPurchased: boolean; proxyDetails: UserProxyDetails | null; agentTokenBalance: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { hasPurchased: false, proxyDetails: null, agentTokenBalance: 0 };
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const saved = loadFromStorage();
  const [hasPurchased, setHasPurchased] = useState(saved.hasPurchased);
  const [proxyDetails, setProxyDetails] = useState<UserProxyDetails | null>(saved.proxyDetails);
  const [agentTokenBalance, setAgentTokenBalance] = useState(saved.agentTokenBalance);

  // Persist any state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ hasPurchased, proxyDetails, agentTokenBalance }));
  }, [hasPurchased, proxyDetails, agentTokenBalance]);

  const setPurchased = (tierGb: number, priceUsd: number) => {
    const tierName = tierGb === 25 ? 'Starter' : tierGb === 50 ? 'Growth' : 'Scale';
    const randomHex = () => Math.random().toString(16).substring(2, 10).toUpperCase();
    const details: UserProxyDetails = {
      endpoint: 'us-east.proxy.solproxy.network',
      port: '7777',
      username: `sp_${randomHex().toLowerCase()}`,
      password: `mpp_${randomHex()}${randomHex()}`,
      dataLimitGb: tierGb,
      dataUsedGb: 0,
      tier: tierName,
      txSignature: `${randomHex()}${randomHex()}${randomHex()}${randomHex()}`,
      purchasedAt: new Date().toISOString(),
    };
    setHasPurchased(true);
    setProxyDetails(details);
    setAgentTokenBalance(5000); // 5000 micro-USDC agent balance
    void priceUsd; // referenced to avoid lint warning
  };

  const deductAgentBalance = (amount: number) => {
    setAgentTokenBalance(prev => Math.max(0, prev - amount));
  };

  const resetPurchase = () => {
    setHasPurchased(false);
    setProxyDetails(null);
    setAgentTokenBalance(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AppContext.Provider value={{ hasPurchased, proxyDetails, agentTokenBalance, setPurchased, deductAgentBalance, resetPurchase }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
}
