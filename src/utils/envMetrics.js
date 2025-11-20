// Rough characters → tokens estimate
export function estimateTokensFromText(text) {
    if (!text) return 0;
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return Math.ceil(trimmed.length / 4); // ~4 chars per token
  }
  
  // Group models into "small", "medium", "large" buckets
  function getModelTier(modelName = '') {
    const m = modelName.toLowerCase();
    if (m.includes('o1') || m.includes('gpt-4') || m.includes('4o')) {
      return 'large';
    }
    if (m.includes('mini') || m.includes('3.5') || m.includes('gpt-3')) {
      return 'small';
    }
    return 'medium';
  }
  
  /**
   * These constants are purely illustrative — not real values.
   * You can tune them later.
   */
  const PER_1K = {
    small: {
      energyWh: 0.8,
      waterL: 0.4,
      co2g: 5
    },
    medium: {
      energyWh: 1.2,
      waterL: 0.6,
      co2g: 8
    },
    large: {
      energyWh: 1.8,
      waterL: 0.9,
      co2g: 12
    }
  };
  
  export function estimateEnvImpact(tokens, modelName) {
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
  