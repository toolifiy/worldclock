import React from 'react';
import { Mail, Instagram, MapPin, Zap, MessageCircle, MessageSquareCode, Award, ArrowUpRight, ArrowLeft } from 'lucide-react';
import AdBanner from './AdBanner';

interface ContactUsProps {
  onClose?: () => void;
}

export default function ContactUsTab({ onClose }: ContactUsProps) {
  return (
    <div className="bg-slate-900/45 border border-slate-900/80 rounded-3xl p-6 sm:p-10 text-left space-y-8 animate-fade-in" id="contact-us-hull">
      
      {/* Header section */}
      <div className="border-b border-slate-800/80 pb-6 flex items-center gap-3 sm:gap-4">
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-900 hover:border-slate-700 transition duration-150 cursor-pointer flex items-center justify-center shrink-0"
            title="Back to Timing Tools"
            id="contact-back-btn"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div className="text-left">
          <h2 className="text-xl sm:text-2xl font-display font-semibold text-slate-100 flex items-center gap-2">
            <MessageCircle className="h-5 sm:h-6 w-5 sm:w-6 text-pink-500 shrink-0" />
            Get in Touch
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
            Direct connection with the creator of Timing Utilities and global productivity assets.
          </p>
        </div>
      </div>

      {/* Embedded Responsive Leaderboard Ad Header optimized for PC/Mobile/Tablet */}
      <div className="w-full flex justify-center animate-fade-in" id="contact-top-leaderboard-ad">
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

      {/* Main Grid: Focus content and direct social CTA card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Focus Card: Massive direct-action Instagram link */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-950/80 border border-slate-900 p-6 sm:p-8 rounded-2xl flex flex-col justify-between h-full relative overflow-hidden group">
            {/* Background absolute styling accent */}
            <div className="absolute top-0 right-0 h-28 w-28 bg-gradient-to-br from-pink-500/10 to-indigo-500/0 rounded-full blur-2xl group-hover:scale-125 transition duration-500" />
            
            <div className="space-y-4 relative z-10">
              <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 font-mono text-[9px] uppercase tracking-wider inline-block">
                Direct Contact Channel
              </span>
              <h3 className="text-lg font-display font-semibold text-slate-200">
                Official Instagram Account
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Skip the ticket queues. If you have recommendations, feedback, business inquiries, or custom feature requests, click the link below to head directly to Instagram and shoot a Direct Message (DM) to <strong>@toolifiy</strong>.
              </p>
            </div>

            <div className="mt-8 pt-4 relative z-10">
              <a 
                href="https://www.instagram.com/toolifiy?igsh=MTJkY3ZmbnhnM2kyNg==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 px-6 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 active:from-pink-700 active:to-indigo-700 text-slate-100 text-sm font-bold rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-pink-500/10"
              >
                <Instagram className="h-5 w-5" />
                <span>DM @toolifiy on Instagram</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </a>
              <span className="text-[10px] text-slate-500 text-center block mt-3 font-mono">
                Clicking links redirects to www.instagram.com/toolifiy
              </span>
            </div>
          </div>
        </div>

        {/* Right Detail Panel: Exhaustive 500+ Words Technical & Operations Documentation */}
        <div className="lg:col-span-7 space-y-6 text-xs sm:text-sm text-slate-400 leading-relaxed">
          
          <div className="space-y-3">
            <h4 className="text-sm font-display font-semibold text-slate-200 flex items-center gap-2">
              <MessageSquareCode className="h-4 w-4 text-indigo-4000" />
              1. Direct Developer Connection Policy
            </h4>
            <p>
              To ensure unmatched product transparency and speed, we retired traditional automated mailing forms on this web portal. Rather than routing user files to stagnant back-office servers, we choose to interact directly with you on our active social profiles. Users can leverage Instagram messages to immediately start dialogues, report client-side anomalies, share screenshots of timesheet configurations, or discuss responsive UI layout improvements.
            </p>
            <p>
              This strategy guarantees you bypass typical intermediate server filters and land directly in the private workspace of the primary software architect. We enjoy receiving feedback from all profiles, including track coaches, gym tutors, full-stack software engineers, and remote digital consultants.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-display font-semibold text-slate-200 flex items-center gap-2">
              <Award className="h-4 w-4 text-teal-400" />
              2. Technical Collaboration Objectives &amp; APIs
            </h4>
            <p>
              Do you have a specific custom feature set in mind? If you wish to embed our high-precision, millisecond-calibrated digital stopwatch, progressive visual ring timer, or multi-city UTC/GMT clock into your own educational blogs or private intranets, we are happy to assist. 
            </p>
            <p>
              Contact our product lead to request customized code guidelines, light theme adaptations, specific IANA timezone arrays, or headless coordinate presets. Send a direct message detailing your targeted platform version (React, Angular, standard Web, or native Android environment), and we'll reply with modular snippets built for your container stack.
            </p>
          </div>

          {/* Supplementary Mid Page Ad Square */}
          <div className="w-full flex justify-center py-4 my-2 border-y border-slate-900/45 bg-slate-950/20 rounded-2xl" id="contact-mid-square-ad">
            <AdBanner adKey="c5bdb30469010828e32529cd44eafd76" format="iframe" height={250} width={300} label="RECOMMENDED ADVERTISEMENT" />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-display font-semibold text-slate-200 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              3. Operational Hours &amp; Dynamic SLA SLA
            </h4>
            <p>
              Our timing suites operate 24 hours a day, 365 days a year. Since our timing logic lives entirely locally inside your client browser, our systems never experience background cluster restarts. If you send a message concerning custom adjustments, our support SLA guarantees:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-500 text-[11px] sm:text-xs">
              <li><strong>Instagram Direct Messages (DM):</strong> Responses typically under 4 to 12 hours depending on current timezone coordinates.</li>
              <li><strong>Development Code Contributions:</strong> Open dialogue reviews with clean documentation formatting inside 24 hours.</li>
              <li><strong>Physical Workspace Integrations:</strong> Comprehensive assistance provided directly to verified partners.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-display font-semibold text-slate-200 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              4. Corporate Headquarters Coordinates
            </h4>
            <p>
              Our coordination and testing hub is stationed in New Delhi, India (operating within Asia/Kolkata timezone limits). We continuously calibrate our systems against global atomic networks to ensure all client devices receive highly optimized web packages without ad-bloatware or slow rendering lags. 
            </p>
            <p>
              We look forward to hearing your insights! Make sure to head over to <strong>@toolifiy</strong> on Instagram, hit follow to stay up to speed with our lightweight web application launches, and drop us a line about how this timing suite serves your daily productivity sprints!
            </p>
          </div>

        </div>

      </div>

      {/* Embedded High Value Large Square Ad Banner optimized for all devices */}
      <div className="w-full flex justify-center my-6 py-2" id="contact-bottom-square-ad">
        <AdBanner adKey="c5bdb30469010828e32529cd44eafd76" format="iframe" height={250} width={300} label="SPONSORED TOPIC" />
      </div>

      {/* Back button container */}
      {onClose && (
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button 
            onClick={onClose}
            className="text-xs bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20 px-5 py-2.5 rounded-xl transition duration-150 cursor-pointer flex items-center gap-1.5 font-bold animate-pulse"
          >
            ← Back to Timing Tools
          </button>
        </div>
      )}

    </div>
  );
}
