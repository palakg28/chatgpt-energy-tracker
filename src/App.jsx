import React from 'react';
import useUsageStats from './hooks/useUsageStats';
import StatsCard from './components/StatsCard';
import {
  EnergyIcon,
  WaterIcon,
  EarthIcon,
  StatsIcon
} from './components/icons';

function formatNumber(num, digits = 3) {
  if (!num) return '0';
  return Number(num).toFixed(digits);
}

export default function App() {
  const { stats, loading } = useUsageStats();

  const total = stats.total || {};
  const last = stats.lastQuery;
  const conversationId = last?.conversationId;
  const conversation =
    (conversationId && stats.conversations?.[conversationId]) || null;

  return (
    <div className="flex min-h-full flex-col gap-3 bg-gradient-to-b from-slate-950 via-slate-950 to-emerald-950 px-4 py-3">
      {/* Header */}
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/20 ring-2 ring-emerald-400/60">
            <EnergyIcon />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-50">
              ChatGPT Energy Tracker
            </h1>
            <p className="text-xs text-slate-400">
              Estimate energy ⚡ water 💧 and CO₂ 🌍 per query.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] font-medium text-emerald-300">
          Live · Beta
        </span>
      </header>

      {loading ? (
        <div className="mt-4 flex flex-1 items-center justify-center text-xs text-slate-400">
          <div className="animate-pulse">Loading stats…</div>
        </div>
      ) : (
        <>
          {/* Last query */}
          <section className="mt-1 rounded-2xl border border-slate-700/80 bg-slate-900/70 p-3 shadow-md shadow-black/40">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                <StatsIcon />
                <span>Current query</span>
              </div>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                {last?.model || 'Model unknown'}
              </span>
            </div>

            {last ? (
              <>
                <div className="mb-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
                  <span>
                    Tokens:{' '}
                    <span className="font-semibold text-slate-200">
                      {last.tokens}
                    </span>
                  </span>
                  <span>·</span>
                  <span>{new Date(last.timestamp).toLocaleTimeString()}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <StatsCard
                    icon={<EnergyIcon />}
                    label="Energy"
                    value={`${formatNumber(last.energyWh, 2)} Wh`}
                    subtitle={`${formatNumber(
                      last.energyKWh,
                      5
                    )} kWh est.`}
                  />
                  <StatsCard
                    icon={<WaterIcon />}
                    label="Water"
                    value={`${formatNumber(last.waterL, 3)} L`}
                    subtitle="Freshwater est."
                  />
                  <StatsCard
                    icon={<EarthIcon />}
                    label="CO₂"
                    value={`${formatNumber(last.co2g, 2)} g`}
                    subtitle="Carbon footprint"
                  />
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-400">
                No queries tracked yet. Open ChatGPT in another tab and send a
                message to see live stats.
              </p>
            )}
          </section>

          {/* Conversation vs All time */}
          <section className="grid grid-cols-1 gap-3">
            <div className="rounded-2xl border border-emerald-600/50 bg-slate-950/70 p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-300">
                  This conversation
                </span>
                <span className="text-[10px] text-slate-500">
                  {conversation
                    ? `${conversation.queries} queries`
                    : 'No data yet'}
                </span>
              </div>
              {conversation ? (
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <div className="text-slate-400">Energy</div>
                    <div className="font-semibold text-slate-100">
                      {formatNumber(conversation.energyWh, 2)} Wh
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Water</div>
                    <div className="font-semibold text-slate-100">
                      {formatNumber(conversation.waterL, 3)} L
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">CO₂</div>
                    <div className="font-semibold text-slate-100">
                      {formatNumber(conversation.co2g, 2)} g
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">
                  Metrics show up once you send at least one tracked message in
                  a ChatGPT conversation.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  All-time usage
                </span>
                <span className="text-[10px] text-slate-500">
                  {total.queries || 0} queries tracked
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div>
                  <div className="text-slate-400">Energy</div>
                  <div className="font-semibold text-slate-100">
                    {formatNumber(total.energyWh, 2)} Wh
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Water</div>
                  <div className="font-semibold text-slate-100">
                    {formatNumber(total.waterL, 3)} L
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">CO₂</div>
                  <div className="font-semibold text-slate-100">
                    {formatNumber(total.co2g, 2)} g
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
            <span>Estimates only · per-query model-based heuristics</span>
            <span className="text-emerald-300">🌱</span>
          </footer>
        </>
      )}
    </div>
  );
}
