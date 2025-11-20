import { loadStats, saveStats, getDefaultStats } from './utils/storage';
import { estimateEnvImpact } from './utils/envMetrics';

const TAG = '[EnergyTracker-bg]';

function log(...args) {
  console.log(TAG, ...args);
}

chrome.runtime.onInstalled.addListener(() => {
  log('onInstalled');
  loadStats().then(stats => {
    if (!stats || !stats.total) {
      log('initializing default stats');
      saveStats(getDefaultStats());
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'CHAT_QUERY') {
    log('received CHAT_QUERY', message);
    handleChatQuery(message)
      .then(updated => {
        log('stats updated');
        sendResponse({ ok: true, stats: updated });
      })
      .catch(err => {
        log('error in handleChatQuery', err);
        sendResponse({ ok: false, error: err?.message });
      });

    return true; // async
  } else {
    log('unknown message', message);
  }
});

// ... keep the rest of handleChatQuery exactly as it was ...
