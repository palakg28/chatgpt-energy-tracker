const KEY = 'usageStats';

const defaultStats = {
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

export function getDefaultStats() {
  return structuredClone
    ? structuredClone(defaultStats)
    : JSON.parse(JSON.stringify(defaultStats));
}

export function loadStats() {
  return new Promise(resolve => {
    if (!chrome?.storage?.local) {
      resolve(getDefaultStats());
      return;
    }
    chrome.storage.local.get([KEY], result => {
      if (chrome.runtime.lastError) {
        console.warn('Error reading stats', chrome.runtime.lastError);
        resolve(getDefaultStats());
        return;
      }
      resolve(result[KEY] || getDefaultStats());
    });
  });
}

export function saveStats(stats) {
  return new Promise(resolve => {
    if (!chrome?.storage?.local) {
      resolve();
      return;
    }
    chrome.storage.local.set({ [KEY]: stats }, () => {
      if (chrome.runtime.lastError) {
        console.warn('Error saving stats', chrome.runtime.lastError);
      }
      resolve();
    });
  });
}
