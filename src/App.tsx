import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Keyboard, 
  Clock, 
  X,
  Hourglass,
  Globe,
  HelpCircle,
  Shield,
  Scale,
  Instagram,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab } from './types';
import { audioEngine } from './components/AudioEngine';
import SEOContent from './components/SEOContent';
import TimerTab from './components/TimerTab';
import WorldClockTab from './components/WorldClockTab';
import StopwatchTab from './components/StopwatchTab';
import SandglassLoader from './components/SandglassLoader';
import PrivacyPolicyTab from './components/PrivacyPolicyTab';
import TermsOfServiceTab from './components/TermsOfServiceTab';
import ContactUsTab from './components/ContactUsTab';

export default function App() {
  // Navigation State & Dynamic Transition states
  const [activeTab, setActiveTab] = useState<ActiveTab>('STOPWATCH');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true); // Keeps sandglass active on initial cold load calibration
  const [pendingTab, setPendingTab] = useState<ActiveTab>(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#timer' || hash === '#countdown') {
      return 'TIMER';
    } else if (hash === '#clock' || hash === '#timezone' || hash === '#worldclock' || hash === '#world-clock') {
      return 'WORLD_CLOCK';
    }
    return 'STOPWATCH';
  });

  const initiateTabSwitch = (targetTab: ActiveTab) => {
    setPendingTab(targetTab);
    setIsTransitioning(true);
  };

  const handleLoaderComplete = () => {
    setActiveTab(pendingTab);
    setIsTransitioning(false);
  };

  // Bidirectional sync: Shift URL hash when active tab changes
  useEffect(() => {
    let hash = '#stopwatch';
    if (activeTab === 'TIMER') {
      hash = '#timer';
    } else if (activeTab === 'WORLD_CLOCK') {
      hash = '#clock';
    }
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  }, [activeTab]);

  // Bidirectional sync: Respond to physical browser navigation/Back/Forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      let target: ActiveTab = 'STOPWATCH';
      if (hash === '#timer' || hash === '#countdown') {
        target = 'TIMER';
      } else if (hash === '#clock' || hash === '#timezone' || hash === '#worldclock' || hash === '#world-clock') {
        target = 'WORLD_CLOCK';
      }
      if (target !== pendingTab) {
        initiateTabSwitch(target);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pendingTab]);

  // Dynamic Browser SEO Page-Level Titles on tab switch
  useEffect(() => {
    let title = "Online Stopwatch - Instant Free Millisecond Lap Timer";
    let description = "Our highly accurate, professional Online Stopwatch features precision lap split increments and direct timesheet CSV exports for elite task logging.";
    
    if (activeTab === 'TIMER') {
      title = "Online Countdown Timer - Free Quick Alarm & Interval Study Tracker";
      description = "Simple online countdown timer tools and buzzer triggers curated for students, educators, and gym workouts. Full visual ring progress tracking.";
    } else if (activeTab === 'WORLD_CLOCK') {
      title = "Online World Clock - Exact UTC, GMT & Live Multi-City Timezone Converter";
      description = "Review accurate, real-time local wall clock times around the globe. Monitor shifts, daylight savings, and GMT offsets smoothly on an atomic feed.";
    } else if (activeTab === 'PRIVACY') {
      title = "Privacy Policy - Online Timing Suite Data Privacy Guarantee";
      description = "Review our comprehensive client-side data security policies. Zero recording, zero server logs, and complete, standard global privacy compliance.";
    } else if (activeTab === 'TERMS') {
      title = "Terms of Service - Online Timing Suite Licensing Agreement";
      description = "Understand our free permissible licenses, high-precision limitations of liability, and web operational terms of timing synchronization.";
    } else if (activeTab === 'CONTACT') {
      title = "Contact Us - Connect Directly on Instagram @toolifiy";
      description = "Official communication channel of our Timing utilities. Access our verified Instagram profile links to share technical feedback or DM business ideas.";
    }

    document.title = title;
    
    // Dynamically override description meta tag to maximize crawler ranking
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [activeTab]);

  // Preference Toggles (persisted to localStorage if available)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('stopwatch_sound_enabled');
    return saved ? saved === 'true' : true;
  });
  const [shortcutsEnabled, setShortcutsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('stopwatch_shortcuts_enabled');
    return saved ? saved === 'true' : true;
  });

  // UI States
  const [showShortcutModal, setShowShortcutModal] = useState<boolean>(false);

  // Sound Engine synchronization
  useEffect(() => {
    audioEngine.toggle(soundEnabled);
    localStorage.setItem('stopwatch_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('stopwatch_shortcuts_enabled', String(shortcutsEnabled));
  }, [shortcutsEnabled]);

  // Dynamic Page Header Title
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'STOPWATCH':
        return 'Online Stopwatch';
      case 'TIMER':
        return 'Online Countdown Timer';
      case 'WORLD_CLOCK':
        return 'Online World Clock';
      case 'PRIVACY':
        return 'Privacy Policy';
      case 'TERMS':
        return 'Terms of Service';
      case 'CONTACT':
        return 'Contact Us';
      default:
        return 'Online Stopwatch';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-600/30 selection:text-indigo-200 pb-12" id="main-stopwatch-app">
      
      {/* Top Navigation Headers */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md relative z-40 px-4 py-4" id="app-header">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              {activeTab === 'STOPWATCH' && <Clock className="h-4 w-4" />}
              {activeTab === 'TIMER' && <Hourglass className="h-4 w-4" />}
              {activeTab === 'WORLD_CLOCK' && <Globe className="h-4 w-4" />}
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-wide text-slate-100 uppercase font-display">
                {getHeaderTitle()}
              </h1>
              <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-tight">PRECISION ENGINE v1.2</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sound Toggle */}
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                soundEnabled 
                  ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20' 
                  : 'bg-slate-900/40 border-slate-900 text-slate-500 hover:text-slate-300'
              }`}
              title={soundEnabled ? "Disable tactile alerts" : "Enable sound alerts"}
              id="sound-opt-toggle"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Keyboard Shortcuts Guide Menu */}
            {(activeTab === 'STOPWATCH' || activeTab === 'TIMER') && (
              <button 
                onClick={() => setShowShortcutModal(true)}
                className="p-2 rounded-xl bg-slate-900/40 border border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800 transition duration-150 cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                id="shortcuts-guide-btn"
              >
                <Keyboard className="h-4 w-4" />
                <span className="hidden sm:inline">Keys</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Deck */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 pt-3 pb-6 sm:pt-4 sm:pb-8 flex flex-col gap-4 sm:gap-5">
        
        {/* Horizontal Wide & Curved Small Option Selector Header Bar */}
        <div className="w-full flex justify-center animate-fade-in animate-duration-300" id="header-option-selector-deck">
          <div className="bg-slate-950/30 border border-slate-900/90 backdrop-blur-md rounded-2xl p-1.5 flex items-center gap-1.5 w-full max-w-lg shadow-xl shadow-slate-950/30" id="header-tabs-navigation">
            
            {/* Stopwatch Option Button */}
            <button
              onClick={() => {
                initiateTabSwitch('STOPWATCH');
                if (soundEnabled) audioEngine.playTick();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all duration-200 cursor-pointer text-xs font-semibold border ${
                (activeTab === 'STOPWATCH' || pendingTab === 'STOPWATCH') && isTransitioning
                  ? 'bg-slate-900/10 border-slate-850 text-indigo-400 font-bold'
                  : activeTab === 'STOPWATCH'
                  ? 'bg-indigo-600/15 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/5 font-bold'
                  : 'bg-slate-900/30 border-slate-800/80 text-slate-400 hover:text-indigo-300 hover:border-slate-700/80'
              }`}
              id="header-tab-stopwatch"
            >
              <Clock className="h-4 w-4" />
              <span>Online Stopwatch</span>
            </button>

            {/* Timer Option Button */}
            <button
              onClick={() => {
                initiateTabSwitch('TIMER');
                if (soundEnabled) audioEngine.playTick();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all duration-200 cursor-pointer text-xs font-semibold border ${
                (activeTab === 'TIMER' || pendingTab === 'TIMER') && isTransitioning
                  ? 'bg-slate-900/10 border-slate-850 text-indigo-400 font-bold'
                  : activeTab === 'TIMER'
                  ? 'bg-indigo-600/15 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/5 font-bold'
                  : 'bg-slate-900/30 border-slate-800/80 text-slate-400 hover:text-indigo-300 hover:border-slate-700/80'
              }`}
              id="header-tab-timer"
            >
              <Hourglass className="h-4 w-4" />
              <span>Online Timer</span>
            </button>

            {/* Clock Option Button */}
            <button
              onClick={() => {
                initiateTabSwitch('WORLD_CLOCK');
                if (soundEnabled) audioEngine.playTick();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all duration-200 cursor-pointer text-xs font-semibold border ${
                (activeTab === 'WORLD_CLOCK' || pendingTab === 'WORLD_CLOCK') && isTransitioning
                  ? 'bg-slate-900/10 border-slate-850 text-indigo-400 font-bold'
                  : activeTab === 'WORLD_CLOCK'
                  ? 'bg-indigo-600/15 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/5 font-bold'
                  : 'bg-slate-900/30 border-slate-800/80 text-slate-400 hover:text-indigo-300 hover:border-slate-700/80'
              }`}
              id="header-tab-world-clock"
            >
              <Globe className="h-4 w-4" />
              <span>Online Clock</span>
            </button>

          </div>
        </div>
        
        {/* Render content based on Active Tab */}
        {activeTab === 'STOPWATCH' && (
          <div className="animate-fade-in" id="stopwatch-container-view">
            <StopwatchTab 
              soundEnabled={soundEnabled} 
              shortcutsEnabled={shortcutsEnabled} 
              activeTab={activeTab} 
            />
          </div>
        )}

        {/* Render Countdown Timer tab */}
        {activeTab === 'TIMER' && (
          <div className="animate-fade-in" id="timer-container-view">
            <TimerTab 
              soundEnabled={soundEnabled} 
              shortcutsEnabled={shortcutsEnabled}
              activeTab={activeTab}
            />
          </div>
        )}

        {/* Render World Clock tab */}
        {activeTab === 'WORLD_CLOCK' && (
          <div className="animate-fade-in" id="world-clock-container-view">
            <WorldClockTab soundEnabled={soundEnabled} />
          </div>
        )}

        {/* Render Privacy Policy page */}
        {activeTab === 'PRIVACY' && (
          <div className="animate-fade-in" id="privacy-container-view">
            <PrivacyPolicyTab onClose={() => initiateTabSwitch('STOPWATCH')} />
          </div>
        )}

        {/* Render Terms of Service page */}
        {activeTab === 'TERMS' && (
          <div className="animate-fade-in" id="terms-container-view">
            <TermsOfServiceTab onClose={() => initiateTabSwitch('STOPWATCH')} />
          </div>
        )}

        {/* Render Contact Us page */}
        {activeTab === 'CONTACT' && (
          <div className="animate-fade-in" id="contact-container-view">
            <ContactUsTab onClose={() => initiateTabSwitch('STOPWATCH')} />
          </div>
        )}

        {/* Structured SEO-friendly instructions & FAQs panel */}
        {(activeTab === 'STOPWATCH' || activeTab === 'TIMER' || activeTab === 'WORLD_CLOCK') && <SEOContent />}

        {/* Dynamic Sandglass Loader with Adaptive Connection-Speed Scaling */}
        <SandglassLoader 
          isVisible={isTransitioning}
          onComplete={handleLoaderComplete}
        />

      </main>


      {/* Structured Hotkeys Modal Popup */}
      <AnimatePresence>
        {showShortcutModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="hotkeys-modal-overlay">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative"
              id="hotkeys-modal-card"
            >
              <button 
                onClick={() => setShowShortcutModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-950/50 hover:bg-slate-950 transition cursor-pointer font-bold"
                id="close-modal-btn"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <Keyboard className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-slate-100 font-display">Keyboard Hotkeys</h3>
              </div>
              
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                You can operate the stopwatch and countdown timer directly using physical keyboard inputs. Please activate your switch toggle to enable operations:
              </p>

              {/* Shortcuts Switch toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-950 rounded-2xl mb-6">
                <div>
                  <span className="text-xs font-semibold text-slate-300 block">Shortcuts Status</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {shortcutsEnabled ? 'Active in workspace' : 'Deactivated completely'}
                  </span>
                </div>
                <button
                  onClick={() => setShortcutsEnabled(!shortcutsEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    shortcutsEnabled ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                  id="shortcuts-status-toggle"
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 left-1 transition-transform ${
                    shortcutsEnabled ? 'translate-x-5' : ''
                  }`} />
                </button>
              </div>

              {/* Checklist */}
              <div className="space-y-4">
                {/* Stopwatch controls category */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold mb-1">Stopwatch Controls</h4>
                  <div className="flex items-center justify-between text-xs" id="key-guide-space">
                    <span className="text-slate-400">Start / Pause</span>
                    <kbd className="px-2 py-0.5 font-mono font-bold bg-slate-950 text-indigo-450 border border-slate-800 rounded-md shadow text-[10px]">
                      Spacebar
                    </kbd>
                  </div>

                  <div className="flex items-center justify-between text-xs" id="key-guide-space-lap">
                    <span className="text-slate-400">Record Split Lap Time</span>
                    <kbd className="px-2 py-0.5 font-mono font-bold bg-slate-950 text-indigo-455 border border-slate-800 rounded-md shadow text-[10px]">
                      L
                    </kbd>
                  </div>

                  <div className="flex items-center justify-between text-xs" id="key-guide-space-reset">
                    <span className="text-slate-400">Clear & Reset Stopwatch</span>
                    <kbd className="px-2 py-0.5 font-mono font-bold bg-slate-950 text-indigo-455 border border-slate-800 rounded-md shadow text-[10px]">
                      R
                    </kbd>
                  </div>
                </div>

                {/* Timer controls category */}
                <div className="space-y-2.5 border-t border-slate-950 pt-3">
                  <h4 className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold mb-1">Timer Controls</h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Start / Pause / Resume</span>
                    <kbd className="px-2 py-0.5 font-mono font-bold bg-slate-950 text-indigo-455 border border-slate-800 rounded-md shadow text-[10px]">
                      Spacebar
                    </kbd>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Cancel & Reset Timer</span>
                    <kbd className="px-2 py-0.5 font-mono font-bold bg-slate-950 text-indigo-455 border border-slate-800 rounded-md shadow text-[10px]">
                      R / C
                    </kbd>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-950 text-[10px] text-slate-500 leading-normal bg-slate-950/10 p-3 rounded-xl">
                ⚠️ Shortcuts are automatically bypassed inside writing input widgets to let you compose labels smoothly.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Branding Area */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600 bg-slate-950" id="app-footer">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
          <p className="font-mono">
            Online Stopwatch & Utilities © 2026. High-Precision Digital Productivity Web application.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a href="#seo-documentation" className="text-slate-500 hover:text-slate-400 transition">How it works</a>
            <span className="text-slate-800 hidden sm:inline">|</span>
            <button 
              onClick={() => { initiateTabSwitch('PRIVACY'); if (soundEnabled) audioEngine.playTick(); }}
              className={`transition cursor-pointer ${activeTab === 'PRIVACY' ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-indigo-400'}`}
            >
              Privacy Policy
            </button>
            <span className="text-slate-800 hidden sm:inline">|</span>
            <button 
              onClick={() => { initiateTabSwitch('TERMS'); if (soundEnabled) audioEngine.playTick(); }}
              className={`transition cursor-pointer ${activeTab === 'TERMS' ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-indigo-400'}`}
            >
              Terms of Service
            </button>
            <span className="text-slate-800 hidden sm:inline">|</span>
            <button 
              onClick={() => { initiateTabSwitch('CONTACT'); if (soundEnabled) audioEngine.playTick(); }}
              className={`transition font-bold cursor-pointer underline decoration-indigo-500/30 underline-offset-4 ${activeTab === 'CONTACT' ? 'text-indigo-400' : 'text-slate-400 hover:text-indigo-400'}`}
            >
              Contact Us (@toolifiy)
            </button>
            <span className="text-slate-800">|</span>
            <span className="text-emerald-500/70 select-none flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Optimized for Google Rank
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
