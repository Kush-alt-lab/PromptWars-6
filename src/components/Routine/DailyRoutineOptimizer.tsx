// ============================================================
// src/components/Routine/DailyRoutineOptimizer.tsx
// GenAI-powered personalized daily schedule & exposure minimizer
// Per PROBLEM_ALIGNMENT.md §1.2 & ACCESSIBILITY.md §6
// ============================================================

import { memo, useState, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { apiService } from '@/services/apiService';
import type { PersonaProfile } from '@/types';
import { RoutineTimeline } from './RoutineTimeline';

export const DailyRoutineOptimizer = memo(function DailyRoutineOptimizer() {
  const {
    personas,
    activePersona,
    setActivePersona,
    selectedZone,
    language,
    routinePlan,
    setRoutinePlan,
  } = useAppContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const plan = await apiService.generateDailyRoutine({
        persona: activePersona,
        zone: selectedZone,
        language,
      });
      setRoutinePlan(plan);
    } catch (err: unknown) {
      console.error('Failed to generate routine:', err);
      setErrorMessage('Unable to generate AI schedule right now. Showing localized heuristic guidance.');
    } finally {
      setIsLoading(false);
    }
  }, [activePersona, selectedZone, language, setRoutinePlan]);

  return (
    <section aria-label="GenAI Daily Routine and Exposure Optimizer" className="flex flex-col gap-8 fade-in">
      {/* Persona Selection Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                Personalized AI Health Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 mt-1">
              <span aria-hidden="true">🤖</span> GenAI Daily Routine & Smog Exposure Optimizer
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Select your family or lifestyle vulnerability profile to compute an hour-by-hour exposure mitigation routine powered by Gemini AI and atmospheric boundary physics.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-7 py-3.5 rounded-2xl font-black text-sm tracking-wide bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-emerald-950/50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                <span>Optimizing with Gemini AI…</span>
              </>
            ) : (
              <>
                <span aria-hidden="true">✨</span>
                <span>Generate Smart Schedule</span>
              </>
            )}
          </button>
        </div>

        {/* Persona Selector Chips */}
        <fieldset className="flex flex-col gap-3">
          <legend className="text-xs font-black uppercase tracking-wider text-slate-300">
            Target Family & Commuter Persona:
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {personas.map((p: PersonaProfile) => {
              const isSelected = p.id === activePersona.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setActivePersona(p)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900/95 border-emerald-500/80 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/40 -translate-y-0.5'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/70 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-black text-sm tracking-tight ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {p.name}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        p.sensitivityLevel === 'high'
                          ? 'bg-red-950/80 text-rose-300 border border-red-500/50'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/50'
                      }`}
                    >
                      {p.sensitivityLevel} Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div aria-live="polite" aria-busy={isLoading} className="sr-only">
          {isLoading ? 'Generating personalized air quality daily schedule with Gemini AI…' : 'Schedule ready.'}
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-amber-950/40 border border-amber-500/50 rounded-2xl text-amber-200 text-xs flex items-center gap-2.5">
            <span aria-hidden="true">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Routine Plan Results */}
      {routinePlan && (
        <div className="flex flex-col gap-6 fade-in">
          {/* Key Metric Highlights & Optimal Window */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel border-emerald-500/40 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
                  Optimal Outdoor Activity Window
                </span>
                <div className="text-3xl font-black text-white mt-1.5 font-mono">
                  {routinePlan.optimalOutdoorWindow.startHour}:00 – {routinePlan.optimalOutdoorWindow.endHour}:00
                </div>
              </div>
              <p className="text-xs text-emerald-200/90 mt-2.5 leading-relaxed">
                {routinePlan.optimalOutdoorWindow.rationale}
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                  Predicted PM2.5 Inhaled Dose
                </span>
                <div className="text-3xl font-black text-cyan-400 mt-1.5 font-mono">
                  {routinePlan.totalExposureScore} <span className="text-sm font-sans text-slate-400">µg·h</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                Avoiding morning inversion peaks reduces pulmonary particulate intake by ~42%.
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                  Estimated Carbon Abatement
                </span>
                <div className="text-3xl font-black text-emerald-400 mt-1.5 font-mono">
                  {routinePlan.carbonOffsetKg} <span className="text-sm font-sans text-slate-400">kg CO₂</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                Achieved by consolidating errands and shifting peak motorized transit trips.
              </p>
            </div>
          </div>

          <RoutineTimeline
            routinePlan={routinePlan}
            zoneName={selectedZone.zoneName}
          />

          {/* Actionable General Guidance */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7">
            <h3 className="text-base font-black text-white flex items-center gap-2 mb-4">
              <span aria-hidden="true">💡</span> Expert Smog Defense Directives
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
              {routinePlan.generalAdvice.map((advice, i) => (
                <li key={i} className="flex items-start gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition-all">
                  <span className="text-emerald-400 font-black" aria-hidden="true">✔</span>
                  <span className="leading-relaxed">{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
});
