import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Timer, BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioEngine } from './AudioEngine';

interface TimerTabProps {
  soundEnabled: boolean;
  shortcutsEnabled?: boolean;
  activeTab?: string;
}

export default function TimerTab({ soundEnabled, shortcutsEnabled = true, activeTab = 'TIMER' }: TimerTabProps) {
  // Input selector states
  const [hrs, setHrs] = useState<number>(0);
  const [mins, setMins] = useState<number>(10); // Default to a standard 10-min block
  const [secs, setSecs] = useState<number>(0);

  // Live countdown states
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSetupState, setIsSetupState] = useState<boolean>(true);

  // Time completion alert
  const [showTimesUpSplash, setShowTimesUpSplash] = useState<boolean>(false);

  // Handle high-precision timer loop with absolute timestamp offset to avoid setInterval latency
  const timerIntervalRef = useRef<number | null>(null);
  const startTimeStampRef = useRef<number>(0);
  const totalSecondsPausedSnapshotRef = useRef<number>(0);
  const lastTimerTickRef = useRef<number>(-1);

  const formatUnit = (num: number) => num.toString().padStart(2, '0');

  // Set Preset quick triggers
  const setPreset = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    setHrs(h);
    setMins(m);
    setSecs(s);
    if (soundEnabled) audioEngine.playTick();
  };

  const handleHoursWheel = (e: React.WheelEvent) => {
    if (!isSetupState) return;
    e.preventDefault();
    if (e.deltaY < 0) {
      setHrs(h => Math.min(23, h + 1));
    } else {
      setHrs(h => Math.max(0, h - 1));
    }
    if (soundEnabled) audioEngine.playTick();
  };

  const handleMinsWheel = (e: React.WheelEvent) => {
    if (!isSetupState) return;
    e.preventDefault();
    if (e.deltaY < 0) {
      setMins(m => Math.min(59, m + 1));
    } else {
      setMins(m => Math.max(0, m - 1));
    }
    if (soundEnabled) audioEngine.playTick();
  };

  const handleSecsWheel = (e: React.WheelEvent) => {
    if (!isSetupState) return;
    e.preventDefault();
    if (e.deltaY < 0) {
      setSecs(s => Math.min(59, s + 1));
    } else {
      setSecs(s => Math.max(0, s - 1));
    }
    if (soundEnabled) audioEngine.playTick();
  };

  // Calculations for Estimated Finish Time
  const estimatedFinishTime = useMemo(() => {
    if (isSetupState) return '';
    const now = new Date();
    const finishAt = new Date(now.getTime() + remainingSeconds * 1000);
    return finishAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, [remainingSeconds, isSetupState]);

  // Clean formatted text for countdown
  const formattedCountdown = useMemo(() => {
    const h = Math.floor(remainingSeconds / 3600);
    const m = Math.floor((remainingSeconds % 3600) / 60);
    const s = remainingSeconds % 60;
    return `${formatUnit(h)}:${formatUnit(m)}:${formatUnit(s)}`;
  }, [remainingSeconds]);

  // SVG Circumference for circular visualization
  const radius = 110;
  const circumference = 2 * Math.PI * radius; // ~691.15
  const isFinalPhase = !isSetupState && remainingSeconds > 0 && remainingSeconds <= 5;

  const strokeDashoffset = useMemo(() => {
    if (totalSeconds <= 0) return circumference; // Start fully empty
    
    const ratio = (totalSeconds - remainingSeconds) / totalSeconds; // Ratio of time elapsed (starts at 0, ends at 1)
    return circumference - (ratio * circumference);
  }, [remainingSeconds, totalSeconds, circumference]);

  // Audio completion loop - deactivated
  const completionSoundRef = useRef<number | null>(null);

  // Standard cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (completionSoundRef.current) clearTimeout(completionSoundRef.current);
    };
  }, []);

  // Keyboard Shortcuts Handler for Timer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!shortcutsEnabled || activeTab !== 'TIMER') return;

      // Skip event handling if focus is inside text input layers
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (isSetupState) {
            handleStartTimer();
          } else {
            handlePauseResume();
          }
          break;
        case 'KeyR':
        case 'KeyC':
          e.preventDefault();
          handleCancelTimer();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcutsEnabled, activeTab, isSetupState, isRunning, hrs, mins, secs]);

  // Timer run toggle trigger
  const handleStartTimer = () => {
    const calculatedSecs = hrs * 3600 + mins * 60 + secs;
    if (calculatedSecs <= 0) {
      if (soundEnabled) audioEngine.playBeep();
      return;
    }

    setIsSetupState(false);
    setTotalSeconds(calculatedSecs);
    setRemainingSeconds(calculatedSecs);
    setIsRunning(true);
    
    startTimeStampRef.current = Date.now();
    totalSecondsPausedSnapshotRef.current = calculatedSecs;
    lastTimerTickRef.current = calculatedSecs;

    if (soundEnabled) audioEngine.playBeep();

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = window.setInterval(() => {
      const elapsedSecs = Math.floor((Date.now() - startTimeStampRef.current) / 1000);
      const calculatedRemaining = totalSecondsPausedSnapshotRef.current - elapsedSecs;

      if (calculatedRemaining <= 0) {
        setRemainingSeconds(0);
        setIsRunning(false);
        setIsSetupState(true);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
        setShowTimesUpSplash(true);
      } else {
        setRemainingSeconds(calculatedRemaining);
        // Play the tick-tick sound exactly on every second passing by
        if (calculatedRemaining !== lastTimerTickRef.current) {
          lastTimerTickRef.current = calculatedRemaining;
          if (soundEnabled) {
            if (calculatedRemaining <= 5) {
              audioEngine.playBeep();
            } else {
              audioEngine.playTick();
            }
          }
        }
      }
    }, 100);
  };

  const handlePauseResume = () => {
    if (isRunning) {
      // Pause action
      setIsRunning(false);
      totalSecondsPausedSnapshotRef.current = remainingSeconds;
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (soundEnabled) audioEngine.playBeep();
    } else {
      // Resume action
      setIsRunning(true);
      startTimeStampRef.current = Date.now();
      lastTimerTickRef.current = remainingSeconds;
      if (soundEnabled) audioEngine.playBeep();

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = window.setInterval(() => {
        const elapsedSecs = Math.floor((Date.now() - startTimeStampRef.current) / 1000);
        const calculatedRemaining = totalSecondsPausedSnapshotRef.current - elapsedSecs;

        if (calculatedRemaining <= 0) {
          setRemainingSeconds(0);
          setIsRunning(false);
          setIsSetupState(true);
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
          setShowTimesUpSplash(true);
        } else {
          setRemainingSeconds(calculatedRemaining);
          // Play the tick-tick sound exactly on every second passing by
          if (calculatedRemaining !== lastTimerTickRef.current) {
            lastTimerTickRef.current = calculatedRemaining;
            if (soundEnabled) {
              if (calculatedRemaining <= 5) {
                audioEngine.playBeep();
              } else {
                audioEngine.playTick();
              }
            }
          }
        }
      }, 100);
    }
  };

  // Reset core countdown
  const handleCancelTimer = () => {
    setIsRunning(false);
    setIsSetupState(true);
    setTotalSeconds(0);
    setRemainingSeconds(0);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (soundEnabled) audioEngine.playBeep();
  };

  return (
    <div className="w-full flex flex-col gap-6" id="countdown-timer-module">
      
      {/* Alert Banner / Overlay Splash */}
      <AnimatePresence>
        {showTimesUpSplash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-5 border-l-4 border-emerald-500 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-between gap-3 shadow-lg shadow-emerald-500/5 mb-2 max-w-2xl mx-auto w-full"
          >
            <div className="flex items-center gap-3">
              <BellRing className="h-5 w-5 text-emerald-400 animate-bounce" />
              <div>
                <h4 className="text-sm font-bold font-display">Time's Up!</h4>
                <p className="text-xs text-slate-400">Your countdown interval timer has finished successfully.</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setShowTimesUpSplash(false);
                if (completionSoundRef.current) clearTimeout(completionSoundRef.current);
              }}
              className="text-xs font-mono py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition uppercase cursor-pointer"
            >
              Okay
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Centered Panel Container (Unified Single Screen Frame) */}
      <div 
        className="max-w-xl mx-auto w-full bg-slate-900/20 border border-slate-900/80 p-6 sm:p-8 rounded-3xl flex flex-col justify-between min-h-[480px] shadow-xl" 
        id="timer-setup-panel"
      >
        
        {/* Dynamic Header */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-medium text-slate-200 text-base">
                {isSetupState ? 'Setup Countdown Limit' : 'Countdown Session Active'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isSetupState 
                  ? 'Define your custom work sprint or rest break length' 
                  : 'Your interval timer is counting down dynamically'
                }
              </p>
            </div>
            <Timer className={`h-5 w-5 text-indigo-400 ${!isSetupState && isRunning ? 'animate-spin' : ''}`} style={!isSetupState && isRunning ? { animationDuration: '3s' } : undefined} />
          </div>

          <AnimatePresence mode="wait">
            {isSetupState ? (
              <motion.div
                key="setup-controls"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Numeric dials adjustment console - editable & scrollable */}
                <div className="flex items-center justify-center gap-3 sm:gap-5 py-6 bg-slate-950/40 border border-slate-900 rounded-2xl p-4 sm:p-6" id="timer-interactive-dials">
                  
                  {/* Hours Column */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">Hrs</span>
                    <div className="relative group flex flex-col items-center col-span-1">
                      <input
                        type="number"
                        min={0}
                        max={23}
                        disabled={!isSetupState}
                        value={formatUnit(hrs)}
                        onChange={(e) => {
                          let val = parseInt(e.target.value, 10);
                          if (isNaN(val)) val = 0;
                          setHrs(Math.min(23, Math.max(0, val)));
                        }}
                        onWheel={handleHoursWheel}
                        className="w-16 h-11 text-center font-mono text-2xl font-semibold bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition duration-150 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none select-all"
                        title="Scroll mouse wheel or type to set hours"
                      />
                      <span className="absolute -bottom-5 text-[8px] font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">Scroll/Type</span>
                    </div>
                  </div>

                  {/* Separator Box 1 */}
                  <div className="flex flex-col items-center pt-5">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-500 font-bold select-none pointer-events-none" id="separator-1">
                      -
                    </div>
                  </div>

                  {/* Minutes Column */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">Min</span>
                    <div className="relative group flex flex-col items-center col-span-1">
                      <input
                        type="number"
                        min={0}
                        max={59}
                        disabled={!isSetupState}
                        value={formatUnit(mins)}
                        onChange={(e) => {
                          let val = parseInt(e.target.value, 10);
                          if (isNaN(val)) val = 0;
                          setMins(Math.min(59, Math.max(0, val)));
                        }}
                        onWheel={handleMinsWheel}
                        className="w-16 h-11 text-center font-mono text-2xl font-semibold bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition duration-150 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none select-all"
                        title="Scroll mouse wheel or type to set minutes"
                      />
                      <span className="absolute -bottom-5 text-[8px] font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">Scroll/Type</span>
                    </div>
                  </div>

                  {/* Separator Box 2 */}
                  <div className="flex flex-col items-center pt-5">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-500 font-bold select-none pointer-events-none" id="separator-2">
                      -
                    </div>
                  </div>

                  {/* Seconds Column */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">Sec</span>
                    <div className="relative group flex flex-col items-center col-span-1">
                      <input
                        type="number"
                        min={0}
                        max={59}
                        disabled={!isSetupState}
                        value={formatUnit(secs)}
                        onChange={(e) => {
                          let val = parseInt(e.target.value, 10);
                          if (isNaN(val)) val = 0;
                          setSecs(Math.min(59, Math.max(0, val)));
                        }}
                        onWheel={handleSecsWheel}
                        className="w-16 h-11 text-center font-mono text-2xl font-semibold bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition duration-150 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none select-all"
                        title="Scroll mouse wheel or type to set seconds"
                      />
                      <span className="absolute -bottom-5 text-[8px] font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">Scroll/Type</span>
                    </div>
                  </div>

                </div>

                {/* Quick Sprints Preset Deck */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                    Quick Task Templates presets
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: '1 Min', secs: 60 },
                      { name: '5 Min', secs: 300 },
                      { name: '10 Min', secs: 600 },
                      { name: '15 Min', secs: 900 },
                      { name: '25 Min (Pomodoro)', secs: 1500 },
                      { name: '45 Min', secs: 2700 },
                      { name: '1 Hr', secs: 3600 },
                    ].map((item) => (
                      <button
                        key={item.name}
                        disabled={!isSetupState}
                        onClick={() => setPreset(item.secs)}
                        className="text-xs bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 disabled:opacity-30 disabled:hover:bg-slate-950 text-slate-400 hover:text-slate-200 px-3 py-2 rounded-xl transition cursor-pointer"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="active-visual-timer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center justify-center py-4"
              >
                {/* Radial Sweep Circular display sits exactly inside the setup area */}
                <div className="relative w-56 h-56 sm:w-60 sm:h-60 flex items-center justify-center" id="radial-container">
                  <svg className="absolute w-full h-full -rotate-90">
                    <circle 
                      cx="50%" 
                      cy="50%" 
                      r={radius}
                      className={isFinalPhase ? "stroke-emerald-950/40 fill-none" : "stroke-slate-900/60 fill-none"}
                      strokeWidth="6"
                    />
                    
                    <circle 
                      cx="50%" 
                      cy="50%" 
                      r={radius}
                      className={`fill-none ${
                        isFinalPhase 
                          ? 'stroke-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                          : isRunning 
                            ? 'stroke-indigo-500' 
                            : 'stroke-amber-500'
                      }`}
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{
                        transition: isFinalPhase ? 'stroke-dashoffset 1000ms linear' : isRunning ? 'stroke-dashoffset 1s linear' : 'stroke-dashoffset 0.3s ease-out',
                        willChange: 'stroke-dashoffset'
                      }}
                    />
                  </svg>
 
                   {/* Digital Readout Numerals */}
                   <div className="text-center z-10" id="timer-live-time">
                     {isFinalPhase ? (
                       <>
                         <span className="block text-xs font-sans tracking-wider font-extrabold mb-1.5 text-emerald-400 uppercase animate-pulse">
                           Timer is Over
                         </span>
                         
                         <span className="block text-4xl sm:text-5xl font-mono text-emerald-400 font-bold tracking-tight select-none">
                           {remainingSeconds}s
                         </span>
 
                         <span className="block text-[9px] text-emerald-600/80 font-mono mt-2 uppercase tracking-wide font-medium">
                           Ending Phase
                         </span>
                       </>
                     ) : (
                       <>
                         <span className={`block text-[10px] uppercase tracking-widest font-bold mb-1 font-mono ${
                           isRunning ? 'text-indigo-400 animate-pulse' : 'text-amber-500'
                         }`}>
                           {isRunning ? 'RUNNING' : 'PAUSED'}
                         </span>
                         
                         <span className="block text-3xl sm:text-4xl font-mono text-slate-100 font-bold tracking-tight select-all">
                           {formattedCountdown}
                         </span>
 
                         <span className="block text-[10px] text-slate-600 font-mono mt-2 uppercase tracking-tight">
                           {totalSeconds > 0 ? ((remainingSeconds / totalSeconds) * 100).toFixed(0) : 0}% remaining
                         </span>
                       </>
                     )}
                   </div>
                 </div>
 
                 {/* Dynamic finish marker tag banner inside the setup area */}
                 <div className="mt-6 w-full max-w-sm text-center p-3 border border-slate-900/80 bg-slate-950/40 rounded-xl flex items-center justify-center gap-2 text-xs">
                   {isFinalPhase ? (
                     <>
                       <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                       <span className="text-slate-400">Returning to setup in <strong className="text-emerald-400 font-mono">{remainingSeconds}s</strong></span>
                     </>
                   ) : (
                     <>
                       <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
                       <span className="text-slate-400">Finish at: <strong className="text-slate-200 font-mono">{estimatedFinishTime}</strong></span>
                     </>
                   )}
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
         </div>
 
         {/* Unified Bottom Action Buttons - Stable Position */}
         <div className="mt-8 pt-5 border-t border-slate-900 flex items-center gap-3">
           <button
             disabled={isSetupState}
             onClick={handleCancelTimer}
             className="flex-1 py-3.5 rounded-xl border border-slate-900 bg-slate-950 hover:bg-slate-900 text-slate-500 hover:text-slate-300 disabled:opacity-20 transition text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
           >
             <RotateCcw className="h-4 w-4" />
             <span>Cancel / Clear</span>
           </button>
 
           {isSetupState ? (
             <button
               onClick={handleStartTimer}
               disabled={hrs === 0 && mins === 0 && secs === 0}
               className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 transition text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10"
             >
               <Play className="h-4 w-4 fill-current" />
               <span>Start Timer</span>
             </button>
           ) : (
             <button
               onClick={handlePauseResume}
               disabled={isFinalPhase}
               className={`flex-1 py-3.5 rounded-xl transition text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                 isFinalPhase
                   ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 cursor-not-allowed opacity-80'
                   : isRunning 
                     ? 'bg-amber-600 hover:bg-amber-500 text-slate-950' 
                     : 'bg-indigo-600 hover:bg-indigo-500 text-white'
               }`}
             >
               {isFinalPhase ? (
                 <>
                   <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
                   <span>Wrapping Session...</span>
                 </>
               ) : isRunning ? (
                 <>
                   <Pause className="h-4 w-4" />
                   <span>Pause Session</span>
                 </>
               ) : (
                 <>
                   <Play className="h-4 w-4 fill-current" />
                   <span>Resume Session</span>
                 </>
               )}
             </button>
           )}
         </div>

      </div>

    </div>
  );
}
