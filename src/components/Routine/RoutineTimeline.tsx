// ============================================================
// src/components/Routine/RoutineTimeline.tsx
// Hour-by-hour exposure schedule timeline list
// ============================================================

import { memo } from 'react';
import type { DailyRoutinePlan } from '@/types';

interface RoutineTimelineProps {
  routinePlan: DailyRoutinePlan;
  zoneName: string;
}

export const RoutineTimeline = memo(function RoutineTimeline({
  routinePlan,
  zoneName,
}: RoutineTimelineProps) {
  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <span aria-hidden="true">📅</span> Hour-by-Hour Exposure & Routine Timeline
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Tailored for <strong className="text-slate-200">{routinePlan.persona}</strong> in <strong className="text-slate-200">{zoneName}</strong>
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {routinePlan.hourlySchedule.map((slot) => {
          const isOutdoor = slot.recommendation === 'safe-outdoor';
          const isIndoorOnly = slot.recommendation === 'indoor-only';

          return (
            <div
              key={slot.hour}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${isIndoorOnly
                ? 'bg-gradient-to-r from-red-950/40 to-slate-900/60 border-red-500/40 shadow-sm shadow-red-950/20'
                : isOutdoor
                  ? 'bg-gradient-to-r from-emerald-950/40 to-slate-900/60 border-emerald-500/50 shadow-sm shadow-emerald-950/20'
                  : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700/80'
                }`}
            >
              <div className="flex items-center gap-4 min-w-[150px]">
                <span className="text-base font-black text-white font-mono bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800/80">
                  {slot.timeLabel}
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${isIndoorOnly
                    ? 'bg-red-950 text-rose-300 border border-red-500/50'
                    : isOutdoor
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/50'
                    }`}
                >
                  {slot.recommendation.replace('-', ' ')}
                </span>
              </div>

              <div className="flex-1">
                <h4 className="font-bold text-white text-sm tracking-tight">{slot.activity}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{slot.healthImpactNotes}</p>
              </div>

              <div className="flex items-center gap-5 text-xs min-w-[170px] justify-start md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                <div className="text-left md:text-right">
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Predicted AQI</div>
                  <div className="font-black text-white text-sm font-mono mt-0.5">{slot.predictedAQI}</div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Inversion Risk</div>
                  <div
                    className={`font-black text-xs capitalize mt-0.5 ${slot.inversionLikelihood === 'high' ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                  >
                    {slot.inversionLikelihood}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
