import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

export interface UserProxyDetails {
  userId: string;
  dashboardId: string;
  walletAddress: string;
  accessToken: string;
  claimUrl: string;
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

export type AppView = 'landing' | 'dashboard';
export type DashboardTab = 'credentials' | 'agent' | 'code';

interface AppState {
  hasPurchased: boolean;
  proxyDetails: UserProxyDetails | null;
  agentTokenBalance: number;
  currentView: AppView;
  activeDashboardTab: DashboardTab;
  setPurchased: (
    tierGb: number,
    priceUsd: number,
    walletAddress?: string,
  ) => Promise<void>;
  deductAgentBalance: (amount: number) => void;
  navigateToLanding: (sectionId?: string) => void;
  navigateToDashboard: (tab?: DashboardTab) => void;
  setDashboardTab: (tab: DashboardTab) => void;
  restorePurchase: (claimInput: string) => Promise<boolean>;
  resetPurchase: () => void;
}

const STORAGE_KEY = 'solproxy_session';
const DEFAULT_LANDING_SECTION = 'hero';
const DEFAULT_DASHBOARD_TAB: DashboardTab = 'credentials';
const DASHBOARD_HASH_PREFIX = 'dashboard';

type PersistedState = {
  hasPurchased: boolean;
  proxyDetails: UserProxyDetails | null;
  agentTokenBalance: number;
  currentView: AppView;
  activeDashboardTab: DashboardTab;
};

type ClaimRecord = {
  hasPurchased: boolean;
  agentTokenBalance: number;
  currentView: AppView;
  activeDashboardTab: DashboardTab;
  proxyDetails: Partial<UserProxyDetails>;
};

function readStoredSession() {
  return sessionStorage.getItem(STORAGE_KEY);
}

function writeStoredSession(value: string) {
  sessionStorage.setItem(STORAGE_KEY, value);
}

function clearStoredSession() {
  sessionStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY);
}

function isDashboardTab(value: string): value is DashboardTab {
  return value === 'credentials' || value === 'agent' || value === 'code';
}

function parseHash(hash: string): {
  view: AppView;
  sectionId: string;
  dashboardTab: DashboardTab;
} {
  const normalized = hash.replace(/^#/, '').trim();

  if (!normalized) {
    return {
      view: 'landing',
      sectionId: DEFAULT_LANDING_SECTION,
      dashboardTab: DEFAULT_DASHBOARD_TAB,
    };
  }

  if (normalized === DASHBOARD_HASH_PREFIX) {
    return {
      view: 'dashboard',
      sectionId: DEFAULT_LANDING_SECTION,
      dashboardTab: DEFAULT_DASHBOARD_TAB,
    };
  }

  if (normalized.startsWith(`${DASHBOARD_HASH_PREFIX}-`)) {
    const maybeTab = normalized.slice(DASHBOARD_HASH_PREFIX.length + 1);
    return {
      view: 'dashboard',
      sectionId: DEFAULT_LANDING_SECTION,
      dashboardTab: isDashboardTab(maybeTab)
        ? maybeTab
        : DEFAULT_DASHBOARD_TAB,
    };
  }

  return {
    view: 'landing',
    sectionId: normalized,
    dashboardTab: DEFAULT_DASHBOARD_TAB,
  };
}

function updateHash(hash: string) {
  const nextHash = `#${hash}`;
  if (window.location.hash !== nextHash) {
    window.history.pushState(
      null,
      '',
      `${window.location.pathname}${window.location.search}${nextHash}`,
    );
  }
}

function scrollToTop(behavior: ScrollBehavior = 'smooth') {
  window.scrollTo({ top: 0, behavior });
}

function scrollToSection(
  sectionId: string,
  behavior: ScrollBehavior = 'smooth',
  attemptsLeft = 18,
) {
  const target = document.getElementById(sectionId);

  if (!target) {
    if (attemptsLeft <= 0) return;
    window.requestAnimationFrame(() =>
      scrollToSection(sectionId, behavior, attemptsLeft - 1),
    );
    return;
  }

  const navOffset = window.matchMedia('(min-width: 1024px)').matches ? 96 : 84;
  const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
  window.scrollTo({ top: Math.max(top, 0), behavior });
}

function persistStateSnapshot(state: PersistedState) {
  writeStoredSession(JSON.stringify(state));
}

function buildClaimUrl(accessToken: string) {
  return `${window.location.origin}${window.location.pathname}?claim=${encodeURIComponent(accessToken)}`;
}

function normalizeClaimInput(claimInput: string) {
  const trimmed = claimInput.trim();
  if (!trimmed) return '';

  try {
    const url = new URL(trimmed);
    return url.searchParams.get('claim') ?? trimmed;
  } catch {
    const match = trimmed.match(/[?&]claim=([^&#]+)/);
    return match ? decodeURIComponent(match[1]) : trimmed;
  }
}

function hydrateProxyDetails(proxyDetails: Partial<UserProxyDetails> | null | undefined) {
  if (
    !proxyDetails ||
    typeof proxyDetails.userId !== 'string' ||
    typeof proxyDetails.dashboardId !== 'string' ||
    typeof proxyDetails.walletAddress !== 'string' ||
    typeof proxyDetails.endpoint !== 'string' ||
    typeof proxyDetails.port !== 'string' ||
    typeof proxyDetails.username !== 'string' ||
    typeof proxyDetails.password !== 'string' ||
    typeof proxyDetails.dataLimitGb !== 'number' ||
    typeof proxyDetails.dataUsedGb !== 'number' ||
    typeof proxyDetails.tier !== 'string' ||
    typeof proxyDetails.txSignature !== 'string' ||
    typeof proxyDetails.purchasedAt !== 'string'
  ) {
    return null;
  }

  const accessToken =
    typeof proxyDetails.accessToken === 'string' ? proxyDetails.accessToken : '';

  return {
    userId: proxyDetails.userId,
    dashboardId: proxyDetails.dashboardId,
    walletAddress: proxyDetails.walletAddress,
    accessToken,
    claimUrl:
      typeof proxyDetails.claimUrl === 'string' && proxyDetails.claimUrl
        ? proxyDetails.claimUrl
        : accessToken
          ? buildClaimUrl(accessToken)
          : '',
    endpoint: proxyDetails.endpoint,
    port: proxyDetails.port,
    username: proxyDetails.username,
    password: proxyDetails.password,
    dataLimitGb: proxyDetails.dataLimitGb,
    dataUsedGb: proxyDetails.dataUsedGb,
    tier: proxyDetails.tier,
    txSignature: proxyDetails.txSignature,
    purchasedAt: proxyDetails.purchasedAt,
  } satisfies UserProxyDetails;
}

async function createClaimRecord(payload: {
  proxyDetails: Omit<UserProxyDetails, 'accessToken' | 'claimUrl'>;
  agentTokenBalance: number;
  activeDashboardTab: DashboardTab;
}) {
  const response = await fetch('/api/claims', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create dashboard claim.');
  }

  return response.json() as Promise<{ accessToken: string }>;
}

async function fetchClaimRecord(accessToken: string) {
  const response = await fetch(`/api/claims/${encodeURIComponent(accessToken)}`);
  if (!response.ok) return null;

  return response.json() as Promise<ClaimRecord>;
}

async function updateClaimRecord(payload: {
  accessToken: string;
  proxyDetails: Omit<UserProxyDetails, 'accessToken' | 'claimUrl'>;
  agentTokenBalance: number;
  currentView: AppView;
  activeDashboardTab: DashboardTab;
}) {
  const response = await fetch(`/api/claims/${encodeURIComponent(payload.accessToken)}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      proxyDetails: payload.proxyDetails,
      agentTokenBalance: payload.agentTokenBalance,
      currentView: payload.currentView,
      activeDashboardTab: payload.activeDashboardTab,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to sync dashboard claim.');
  }
}

function loadFromStorage(): PersistedState {
  try {
    const raw = readStoredSession();
    localStorage.removeItem(STORAGE_KEY);

    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      const activeDashboardTab = isDashboardTab(parsed.activeDashboardTab ?? '')
        ? parsed.activeDashboardTab ?? DEFAULT_DASHBOARD_TAB
        : DEFAULT_DASHBOARD_TAB;
      const normalizedProxyDetails = hydrateProxyDetails(parsed.proxyDetails);
      const hasValidPurchase = Boolean(parsed.hasPurchased && normalizedProxyDetails);

      return {
        hasPurchased: hasValidPurchase,
        proxyDetails: hasValidPurchase ? normalizedProxyDetails : null,
        agentTokenBalance:
          typeof parsed.agentTokenBalance === 'number'
            ? parsed.agentTokenBalance
            : 0,
        currentView:
          parsed.currentView === 'dashboard' && hasValidPurchase
            ? 'dashboard'
            : 'landing',
        activeDashboardTab,
      };
    }
  } catch {}

  return {
    hasPurchased: false,
    proxyDetails: null,
    agentTokenBalance: 0,
    currentView: 'landing',
    activeDashboardTab: DEFAULT_DASHBOARD_TAB,
  };
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const saved = loadFromStorage();
  const hashState = parseHash(window.location.hash);
  const savedHasDashboardAccess = saved.hasPurchased && saved.proxyDetails !== null;
  const lastSyncedClaimRef = useRef('');
  const [hasPurchased, setHasPurchased] = useState(saved.hasPurchased);
  const [proxyDetails, setProxyDetails] = useState<UserProxyDetails | null>(saved.proxyDetails);
  const [agentTokenBalance, setAgentTokenBalance] = useState(saved.agentTokenBalance);
  const [currentView, setCurrentView] = useState<AppView>(
    hashState.view === 'dashboard'
      ? savedHasDashboardAccess
        ? 'dashboard'
        : 'landing'
      : window.location.hash
        ? 'landing'
        : saved.currentView,
  );
  const [activeDashboardTab, setActiveDashboardTabState] = useState<DashboardTab>(
    hashState.view === 'dashboard'
      ? hashState.dashboardTab
      : saved.activeDashboardTab,
  );

  useEffect(() => {
    persistStateSnapshot({
      hasPurchased,
      proxyDetails,
      agentTokenBalance,
      currentView: hasPurchased ? currentView : 'landing',
      activeDashboardTab,
    });
  }, [
    hasPurchased,
    proxyDetails,
    agentTokenBalance,
    currentView,
    activeDashboardTab,
  ]);

  useEffect(() => {
    const syncFromHash = () => {
      const nextState = parseHash(window.location.hash);
      const canAccessDashboard = hasPurchased && proxyDetails !== null;

      if (nextState.view === 'dashboard') {
        if (!canAccessDashboard) {
          setCurrentView('landing');
          updateHash(DEFAULT_LANDING_SECTION);
          scrollToSection(DEFAULT_LANDING_SECTION, 'auto');
          return;
        }

        setCurrentView('dashboard');
        setActiveDashboardTabState(nextState.dashboardTab);
        scrollToTop('auto');
        return;
      }

      setCurrentView('landing');
      scrollToSection(nextState.sectionId, 'auto');
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('popstate', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('popstate', syncFromHash);
    };
  }, [hasPurchased, proxyDetails]);

  useEffect(() => {
    const claimToken = new URL(window.location.href).searchParams.get('claim');
    if (!claimToken || proxyDetails) return;

    void (async () => {
      const restored = await fetchClaimRecord(claimToken);
      if (!restored?.proxyDetails) return;

      const normalizedProxyDetails = hydrateProxyDetails({
        ...restored.proxyDetails,
        accessToken: claimToken,
        claimUrl: buildClaimUrl(claimToken),
      });

      if (!normalizedProxyDetails) return;

      const nextDashboardTab = isDashboardTab(restored.activeDashboardTab)
        ? restored.activeDashboardTab
        : DEFAULT_DASHBOARD_TAB;

      setHasPurchased(true);
      setProxyDetails(normalizedProxyDetails);
      setAgentTokenBalance(restored.agentTokenBalance);
      setCurrentView('dashboard');
      setActiveDashboardTabState(nextDashboardTab);
      persistStateSnapshot({
        hasPurchased: true,
        proxyDetails: normalizedProxyDetails,
        agentTokenBalance: restored.agentTokenBalance,
        currentView: 'dashboard',
        activeDashboardTab: nextDashboardTab,
      });
      updateHash(DASHBOARD_HASH_PREFIX);
    })();
  }, [proxyDetails]);

  useEffect(() => {
    if (!hasPurchased || !proxyDetails?.accessToken) {
      lastSyncedClaimRef.current = '';
      return;
    }

    const payload = {
      accessToken: proxyDetails.accessToken,
      proxyDetails: {
        userId: proxyDetails.userId,
        dashboardId: proxyDetails.dashboardId,
        walletAddress: proxyDetails.walletAddress,
        endpoint: proxyDetails.endpoint,
        port: proxyDetails.port,
        username: proxyDetails.username,
        password: proxyDetails.password,
        dataLimitGb: proxyDetails.dataLimitGb,
        dataUsedGb: proxyDetails.dataUsedGb,
        tier: proxyDetails.tier,
        txSignature: proxyDetails.txSignature,
        purchasedAt: proxyDetails.purchasedAt,
      },
      agentTokenBalance,
      currentView,
      activeDashboardTab,
    };

    const syncKey = JSON.stringify(payload);
    if (lastSyncedClaimRef.current === syncKey) return;

    lastSyncedClaimRef.current = syncKey;
    void updateClaimRecord(payload).catch(() => {
      lastSyncedClaimRef.current = '';
    });
  }, [
    hasPurchased,
    proxyDetails,
    agentTokenBalance,
    currentView,
    activeDashboardTab,
  ]);

  const setPurchased = async (
    tierGb: number,
    priceUsd: number,
    walletAddress?: string,
  ) => {
    const tierName = tierGb === 25 ? 'Starter' : tierGb === 50 ? 'Growth' : 'Scale';
    const randomHex = () => Math.random().toString(16).substring(2, 10).toUpperCase();
    const randomBase58 = (length: number) => {
      const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      return Array.from({ length }, () =>
        alphabet[Math.floor(Math.random() * alphabet.length)],
      ).join('');
    };
    const purchaseCode = randomHex();
    const userId = `usr_${purchaseCode.slice(0, 6).toLowerCase()}`;
    const dashboardId = `dash_${purchaseCode.toLowerCase()}_${Date.now().toString(36)}`;
    const baseProxyDetails = {
      userId,
      dashboardId,
      walletAddress: walletAddress?.trim() || randomBase58(44),
      endpoint: 'us-east.proxy.solproxy.network',
      port: '7777',
      username: `sp_${randomHex().toLowerCase()}`,
      password: `mpp_${randomHex()}${randomHex()}`,
      dataLimitGb: tierGb,
      dataUsedGb: 0,
      tier: tierName,
      txSignature: randomBase58(88),
      purchasedAt: new Date().toISOString(),
    };

    const claimRecord = await createClaimRecord({
      proxyDetails: baseProxyDetails,
      agentTokenBalance: 5000,
      activeDashboardTab: DEFAULT_DASHBOARD_TAB,
    });

    const details: UserProxyDetails = {
      ...baseProxyDetails,
      accessToken: claimRecord.accessToken,
      claimUrl: buildClaimUrl(claimRecord.accessToken),
    };

    setHasPurchased(true);
    setProxyDetails(details);
    setAgentTokenBalance(5000);
    setCurrentView('dashboard');
    setActiveDashboardTabState(DEFAULT_DASHBOARD_TAB);
    persistStateSnapshot({
      hasPurchased: true,
      proxyDetails: details,
      agentTokenBalance: 5000,
      currentView: 'dashboard',
      activeDashboardTab: DEFAULT_DASHBOARD_TAB,
    });
    updateHash(DASHBOARD_HASH_PREFIX);
    scrollToTop('auto');
    void priceUsd;
  };

  const deductAgentBalance = (amount: number) => {
    setAgentTokenBalance((prev) => Math.max(0, prev - amount));
  };

  const navigateToLanding = (sectionId = DEFAULT_LANDING_SECTION) => {
    setCurrentView('landing');
    updateHash(sectionId);
    scrollToSection(sectionId);
  };

  const navigateToDashboard = (tab: DashboardTab = DEFAULT_DASHBOARD_TAB) => {
    if (!hasPurchased || !proxyDetails) {
      navigateToLanding('pricing');
      return;
    }

    setCurrentView('dashboard');
    setActiveDashboardTabState(tab);
    updateHash(
      tab === DEFAULT_DASHBOARD_TAB
        ? DASHBOARD_HASH_PREFIX
        : `${DASHBOARD_HASH_PREFIX}-${tab}`,
    );
    scrollToTop();
  };

  const setDashboardTab = (tab: DashboardTab) => {
    setActiveDashboardTabState(tab);
    if (!hasPurchased || !proxyDetails) return;

    updateHash(
      tab === DEFAULT_DASHBOARD_TAB
        ? DASHBOARD_HASH_PREFIX
        : `${DASHBOARD_HASH_PREFIX}-${tab}`,
    );
    scrollToTop();
  };

  const restorePurchase = async (claimInput: string) => {
    const accessToken = normalizeClaimInput(claimInput);
    if (!accessToken) return false;

    const restored = await fetchClaimRecord(accessToken);
    if (!restored?.proxyDetails) return false;

    const normalizedProxyDetails = hydrateProxyDetails({
      ...restored.proxyDetails,
      accessToken,
      claimUrl: buildClaimUrl(accessToken),
    });

    if (!normalizedProxyDetails) return false;

    const nextDashboardTab = isDashboardTab(restored.activeDashboardTab)
      ? restored.activeDashboardTab
      : DEFAULT_DASHBOARD_TAB;

    setHasPurchased(true);
    setProxyDetails(normalizedProxyDetails);
    setAgentTokenBalance(restored.agentTokenBalance);
    setCurrentView('dashboard');
    setActiveDashboardTabState(nextDashboardTab);
    persistStateSnapshot({
      hasPurchased: true,
      proxyDetails: normalizedProxyDetails,
      agentTokenBalance: restored.agentTokenBalance,
      currentView: 'dashboard',
      activeDashboardTab: nextDashboardTab,
    });
    updateHash(
      nextDashboardTab === DEFAULT_DASHBOARD_TAB
        ? DASHBOARD_HASH_PREFIX
        : `${DASHBOARD_HASH_PREFIX}-${nextDashboardTab}`,
    );
    scrollToTop('auto');
    return true;
  };

  const resetPurchase = () => {
    setHasPurchased(false);
    setProxyDetails(null);
    setAgentTokenBalance(0);
    setCurrentView('landing');
    setActiveDashboardTabState(DEFAULT_DASHBOARD_TAB);
    clearStoredSession();
    updateHash(DEFAULT_LANDING_SECTION);
    scrollToTop();
  };

  return (
    <AppContext.Provider
      value={{
        hasPurchased,
        proxyDetails,
        agentTokenBalance,
        currentView,
        activeDashboardTab,
        setPurchased,
        deductAgentBalance,
        navigateToLanding,
        navigateToDashboard,
        setDashboardTab,
        restorePurchase,
        resetPurchase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
}
