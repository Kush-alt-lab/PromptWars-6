// ============================================================
// src/components/Dashboard/AirTelemetryDashboard.tsx
// Dark Editorial Air Telemetry Dashboard (Matching Saans Inspiration)
// Per ACCESSIBILITY.md §3 (Twin Representation) & EFFICIENCY.md §3
// ============================================================

import { memo } from 'react';
import { useAirAnalytics } from '@/hooks/useAirAnalytics';
import { useAppContext } from '@/context/AppContext';
import { TabId } from '@/types';
import { Sparkline } from '@/components/shared/Sparkline';
import { ZoneCard } from '@/components/shared/ZoneCard';
import { SmogHeatmap } from './SmogHeatmap';

export const AirTelemetryDashboard = memo(function AirTelemetryDashboard() {
  const { setActiveTab, openTour, isTourOpen, tourStepIndex } = useAppContext();
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

  const isLiveReadingTourTarget = isTourOpen && (tourStepIndex === 1 || tourStepIndex === 0);
  const isSourcesTourTarget = isTourOpen && tourStepIndex === 3;

  return (
    <section aria-label="Hyperlocal AQI Telemetry Dashboard" className="flex flex-col gap-8 fade-in">
      {/* 1. Hero Section (Matching Screenshots) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        {/* Left Column: Big Editorial Typography & CTA */}
        <div className="lg:col-span-7 flex flex-col justify-center gap-5">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.1]">
            Know the air<br />
            <span className="text-slate-400">before you breathe it</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
            Live readings from ground stations, model estimates where there are none, and an atmospheric plan for your day that cuts how much pollution you inhale.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab(TabId.Routine)}
              className="px-5 py-2.5 rounded-lg bg-white text-black hover:bg-slate-200 text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95"
            >
              PLAN MY DAY &gt;
            </button>

            <button
              type="button"
              onClick={() => openTour(0)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/20 hover:border-white text-xs font-bold font-mono uppercase tracking-wider text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <span aria-hidden="true">⊙</span>
              <span>TAKE THE TOUR</span>
            </button>
          </div>
        </div>

        {/* Right Column: 'The Live Reading' Card (Exact Match to Screenshot 3) */}
        <div
          id="tour-live-reading"
          className={`lg:col-span-5 saans-card p-6 flex flex-col justify-between gap-5 transition-all duration-300 ${
            isLiveReadingTourTarget ? 'tour-target-ring' : ''
          }`}
        >
          {/* Card Top Row */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span className="font-bold text-slate-300 tracking-wider uppercase text-[11px]">
                LIVE IN {currentZone.zoneName.toUpperCase()}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 border border-emerald-500/40 bg-emerald-950/40 tracking-wider uppercase">
              MEASURED
            </span>
          </div>

          {/* Big Number & Category Readout */}
          <div className="flex items-baseline gap-4 mt-1">
            <span
              className="text-6xl font-black font-mono tracking-tight"
              style={{ color: aqiColor }}
            >
              {currentZone.aqi}
            </span>
            <div>
              <span className="text-lg font-bold text-white block leading-snug">
                {aqiCategory}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                US AQI • {currentZone.dominantPollutant}
              </span>
            </div>
          </div>

          {/* Dotted Forecast Timeline Indicator */}
          <div className="pt-2 border-t border-white/[0.08]">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1.5 uppercase">
              <span>NOW</span>
              <span>FORECAST</span>
              <span>+24 H</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (currentZone.aqi / 300) * 100)}%`, backgroundColor: aqiColor }}
              />
            </div>
          </div>

          {/* Recommendation & Subtext */}
          <div>
            <p className="text-xs text-slate-200 font-medium">
              {currentZone.aqi <= 50
                ? 'Ideal for outdoor activities.'
                : currentZone.aqi <= 100
                ? 'Acceptable air quality for most individuals.'
                : currentZone.aqi <= 200
                ? 'Sensitive groups should reduce prolonged outdoor exertion.'
                : 'Avoid outdoor exercise. Run indoor HEPA air filtration.'}
            </p>
            <p className="text-[11px] font-mono text-slate-500 mt-1">
              Median of municipal ground stations in {currentZone.zoneName} / updated {new Date(currentZone.lastUpdated).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Five Public Sources, Cross-Checked Strip (Exact Match to Screenshot 1) */}
      <div
        id="tour-sources-strip"
        className={`saans-panel p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 transition-all duration-300 ${
          isSourcesTourTarget ? 'tour-target-ring' : ''
        }`}
      >
        <div className="flex flex-col justify-between border-r border-white/[0.08] pr-4 last:border-r-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs font-mono">WAQI</span>
            <span className="text-[9px] font-mono uppercase text-slate-400 bg-white/[0.06] px-1.5 py-0.5 rounded">MEASURED</span>
          </div>
          <div className="mt-2">
            <span className="text-sm font-bold font-mono text-slate-200">AQI {currentZone.aqi}</span>
          </div>
        </div>

        <div className="flex flex-col justify-between border-r border-white/[0.08] pr-4 last:border-r-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs font-mono">OpenAQ</span>
            <span className="text-[9px] font-mono uppercase text-slate-400 bg-white/[0.06] px-1.5 py-0.5 rounded">MEASURED</span>
          </div>
          <div className="mt-2">
            <span className="text-sm font-bold font-mono text-slate-200">PM2.5: {currentZone.pm25} µg</span>
          </div>
        </div>

        <div className="flex flex-col justify-between border-r border-white/[0.08] pr-4 last:border-r-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs font-mono">Copernicus CAMS</span>
            <span className="text-[9px] font-mono uppercase text-slate-400 bg-white/[0.06] px-1.5 py-0.5 rounded">MODEL</span>
          </div>
          <div className="mt-2">
            <span className="text-sm font-bold font-mono text-slate-200">NO2: {currentZone.no2} ppb</span>
          </div>
        </div>

        <div className="flex flex-col justify-between border-r border-white/[0.08] pr-4 last:border-r-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs font-mono">Open-Meteo</span>
            <span className="text-[9px] font-mono uppercase text-slate-400 bg-white/[0.06] px-1.5 py-0.5 rounded">WEATHER</span>
          </div>
          <div className="mt-2">
            <span className="text-sm font-bold font-mono text-slate-200">{currentZone.temperatureC}°C, wind {currentZone.windSpeedKmh} km/h</span>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs font-mono">Google Gemini</span>
            <span className="text-[9px] font-mono uppercase text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">AI</span>
          </div>
          <div className="mt-2">
            <span className="text-xs text-slate-300 font-mono">Insights & assistant</span>
          </div>
        </div>
      </div>

      {/* 3. Grid: Spatial Smog Heatmap (Left) & Pollutant Sparklines (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <SmogHeatmap
          zones={zones}
          selectedZoneId={selectedZoneId}
          onSelectZone={setSelectedZoneId}
        />

        {/* Pollutant Sparklines Panel */}
        <div className="lg:col-span-5 saans-panel p-6 flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span aria-hidden="true">📈</span> Pollutant Trend Sparklines
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Multi-parameter telemetry ({currentZone.zoneName})
              </p>
            </div>
            <div className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
              inversionStatus.isInversion ? 'text-amber-400 border-amber-500/40 bg-amber-950/30' : 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30'
            }`}>
              {inversionStatus.isInversion ? 'Inversion Active' : 'Normal Mixing'}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {pollutantBreakdown.map((pollutant) => (
              <div
                key={pollutant.type}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between gap-3 hover:border-white/15 transition-all"
              >
                <div className="min-w-[95px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white font-mono">{pollutant.type}</span>
                    <span className="text-[10px] text-slate-500">({pollutant.unit})</span>
                  </div>
                  <div className="text-xs font-mono text-slate-300 mt-0.5">
                    {pollutant.current} <span className="text-[10px] text-slate-500">/ max {pollutant.threshold}</span>
                  </div>
                </div>

                <div className="flex-1 flex justify-center">
                  <Sparkline
                    values={pollutant.history}
                    color={pollutant.current > pollutant.threshold ? '#ef4444' : '#22c55e'}
                    width={130}
                    height={30}
                    label={`${pollutant.type} 7-hour trend`}
                  />
                </div>

                <div className="text-right min-w-[70px]">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      pollutant.status === 'Hazardous' || pollutant.status === 'Critical'
                        ? 'bg-red-950/80 text-red-300 border border-red-500/50'
                        : pollutant.status === 'Unhealthy' || pollutant.status === 'Moderate'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                    }`}
                  >
                    {pollutant.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Simulation Engine Controls (Preserved for tests & interactivity) */}
          <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-400 font-mono">Simulation Controls:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={simulateSmogSpike}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-white/[0.05] border border-white/20 text-red-300 hover:border-red-400 hover:text-white transition-all cursor-pointer"
              >
                Simulate Winter Smog Spike
              </button>
              <button
                type="button"
                onClick={simulateCleanDispersion}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-white/[0.05] border border-white/20 text-emerald-300 hover:border-emerald-400 hover:text-white transition-all cursor-pointer"
              >
                Simulate Solar Wind Cleansing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Monitored Urban Sectors Grid */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Monitored Municipal Sectors ({zones.length})
          </h2>
          <span className="text-xs text-slate-500 font-mono">Click to switch primary active sector</span>
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
