// ============================================================
// src/components/Tour/GuidedTourModal.tsx
// Accessible interactive guided walkthrough modal (WCAG 2.2 AA)
// Per ACCESSIBILITY.md §2 & ARCHITECTURE_PATTERNS.md §2.1
// ============================================================

import { memo, useEffect, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { TOUR_STEPS } from '@/lib/constants';

export const GuidedTourModal = memo(function GuidedTourModal() {
  const {
    isTourOpen,
    closeTour,
    tourStepIndex,
    nextTourStep,
    prevTourStep,
    setTourStepIndex,
  } = useAppContext();

  const currentStep = TOUR_STEPS[tourStepIndex] || TOUR_STEPS[0];
  const isLastStep = tourStepIndex === TOUR_STEPS.length - 1;
  const isFirstStep = tourStepIndex === 0;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeTour();
      } else if (e.key === 'ArrowRight' && !isLastStep) {
        nextTourStep();
      } else if (e.key === 'ArrowLeft' && !isFirstStep) {
        prevTourStep();
      }
    },
    [closeTour, isFirstStep, isLastStep, nextTourStep, prevTourStep]
  );

  useEffect(() => {
    if (!isTourOpen) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourOpen, handleKeyDown]);

  if (!isTourOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeTour();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-step-title"
        aria-describedby="tour-step-desc"
        className="w-full max-w-xl glass-panel border border-emerald-500/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl shadow-black/80 relative overflow-hidden focus:outline-none"
        tabIndex={-1}
      >
        {/* Ambient background glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row with Skip Button */}
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-950/90 text-emerald-300 border border-emerald-500/50">
              {currentStep.tag}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">
              Step {currentStep.stepNumber} of {currentStep.totalSteps}
            </span>
          </div>

          <button
            type="button"
            onClick={closeTour}
            aria-label="Skip guided tour"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <span>Skip Tour</span>
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Highlighted 'Currently On' Location Pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-950/80 border border-emerald-500/40 text-xs text-emerald-300 relative z-10 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" aria-hidden="true" />
          <span>
            Currently on Section: <strong className="text-white uppercase tracking-wider">{currentStep.targetTabLabel}</strong>
          </span>
        </div>

        {/* Step Content */}
        <div className="flex flex-col gap-3 relative z-10">
          <h3
            id="tour-step-title"
            className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug"
          >
            {currentStep.title}
          </h3>

          <p
            id="tour-step-desc"
            className="text-xs sm:text-sm text-slate-300 leading-relaxed"
          >
            {currentStep.description}
          </p>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2 mt-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Key Capabilities:
            </span>
            <ul className="flex flex-col gap-1.5 text-xs text-slate-200">
              {currentStep.highlights.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold" aria-hidden="true">✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-[11px] text-cyan-400/90 font-medium flex items-center gap-1.5 mt-1">
            <span aria-hidden="true">💡</span>
            <span>{currentStep.actionPrompt}</span>
          </div>
        </div>

        {/* Footer Navigation & Progress */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setTourStepIndex(idx)}
                aria-label={`Jump to step ${idx + 1}: ${step.title}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === tourStepIndex
                    ? 'w-6 bg-gradient-to-r from-emerald-400 to-teal-400'
                    : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={closeTour}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Skip Tour
            </button>

            {!isFirstStep && (
              <button
                type="button"
                onClick={prevTourStep}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 border border-slate-700/60 transition-all cursor-pointer"
              >
                Previous
              </button>
            )}

            <button
              type="button"
              onClick={nextTourStep}
              className="px-5 py-2 rounded-xl text-xs font-black tracking-wide bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:brightness-110 shadow-md shadow-emerald-950/40 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {isLastStep ? 'Get Started 🚀' : 'Next Step →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
