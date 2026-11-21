// ============================================================
// src/components/IAQ/IAQCenter.tsx
// Indoor Air Quality (IAQ), Room CADR Calculator, and Low-Cost DIY Hack Center
// Per PROBLEM_ALIGNMENT.md §1.4 & EFFICIENCY.md §2
// ============================================================

import { memo, useState, useMemo, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  calculateRoomVolume,
  calculateRequiredCADR,
  estimatePurificationTime,
} from '@/lib/aqiCompute';
import { WindowSchedule } from './WindowSchedule';
import { DIYHackGrid } from './DIYHackGrid';

export const IAQCenter = memo(function IAQCenter() {
  const { rooms, updateRoom, selectedZone } = useAppContext();
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0].roomId);

  const activeRoom = useMemo(() => {
    return rooms.find((r) => r.roomId === selectedRoomId) || rooms[0];
  }, [rooms, selectedRoomId]);

  const roomVolumeM3 = useMemo(() => {
    return calculateRoomVolume(activeRoom.areaSqMeters, activeRoom.ceilingHeightMeters);
  }, [activeRoom.areaSqMeters, activeRoom.ceilingHeightMeters]);

  const requiredCadrM3H = useMemo(() => {
    return calculateRequiredCADR(roomVolumeM3, 4);
  }, [roomVolumeM3]);

  const effectiveAch = useMemo(() => {
    if (activeRoom.purifierCadrM3H <= 0) return 0.3;
    return Math.round((activeRoom.purifierCadrM3H / roomVolumeM3) * 10) / 10;
  }, [activeRoom.purifierCadrM3H, roomVolumeM3]);

  const purificationTimeMins = useMemo(() => {
    if (activeRoom.purifierCadrM3H <= 0) return 999;
    return estimatePurificationTime(roomVolumeM3, activeRoom.purifierCadrM3H, 0.8);
  }, [roomVolumeM3, activeRoom.purifierCadrM3H]);

  const cadrDeficit = useMemo(() => {
    return Math.max(0, requiredCadrM3H - activeRoom.purifierCadrM3H);
  }, [requiredCadrM3H, activeRoom.purifierCadrM3H]);

  const handleAreaChange = useCallback(
    (area: number) => {
      updateRoom(activeRoom.roomId, { areaSqMeters: Math.max(4, area) });
    },
    [activeRoom.roomId, updateRoom]
  );

  const handleCadrChange = useCallback(
    (cadr: number) => {
      updateRoom(activeRoom.roomId, {
        purifierCadrM3H: Math.max(0, cadr),
        hasAirPurifier: cadr > 0,
      });
    },
    [activeRoom.roomId, updateRoom]
  );

  return (
    <section aria-label="Indoor Air Quality and Low-Cost Hack Center" className="flex flex-col gap-8 fade-in">
      {/* CADR Calculator & Room Profile */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              Clean Air Delivery Rate (CADR) System
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 mt-1">
            <span aria-hidden="true">💨</span> Room CADR & Indoor Air Quality (IAQ) Calculator
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Calculate Clean Air Delivery Rate (CADR) requirements, air changes per hour (ACH), and purification duration to protect your living spaces from PM2.5 infiltration.
          </p>
        </div>

        {/* Room Tab Selection */}
        <div className="flex flex-wrap gap-2.5">
          {rooms.map((room) => {
            const isSelected = room.roomId === selectedRoomId;
            return (
              <button
                key={room.roomId}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedRoomId(room.roomId)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800/80'
                }`}
              >
                {room.roomName}
              </button>
            );
          })}
        </div>

        {/* Room Parameters & Live Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-5 shadow-inner">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <label htmlFor="room-area-range">Floor Area:</label>
                <span className="text-emerald-400 font-mono font-black text-sm">{activeRoom.areaSqMeters} m²</span>
              </div>
              <input
                id="room-area-range"
                type="range"
                min="6"
                max="80"
                step="1"
                value={activeRoom.areaSqMeters}
                onChange={(e) => handleAreaChange(parseFloat(e.target.value))}
                className="w-full mt-2.5 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <label htmlFor="room-cadr-range">Purifier Clean Air Delivery Rate (CADR):</label>
                <span className="text-cyan-400 font-mono font-black text-sm">{activeRoom.purifierCadrM3H} m³/h</span>
              </div>
              <input
                id="room-cadr-range"
                type="range"
                min="0"
                max="600"
                step="20"
                value={activeRoom.purifierCadrM3H}
                onChange={(e) => handleCadrChange(parseFloat(e.target.value))}
                className="w-full mt-2.5 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Diagnostic Metrics Display */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Target CADR (4 ACH)
              </span>
              <div className="text-2xl font-black text-white mt-2 font-mono">
                {requiredCadrM3H} <span className="text-xs font-sans text-slate-400 font-normal">m³/h</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Volume: {roomVolumeM3} m³ ({activeRoom.ceilingHeightMeters}m ceiling).
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Effective Air Changes
              </span>
              <div className="text-2xl font-black text-emerald-400 mt-2 font-mono">
                {effectiveAch} <span className="text-xs font-sans text-slate-400 font-normal">ACH</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-2">
                {effectiveAch >= 4
                  ? '✅ Meets hospital-grade clean room target.'
                  : '⚠️ Sub-optimal air recycling rate.'}
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                80% Clean Time
              </span>
              <div className="text-2xl font-black text-cyan-400 mt-2 font-mono">
                {purificationTimeMins > 120 ? 'No Purifier' : `${purificationTimeMins} mins`}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Time required to filter out airborne ambient particles.
              </p>
            </div>
          </div>
        </div>

        {cadrDeficit > 0 && (
          <div className="bg-gradient-to-r from-amber-950/60 to-red-950/40 border border-amber-500/50 rounded-2xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 rounded-xl bg-amber-900/40 border border-amber-500/40" aria-hidden="true">🛠️</span>
              <div>
                <strong>CADR Deficit Detected:</strong> Your current setup is short by{' '}
                <strong className="text-white font-mono">{cadrDeficit} m³/h</strong>.
                Build a low-cost DIY Corsi-Rosenthal Box to achieve full 4 ACH protection!
              </div>
            </div>
          </div>
        )}
      </div>

      <WindowSchedule currentAqi={selectedZone.aqi} />
      <DIYHackGrid />
    </section>
  );
});
