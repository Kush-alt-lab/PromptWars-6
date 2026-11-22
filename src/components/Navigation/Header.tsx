// ============================================================
// src/components/Navigation/Header.tsx
// Refined Modern Header & Telemetry Ticker
// WCAG 2.2 Level AA & ARCHITECTURE_PATTERNS.md §2.1
// ============================================================

import { memo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { TabId, Language, AccessibilityMode } from '@/types';
import { TRANSLATIONS, TOUR_STEPS } from '@/lib/constants';

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
    alerts,
  } = useAppContext();

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const currentTourTab = isTourOpen && TOUR_STEPS[tourStepIndex] ? TOUR_STEPS[tourStepIndex].targetTab : null;
  const isLocationTourTarget = isTourOpen && (tourStepIndex === 2 || TOUR_STEPS[tourStepIndex]?.id === 'location');

  const tabs = [
    { id: TabId.Dashboard, label: t.tabDashboard || 'Air Telemetry', num: '01' },
    { id: TabId.Routine, label: t.tabRoutine || 'Routine Optimizer', num: '02' },
    { id: TabId.Transit, label: t.tabTransit || 'Low-Emission Transit', num: '03' },
    { id: TabId.IAQ, label: t.tabIAQ || 'Indoor Air & Hacks', num: '04' },
    { id: TabId.Community, label: t.tabCommunity || 'Community Action', num: '05' },
  ];

  return (
    <header
      aria-label="SaansIQ application header"
      className={`sticky top-0 transition-all duration-200 bg-[#07080a]/95 backdrop-blur-md border-b border-white/[0.08] ${
        isTourOpen ? 'z-[60]' : 'z-40'
      }`}
    >
      {/* Top Navbar Row */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand & Main Navigation Links */}
        <div className="flex items-center gap-6 xl:gap-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">💨</span>
            <span className="text-lg font-black tracking-widest text-white uppercase font-mono">
              SAANS
            </span>
            <span className="sr-only">SaansIQ</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300 border border-white/15">
              IQ
            </span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              LIVE
            </span>
          </div>

          {/* Primary Viewport Tabs (Desktop Tablist) */}
          <nav aria-label="Main application tabs" className="hidden lg:flex items-center gap-1">
            <div role="tablist" aria-label="Main navigation panels" className="flex items-center gap-1">
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
                    className={`relative flex items-center gap-2 px-3 py-1.5 text-xs tracking-wider transition-all rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-white ${
                      isTourHighlighted
                        ? 'text-white border-2 border-white bg-slate-900 font-bold ring-4 ring-white/30 scale-105 z-[65] shadow-2xl'
                        : isActive
                        ? 'text-white border-b-2 border-white font-bold bg-white/[0.04]'
                        : isTourOpen
                        ? 'text-slate-400 opacity-60 hover:opacity-100 hover:text-slate-200'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 font-normal">{tab.num}</span>
                    <span className="font-sans font-medium text-xs">{tab.label}</span>
                    {isTourHighlighted && (
                      <span className="px-1 py-0.2 rounded text-[8px] font-black uppercase bg-white text-black animate-pulse">
                        Tour Focus
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Right Navigation & Utility Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Location Badge */}
          <div
            id="tour-location-badge"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono tracking-wider transition-all ${
              isLocationTourTarget
                ? 'border-2 border-white ring-4 ring-white/30 bg-slate-900 text-white font-black z-[65]'
                : 'border-white/20 bg-white/[0.03] text-slate-200 hover:border-white/40'
            }`}
          >
            <span aria-hidden="true">📍</span>
            <span className="font-bold uppercase text-[11px]">{selectedZone.zoneName.split(' ')[0]}</span>
            <span className="text-[10px] text-slate-400">AQI {selectedZone.aqi}</span>
          </div>

          {/* Alerts Counter Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/15 text-xs text-slate-400 font-mono">
            <span aria-hidden="true">🔔</span>
            <span className="text-[11px] font-bold text-slate-300">ALERTS {alerts.length}</span>
          </div>

          {/* Quick Tour Trigger */}
          <button
            type="button"
            id="tour-nav-btn"
            onClick={() => openTour(0)}
            aria-label="Open guided walkthrough tour"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/20 hover:border-white text-xs font-mono uppercase text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <span aria-hidden="true">⊙</span>
            <span>TOUR</span>
          </button>

          {/* Language Selector */}
          <div className="hidden md:flex items-center bg-white/[0.04] rounded-lg px-2 py-1 border border-white/15">
            <label htmlFor="language-select" className="sr-only">Select Language</label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-[11px] text-slate-300 font-mono focus:outline-none cursor-pointer"
            >
              <option value={Language.English} className="bg-zinc-900 text-white">EN</option>
              <option value={Language.Hindi} className="bg-zinc-900 text-white">HI</option>
              <option value={Language.Arabic} className="bg-zinc-900 text-white">AR</option>
              <option value={Language.Spanish} className="bg-zinc-900 text-white">ES</option>
            </select>
          </div>

          {/* Accessibility Mode Selector */}
          <div className="hidden md:flex items-center bg-white/[0.04] rounded-lg px-2 py-1 border border-white/15">
            <label htmlFor="a11y-select" className="sr-only">Accessibility Mode</label>
            <select
              id="a11y-select"
              value={accessibilityMode}
              onChange={(e) => setAccessibilityMode(e.target.value as AccessibilityMode)}
              className="bg-transparent text-[11px] text-slate-300 font-mono focus:outline-none cursor-pointer"
            >
              <option value={AccessibilityMode.Standard} className="bg-zinc-900 text-white">STD</option>
              <option value={AccessibilityMode.HighContrast} className="bg-zinc-900 text-white">HIGH</option>
              <option value={AccessibilityMode.ReducedMotion} className="bg-zinc-900 text-white">CALM</option>
              <option value={AccessibilityMode.ScreenReader} className="bg-zinc-900 text-white">A11Y</option>
            </select>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => setActiveTab(TabId.Routine)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-black hover:bg-slate-200 text-xs font-bold tracking-wider uppercase font-mono transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <span>PLAN MY DAY</span>
            <span aria-hidden="true">&gt;</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Strip (When screen < lg) */}
      <div className="lg:hidden px-4 pb-2 pt-1 border-t border-white/[0.06] overflow-x-auto scrollbar-none">
        <nav aria-label="Mobile viewport links" className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                id={`tab-mobile-${tab.id}`}
                aria-label={`View ${tab.label}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 text-xs whitespace-nowrap rounded font-mono ${
                  isActive ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.num} {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sub-header Live News Ticker Bar */}
      <div className="border-t border-white/[0.06] bg-[#090a0d] py-1.5 px-4 text-xs font-mono overflow-hidden flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0 text-slate-400 text-[10px] font-black uppercase tracking-wider pr-3 border-r border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
          <span>AIR QUALITY NEWS</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap text-slate-400 text-[11px] leading-none flex-1">
          <div className="animate-ticker">
            <span>• Morning thermal inversion alert: particulate trap in northern industrial sector • Solar boundary window active 13:00 to 16:00 • Favor subterranean metro transit to minimize pulmonary particulate load • Live telemetry cross-checked across 5 independent municipal and atmospheric models •</span>
            <span className="ml-8">• Code Orange winter smog advisories • Seal window latches during inversion hours •</span>
          </div>
        </div>
      </div>
    </header>
  );
});
