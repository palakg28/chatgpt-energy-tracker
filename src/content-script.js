// ChatGPT Energy Tracker - Content Script (no background, no sendMessage)

const TAG = '[EnergyTracker-CS]';
function log(...args) {
  try {
    console.log(TAG, ...args);
  } catch (_) {}
}

// ---------- token + environmental math ----------

function estimateTokensFromText(text) {
  if (!text) return 0;
  const trimmed = String(text).trim();
  if (!trimmed) return 0;
  return Math.ceil(trimmed.length / 4);
}

function getModelTier(modelName = '') {
  const m = modelName.toLowerCase();
  if (m.includes('o1') || m.includes('gpt-4') || m.includes('4o')) return 'large';
  if (m.includes('mini') || m.includes('3.5') || m.includes('gpt-3')) return 'small';
  return 'medium';
}

const PER_1K = {
  small: { energyWh: 0.8, waterL: 0.4, co2g: 5 },
  medium: { energyWh: 1.2, waterL: 0.6, co2g: 8 },
  large: { energyWh: 1.8, waterL: 0.9, co2g: 12 }
};

function estimateEnvImpact(tokens, modelName) {
  const tier = getModelTier(modelName);
  const per = PER_1K[tier] || PER_1K.medium;
  const factor = tokens / 1000;

  const energyWh = per.energyWh * factor;
  const waterL = per.waterL * factor;
  const co2g = per.co2g * factor;

  return {
    tokens,
    energyWh,
    energyKWh: energyWh / 1000,
    waterL,
    co2g
  };
}

// ---------- storage helpers ----------

const STORAGE_KEY = 'usageStats';

function getDefaultStats() {
  return {
    total: {
      tokens: 0,
      energyWh: 0,
      waterL: 0,
      co2g: 0,
      queries: 0
    },
    conversations: {},
    lastQuery: null
  };
}

function loadStats() {
  return new Promise(resolve => {
    try {
      if (!chrome?.storage?.local) {
        resolve(getDefaultStats());
        return;
      }
      chrome.storage.local.get([STORAGE_KEY], result => {
        if (chrome.runtime.lastError) {
          log('loadStats error', chrome.runtime.lastError);
          resolve(getDefaultStats());
          return;
        }
        resolve(result[STORAGE_KEY] || getDefaultStats());
      });
    } catch (e) {
      log('loadStats exception', e);
      resolve(getDefaultStats());
    }
  });
}

function saveStats(stats) {
  return new Promise(resolve => {
    try {
      if (!chrome?.storage?.local) {
        resolve();
        return;
      }
      chrome.storage.local.set({ [STORAGE_KEY]: stats }, () => {
        if (chrome.runtime.lastError) {
          log('saveStats error', chrome.runtime.lastError);
        }
        resolve();
      });
    } catch (e) {
      log('saveStats exception', e);
      resolve();
    }
  });
}

// ---------- context ----------

function getConversationId() {
  try {
    const path = window.location.pathname || '';
    const parts = path.split('/').filter(Boolean);
    return parts[parts.length - 1] || 'default';
  } catch {
    return 'default';
  }
}

function detectModelName() {
  try {
    const switcher =
      document.querySelector('[data-testid="model-switcher"]') ||
      document.querySelector('button[aria-label*="Model"]');
    if (switcher && switcher.textContent) {
      return switcher.textContent.trim();
    }
    const chip = document.querySelector('[data-testid*="model"], [class*="model"]');
    if (chip && chip.textContent) {
      return chip.textContent.trim();
    }
  } catch (e) {
    log('model detection error', e);
  }
  return 'ChatGPT';
}

function extractTextFromNode(node) {
  if (!node) return '';
  return node.innerText || node.textContent || '';
}

// ---------- core: track user message -> update storage ----------

async function trackUserMessage(text) {
  const cleaned = (text || '').trim();
  if (!cleaned) {
    log('trackUserMessage: empty text, skipping');
    return;
  }

  const model = detectModelName();
  const tokens = estimateTokensFromText(cleaned);
  const conversationId = getConversationId();
  const impact = estimateEnvImpact(tokens, model);

  let stats = await loadStats();
  if (!stats || !stats.total) stats = getDefaultStats();

  // Totals
  stats.total.tokens += impact.tokens;
  stats.total.energyWh += impact.energyWh;
  stats.total.waterL += impact.waterL;
  stats.total.co2g += impact.co2g;
  stats.total.queries += 1;

  // Conversation bucket
  const convId = conversationId || 'unknown';
  if (!stats.conversations[convId]) {
    stats.conversations[convId] = {
      tokens: 0,
      energyWh: 0,
      waterL: 0,
      co2g: 0,
      queries: 0
    };
  }
  const conv = stats.conversations[convId];
  conv.tokens += impact.tokens;
  conv.energyWh += impact.energyWh;
  conv.waterL += impact.waterL;
  conv.co2g += impact.co2g;
  conv.queries += 1;

  // Last query
  stats.lastQuery = {
    conversationId: convId,
    model,
    tokens: impact.tokens,
    energyWh: impact.energyWh,
    energyKWh: impact.energyKWh,
    waterL: impact.waterL,
    co2g: impact.co2g,
    timestamp: Date.now()
  };

  log('trackUserMessage: updated stats', stats);

  await saveStats(stats);

  // Let popup know (no response expected)
  try {
    chrome.runtime.sendMessage({
      type: 'USAGE_STATS_UPDATED',
      stats
    });
  } catch (e) {
    log('sendMessage USAGE_STATS_UPDATED error', e);
  }
}

// ---------- detect user messages in DOM ----------

const seenMessages = new Set();

function handleUserMessageNode(node) {
  if (!(node instanceof HTMLElement)) return;

  let msgEl = node;
  if (!msgEl.matches?.('[data-message-author-role="user"]')) {
    msgEl = node.querySelector?.('[data-message-author-role="user"]') || null;
  }
  if (!msgEl) return;

  const id =
    msgEl.getAttribute('data-message-id') ||
    extractTextFromNode(msgEl).slice(0, 100);

  if (!id || seenMessages.has(id)) return;
  seenMessages.add(id);

  const text = extractTextFromNode(msgEl);
  if (!text.trim()) return;

  log('detected new user message', { id, preview: text.slice(0, 80) + '…' });
  trackUserMessage(text);
}

function scanExistingUserMessages() {
  const nodes = document.querySelectorAll('[data-message-author-role="user"]');
  nodes.forEach(n => handleUserMessageNode(n));
}

const observer = new MutationObserver(mutations => {
  let found = false;
  for (const m of mutations) {
    m.addedNodes &&
      m.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        if (
          node.matches?.('[data-message-author-role="user"]') ||
          node.querySelector?.('[data-message-author-role="user"]')
        ) {
          found = true;
          handleUserMessageNode(node);
        }
      });
  }
  if (!found) {
    scanExistingUserMessages();
  }
});

try {
  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true
  });
  log('content script loaded, observer attached');
  scanExistingUserMessages();
} catch (e) {
  log('observer setup error', e);
}
