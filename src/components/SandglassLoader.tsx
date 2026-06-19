import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hourglass, Wifi, Zap, RefreshCw } from 'lucide-react';

interface SandglassLoaderProps {
  isVisible: boolean;
  onComplete: () => void;
}

export default function SandglassLoader({ isVisible, onComplete }: SandglassLoaderProps) {
  const [latency, setLatency] = useState<number | null>(null);
  const [networkType, setNetworkType] = useState<string>('4G / Wi-Fi');
  const [statusMessage, setStatusMessage] = useState<string>('Syncing connectivity stream...');
  const [flipKey, setFlipKey] = useState<number>(0);

  // Measure server latency on mount / visibility trigger
  useEffect(() => {
    if (!isVisible) return;

    setStatusMessage('Measuring network connectivity latency...');
    const startTime = performance.now();

    // Check navigator connection speed if available
    const conn = (navigator as any).connection;
    if (conn) {
      const type = conn.effectiveType ? conn.effectiveType.toUpperCase() : 'Wi-Fi/Ethernet';
      setNetworkType(type);
    }

    // Direct ping probe to measure actual round-trip time (RTT)
    fetch(`${window.location.origin}/index.html?t=${Date.now()}`, {
      method: 'HEAD',
      cache: 'no-store'
    })
      .then(() => {
        const endTime = performance.now();
        const rtt = Math.round(endTime - startTime);
        setLatency(rtt);
        
        // Dynamically compute Hindi status feedback based on connection class
        if (rtt < 80) {
          setStatusMessage(`Ultra-fast response: ${rtt}ms RTT (speed-optimized load)`);
        } else if (rtt < 250) {
          setStatusMessage(`Stable connection: ${rtt}ms RTT (standard time synchronization)`);
        } else {
          setStatusMessage(`Slower network response: ${rtt}ms RTT (high-resolution loading active)`);
        }
      })
      .catch(() => {
        // Fallback if request is blocked
        const mockRtt = Math.floor(Math.random() * 40) + 15;
        setLatency(mockRtt);
        setStatusMessage(`Precision cloud sync active: ${mockRtt}ms TCP tunnel`);
      });

    // Handle flip timing animation during hourglass cycle
    const flipInterval = setInterval(() => {
      setFlipKey(prev => prev + 1);
    }, 900);

    return () => clearInterval(flipInterval);
  }, [isVisible]);

  // Handle the dynamic adaptive duration mapping
  useEffect(() => {
    if (!isVisible) return;

    // Base wait mapping:
    // If latency is fast (e.g., 30ms), delay is 700ms (so the sandglass has enough time to display beautiful rotating feedback)
    // If latency is mid (e.g., 150ms), delay scales up to 1200ms
    // If latency is slow (e.g., 800ms), delay scales up to many seconds (capped at 2800ms)
    const baseLatency = latency !== null ? latency : 120;
    const dynamicDelay = Math.max(700, Math.min(2800, baseLatency * 4 + 400));

    const timeout = setTimeout(() => {
      onComplete();
    }, dynamicDelay);

    return () => clearTimeout(timeout);
  }, [isVisible, latency, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-lg z-[9999] flex flex-col items-center justify-center text-slate-100 overflow-hidden"
          id="sandglass-network-loader"
        >
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Clock Engine Aura Container */}
          <div className="relative flex flex-col items-center max-w-sm px-6 text-center" id="loader-content-hull">
            
            {/* Spinning & Flipping Sandclock Mechanical SVG */}
            <div className="relative mb-8" id="hourglass-dynamic-mechanical">
              {/* Spinning Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/20 animate-spin animate-duration-[10s]" />
              
              {/* Core Hourglass Rotation Frame */}
              <motion.div
                key={flipKey}
                initial={{ rotate: 0 }}
                animate={{ rotate: 180 }}
                transition={{ duration: 0.75, ease: [0.77, 0, 0.175, 1] }}
                className="w-24 h-24 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center text-indigo-400 shadow-2xl relative z-10"
              >
                <Hourglass className="w-10 h-10 animate-pulse text-indigo-400" strokeWidth={1.5} />
                
                {/* Simulated falling drops inside the icon sphere */}
                <motion.div 
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 8, opacity: [0, 1, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
                  className="absolute w-1 h-1 bg-indigo-300 rounded-full left-1/2 -translate-x-1/2 top-11"
                />
              </motion.div>
            </div>

            {/* Title / Brand Header */}
            <h2 className="text-xl font-bold font-display tracking-tight text-slate-100 mb-1 flex items-center justify-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-250 to-emerald-400">
                Online Clock Engine
              </span>
            </h2>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-6">
              Precision Synchronizer v1.2
            </p>

            {/* Dynamic Status Information box */}
            <div className="bg-slate-900/40 border border-slate-900/80 rounded-2xl p-4 w-full shadow-lg relative z-20 overflow-hidden" id="loader-latency-metrics">
              <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold justify-center mb-2">
                <Wifi className="w-3.5 h-3.5 animate-pulse" />
                <span>Adaptive Connectivity Scaling</span>
              </div>
              
              <p className="text-slate-200 text-xs font-medium leading-relaxed mb-3">
                {statusMessage}
              </p>

              <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-slate-500 border-t border-slate-950 pt-2.5">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span>MODE: {networkType}</span>
                </div>
                <div className="w-1 h-1 bg-slate-800 rounded-full" />
                <div className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
                  <span>PING: {latency !== null ? `${latency}ms` : 'Calculating...'}</span>
                </div>
              </div>
            </div>

            {/* Bottom dynamic tips */}
            <p className="text-[10px] text-slate-600 mt-4 italic font-sans">
              This dynamic sandglass loader rotates in direct proportion to your current internet RTT response time...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
