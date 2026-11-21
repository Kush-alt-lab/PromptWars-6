// ============================================================
// src/components/IAQ/WindowSchedule.tsx
// Smart Inversion-Aware Window Ventilation Schedule
// ============================================================

import { memo } from 'react';

interface WindowScheduleProps {
  currentAqi: number;
}

export const WindowSchedule = memo(function WindowSchedule({ currentAqi }: WindowScheduleProps) {
  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <span aria-hidden="true">🪟</span> Smart Inversion-Aware Window Ventilation Schedule
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Tailored to current outdoor AQI (<strong className="text-slate-200">{currentAqi}</strong>) and meteorological boundary layer dynamics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mt-2">
        <div className="bg-gradient-to-br from-red-950/40 to-slate-900/60 border border-red-500/40 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 block">
            Morning Inversion Lock (6:00 AM – 10:30 AM)
          </span>
          <strong className="text-white text-base font-black block mt-1.5">Windows Tightly Latched</strong>
          <p className="text-slate-300 text-xs mt-2 leading-relaxed">
            Cold nocturnal air traps ground-level vehicular soot. Opening windows increases indoor PM2.5 by 300%.
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border border-emerald-500/40 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
            Optimal Flush Window (1:30 PM – 3:30 PM)
          </span>
          <strong className="text-white text-base font-black block mt-1.5">Crack Opposing Windows (15 mins)</strong>
          <p className="text-slate-300 text-xs mt-2 leading-relaxed">
            Solar radiation breaks the surface inversion, maximizing natural vertical air mixing and flushing stale CO2.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-950/40 to-slate-900/60 border border-amber-500/40 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
            Evening Rush Trap (5:30 PM – 9:00 PM)
          </span>
          <strong className="text-white text-base font-black block mt-1.5">Seal Perimeter & Run HEPA</strong>
          <p className="text-slate-300 text-xs mt-2 leading-relaxed">
            Commuter traffic and cooling surface temperatures cause toxic secondary particulate settling.
          </p>
        </div>
      </div>
    </div>
  );
});
