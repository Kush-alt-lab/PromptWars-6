// ============================================================
// src/components/Dashboard/SmogHeatmap.tsx
// Modern Spatial Smog Heatmap & Real-Time Sector Radar
// Per WCAG SC 1.1.1 Twin Representation & EFFICIENCY.md §3
// ============================================================

import { memo, useState, useMemo } from 'react';
import type { UrbanZone } from '@/types';
import { getAQIColor } from '@/lib/aqiCompute';

interface SmogHeatmapProps {
  zones: UrbanZone[];
  selectedZoneId: string;
  onSelectZone: (zoneId: string) => void;
}

const NODE_COORDINATES = [
  { cx: 300, cy: 160 }, // Central
  { cx: 160, cy: 75 },  // North Industrial
  { cx: 450, cy: 90 },  // Residential
  { cx: 460, cy: 235 }, // Riverside
  { cx: 170, cy: 230 }, // Transit Hub
];

export const SmogHeatmap = memo(function SmogHeatmap({
  zones,
  selectedZoneId,
  onSelectZone,
}: SmogHeatmapProps) {
  const [activeTab, setActiveTab] = useState<'hotspots' | 'cleaner'>('hotspots');
  const [filterType, setFilterType] = useState<'stations' | 'sectors'>('sectors');

  // Dynamically compute hotspots and cleaner sectors from live telemetry data
  const sectorList = useMemo(() => {
    const list = [...zones];
    if (activeTab === 'hotspots') {
      return list.sort((a, b) => b.aqi - a.aqi);
    }
    return list.sort((a, b) => a.aqi - b.aqi);
  }, [zones, activeTab]);

  return (
    <div className="lg:col-span-7 saans-card p-6 flex flex-col gap-5">
      {/* Editorial Headline */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/[0.08] pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Urban Smog Heatmap &amp; Micro-Climate Grid
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Spatial particulate dispersion across municipal monitoring sectors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-950/40 px-2 py-0.5 rounded">
            {zones.length} SECTORS ACTIVE
          </span>
        </div>
      </div>

      {/* WCAG SC 1.1.1 Twin Representation Rule: Textual equivalent */}
      <ul className="sr-only" aria-label="Urban air quality heatmap description">
        {zones.map((zone) => (
          <li key={zone.zoneId}>
            Sector {zone.zoneName}: AQI is {zone.aqi}, Category {zone.category},
            PM2.5 is {zone.pm25} micrograms per cubic meter,
            dominant pollutant is {zone.dominantPollutant},
            inversion risk is {zone.inversionRisk ? 'Active hazard' : 'Normal atmospheric mixing'}.
          </li>
        ))}
      </ul>

      {/* Main Map + Hotspots Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#050608] rounded-xl border border-white/[0.08] p-3 overflow-hidden relative">
        {/* Left Side: Map Canvas & Filters */}
        <div className="md:col-span-8 flex flex-col gap-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <button
              type="button"
              onClick={() => setFilterType('sectors')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                filterType === 'sectors'
                  ? 'border-white/40 bg-white/10 text-white font-bold'
                  : 'border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-[9px] text-emerald-400">■</span>
              <span>Monitored Sectors · {zones.length}</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType('stations')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                filterType === 'stations'
                  ? 'border-white/40 bg-white/10 text-white font-bold'
                  : 'border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-[9px] text-cyan-400">■</span>
              <span>Ground Stations</span>
            </button>
          </div>

          {/* SVG Map Canvas */}
          <div className="w-full relative rounded-lg overflow-hidden bg-[#07090e] border border-white/[0.05]">
            <svg
              viewBox="0 0 600 320"
              aria-hidden="true"
              role="presentation"
              className="w-full h-auto max-h-[300px]"
            >
              <defs>
                <linearGradient id="smogGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0b0e17" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#05070c" stopOpacity="0.98" />
                </linearGradient>
                <radialGradient id="radarCenter" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#05070c" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect x="0" y="0" width="600" height="320" fill="url(#smogGrad)" rx="8" />
              <circle cx="300" cy="160" r="140" fill="url(#radarCenter)" />
              <circle cx="300" cy="160" r="100" fill="none" stroke="#1f293d" strokeWidth="0.75" strokeDasharray="4 4" />
              <circle cx="300" cy="160" r="180" fill="none" stroke="#1f293d" strokeWidth="0.5" strokeDasharray="6 6" />

              {[60, 120, 180, 240].map((y) => (
                <line key={`grid-h-${y}`} x1="20" y1={y} x2="580" y2={y} stroke="#172033" strokeWidth="0.6" strokeDasharray="3 3" />
              ))}
              {[120, 240, 360, 480].map((x) => (
                <line key={`grid-v-${x}`} x1={x} y1="20" x2={x} y2="300" stroke="#172033" strokeWidth="0.6" strokeDasharray="3 3" />
              ))}

              {/* Wind Vectors */}
              <g stroke="#38bdf8" strokeWidth="1" opacity="0.3">
                <path d="M 50 40 Q 150 20 250 50 T 450 40" fill="none" strokeDasharray="5 4" />
                <path d="M 100 160 Q 250 140 380 170 T 550 150" fill="none" strokeDasharray="5 4" />
                <path d="M 80 270 Q 220 250 360 280 T 520 260" fill="none" strokeDasharray="5 4" />
              </g>

              {/* Zone Telemetry Nodes */}
              {zones.map((zone, idx) => {
                const pos = NODE_COORDINATES[idx] || { cx: 200 + idx * 60, cy: 150 };
                const color = getAQIColor(zone.aqi);
                const isSelected = zone.zoneId === selectedZoneId;

                return (
                  <g
                    key={zone.zoneId}
                    className="cursor-pointer transition-transform duration-200"
                    onClick={() => onSelectZone(zone.zoneId)}
                  >
                    {zone.aqi > 200 && (
                      <circle cx={pos.cx} cy={pos.cy} r="34" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" className="animate-ping" />
                    )}
                    {isSelected && (
                      <>
                        <circle cx={pos.cx} cy={pos.cy} r="30" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 2" />
                        <circle cx={pos.cx} cy={pos.cy} r="25" fill="#ffffff" opacity="0.1" />
                      </>
                    )}
                    <circle cx={pos.cx} cy={pos.cy} r="20" fill="#0c1222" stroke={color} strokeWidth="2.5" />
                    <text x={pos.cx} y={pos.cy + 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily="monospace">
                      {zone.aqi}
                    </text>
                    <rect x={pos.cx - 40} y={pos.cy + 24} width="80" height="16" rx="4" fill="#080b12" stroke="#ffffff15" strokeWidth="0.5" />
                    <text x={pos.cx} y={pos.cy + 35} textAnchor="middle" fill="#cbd5e1" fontSize="9" fontWeight="600" fontFamily="sans-serif">
                      {zone.zoneName.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Side: Hotspots / Cleaner Sectors Tabbed Panel */}
        <div className="md:col-span-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/[0.08] pt-3 md:pt-0 md:pl-3">
          <div className="flex flex-col gap-3">
            {/* Top Switcher Tabs */}
            <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setActiveTab('hotspots')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded text-[11px] font-mono transition-all cursor-pointer ${
                  activeTab === 'hotspots'
                    ? 'bg-white/10 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span aria-hidden="true">🔥</span>
                <span>Hotspots</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('cleaner')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded text-[11px] font-mono transition-all cursor-pointer ${
                  activeTab === 'cleaner'
                    ? 'bg-white/10 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span aria-hidden="true">🍃</span>
                <span>Cleaner air</span>
              </button>
            </div>

            {/* List of Sectors */}
            <div className="flex flex-col gap-2 mt-1">
              {sectorList.map((z) => {
                const color = getAQIColor(z.aqi);
                const isSelected = z.zoneId === selectedZoneId;
                return (
                  <button
                    key={z.zoneId}
                    type="button"
                    onClick={() => onSelectZone(z.zoneId)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 border-white/30 text-white'
                        : 'bg-white/[0.02] border-white/[0.04] hover:border-white/15 text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-sans font-medium truncate max-w-[140px]">{z.zoneName}</span>
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-mono font-bold text-white shadow-sm shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      AQI {z.aqi}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Filter Info */}
          <div className="pt-3 border-t border-white/[0.06] mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Primary Pollutant:</span>
            <span className="text-white font-bold">
              {zones.find((z) => z.zoneId === selectedZoneId)?.dominantPollutant || 'PM2.5'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
