// ============================================================
// src/components/Transit/TransitPlanner.tsx
// Multi-modal route exposure calculator & Dijkstra clean-corridor pathfinder
// Per PROBLEM_ALIGNMENT.md §1.3 & CODING_CONVENTIONS.md §4
// ============================================================

import { memo } from 'react';
import { useExposureRouting } from '@/hooks/useExposureRouting';
import { useAppContext } from '@/context/AppContext';
import { TransitComparisonTable } from './TransitComparisonTable';

export const TransitPlanner = memo(function TransitPlanner() {
  const { selectedZone } = useAppContext();
  const {
    nodes,
    originId,
    destinationId,
    setOrigin,
    setDestination,
    lowestExposureResult,
    pathNodes,
    routeDistanceKm,
    modalComparisons,
  } = useExposureRouting();

  return (
    <section aria-label="Low-Emission Commute & Transit Planner" className="flex flex-col gap-8 fade-in">
      {/* Route Pathfinder Selector */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400">
              Clean-Air Navigation Routing
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 mt-1">
            <span aria-hidden="true">🚇</span> Low-Exposure Commute & Transit Path Optimizer
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Dijkstra-powered algorithm identifying subterranean and clean-air corridors to bypass surface smog hotspots and minimize pulmonary particulate load.
          </p>
        </div>

        {/* Origin / Destination Waypoints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="origin-select" className="text-xs font-black uppercase tracking-wider text-slate-300">
              Commute Origin Waypoint:
            </label>
            <div className="relative">
              <select
                id="origin-select"
                value={originId}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner cursor-pointer"
              >
                {nodes.map((node) => (
                  <option key={node.id} value={node.id} className="bg-slate-900 text-white">
                    {node.name} {node.isCleanCorridor ? '(Clean Corridor)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="destination-select" className="text-xs font-black uppercase tracking-wider text-slate-300">
              Destination Waypoint:
            </label>
            <div className="relative">
              <select
                id="destination-select"
                value={destinationId}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner cursor-pointer"
              >
                {nodes.map((node) => (
                  <option key={node.id} value={node.id} className="bg-slate-900 text-white">
                    {node.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lowest Exposure Path Breadcrumbs */}
        {lowestExposureResult && (
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Optimal Clean-Air Trajectory (Dijkstra Min-Exposure Cost: {lowestExposureResult.totalExposure})
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Distance: <strong className="text-white font-mono">{routeDistanceKm} km</strong>
              </span>
            </div>

            <nav aria-label="Lowest pollution route steps">
              <ol className="flex flex-wrap items-center gap-2.5 text-xs">
                {pathNodes.map((n, idx) => (
                  <li key={n.id} className="flex items-center gap-2.5">
                    <span
                      className={`px-3.5 py-1.5 rounded-xl font-bold border flex items-center gap-2 shadow-sm ${n.isMetro
                        ? 'bg-sky-950/80 text-sky-300 border-sky-500/50 shadow-sky-950'
                        : n.isCleanCorridor
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-emerald-950'
                          : 'bg-slate-900/80 text-slate-300 border-slate-800'
                        }`}
                    >
                      <span>{n.isMetro ? '🚇' : n.isCleanCorridor ? '🌲' : '📍'}</span>
                      <span>{n.name}</span>
                    </span>
                    {idx < pathNodes.length - 1 && (
                      <span className="text-slate-600 font-black text-sm" aria-hidden="true">➔</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        )}
      </div>

      {/* Multi-Modal Comparison Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span aria-hidden="true">⚖️</span> Multi-Modal Exposure & Carbon Comparison
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Evaluated against current ambient air quality in <strong className="text-slate-200">{selectedZone.zoneName}</strong> (AQI {selectedZone.aqi})
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Trip Length: <strong className="text-slate-200 font-mono">{routeDistanceKm} km</strong>
          </span>
        </div>

        <TransitComparisonTable modalComparisons={modalComparisons} />
      </div>
    </section>
  );
});
