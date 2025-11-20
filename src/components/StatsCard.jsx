import React from 'react';

export default function StatsCard({
  icon,
  label,
  value,
  subtitle
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-emerald-500/40 bg-slate-900/80 p-3 shadow-lg shadow-emerald-900/40 backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-emerald-700/60">
      <div className="flex items-center gap-2 text-sm text-emerald-300">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-xl font-semibold text-slate-50">{value}</div>
      {subtitle && (
        <div className="text-xs text-slate-400">{subtitle}</div>
      )}
    </div>
  );
}
