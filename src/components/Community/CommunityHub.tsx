// ============================================================
// src/components/Community/CommunityHub.tsx
// Neighborhood collective pledges, live emission offsets, and multilingual advisories
// Per PROBLEM_ALIGNMENT.md §1.5 & ACCESSIBILITY.md §7
// ============================================================

import { memo, useState, useMemo, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { calculateCommunityOffset } from '@/lib/aqiCompute';
import { apiService } from '@/services/apiService';
import { TRANSLATIONS } from '@/lib/constants';
import { PledgeCard } from './PledgeCard';

export const CommunityHub = memo(function CommunityHub() {
  const {
    pledges,
    togglePledge,
    alerts,
    dismissAlert,
    selectedZone,
    language,
  } = useAppContext();

  const [aiAdvisory, setAiAdvisory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const collectiveMetrics = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of pledges) {
      counts[p.category] = p.currentParticipants;
    }
    return calculateCommunityOffset(counts);
  }, [pledges]);

  const handleGenerateAdvisory = useCallback(async () => {
    setIsGenerating(true);
    try {
      const advisory = await apiService.generateEmergencyAdvisory(selectedZone, language);
      setAiAdvisory(advisory);
    } catch {
      setAiAdvisory(
        `URGENT NOTICE for ${selectedZone.zoneName}: AQI is ${selectedZone.aqi}. Please activate indoor filtration, seal doors, and assist vulnerable neighbors.`
      );
    } finally {
      setIsGenerating(false);
    }
  }, [selectedZone, language]);

  return (
    <section aria-label="Community Action and Collective Impact Hub" className="flex flex-col gap-8 fade-in">
      {/* Top Collective Impact KPI Banner */}
      <div className="glass-panel border-emerald-500/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              Collective Neighborhood Resilience Impact
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight">
            Community Smog Abatement Dashboard
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            When neighbors coordinate emission curbs—eliminating open biomass burning, coordinating electric carpools, and wet-sweeping streets—local PM2.5 levels decrease by up to 28%.
          </p>
        </div>

        <div className="flex gap-4 relative z-10">
          <div className="glass-card p-5 text-center min-w-[145px] rounded-2xl border border-emerald-500/40 bg-slate-900/90 shadow-lg shadow-emerald-950/20">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">CO₂ Prevented</span>
            <div className="text-3xl font-black text-emerald-400 mt-1.5 font-mono">
              {collectiveMetrics.totalCo2Kg} <span className="text-xs font-sans text-slate-400 font-normal">kg</span>
            </div>
          </div>

          <div className="glass-card p-5 text-center min-w-[145px] rounded-2xl border border-cyan-500/40 bg-slate-900/90 shadow-lg shadow-cyan-950/20">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">PM2.5 Averted</span>
            <div className="text-3xl font-black text-cyan-400 mt-1.5 font-mono">
              {collectiveMetrics.totalPm25Grams} <span className="text-xs font-sans text-slate-400 font-normal">g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Smog Hazard Advisories & AI Generator */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span aria-hidden="true">📢</span> Multilingual Emergency Smog Advisories
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Live automated broadcast generation for neighborhood associations and public safety broadcast.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateAdvisory}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl text-xs font-black tracking-wide bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110 transition-all shadow-md shadow-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {isGenerating ? 'Synthesizing Broadcast…' : 'Generate Localized Advisory'}
          </button>
        </div>

        {aiAdvisory && (
          <div
            role="region"
            aria-label="Generated community advisory"
            className={`p-5 bg-slate-950/70 border border-slate-800 rounded-2xl text-slate-100 text-sm leading-relaxed shadow-inner ${
              language === 'ar' ? 'font-arabic text-right' : ''
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
              <span aria-hidden="true">📡</span>
              <span>Official Air Resilience Broadcast ({language.toUpperCase()}):</span>
            </div>
            <p>{aiAdvisory}</p>
          </div>
        )}

        {/* Community AQI Alert Banners */}
        <div className="flex flex-col gap-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              role="alert"
              aria-live="assertive"
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                alert.severity === 'emergency'
                  ? 'bg-gradient-to-r from-red-950/40 to-slate-900/80 border-red-500/50 text-red-200'
                  : 'bg-gradient-to-r from-amber-950/40 to-slate-900/80 border-amber-500/50 text-amber-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <span className="text-xl p-2 rounded-xl bg-black/20" aria-hidden="true">
                  {alert.severity === 'emergency' ? '🚨' : '⚠️'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
                      {alert.zone}
                    </span>
                    <h4 className="font-black text-sm text-white tracking-tight">{alert.headline}</h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.instructions}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => dismissAlert(alert.id)}
                className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 self-end sm:self-center focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
              >
                Acknowledge
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Community Action Pledges Grid */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span aria-hidden="true">🤝</span> Neighborhood Emission Reduction Pledges
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Join collective community pacts to eliminate localized winter pollution hotspots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pledges.map((pledge) => (
            <PledgeCard
              key={pledge.id}
              pledge={pledge}
              onToggle={togglePledge}
              pledgedLabel={t.pledged || 'Pledged Active'}
              pledgeNowLabel={t.pledgeNow || 'Take the Pledge'}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
