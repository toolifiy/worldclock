import React from 'react';
import { Shield, EyeOff, Lock, Database, ArrowLeft } from 'lucide-react';
import AdBanner from './AdBanner';

interface PrivacyPolicyProps {
  onClose: () => void;
}

export default function PrivacyPolicyTab({ onClose }: PrivacyPolicyProps) {
  return (
    <div className="space-y-6" id="privacy-policy-hull text-left">
      <div className="flex items-center gap-3 border-b border-slate-900 pb-3">
        <button 
          onClick={onClose}
          className="p-2 sm:p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-900 hover:border-slate-700 transition duration-150 cursor-pointer flex items-center justify-center shrink-0"
          title="Back to Timing Tools"
          id="privacy-back-btn"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="text-left">
          <h3 className="text-lg sm:text-xl font-display font-semibold text-slate-100">Privacy Policy & Data Security</h3>
          <p className="text-[10px] sm:text-xs text-slate-500">Effective Date: June 19, 2026 | Standard Global Compliance</p>
        </div>
      </div>

      {/* Embedded Responsive Leaderboard Ad Header optimized for PC/Mobile/Tablet */}
      <div className="w-full flex justify-center animate-fade-in my-4" id="privacy-top-leaderboard-ad">
        {/* Phone display */}
        <div className="block sm:hidden">
          <AdBanner adKey="ccade14074ab6047bdcd6acbf921dc1d" format="iframe" height={50} width={320} label="SPONSORED广告" hideBorder compact />
        </div>
        {/* Tablet display */}
        <div className="hidden sm:block md:hidden">
          <AdBanner adKey="db3a79e12aa161ce3f5a8e4e34162c60" format="iframe" height={60} width={468} label="SPONSORED广告" hideBorder compact />
        </div>
        {/* Desktop/Big screen display */}
        <div className="hidden md:block">
          <AdBanner adKey="d75dbe355ad5fd66241106d0dab90b09" format="iframe" height={90} width={728} label="SPONSORED广告" hideBorder compact />
        </div>
      </div>

      <div className="space-y-6 text-slate-400 text-xs sm:text-sm leading-relaxed text-left font-sans">
        
        {/* Core highlight bar */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex gap-3 text-slate-200">
          <Shield className="h-5 w-5 text-emerald-400 shrink-0 self-start animate-pulse" />
          <p className="text-[11px] sm:text-xs text-left">
            <strong>Zero Server Storage & Complete User Discretion:</strong> All stopwatch laps, timesheets, and custom countdown parameters are exclusively persisted inside your browser's local sandbox (<em>localStorage</em>). We never transmit, gather, or upload your records to separate server caches.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-200 font-display">1. Information We Do Not Collect (Data Minimization)</h4>
          <p>
            Because we believe in absolute data transparency, our software maintains a strict zero-collection policy. Our servers do not have databases configured to record, log, process, or read user-authored values. When you create new task tags, log customized lap records, choose particular buzzer sounds, or modify global timezone selections, that data is completely invisible to our core development team.
          </p>
          <p>
            We live by the principle of <strong>Privacy by Design</strong>. Traditional tools require you to create accounts, enter email addresses, and share social details just to log timing statistics. We believe your productivity logs belong entirely to you, and we purposefully built this application without any user registration interfaces.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-200 font-display">2. Client-Side Browser Storage (`localStorage` and Integrity)</h4>
          <p>
            The application tracks custom setup configuration markers purely through your device's browser register space. This local sandbox stores the following:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[11px] sm:text-xs text-slate-500">
            <li><strong>Laps & Timesheets:</strong> Lists of logged splits, durations, and text descriptions aligned with task logs.</li>
            <li><strong>Timer Settings:</strong> Your customized hours, minutes, and seconds, along with preferred sound alert choices.</li>
            <li><strong>World Clock Pinned Locations:</strong> The list of specific city timezone regions you have selected to follow.</li>
            <li><strong>Sound Parameters:</strong> Your preference flag to either play or mute the synthetic alarm buzzers.</li>
          </ul>
          <p>
            This data never leaves your device. However, please note that if you manually clear your browser's site data, execute hard cache wipes, or use private browsing / incognito windows that automatically flush memory states, these configurations will be wiped. This is why we have implemented direct, instant CSV exports so you can backup your records.
          </p>
        </div>

        {/* Supplementary Mid Page Ad Square - High CPC monetization impact */}
        <div className="w-full flex justify-center py-4 my-4 border-y border-slate-900/40 bg-slate-950/20 rounded-2xl" id="privacy-mid-square-ad-1">
          <AdBanner adKey="c5bdb30469010828e32529cd44eafd76" format="iframe" height={250} width={300} label="RECOMMENDED PROMOTION" />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-200 font-display">3. Audio Alarm & Media Privacy</h4>
          <p>
            The audio ticker, metronome ticking pulses, and countdown alarm sounds utilize the latest standard HTML5 **Web Audio API**. This API is completely client-driven and executes local frequency calculations directly inside your browser container. 
          </p>
          <p>
            The application **never** requests permissions to access physical recording inputs, such as telephone lines or system microphones. All audio functions are strictly unidirectional outputs. If you select to mute sound effects via our speaker button, all internal sound nodes are immediately put in a suspended state to ensure absolute hardware peace.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-200 font-display">4. Absence of Tracking & Telemetry (No Bloatware)</h4>
          <p>
            Unlike typical timing utilities, we do not deploy high-overhead analytics pixels, demographic tracking codes, or ad-display loops. This guarantees optimized page load times, minimal physical data transfer costs, and absolute security. Your localized chronometer usage remains entirely confidential. 
          </p>
          <p>
            We strictly enforce compliance guidelines matching GDPR (General Data Protection Regulation) and CCPA (California Consumer Privacy Act) requirements regarding user data control, specifically because we gather a total of **zero** pieces of Personally Identifiable Information (PII).
          </p>
        </div>

        {/* Second Supplementary Mid Page Ad Square - Higher user scroll conversions */}
        <div className="w-full flex justify-center py-4 my-4 border-y border-slate-900/40 bg-slate-950/20 rounded-2xl" id="privacy-mid-square-ad-2">
          <AdBanner adKey="c5bdb30469010828e32529cd44eafd76" format="iframe" height={250} width={300} label="SPONSORED SEARCH RESULT" />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-200 font-display">5. Third-Party Links & Social Channels</h4>
          <p>
            If you decide to engage with our official developer resources or click external links (such as navigating to our official Instagram page <strong>@toolifiy</strong>), those target sites retain completely distinct privacy regulations. We strongly recommend evaluating third-party privacy templates when exploring external communities.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-200 font-display">6. Policy updates & Contact Information</h4>
          <p>
            As this platform evolves with extra performance modules, any amendments to our security paradigms will be detailed directly on this page. If you have questions concerning client-side security standards or web development architectures, feel free to direct-message our engineering lead via the links available in the Contact Us panel or via Instagram at <strong>@toolifiy</strong>.
          </p>
        </div>

      </div>

      {/* Embedded High Value Large Square Ad Banner optimized for all devices */}
      <div className="w-full flex justify-center my-6 py-2" id="privacy-bottom-square-ad">
        <AdBanner adKey="c5bdb30469010828e32529cd44eafd76" format="iframe" height={250} width={300} label="SPONSORED TOPIC" />
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-900">
        <button 
          onClick={onClose}
          className="text-xs bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20 px-5 py-2.5 rounded-xl transition duration-150 cursor-pointer flex items-center gap-1.5 font-bold"
        >
          ← Back to Timing Tools
        </button>
      </div>
    </div>
  );
}
