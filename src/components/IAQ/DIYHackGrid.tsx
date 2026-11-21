// ============================================================
// src/components/IAQ/DIYHackGrid.tsx
// Low-Cost & DIY Indoor Air Purification Hack Cards
// ============================================================

import { memo } from 'react';
import { DIY_HACKS } from '@/lib/constants';

export const DIYHackGrid = memo(function DIYHackGrid() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <span aria-hidden="true">💡</span> Low-Cost & DIY Indoor Air Purification Hacks
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Peer-reviewed open-source solutions proven to deliver high CADR at minimal household expense.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {DIY_HACKS.map((hack) => (
          <div
            key={hack.id}
            className="glass-card rounded-2xl p-6 flex flex-col justify-between gap-4 border border-slate-800/80 hover:border-slate-700/80"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-black text-white text-base tracking-tight">{hack.title}</h4>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  {hack.costRating}
                </span>
              </div>
              <div className="text-xs text-emerald-400 font-bold mt-1.5 flex items-center gap-1.5">
                <span>Clean Air Output:</span>
                <span className="font-mono">{hack.cadrDelivery}</span>
              </div>
              <div className="text-xs text-slate-300 mt-2.5">
                <strong className="text-slate-100">Materials:</strong> {hack.materials}
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {hack.instructions}
              </p>
            </div>

            <div className="pt-3.5 border-t border-slate-800/80 text-xs text-cyan-400 font-semibold flex items-center gap-1.5">
              <span>🎯</span>
              <span>{hack.efficiencyBonus}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
