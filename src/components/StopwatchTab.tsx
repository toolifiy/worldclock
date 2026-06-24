import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Download, 
  Copy, 
  Check, 
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Lap, TimerStatus } from '../types';
import { audioEngine } from './AudioEngine';
import StatsPanel from './StatsPanel';
import AdBanner from './AdBanner';

interface StopwatchTabProps {
  soundEnabled: boolean;
  shortcutsEnabled: boolean;
  activeTab: string;
}

export default function StopwatchTab({ soundEnabled, shortcutsEnabled, activeTab }: StopwatchTabProps) {
  // Timer Core States
  const [time, setTime] = useState<number>(0);
  const [status, setStatus] = useState<TimerStatus>('IDLE');
  const [laps, setLaps] = useState<Lap[]>([]);

  // UI States
  const [copied, setCopied] = useState<boolean>(false);

  // High-precision refs to prevent interval drifting
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastTickSecondRef = useRef<number>(-1);

  // High-precision animation frame tick loop
  const tick = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const currentOverall = accumulatedTimeRef.current + elapsed;
    setTime(currentOverall);

    // Audio click ticker (plays once per second when the second changes)
    if (soundEnabled) {
      const currentSecond = Math.floor(currentOverall / 1000);
      if (currentSecond > lastTickSecondRef.current) {
        audioEngine.playTick();
        lastTickSecondRef.current = currentSecond;
      }
    }
    
    rafRef.current = requestAnimationFrame(tick);
  }, [soundEnabled]);

  // Start / Pause timer toggle
  const toggleTimer = useCallback(() => {
    if (status === 'RUNNING') {
      // Pause
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      accumulatedTimeRef.current += Date.now() - startTimeRef.current;
      setStatus('PAUSED');
      if (soundEnabled) audioEngine.playBeep();
    } else {
      // Start or Resume
      startTimeRef.current = Date.now();
      setStatus('RUNNING');
      lastTickSecondRef.current = Math.floor(accumulatedTimeRef.current / 1000);
      rafRef.current = requestAnimationFrame(tick);
      if (soundEnabled) audioEngine.playBeep();
    }
  }, [status, tick, soundEnabled]);

  // Record a Lap Split
  const recordLap = useCallback(() => {
    const overallElapsed = accumulatedTimeRef.current + (status === 'RUNNING' ? Date.now() - startTimeRef.current : 0);
    
    // Calculate split offset boundaries
    const previousCumulative = laps.length > 0 ? laps[laps.length - 1].cumulativeMs : 0;
    const lapDuration = overallElapsed - previousCumulative;

    if (lapDuration <= 0 && laps.length > 0) return; // Prevent logging duplicate frame timestamps

    const newLap: Lap = {
      id: Math.random().toString(36).substring(2, 9),
      lapNumber: laps.length + 1,
      durationMs: lapDuration,
      cumulativeMs: overallElapsed,
      timestamp: Date.now()
    };

    setLaps(prev => [...prev, newLap]);

    if (soundEnabled) {
      audioEngine.playLap();
    }
  }, [laps, status, soundEnabled]);

  // Full hard Reset
  const resetTimer = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;
    setTime(0);
    setLaps([]);
    setStatus('IDLE');
    lastTickSecondRef.current = -1;
    if (soundEnabled) audioEngine.playBeep();
  }, [soundEnabled]);

  // Clear single specific lap from history
  const deleteLap = (id: string) => {
    setLaps(prev => {
      const filtered = prev.filter(l => l.id !== id);
      // Recalculate lap index numbers & durations to keep sequence logical
      let accumulated = 0;
      return filtered.map((l, index) => {
        const lapNum = index + 1;
        accumulated += l.durationMs;
        return {
          ...l,
          lapNumber: lapNum,
          cumulativeMs: accumulated
        };
      });
    });
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!shortcutsEnabled || activeTab !== 'STOPWATCH') return;
      
      // Strict ignore when user is actively writing a note in input fields
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          toggleTimer();
          break;
        case 'KeyL':
          e.preventDefault();
          if (status !== 'IDLE') {
            recordLap();
          }
          break;
        case 'KeyR':
          e.preventDefault();
          resetTimer();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcutsEnabled, toggleTimer, recordLap, resetTimer, status, activeTab]);

  // Cleanup tick frame on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Clean formatted clock layout calculations
  const timeUnits = useMemo(() => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10); // Display 2-digit centiseconds for rapid aesthetic rhythm

    const pad = (num: number, size: number = 2) => num.toString().padStart(size, '0');

    return {
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
      milliseconds: pad(milliseconds)
    };
  }, [time]);

  // CSV Exporter
  const exportCSV = () => {
    if (laps.length === 0) return;
    
    const headers = ['Lap #', 'Lap Duration (ms)', 'Lap Duration (Formatted)', 'Cumulative Duration (Formatted)'];
    
    const pad = (num: number, size: number = 2) => num.toString().padStart(size, '0');
    const displayTimeStr = (ms: number) => {
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      const mil = Math.floor((ms % 1000));
      return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(mil, 3)}`;
    };

    const rows = laps.map(lap => [
      lap.lapNumber,
      lap.durationMs,
      displayTimeStr(lap.durationMs),
      displayTimeStr(lap.cumulativeMs)
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" // UTF-8 BOM definition for Excel
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `stopwatch_timesheet_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clipboard Copier (as formatted Markdown for Jira/GitHub/Word)
  const copyMarkdownTable = () => {
    if (laps.length === 0) return;
    
    const pad = (num: number, size: number = 2) => num.toString().padStart(size, '0');
    const displayTimeStr = (ms: number) => {
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      const mil = Math.floor((ms % 1000));
      return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(mil, 3)}`;
    };

    let table = `### Online Stopwatch - Tracked Productivity Session Logs\n\n`;
    table += `| Lap # | Segment Lap Time | Cumulative Running Timestamps |\n`;
    table += `| :---: | :---: | :---: |\n`;
    
    laps.forEach(lap => {
      table += `| **${lap.lapNumber}** | \`${displayTimeStr(lap.durationMs)}\` | \`${displayTimeStr(lap.cumulativeMs)}\` |\n`;
    });

    table += `\n*Session Tracked Dynamically with Online Stopwatch Utility.*`;

    navigator.clipboard.writeText(table).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Helper inside renderer for list rendering
  const formatMsToString = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000));

    const pad = (num: number, size: number = 2) => num.toString().padStart(size, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
  };

  // Sweep SVG Offset progress calculations (Represent fractional milliseconds of a single minute)
  const circularProgressOffset = useMemo(() => {
    const oneSecFraction = (time % 60000) / 60000;
    const r = 120;
    const circumference = 2 * Math.PI * r; // ~753.98
    return circumference - (oneSecFraction * circumference);
  }, [time]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="stopwatch-tab-view">
      
      {/* LEFT: Central high-precision visual stopwatch clock (Column Span 5) */}
      <div className="lg:col-span-5 flex flex-col items-center gap-6 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 sm:p-8" id="stopwatch-canvas-panel">
        
        {/* Radial ticking stopwatch Dial visualization */}
        <div className="relative h-64 w-64 sm:h-72 sm:w-72 flex items-center justify-center bg-slate-950/80 rounded-full border border-indigo-500/10 shadow-2xl shadow-indigo-600/5" id="stopwatch-dial">
          {/* Neon backlighting blur */}
          <div className="absolute inset-4 rounded-full bg-indigo-500/2 blur-xl" />
          
          {/* Radial progress visual border track */}
          <svg className="absolute inset-0 h-full w-full rotate-[-90deg]" viewBox="0 0 260 260">
            {/* Background passive circle */}
            <circle 
              cx="130" 
              cy="130" 
              r="120" 
              className="stroke-slate-900 fill-none" 
              strokeWidth="2.5" 
            />
            {/* Active sweep dynamic circle overlay */}
            <motion.circle 
              cx="130" 
              cy="130" 
              r="120" 
              className="stroke-indigo-500 fill-none drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
              strokeWidth="3.5" 
              strokeLinecap="round"
              initial={{ strokeDasharray: 2 * Math.PI * 120, strokeDashoffset: 2 * Math.PI * 120 }}
              animate={{ strokeDashoffset: circularProgressOffset }}
              transition={{ 
                duration: status === 'RUNNING' ? 0.016 : 0.3, 
                ease: "linear" 
              }}
              style={{
                strokeDasharray: 2 * Math.PI * 120,
                transformOrigin: 'center',
                transform: 'translate3d(0, 0, 0)'
              }}
            />
          </svg>

          {/* Digital Time Numerals */}
          <div className="text-center z-10 select-all" id="time-numeric-display">
            <span className={`block font-mono text-xs uppercase tracking-widest font-bold mb-1 ${
              status === 'RUNNING' ? 'text-emerald-400' :
              status === 'PAUSED' ? 'text-amber-500 font-medium' : 'text-slate-500 font-medium'
            }`}>
              {status}
            </span>
            
            {/* Micro timing ticks representation */}
            <div className="flex justify-center items-baseline font-mono font-medium select-text">
              <span className={`text-4xl sm:text-5xl tracking-tight text-slate-100 ${
                status === 'RUNNING' ? 'glow-active' : status === 'PAUSED' ? 'glow-paused' : ''
              }`}>
                {timeUnits.hours !== '00' ? `${timeUnits.hours}:` : ''}
                {timeUnits.minutes}:{timeUnits.seconds}
              </span>
              <span className={`text-xl sm:text-2xl ml-1 font-light ${
                status === 'RUNNING' ? 'text-indigo-400' : 
                status === 'PAUSED' ? 'text-amber-400' : 'text-slate-500'
              }`}>
                .{timeUnits.milliseconds}
              </span>
            </div>
            
            {/* Visual indicator of fraction of minute elapsed */}
            <span className="block text-[10px] text-slate-600 font-mono mt-2 uppercase tracking-wide">
              {(time / 1000).toFixed(1)}s seconds
            </span>
          </div>
        </div>

        {/* Core Action Trigger Controls */}
        <div className="w-full flex justify-center items-center gap-3 mt-3 animate-fade-in" id="action-trigger-row">
          {/* Reset Trigger */}
          <button 
            onClick={resetTimer}
            disabled={status === 'IDLE'}
            className={`rounded-xl border border-slate-900 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-all font-medium flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-slate-950 ${
              status === 'IDLE' 
                ? 'flex-[0.7] py-2 px-2 text-[11px] opacity-20 scale-95' 
                : 'flex-1 py-3.5 px-4 text-sm'
            }`}
            id="stopwatch-btn-reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          {/* Toggle Start / Pause */}
          <button 
            onClick={toggleTimer}
            className={`rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
              status === 'IDLE' 
                ? 'flex-[1.6] py-4 px-6 text-base bg-indigo-600 hover:bg-indigo-500 text-slate-100 shadow-xl shadow-indigo-600/30 scale-105 font-bold' 
                : status === 'RUNNING' 
                  ? 'flex-1 py-3.5 px-5 bg-amber-600 hover:bg-amber-500 text-slate-950 text-sm shadow-amber-600/10' 
                  : 'flex-1 py-3.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-slate-100 text-sm shadow-indigo-600/15 font-bold'
            }`}
            id="stopwatch-btn-toggle"
          >
            {status === 'RUNNING' ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>{status === 'PAUSED' ? 'Resume' : 'Start'}</span>
              </>
            )}
          </button>

          {/* Record Split / Lap */}
          <motion.button 
            whileTap={status === 'IDLE' ? undefined : { scale: 0.93 }}
            onClick={recordLap}
            disabled={status === 'IDLE'}
            className={`rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 border border-emerald-500/30 text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-150 shadow-md shadow-emerald-600/10 ${
              status === 'IDLE' 
                ? 'flex-[0.7] py-2 px-2 text-[11px] opacity-20 scale-95' 
                : 'flex-1 py-3.5 px-4 text-sm'
            }`}
            id="stopwatch-btn-lap"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Lap</span>
          </motion.button>
        </div>

        {/* Dynamic Keyboard helper banner */}
        <div className="w-full border-t border-slate-900 pt-5 text-[10px] font-mono text-slate-600 flex justify-between items-center bg-slate-950/20 px-3 py-2 rounded-lg border border-slate-900/30">
          <span className="flex items-center gap-1">
            <span className="bg-slate-900 border border-slate-800 px-1 py-0.5 rounded text-slate-400 font-semibold">Space</span> Start/Pause
          </span>
          <span className="flex items-center gap-1">
            <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-semibold">L</span> Lap split
          </span>
        </div>

      </div>

      {/* RIGHT: Analytical Metrics & Laps List Board (Column Span 7) */}
      <div className="lg:col-span-7 flex flex-col gap-6" id="dashboard-analytical-panel">
        
        {/* Sticky/Header tab for Lap Logs control actions */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm border-b border-slate-900 pb-4">
            <div>
              <h2 className="font-display font-medium text-slate-200 text-base">Recorded Lap Logs</h2>
              <p className="text-xs text-slate-500 mt-0.5">Live session interval breakdown history</p>
            </div>
            
            {/* Export Options */}
            {laps.length > 0 && (
              <div className="flex items-center gap-2" id="action-export-toolbar">
                {/* Copy Table */}
                <button 
                  onClick={copyMarkdownTable}
                  className="p-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                  title="Copy timesheet to clipboard as clean Markdown table"
                  id="copy-md-btn"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-indigo-400" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                {/* Download CSV */}
                <button 
                  onClick={exportCSV}
                  className="p-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                  title="Export timesheet logs directly to CSV file for Excel"
                  id="export-csv-btn"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>CSV</span>
                </button>
              </div>
            )}
          </div>

          {/* The Actual Lap list */}
          {laps.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2 border border-dashed border-slate-900 rounded-2xl" id="lap-empty-prompt">
              <Plus className="h-6 w-6 mx-auto text-slate-700 animate-bounce" />
              <p className="text-xs font-display">Click "Lap" trigger above to capture split timings.</p>
              <p className="text-[10px] text-slate-600 max-w-sm mx-auto">Perfect for noting milestones, segmenting focus intervals or tracking billable tasks.</p>
            </div>
          ) : (
            <div className="max-h-[350px] overflow-y-auto pr-1.5 custom-scrollbar space-y-2" id="logs-feed-container">
              <AnimatePresence initial={false}>
                {laps.slice().reverse().map((lap) => {
                  // Live highlighting of fastest / slowest laps if multiple laps are available
                  const isMulti = laps.length > 1;
                  let performanceBadge = null;
                  if (isMulti) {
                    const times = laps.map(l => l.durationMs);
                    const min = Math.min(...times);
                    const max = Math.max(...times);
                    if (lap.durationMs === min) {
                      performanceBadge = 'FAST';
                    } else if (lap.durationMs === max && laps.length > 2) {
                      performanceBadge = 'SLOW';
                    }
                  }

                  return (
                    <motion.div
                      key={lap.id}
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-center justify-between p-3.5 bg-slate-950/50 border rounded-2xl group transition-all duration-200 ${
                        performanceBadge === 'FAST' ? 'border-emerald-500/10 hover:border-emerald-500/25' :
                        performanceBadge === 'SLOW' ? 'border-red-500/10 hover:border-red-500/25' :
                        'border-slate-900 hover:border-slate-800'
                      }`}
                      id={`lap-item-${lap.id}`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Sequence number */}
                        <span className="text-xs font-mono font-medium text-slate-500 w-6">
                          #{lap.lapNumber}
                        </span>

                        <div className="space-y-0.5">
                          {/* Performance tag line */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {performanceBadge === 'FAST' && (
                              <span className="text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-1.5 rounded uppercase tracking-wider">
                                ⭐ Fastest
                              </span>
                            )}
                            {performanceBadge === 'SLOW' && (
                              <span className="text-[8px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/25 px-1.5 rounded uppercase tracking-wider">
                                Slowest
                              </span>
                            )}
                            {performanceBadge === null && (
                              <span className="text-[10px] text-slate-500 font-mono">
                                Lap Segment
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Lap time durations split */}
                        <div className="text-right font-mono">
                          <span className={`block text-xs font-semibold ${
                            performanceBadge === 'FAST' ? 'text-emerald-400 font-bold' :
                            performanceBadge === 'SLOW' ? 'text-red-400 font-bold' : 'text-slate-100'
                          }`}>
                            {formatMsToString(lap.durationMs)}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {formatMsToString(lap.cumulativeMs)} total
                          </span>
                        </div>

                        {/* Self deletion button */}
                        <button
                          onClick={() => deleteLap(lap.id)}
                          className="p-1 text-slate-600 hover:text-red-400 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer"
                          title="Delete this lap interval log"
                          id={`delete-btn-${lap.id}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Dynamic Responsive Leaderboard Ad under Lap logs box */}
        <div className="w-full flex justify-center animate-fade-in pt-1" id="sub-laps-middle-ad-deck">
          {/* Phone display */}
          <div className="block sm:hidden flex justify-center">
            <AdBanner adKey="ccade14074ab6047bdcd6acbf921dc1d" format="iframe" height={50} width={320} label="SPONSORED广告" hideBorder compact />
          </div>
          {/* Tablet display */}
          <div className="hidden sm:block md:hidden flex justify-center">
            <AdBanner adKey="db3a79e12aa161ce3f5a8e4e34162c60" format="iframe" height={60} width={468} label="SPONSORED广告" hideBorder compact />
          </div>
          {/* Desktop display */}
          <div className="hidden md:block flex justify-center">
            <AdBanner adKey="d75dbe355ad5fd66241106d0dab90b09" format="iframe" height={90} width={728} label="SPONSORED广告" hideBorder compact />
          </div>
        </div>

        {/* Statistics and timesheets aggregated panel */}
        <StatsPanel 
          laps={laps} 
          formatTime={formatMsToString} 
        />

      </div>

    </div>
  );
}
