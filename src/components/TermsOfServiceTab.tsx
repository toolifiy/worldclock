import React from 'react';
import { Scale, HelpCircle, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import AdBanner from './AdBanner';

interface TermsOfServiceProps {
  onClose: () => void;
}

export default function TermsOfServiceTab({ onClose }: TermsOfServiceProps) {
  return (
    <div className="space-y-6" id="terms-of-service-hull text-left">
      <div className="flex items-center gap-3 border-b border-slate-900 pb-3">
        <button 
          onClick={onClose}
          className="p-2 sm:p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-900 hover:border-slate-700 transition duration-150 cursor-pointer flex items-center justify-center shrink-0"
          title="Back to Timing Tools"
          id="terms-back-btn"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="text-left">
          <h3 className="text-lg sm:text-xl font-display font-semibold text-slate-100">Terms of Service</h3>
          <p className="text-[10px] sm:text-xs text-slate-500">Effective Date: June 19, 2026 | Global Licensing Agreement</p>
        </div>
      </div>

      {/* Embedded Responsive Leaderboard Ad Header optimized for PC/Mobile/Tablet */}
      <div className="w-full flex justify-center animate-fade-in my-4" id="terms-top-leaderboard-ad">
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
        
        <p className="text-left font-sans">
          Welcome to the <strong>Online Stopwatch, Timer &amp; Clock Suite</strong> (referred to hereafter as the "Service" or "Platform"). By accessing or utilizing any part of this timing application on mobile devices, tablets, or desktop systems, you explicitly consent to these Terms of Service. Please review these contractual provisions carefully before logging corporate billable hours, calibrating athletic fitness intervals, scheduling academic exams, or managing distributed development teams.
        </p>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-200 font-display">1. Permitted Use &amp; Service License</h4>
          <p>
            You are granted a free, non-exclusive, fully revocable, non-transferable, and limited license to operate this tool for personal, athletic, educational, scientific research, and corporate productivity needs. Commercial operators may utilize our timesheet tools to measure corporate consultation durations without requiring paid memberships. 
          </p>
          <p>
            However, under this license, you are strictly prohibited from attempting to automate high-frequency load testing against our content delivery networks, scraping code assets, deploying automated scripts or bots to simulate rapid timing clicks, or injecting malicious executable files into local client states (<em>localStorage</em>). Any reverse engineering of our native synthesizers or structural styles is prohibited.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-200 font-display">2. High-Precision Timing &amp; Technical Disclaimer</h4>
          <p>
            While our development team has implemented microsecond-calibrated performance comparison systems to mitigate standard browser timer drift, you acknowledge that web browsers (such as Google Chrome, Apple's Safari, or Mozilla Firefox) routinely execute timing cycles on standard single-threaded environments. 
          </p>
          <p>
            Standard operating system optimization protocols and energy-saving setups may throttle system ticks if this application is placed in background tabs for extended periods. Consequently, this Platform is delivered purely "As-Is" and "As-Available." 
          </p>
          <p>
            We strongly advise users not to deploy this tool as an official legal apparatus, medical diagnostic system, aviation scheduler, or industrial safety-critical equipment where minor millisecond discrepancies could trigger tangible physical damages or business liabilities.
          </p>
        </div>

        {/* Supplementary Mid Page Ad Square - High CPC monetization impact */}
        <div className="w-full flex justify-center py-4 my-4 border-y border-slate-900/40 bg-slate-950/20 rounded-2xl" id="terms-mid-square-ad-1">
          <AdBanner adKey="c5bdb30469010828e32529cd44eafd76" format="iframe" height={250} width={300} label="RECOMMENDED COMPLIANCE AD" />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-200 font-display">3. User Data Ownership &amp; Local Persistence</h4>
          <p>
            We assert zero ownership or intellectual property claims over your timesheet data, custom alarm configurations, or tab history. You retain absolute control and exclusive ownership of all values inputted. Because our application design strictly prevents data harvesting—choosing not to record or synchronize your stats across cloud portals—you are solely responsible for maintaining robust records.
          </p>
          <p>
            In the event of physical device damage, accidental cache formatting, or major browser updates that wipe client storage blocks, we shall hold zero liability for unrecovered or lost timing logs. We strongly advise users to employ our high-speed **CSV Export** option regularly to extract and archive essential hourly billing spreadsheets locally.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-200 font-display">4. Limitations of General Liability</h4>
          <p>
            To the maximum extent permitted under applicable law, in no event shall our developers, engineering partners, or third-party associations (including <strong>@toolifiy</strong>) be liable for any direct, indirect, incidental, punitive, special, or consequential damages. This includes but is not limited to: loss of project revenues, missed physical appointments, failed alarms due to browser muting policies, lost client consultation track sheets, or temporary service interruptions. You operate this timing platform entirely at your own discretion and risk.
          </p>
        </div>

        {/* Second Supplementary Mid Page Ad Square - Higher user scroll conversions */}
        <div className="w-full flex justify-center py-4 my-4 border-y border-slate-900/40 bg-slate-950/20 rounded-2xl" id="terms-mid-square-ad-2">
          <AdBanner adKey="c5bdb30469010828e32529cd44eafd76" format="iframe" height={250} width={300} label="SPONSORED PLATFORM UPGRADE" />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-200 font-display">5. Code Governance &amp; Intellectual Property</h4>
          <p>
            All custom components, modular layout assets, astronomical Sun/Moon vector structures, interactive sandglass loaders, and specific synthesizer voice nodes present on this Platform remain the exclusive intellectual property of our developers or licensors. Users may not clone, re-package, or re-publish our UI layouts on separate web pages for commercial monetization or visual simulation without written credit or explicit consent from our team.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-200 font-display">6. Third-Party Integrations &amp; Social Connectors</h4>
          <p>
            The website operates in a sandboxed, containerized web space. If you choose to contact the development team through our embedded social vectors (such as navigating to our official Instagram page <strong>@toolifiy</strong>), you accept that those actions connect you to separate digital ecosystems that enforce distinct legal terms and user requirements.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-200 font-display">7. Modifying These Terms &amp; Governing Disputes</h4>
          <p>
            We reserve the right to revise, extend, or prune these conditions as we incorporate advanced productivity, collaboration, or analytical widgets. Continued use of this Platform confirms your agreement to the updated framework. If any clause in these terms is deemed invalid or unenforceable by a court of competent jurisdiction, that specific provision shall be severed from this agreement, and all remaining terms shall continue in full force and effect.
          </p>
        </div>

      </div>

      {/* Embedded High Value Large Square Ad Banner optimized for all devices */}
      <div className="w-full flex justify-center my-6 py-2" id="terms-bottom-square-ad">
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
