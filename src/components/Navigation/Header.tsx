// ============================================================
// src/components/Navigation/Header.tsx
// Modern Glassmorphic Application Header & Segmented Tab Navigation
// Per WCAG 2.2 Level AA & ARCHITECTURE_PATTERNS.md §2.1
// ============================================================

import { memo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { TabId, Language, AccessibilityMode } from '@/types';
import { TRANSLATIONS, TOUR_STEPS } from '@/lib/constants';
import { getAQIColor } from '@/lib/aqiCompute';

export const Header = memo(function Header() {
  const {
    activeTab,
    setActiveTab,
    selectedZone,
    language,
    setLanguage,
    accessibilityMode,
    setAccessibilityMode,
    openTour,
    isTourOpen,
    tourStepIndex,
  } = useAppContext();

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const aqiColor = getAQIColor(selectedZone.aqi);
  const currentTourTab = isTourOpen && TOUR_STEPS[tourStepIndex] ? TOUR_STEPS[tourStepIndex].targetTab : null;

  const tabs = [
    { id: TabId.Dashboard, label: t.tabDashboard || 'Air Telemetry', icon: '📡' },
    { id: TabId.Routine, label: t.tabRoutine || 'Routine Optimizer', icon: '⏰' },
    { id: TabId.Transit, label: t.tabTransit || 'Low-Emission Transit', icon: '🚇' },
    { id: TabId.IAQ, label: t.tabIAQ || 'Indoor Air & Hacks', icon: '🌿' },
    { id: TabId.Community, label: t.tabCommunity || 'Community Action', icon: '🤝' },
  ];

  return (
    <header
      aria-label="SaansIQ application header"
      className="sticky top-0 z-40 bg-[#060913]/85 backdrop-blur-2xl border-b border-slate-800/80 shadow-2xl shadow-black/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Telemetry Indicator */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#0c1222] rounded-[14px] flex items-center justify-center text-xl">
                🛡️
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#060913] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-base font-black text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
                {t.appTitle || 'SaansIQ'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              {t.appSubtitle || 'Urban Air Quality & Smog Public Health Assistant'}
            </p>
          </div>
        </div>

        {/* Selected Zone Quick Telemetry & Control Badges */}
        <div className="flex items-center gap-3">
          <div
            className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border bg-slate-900/90 text-xs shadow-inner backdrop-blur-md"
            style={{ borderColor: `${aqiColor}50` }}
          >
            <span className="text-slate-400 font-medium">{selectedZone.zoneName}:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: aqiColor }} />
              <span className="font-black text-white tracking-tight" style={{ color: aqiColor }}>
                AQI {selectedZone.aqi}
              </span>
            </div>
          </div>

          {/* Interactive Guided Tour Trigger */}
          <button
            type="button"
            onClick={() => openTour(0)}
            aria-label="Open guided walkthrough tour"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border border-emerald-500/50 text-emerald-300 hover:from-emerald-900/90 hover:to-teal-900/90 hover:text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer active:scale-95"
          >
            <span aria-hidden="true">✨</span>
            <span className="hidden sm:inline">Guided Tour</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 rounded-xl px-2.5 py-1 border border-slate-700/60 shadow-sm hover:border-slate-600 transition-all">
            <label htmlFor="language-select" className="sr-only">
              Select Language
            </label>
            <span className="text-xs text-slate-400" aria-hidden="true">🌐</span>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-xs text-slate-200 font-semibold py-0.5 rounded-lg focus:outline-none cursor-pointer"
            >
              <option value={Language.English} className="bg-slate-900 text-white">English (EN)</option>
              <option value={Language.Hindi} className="bg-slate-900 text-white">हिन्दी (HI)</option>
              <option value={Language.Arabic} className="bg-slate-900 text-white">العربية (AR)</option>
              <option value={Language.Spanish} className="bg-slate-900 text-white">Español (ES)</option>
            </select>
          </div>

          {/* Accessibility Mode Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 rounded-xl px-2.5 py-1 border border-slate-700/60 shadow-sm hover:border-slate-600 transition-all">
            <label htmlFor="a11y-select" className="sr-only">
              Accessibility Mode
            </label>
            <span className="text-xs text-slate-400" aria-hidden="true">♿</span>
            <select
              id="a11y-select"
              value={accessibilityMode}
              onChange={(e) => setAccessibilityMode(e.target.value as AccessibilityMode)}
              className="bg-transparent text-xs text-slate-300 font-medium py-0.5 rounded-lg focus:outline-none cursor-pointer"
            >
              <option value={AccessibilityMode.Standard} className="bg-slate-900 text-white">Default Mode</option>
              <option value={AccessibilityMode.HighContrast} className="bg-slate-900 text-white">High Contrast</option>
              <option value={AccessibilityMode.ReducedMotion} className="bg-slate-900 text-white">Reduced Motion</option>
              <option value={AccessibilityMode.ScreenReader} className="bg-slate-900 text-white">Screen Reader</option>
            </select>
          </div>
        </div>
      </div>

      {/* Modern Segmented Pill Tab Dock */}
      <nav aria-label="Main application tabs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <div
          role="tablist"
          aria-label="Main navigation panels"
          className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-2xl border border-slate-800/80 overflow-x-auto scrollbar-none"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isTourHighlighted = isTourOpen && currentTourTab === tab.id;

            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isTourHighlighted
                    ? 'text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-xl shadow-emerald-500/40 ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#060913] scale-105 z-20 font-black'
                    : isActive
                    ? 'text-white bg-gradient-to-r from-emerald-600/90 to-teal-600/90 shadow-md shadow-emerald-950/50 border border-emerald-400/30'
                    : isTourOpen
                    ? 'text-slate-500 opacity-60 hover:opacity-100 hover:text-slate-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span className="text-sm" aria-hidden="true">{tab.icon}</span>
                <span>{tab.label}</span>
                {isTourHighlighted && (
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-slate-950/90 text-emerald-300 border border-emerald-400/60 animate-pulse ml-0.5">
                    Tour Focus
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
});
