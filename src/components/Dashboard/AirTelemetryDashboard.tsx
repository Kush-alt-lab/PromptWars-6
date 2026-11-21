// ============================================================
// src/components/Dashboard/AirTelemetryDashboard.tsx
// Hyperlocal AQI telemetry, custom SVG heatmap, and pollutant sparklines
// Per ACCESSIBILITY.md §3 (Twin Representation) & EFFICIENCY.md §3
// ============================================================

import { memo } from 'react';
import { useAirAnalytics } from '@/hooks/useAirAnalytics';
import { Sparkline } from '@/components/shared/Sparkline';
import { ZoneCard } from '@/components/shared/ZoneCard';
import { SmogHeatmap } from './SmogHeatmap';

export const AirTelemetryDashboard = memo(function AirTelemetryDashboard() {
  const {
    zones,
    currentZone,
    selectedZoneId,
    setSelectedZoneId,
    aqiCategory,
    aqiColor,
    inversionStatus,
    pollutantBreakdown,
    simulateSmogSpike,
    simulateCleanDispersion,
  } = useAirAnalytics();

  return (
    <section aria-label="Hyperlocal AQI Telemetry Dashboard" className="flex flex-col gap-8 fade-in">
      {/* Top Hero KPI Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        {/* Dynamic ambient color glow according to AQI status */}
        <div
          className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: aqiColor }}
        />
        <div
          className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: aqiColor }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] uppercase font-black tracking-widest text-slate-400">
                Selected Hyperlocal Sector
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800/90 text-slate-200 border border-slate-700/60">
                {currentZone.zoneName}
              </span>
            </div>

            <div className="flex items-baseline gap-5 mt-3">
              <h1
                className="text-6xl sm:text-7xl font-black tracking-tighter drop-shadow-lg"
                style={{ color: aqiColor }}
              >
                {currentZone.aqi}
              </h1>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {aqiCategory}
                </span>
                <span className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                  Dominant Pollutant: <span className="font-bold text-slate-200 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/50">{currentZone.dominantPollutant}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Meteorological & Inversion Risk Indicator */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="glass-card p-4 min-w-[210px] rounded-2xl border border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Boundary Layer</span>
                <span className="text-sm p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50" aria-hidden="true">🌡️</span>
              </div>
              <div className="text-lg font-black text-white mt-2">
                {currentZone.temperatureC}°C <span className="text-xs text-slate-400 font-medium">/ {currentZone.humidityPercent}% RH</span>
              </div>
              <div className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
                <span>Wind Vector:</span>
                <strong className="text-slate-200 font-bold">{currentZone.windSpeedKmh} km/h</strong>
              </div>
            </div>

            <div
              className={`rounded-2xl p-4 min-w-[240px] border transition-all duration-300 backdrop-blur-md ${inversionStatus.isInversion
                ? 'bg-gradient-to-br from-amber-950/50 to-red-950/30 border-amber-500/50 text-amber-200 shadow-lg shadow-amber-950/20'
                : 'bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border-emerald-500/40 text-emerald-200 shadow-lg shadow-emerald-950/20'
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider">Inversion Risk</span>
                <span className="text-sm p-1 rounded-lg bg-black/20" aria-hidden="true">{inversionStatus.isInversion ? '⚠️' : '✅'}</span>
              </div>
              <div className="text-base font-black mt-1.5 capitalize flex items-center gap-1.5">
                {inversionStatus.severity} Risk
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug line-clamp-2">
                {inversionStatus.rationale}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Simulation Controls */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Telemetry Simulation Engine:
            </span>
            <button
              type="button"
              onClick={simulateSmogSpike}
              className="px-3.5 py-2 rounded-xl text-xs font-black tracking-wide bg-gradient-to-r from-red-950/80 to-rose-900/60 border border-red-500/50 text-red-200 hover:from-red-900/90 hover:to-rose-800/80 hover:text-white transition-all shadow-md shadow-red-950/40 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer active:scale-95"
            >
              ⚡ Simulate Winter Smog Spike (+45 AQI)
            </button>
            <button
              type="button"
              onClick={simulateCleanDispersion}
              className="px-3.5 py-2 rounded-xl text-xs font-black tracking-wide bg-gradient-to-r from-emerald-950/80 to-teal-900/60 border border-emerald-500/50 text-emerald-200 hover:from-emerald-900/90 hover:to-teal-800/80 hover:text-white transition-all shadow-md shadow-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer active:scale-95"
            >
              🍃 Simulate Solar Wind Cleansing (-50 AQI)
            </button>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Updated: {new Date(currentZone.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Grid: SVG Heatmap (Left) & Pollutant Sparklines (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <SmogHeatmap
          zones={zones}
          selectedZoneId={selectedZoneId}
          onSelectZone={setSelectedZoneId}
        />

        {/* Pollutant Sparklines Panel */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col justify-between gap-5">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span className="text-base" aria-hidden="true">📈</span> Pollutant Trend Sparklines
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Multi-parameter gas and particulate telemetry ({currentZone.zoneName})
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {pollutantBreakdown.map((pollutant) => (
              <div
                key={pollutant.type}
                className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-700/80 transition-all"
              >
                <div className="min-w-[95px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-white">{pollutant.type}</span>
                    <span className="text-[10px] text-slate-400">({pollutant.unit})</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-0.5">
                    {pollutant.current} <span className="text-[10px] text-slate-500">/ {pollutant.threshold} max</span>
                  </div>
                </div>

                <div className="flex-1 flex justify-center">
                  <Sparkline
                    values={pollutant.history}
                    color={pollutant.current > pollutant.threshold ? '#f43f5e' : '#10b981'}
                    width={130}
                    height={32}
                    label={`${pollutant.type} 7-hour trend`}
                  />
                </div>

                <div className="text-right min-w-[75px]">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${pollutant.status === 'Hazardous' || pollutant.status === 'Critical'
                      ? 'bg-red-950/80 text-rose-300 border border-red-500/50 shadow-sm shadow-red-950'
                      : pollutant.status === 'Unhealthy' || pollutant.status === 'Moderate'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-950'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-950'
                      }`}
                  >
                    {pollutant.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/60 rounded-xl p-3.5 border border-slate-800/80 leading-relaxed">
            💡 <strong>Winter Smog Insight:</strong> Secondary PM2.5 formation surges when ambient humidity exceeds 75% alongside traffic NO2 and atmospheric inversion traps.
          </div>
        </div>
      </div>

      {/* Municipal Zone Selector Cards */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span aria-hidden="true">🏙️</span> Monitored Urban Sectors ({zones.length})
          </h2>
          <span className="text-xs text-slate-400 font-medium">Click sector to inspect localized profile</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {zones.map((zone) => (
            <ZoneCard
              key={zone.zoneId}
              zone={zone}
              isSelected={zone.zoneId === selectedZoneId}
              onSelect={setSelectedZoneId}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
