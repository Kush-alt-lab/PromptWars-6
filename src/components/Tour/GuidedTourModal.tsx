// ============================================================
// src/components/Tour/GuidedTourModal.tsx
// Short, Focused Guided Tour Popover (WCAG 2.2 AA)
// Directly anchored near the active highlighted navigation tab
// ============================================================

import { memo, useEffect, useCallback, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { TOUR_STEPS } from '@/lib/constants';

export const GuidedTourModal = memo(function GuidedTourModal() {
  const {
    isTourOpen,
    closeTour,
    tourStepIndex,
    nextTourStep,
    prevTourStep,
  } = useAppContext();

  const currentStep = TOUR_STEPS[tourStepIndex] || TOUR_STEPS[0];
  const isLastStep = tourStepIndex === TOUR_STEPS.length - 1;
  const isFirstStep = tourStepIndex === 0;

  // Track position relative to the highlighted tab element
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = useCallback(() => {
    const targetId = `tab-${currentStep.targetTab}`;
    const el = document.getElementById(targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      const cardWidth = Math.min(360, window.innerWidth - 32);
      // Center card below the target tab, clamped to screen bounds
      let left = rect.left + rect.width / 2 - cardWidth / 2;
      left = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, left));
      const top = rect.bottom + 12;
      setCoords({ top, left });
    } else {
      setCoords(null);
    }
  }, [currentStep.targetTab]);

  useEffect(() => {
    if (!isTourOpen) return;
    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isTourOpen, updatePosition]);

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
    <>
      {/* 
        Subtle Backdrop Scrim without backdrop-blur!
        Allows all underlying telemetry and highlighted tab to remain 100% crisp and readable.
      */}
      <div
        className="fixed inset-0 z-50 bg-black/40 pointer-events-auto transition-opacity"
        role="presentation"
        onClick={closeTour}
      />

      {/* 
        Compact Floating Tooltip Card (Layered at z-[70] above backdrop)
        Positioned directly near the highlighted tab
      */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-step-title"
        aria-describedby="tour-step-desc"
        style={
          coords
            ? { top: `${coords.top}px`, left: `${coords.left}px` }
            : undefined
        }
        className={`fixed z-[70] w-[90vw] max-w-[360px] bg-[#0c0e14] border border-white/20 rounded-xl p-4 shadow-2xl shadow-black/90 flex flex-col gap-3 text-left transition-all duration-200 focus:outline-none ${
          !coords ? 'top-20 left-1/2 -translate-x-1/2' : ''
        }`}
        tabIndex={-1}
      >
        {/* Subtle top indicator notch pointing towards the active tab */}
        <div
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0c0e14] border-t border-l border-white/20 rotate-45 pointer-events-none"
          aria-hidden="true"
        />

        {/* Header row: Step Counter & Skip/Close Button */}
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              TOUR {currentStep.stepNumber} / {currentStep.totalSteps}
            </span>
            <span className="sr-only">Step {currentStep.stepNumber} of {currentStep.totalSteps}</span>
          </div>

          <button
            type="button"
            onClick={closeTour}
            aria-label="Skip guided tour"
            className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer text-xs font-mono leading-none"
          >
            ✕
          </button>
        </div>

        {/* Highlighted 'Currently on Section' indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span>
            Currently on Section: <strong className="text-white uppercase">{currentStep.targetTabLabel}</strong>
          </span>
        </div>

        {/* Short, concise content */}
        <div className="flex flex-col gap-1.5 relative z-10">
          <h3
            id="tour-step-title"
            className="text-sm font-bold text-white tracking-tight leading-snug"
          >
            {currentStep.title}
          </h3>

          <p
            id="tour-step-desc"
            className="text-xs text-slate-300 leading-relaxed font-sans"
          >
            {currentStep.description}
          </p>
        </div>

        {/* Compact bottom action buttons */}
        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 relative z-10">
          <button
            type="button"
            onClick={closeTour}
            aria-label="Skip guided tour"
            className="text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Skip
          </button>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                type="button"
                onClick={prevTourStep}
                aria-label="Previous step"
                className="px-2.5 py-1 rounded border border-white/20 hover:border-white text-xs font-mono text-slate-200 hover:text-white transition-all cursor-pointer"
              >
                BACK
                <span className="sr-only">Previous</span>
              </button>
            )}

            <button
              type="button"
              onClick={nextTourStep}
              aria-label={isLastStep ? 'Get Started' : 'Next Step'}
              className="px-3.5 py-1 rounded bg-white text-black hover:bg-slate-200 text-xs font-mono font-bold uppercase transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {isLastStep ? 'DONE' : 'NEXT'}
              <span className="sr-only">{isLastStep ? 'Get Started 🚀' : 'Next Step'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
});
