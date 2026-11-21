// ============================================================
// src/components/Transit/TransitComparisonTable.tsx
// Multi-modal transit comparison table with health risk indicators
// ============================================================

import { memo } from 'react';
import type { TransitRouteComparison } from '@/types';

interface TransitComparisonTableProps {
  modalComparisons: TransitRouteComparison[];
}

export const TransitComparisonTable = memo(function TransitComparisonTable({
  modalComparisons,
}: TransitComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/40">
      <table className="w-full text-left text-xs text-slate-200 border-collapse">
        <caption className="sr-only">
          Comparison of transit modes by duration, PM2.5 exposure dose, carbon emissions, and health risk
        </caption>
        <thead>
          <tr className="border-b border-slate-800/80 bg-slate-900/80 text-slate-400 uppercase text-[10px] font-black tracking-wider">
            <th scope="col" className="py-3.5 px-4">Transit Mode</th>
            <th scope="col" className="py-3.5 px-4">Duration</th>
            <th scope="col" className="py-3.5 px-4">PM2.5 Inhaled Dose</th>
            <th scope="col" className="py-3.5 px-4">CO₂ Footprint</th>
            <th scope="col" className="py-3.5 px-4">Health Risk</th>
            <th scope="col" className="py-3.5 px-4">Clinical Advisory</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {modalComparisons.map((item) => (
            <tr
              key={item.mode}
              className={`hover:bg-slate-800/30 transition-colors ${item.isRecommended ? 'bg-emerald-950/20 font-semibold' : ''
                }`}
            >
              <td className="py-4 px-4 flex items-center gap-2.5">
                {item.isRecommended && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Recommended Option" aria-hidden="true" />
                )}
                <span className="text-white font-bold">{item.modeLabel}</span>
              </td>
              <td className="py-4 px-4 whitespace-nowrap font-mono">{item.durationMinutes} mins</td>
              <td className="py-4 px-4 font-mono font-black">
                <span
                  className={
                    item.pm25ExposureDoseUg > 40
                      ? 'text-rose-400'
                      : item.pm25ExposureDoseUg > 20
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                  }
                >
                  {item.pm25ExposureDoseUg} µg
                </span>
              </td>
              <td className="py-4 px-4 whitespace-nowrap font-mono">{item.co2EmissionsKg} kg</td>
              <td className="py-4 px-4">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    item.healthRiskRating === 'severe'
                      ? 'bg-red-950/90 text-rose-300 border border-red-500/50'
                      : item.healthRiskRating === 'moderate'
                      ? 'bg-amber-950/90 text-amber-300 border border-amber-500/50'
                      : item.healthRiskRating === 'low'
                      ? 'bg-sky-950/90 text-sky-300 border border-sky-500/50'
                      : 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                  }`}
                >
                  {item.healthRiskRating}
                </span>
              </td>
              <td className="py-4 px-4 text-slate-300 max-w-xs leading-relaxed">{item.advisory}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
