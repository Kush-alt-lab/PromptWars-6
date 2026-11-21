// ============================================================
// src/components/shared/ZoneCard.tsx
// Memoized urban zone status card with AQI badge & inversion indicators
// Per CODING_CONVENTIONS.md §4 & ACCESSIBILITY.md §7
// ============================================================

import { memo } from 'react';
import type { UrbanZone } from '@/types';
import { getAQIColor } from '@/lib/aqiCompute';

interface ZoneCardProps {
  zone: UrbanZone;
  isSelected: boolean;
  onSelect: (zoneId: string) => void;
}

export const ZoneCard = memo(function ZoneCard({
  zone,
  isSelected,
  onSelect,
}: ZoneCardProps) {
  const aqiColor = getAQIColor(zone.aqi);

  return (
    <div
      role="article"
      aria-label={`${zone.zoneName} air quality status`}
      className={`rounded-2xl border p-4 flex flex-col justify-between gap-3.5 transition-all duration-200 ${
        isSelected
          ? 'bg-slate-900/95 border-emerald-500/80 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/30 -translate-y-1'
          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80 hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-black text-white text-sm leading-snug tracking-tight">{zone.zoneName}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Primary: <span className="text-slate-200 font-bold">{zone.dominantPollutant}</span>
          </p>
        </div>
        <div
          className="px-2.5 py-1 rounded-xl text-xs font-black text-white flex items-center gap-1.5 shadow-sm"
          style={{ backgroundColor: `${aqiColor}20`, borderColor: `${aqiColor}80`, borderWidth: '1px' }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: aqiColor }} aria-hidden="true" />
          <span>AQI {zone.aqi}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs py-2.5 px-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
        <div>
          <div className="text-slate-500 text-[10px] font-black uppercase tracking-wider">PM2.5</div>
          <div className="font-bold text-slate-100 mt-0.5">{zone.pm25} µg</div>
        </div>
        <div>
          <div className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Wind</div>
          <div className="font-bold text-slate-100 mt-0.5">{zone.windSpeedKmh} km/h</div>
        </div>
        <div>
          <div className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Temp</div>
          <div className="font-bold text-slate-100 mt-0.5">{zone.temperatureC}°C</div>
        </div>
      </div>

      {zone.inversionRisk && (
        <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/40 px-2.5 py-1.5 rounded-xl border border-amber-500/40 shadow-sm">
          <span aria-hidden="true">⚠️</span>
          <span className="font-bold text-[11px]">Atmospheric Inversion Trap</span>
        </div>
      )}

      <button
        type="button"
        onClick={() => onSelect(zone.zoneId)}
        aria-pressed={isSelected}
        className={`w-full py-2.5 rounded-xl text-xs font-black tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer ${
          isSelected
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/60'
            : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/90 hover:text-white'
        }`}
      >
        {isSelected ? 'Active Telemetry' : 'Switch Telemetry'}
      </button>
    </div>
  );
});
