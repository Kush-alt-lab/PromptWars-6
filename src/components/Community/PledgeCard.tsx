// ============================================================
// src/components/Community/PledgeCard.tsx
// Community pledge card with participation progress bar
// ============================================================

import { memo } from 'react';
import type { CommunityPledge } from '@/types';

interface PledgeCardProps {
  pledge: CommunityPledge;
  onToggle: (id: string) => void;
  pledgedLabel: string;
  pledgeNowLabel: string;
}

export const PledgeCard = memo(function PledgeCard({
  pledge,
  onToggle,
  pledgedLabel,
  pledgeNowLabel,
}: PledgeCardProps) {
  const progress = Math.min(
    100,
    Math.round((pledge.currentParticipants / pledge.targetParticipants) * 100)
  );

  return (
    <div
      className={`p-6 rounded-3xl border flex flex-col justify-between gap-5 transition-all duration-200 ${
        pledge.userPledged
          ? 'bg-slate-900/90 border-emerald-500/70 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/40'
          : 'glass-card border-slate-800/80 hover:border-slate-700/80'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-black text-white text-base tracking-tight leading-snug">
            {pledge.title}
          </h4>
          {pledge.userPledged && (
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-950">
              {pledgedLabel}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
          {pledge.impactDescription}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between text-xs text-slate-400">
          <span>
            Participation: <strong className="text-white font-mono">{pledge.currentParticipants}</strong> / {pledge.targetParticipants} households
          </span>
          <span className="font-black text-emerald-400 font-mono">{progress}%</span>
        </div>

        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={pledge.currentParticipants}
            aria-valuemin={0}
            aria-valuemax={pledge.targetParticipants}
            aria-label={`${pledge.title} progress`}
          />
        </div>

        <div className="flex items-center justify-between pt-3.5 border-t border-slate-800/80 mt-1">
          <span className="text-xs text-slate-400">
            Est. Relief: <strong className="text-slate-200">~{pledge.estimatedEmissionReductionKg} kg CO₂ / wk</strong>
          </span>

          <button
            type="button"
            onClick={() => onToggle(pledge.id)}
            aria-pressed={pledge.userPledged}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer ${
              pledge.userPledged
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110 shadow-md shadow-emerald-950/40 active:scale-95'
            }`}
          >
            {pledge.userPledged ? 'Cancel Pledge' : pledgeNowLabel}
          </button>
        </div>
      </div>
    </div>
  );
});
