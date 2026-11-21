// ============================================================
// src/App.tsx
// Thin AppShell Router and Layout Orchestrator
// Per ARCHITECTURE_PATTERNS.md §2.1 & ACCESSIBILITY.md §2
// ============================================================

import { memo } from 'react';
import { AppContextProvider, useAppContext } from '@/context/AppContext';
import { TabId } from '@/types';
import { Header } from '@/components/Navigation/Header';
import { AlertBanner } from '@/components/shared/AlertBanner';
import { GuidedTourModal } from '@/components/Tour/GuidedTourModal';
import { AirTelemetryDashboard } from '@/components/Dashboard/AirTelemetryDashboard';
import { DailyRoutineOptimizer } from '@/components/Routine/DailyRoutineOptimizer';
import { TransitPlanner } from '@/components/Transit/TransitPlanner';
import { IAQCenter } from '@/components/IAQ/IAQCenter';
import { CommunityHub } from '@/components/Community/CommunityHub';

const AppShell = memo(function AppShell() {
  const { activeTab, alerts, dismissAlert, accessibilityMode } = useAppContext();

  return (
    <div
      className={`min-h-screen bg-[#060913] text-slate-100 flex flex-col justify-between relative selection:bg-emerald-500/30 selection:text-emerald-200 ${
        accessibilityMode === 'high-contrast' ? 'contrast-125' : ''
      }`}
    >
      {/* Background ambient light orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-glow" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-20 left-1/3 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* 1. Header with Tab Navigation */}
      <Header />

      {/* 2. Global Alert Banner Overlay */}
      <AlertBanner alerts={alerts} onDismiss={dismissAlert} />

      {/* 3. Interactive Guided Walkthrough Modal */}
      <GuidedTourModal />

      {/* 4. Primary Semantic Landmark Viewport */}
      <main
        id="main-content"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={-1}
        className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 focus:outline-none"
      >
        {activeTab === TabId.Dashboard && <AirTelemetryDashboard />}
        {activeTab === TabId.Routine && <DailyRoutineOptimizer />}
        {activeTab === TabId.Transit && <TransitPlanner />}
        {activeTab === TabId.IAQ && <IAQCenter />}
        {activeTab === TabId.Community && <CommunityHub />}
      </main>

      {/* 5. Footer Landmark */}
      <footer
        aria-label="Application footer"
        className="border-t border-slate-800/80 bg-[#060913]/90 backdrop-blur-xl py-6 text-xs text-slate-500 mt-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-300">SaansIQ</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">WCAG 2.2 Level AA Compliant</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">EPA Breakpoints Standardized</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Server-side Gemini 3.1 Flash Lite
            </span>
            <span className="text-slate-600">•</span>
            <span>Zero-Trust Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
});

export default function App() {
  return (
    <AppContextProvider>
      <AppShell />
    </AppContextProvider>
  );
}
