import { useEffect, useState } from 'react';
import { getDefaultStats } from '../utils/storage';

export default function useUsageStats() {
  const [stats, setStats] = useState(getDefaultStats());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chrome?.storage?.local) {
      setLoading(false);
      return;
    }

    chrome.storage.local.get(['usageStats'], res => {
      setStats(res.usageStats || getDefaultStats());
      setLoading(false);
    });

    function handleMessage(message) {
      if (message?.type === 'USAGE_STATS_UPDATED' && message.stats) {
        setStats(message.stats);
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return { stats, loading };
}
