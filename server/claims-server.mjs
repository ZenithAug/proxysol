import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.CLAIMS_API_PORT || 4001);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'claims.json');

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ claims: {} }, null, 2));
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

async function writeStore(store) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2));
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString('utf8');
  return body ? JSON.parse(body) : {};
}

function createClaimToken() {
  return `claim_${randomBytes(24).toString('hex')}`;
}

function isValidPayload(payload) {
  return Boolean(
    payload &&
      payload.proxyDetails &&
      typeof payload.proxyDetails.endpoint === 'string' &&
      typeof payload.proxyDetails.port === 'string' &&
      typeof payload.proxyDetails.username === 'string' &&
      typeof payload.proxyDetails.password === 'string' &&
      typeof payload.proxyDetails.userId === 'string' &&
      typeof payload.proxyDetails.dashboardId === 'string' &&
      typeof payload.proxyDetails.walletAddress === 'string' &&
      typeof payload.proxyDetails.txSignature === 'string' &&
      typeof payload.proxyDetails.purchasedAt === 'string' &&
      typeof payload.proxyDetails.tier === 'string' &&
      typeof payload.proxyDetails.dataLimitGb === 'number' &&
      typeof payload.proxyDetails.dataUsedGb === 'number' &&
      typeof payload.agentTokenBalance === 'number'
  );
}

function isValidCurrentView(value) {
  return value === 'landing' || value === 'dashboard';
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,POST,OPTIONS',
      'access-control-allow-headers': 'content-type',
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/claims') {
    try {
      const payload = await readJsonBody(req);
      if (!isValidPayload(payload)) {
        sendJson(res, 400, { error: 'Invalid claim payload.' });
        return;
      }

      const store = await readStore();
      const claimToken = createClaimToken();
      const createdAt = new Date().toISOString();

      store.claims[claimToken] = {
        createdAt,
        lastAccessedAt: createdAt,
        agentTokenBalance: payload.agentTokenBalance,
        currentView: 'dashboard',
        activeDashboardTab:
          payload.activeDashboardTab === 'agent' || payload.activeDashboardTab === 'code'
            ? payload.activeDashboardTab
            : 'credentials',
        proxyDetails: payload.proxyDetails,
      };

      await writeStore(store);

      sendJson(res, 201, {
        accessToken: claimToken,
        createdAt,
      });
    } catch {
      sendJson(res, 500, { error: 'Failed to create claim token.' });
    }
    return;
  }

  if (req.method === 'GET' && url.pathname.startsWith('/api/claims/')) {
    const claimToken = decodeURIComponent(url.pathname.replace('/api/claims/', ''));
    const store = await readStore();
    const record = store.claims[claimToken];

    if (!record) {
      sendJson(res, 404, { error: 'Claim token not found.' });
      return;
    }

    record.lastAccessedAt = new Date().toISOString();
    await writeStore(store);

    sendJson(res, 200, {
      hasPurchased: true,
      agentTokenBalance: record.agentTokenBalance,
      currentView: record.currentView,
      activeDashboardTab: record.activeDashboardTab,
      proxyDetails: record.proxyDetails,
    });
    return;
  }

  if (req.method === 'PATCH' && url.pathname.startsWith('/api/claims/')) {
    try {
      const claimToken = decodeURIComponent(url.pathname.replace('/api/claims/', ''));
      const store = await readStore();
      const record = store.claims[claimToken];

      if (!record) {
        sendJson(res, 404, { error: 'Claim token not found.' });
        return;
      }

      const payload = await readJsonBody(req);
      if (!isValidPayload(payload) || !isValidCurrentView(payload.currentView)) {
        sendJson(res, 400, { error: 'Invalid claim update payload.' });
        return;
      }

      store.claims[claimToken] = {
        ...record,
        lastAccessedAt: new Date().toISOString(),
        agentTokenBalance: payload.agentTokenBalance,
        currentView: payload.currentView,
        activeDashboardTab:
          payload.activeDashboardTab === 'agent' || payload.activeDashboardTab === 'code'
            ? payload.activeDashboardTab
            : 'credentials',
        proxyDetails: payload.proxyDetails,
      };

      await writeStore(store);
      sendJson(res, 200, { ok: true });
    } catch {
      sendJson(res, 500, { error: 'Failed to update claim token.' });
    }
    return;
  }

  sendJson(res, 404, { error: 'Not found.' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Claims API listening on http://127.0.0.1:${PORT}`);
});
