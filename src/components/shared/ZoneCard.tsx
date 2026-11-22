// ============================================================
// src/components/shared/ZoneCard.tsx
// Dark Editorial Urban Zone Telemetry Card (Matching Saans UI Inspiration)
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
      className={`rounded-xl border p-4 flex flex-col justify-between gap-3.5 transition-all duration-200 ${
        isSelected
          ? 'bg-[#0f1118] border-white/40 ring-1 ring-white/30 shadow-xl shadow-black/80'
          : 'bg-[#090b10] border-white/[0.08] hover:border-white/20 hover:bg-[#0c0e14]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-white text-sm leading-snug tracking-tight">{zone.zoneName}</h3>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            Primary: <span className="text-slate-200">{zone.dominantPollutant}</span>
          </p>
        </div>
        <div
          className="px-2 py-0.5 rounded text-xs font-mono font-bold text-white flex items-center gap-1.5"
          style={{ backgroundColor: `${aqiColor}20`, borderColor: `${aqiColor}80`, borderWidth: '1px' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: aqiColor }} aria-hidden="true" />
          <span>AQI {zone.aqi}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 px-2 bg-white/[0.02] rounded-lg border border-white/[0.05] font-mono">
        <div>
          <div className="text-slate-500 text-[10px] uppercase">PM2.5</div>
          <div className="font-bold text-slate-200 mt-0.5">{zone.pm25} µg</div>
        </div>
        <div>
          <div className="text-slate-500 text-[10px] uppercase">Wind</div>
          <div className="font-bold text-slate-200 mt-0.5">{zone.windSpeedKmh} km/h</div>
        </div>
        <div>
          <div className="text-slate-500 text-[10px] uppercase">Temp</div>
          <div className="font-bold text-slate-200 mt-0.5">{zone.temperatureC}°C</div>
        </div>
      </div>

      {zone.inversionRisk && (
        <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/30 px-2 py-1 rounded border border-amber-500/30 font-mono text-[11px]">
          <span aria-hidden="true">⚠️</span>
          <span>Atmospheric Inversion Trap</span>
        </div>
      )}

      <button
        type="button"
        onClick={() => onSelect(zone.zoneId)}
        aria-pressed={isSelected}
        className={`w-full py-2 rounded-lg text-xs font-mono uppercase font-bold tracking-wider transition-all duration-200 cursor-pointer ${
          isSelected
            ? 'bg-white text-black hover:bg-slate-200 shadow-md'
            : 'bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white hover:border-white/30'
        }`}
      >
        {isSelected ? 'Active Telemetry' : 'Switch Telemetry'}
      </button>
    </div>
  );
});
