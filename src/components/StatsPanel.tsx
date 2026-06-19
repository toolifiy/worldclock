import React, { useMemo } from 'react';
import { Lap } from '../types';
import { Award, TrendingUp, Activity, ClipboardMinus } from 'lucide-react';

interface StatsPanelProps {
  laps: Lap[];
  formatTime: (ms: number) => string;
}

export default function StatsPanel({ laps, formatTime }: StatsPanelProps) {
  const stats = useMemo(() => {
    if (laps.length === 0) return null;

    const totalLaps = laps.length;
    const totalDuration = laps.reduce((sum, lap) => sum + lap.durationMs, 0);
    const averageMs = totalDuration / totalLaps;

    let fastest = laps[0];
    let slowest = laps[0];

    laps.forEach((lap) => {
      if (lap.durationMs < fastest.durationMs) {
        fastest = lap;
      }
      if (lap.durationMs > slowest.durationMs) {
        slowest = lap;
      }
    });

    return {
      totalLaps,
      totalDuration,
      averageMs,
      fastest: totalLaps > 0 ? fastest : null,
      slowest: totalLaps > 1 ? slowest : null, // Only show slowest if 2+ laps exist
    };
  }, [laps]);

  if (!stats) {
    return (
      <div className="bg-slate-900/20 border border-slate-900/60 rounded-3xl p-8 text-center" id="stats-placeholder">
        <Activity className="h-8 w-8 text-slate-700 mx-auto mb-3" />
        <p className="text-sm text-slate-500 font-display">No laps recorded yet</p>
        <p className="text-xs text-slate-600 mt-1">Start the stopwatch and click "Lap" to see live session metrics.</p>
      </div>
    );
  }

  // Find max lap time to normalize bars in the bar chart
  const maxLapDuration = Math.max(...laps.map(l => l.durationMs), 1);

  return (
    <div className="space-y-6" id="stats-panel">
      {/* Metrics Grids */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1: Average */}
        <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl" id="metric-avg">
          <div className="flex items-center justify-between text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            <span>Avg Lap</span>
            <Activity className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <div className="mt-2 text-lg font-mono font-bold text-slate-100 tracking-tight">
            {formatTime(stats.averageMs)}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Time per lap block</p>
        </div>

        {/* Metric 2: Fastest */}
        <div className="bg-slate-900/40 border border-emerald-500/10 p-4 rounded-2xl" id="metric-fastest">
          <div className="flex items-center justify-between text-[11px] text-emerald-500 uppercase tracking-wider font-mono">
            <span>Fastest</span>
            <Award className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 text-lg font-mono font-bold text-emerald-400 tracking-tight">
            {stats.fastest ? formatTime(stats.fastest.durationMs) : '—'}
          </div>
          <p className="text-[10px] text-emerald-500/70 mt-1">
            {stats.fastest ? `Lap #${stats.fastest.lapNumber}` : 'No data'}
          </p>
        </div>

        {/* Metric 3: Slowest */}
        <div className="bg-slate-900/40 border border-red-500/10 p-4 rounded-2xl" id="metric-slowest">
          <div className="flex items-center justify-between text-[11px] text-red-500 uppercase tracking-wider font-mono">
            <span>Slowest</span>
            <TrendingUp className="h-3.5 w-3.5 text-red-400" />
          </div>
          <div className="mt-2 text-lg font-mono font-bold text-red-400 tracking-tight">
            {stats.slowest ? formatTime(stats.slowest.durationMs) : formatTime(stats.fastest?.durationMs || 0)}
          </div>
          <p className="text-[10px] text-red-500/70 mt-1">
            {stats.slowest ? `Lap #${stats.slowest.lapNumber}` : `Lap #${stats.fastest?.lapNumber || 1}`}
          </p>
        </div>

        {/* Metric 4: Total Laps */}
        <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl" id="metric-total-laps">
          <div className="flex items-center justify-between text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            <span>Total Laps</span>
            <ClipboardMinus className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="mt-2 text-lg font-mono font-bold text-slate-100 tracking-tight">
            {stats.totalLaps}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Segments registered</p>
        </div>

      </div>

      {/* Visual Bar Timeline Graph */}
      <div className="bg-slate-900/20 border border-slate-900 p-5 rounded-2xl" id="visual-timeline-graph">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4 font-display flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
          Lap Speed Distribution Comparison
        </h4>
        <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
          {laps.slice().reverse().map((lap) => {
            const ratio = (lap.durationMs / maxLapDuration) * 100;
            const isFastest = stats.fastest?.id === lap.id;
            const isSlowest = stats.slowest?.id === lap.id;

            return (
              <div key={lap.id} className="flex items-center gap-3 text-xs" id={`chart-row-${lap.id}`}>
                <span className="w-10 font-mono text-slate-500">Lap {lap.lapNumber}</span>
                <div className="flex-1 h-4 bg-slate-900/80 rounded-sm relative overflow-hidden">
                  <div 
                    className={`h-full rounded-sm transition-all duration-500 ${
                      isFastest ? 'bg-emerald-500/30 border-r border-emerald-400' : 
                      isSlowest ? 'bg-red-500/30 border-r border-red-400' : 
                      'bg-indigo-500/20 border-r border-indigo-400/80'
                    }`}
                    style={{ width: `${Math.max(ratio, 3)}%` }}
                  />
                </div>
                <span className="w-18 text-right font-mono text-[11px] text-slate-400">
                  {formatTime(lap.durationMs)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
