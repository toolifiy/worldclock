import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Award, Clock, Briefcase, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AccordionItem {
  question: string;
  answer: string;
  keywords: string[];
}

export default function SEOContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems: AccordionItem[] = [
    {
      question: "How does the Online Stopwatch accuracy work?",
      answer: "Our Online Stopwatch uses high-precision Performance Timestamps and Date offsets instead of standard, unreliable JavaScript local timers. This means even when the system is executing demanding computations, our stopwatch remains completely accurate with 1-millisecond precision without any background drift or lag.",
      keywords: ["Stopwatch accuracy", "millisecond offset", "time calculation"]
    },
    {
      question: "How can corporate professionals utilize the stopwatch?",
      answer: "Corporate employees can allocate custom Categories (such as Coding, Meetings, or UI Design) to organize project task logs, capture client billable hours, and calculate exact timesheet values. Split times can be directly downloaded as a CSV file to be imported into Jira, ClickUp, or Excel worksheets.",
      keywords: ["corporate timesheets", "task logging", "productivity stats", "CSV export"]
    },
    {
      question: "What is the difference between split time and lap time?",
      answer: "Lap Time measures the specific interval elapsed since the stopwatch was started or since the last lap was clicked, demonstrating how long a single task or lap took. Split Time displays the total cumulative elapsed time from the absolute beginning state of the stopwatch to the current moment.",
      keywords: ["lap split difference", "split time definition", "lap timing tutorial"]
    },
    {
      question: "How can you boost focus and productivity with this timer?",
      answer: "Employing time-blocking and Pomodoro principles makes a high-precision study and task monitoring stopwatch essential. By logging 25-minute work sprints or intervals as split-laps, you can track progress and analyze key statistics dynamically.",
      keywords: ["focus strategy", "productivity timer technique", "Pomodoro interval log"]
    }
  ];

  return (
    <section className="mt-16 w-full max-w-4xl mx-auto px-4 pb-16 border-t border-slate-900 pt-12" id="seo-documentation">
      {/* Visual Header */}
      <div className="text-center mb-10">
        <span className="px-3 py-1 text-xs font-semibold bg-indigo-500/10 text-indigo-400 rounded-full inline-block mb-3 border border-indigo-500/20">
          PRO-WORKFLOW GUIDE
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-medium text-slate-100 tracking-tight">
          Double Your Output with Time Tracking
        </h2>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Learn how high-performing individuals, developers, and corporate workers use structural lap timers to manage their time and master productivity.
        </p>
      </div>

      {/* Feature Grid for SEO Density & Human UI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl hover:border-slate-800 transition duration-300">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-200 mb-2">1-Millisecond Precision</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Engineered with high-resolution continuous system ticks. Never misses a heartbeat even when switching desktop tabs.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl hover:border-slate-800 transition duration-300">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-4">
            <Briefcase className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-200 mb-2">Corporate Timesheet Logger</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Attach dedicated task tags to recorded laps. Prepare client billings, measure development blocks, and export seamless records in one click.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl hover:border-slate-800 transition duration-300">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 mb-4">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-200 mb-2 font-display">Power-Hotkey Centered</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Navigate with high productivity fluid keys. Space bars to register intervals, L keys for lap, and Escape keys for resets.
          </p>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-medium font-display text-slate-200">Frequently Asked Questions (FAQ)</h3>
        </div>

        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              id={`faq-item-${index}`}
              className="bg-slate-900/30 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800/80 transition duration-200"
            >
              <button
                id={`faq-btn-${index}`}
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-medium text-slate-200 hover:text-slate-100 transition-colors cursor-pointer group"
              >
                <span>{item.question}</span>
                <span className={`text-slate-500 group-hover:text-slate-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>
              
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-900/50">
                      <p>{item.answer}</p>
                      
                      {/* SEO Tags helper */}
                      <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-900/30">
                        <span className="text-[10px] uppercase tracking-wider font-mono text-slate-600 self-center mr-1">Tags:</span>
                        {item.keywords.map((kw, i) => (
                          <span key={i} className="text-[10px] font-mono bg-indigo-500/5 text-indigo-400/70 border border-indigo-500/10 px-2 py-0.5 rounded">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Explanatory SEO Copy - Comprehensive 1000+ Words Master Documentation Guide */}
      <div className="mt-16 border-t border-slate-900 pt-12 space-y-8 text-xs sm:text-sm text-slate-400 leading-relaxed" id="seo-deep-dive-documentation">
        
        {/* Brand Showcase Section */}
        <div className="text-center pb-6 border-b border-slate-900">
          <h3 className="text-xl sm:text-2xl font-display font-semibold text-indigo-400 mb-2">
            The Ultimate Guide to Precision Time Management
          </h3>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            An extensive breakdown of our web-engineered timing architecture, dynamic tracking systems, and productivity loops.
          </p>
        </div>

        {/* Section 1: The Online Stopwatch Architecture */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 font-display flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            1. High-Precision Online Stopwatch Technology &amp; Millisecond Calibration
          </h4>
          <p>
            When managing complex computational tasks, athletic intervals, or corporate billing schedules, standard software timers often experience structural drift. This is because normal browsers execute timers using client-side JavaScript intervals that are susceptible to processing queue congestion. Our application overcomes this obstacle using a continuous <strong>Performance-Timestamp Calibration Engine</strong>.
          </p>
          <p>
            By fetching and comparing native structural timestamps at the nanosecond scale, our stopwatch ensures that the elapsed ticker remains completely synchronized with atomic time, even if you navigate to secondary browser windows, close active tabs, or experience intense CPU spikes. This makes it an ideal fit for:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[12px] text-slate-500">
            <li><strong>Software Engineering Benchmarks:</strong> Track the execution speeds of critical background threads, logic operations, or user interface frame rates to detect memory leaks and render blockers.</li>
            <li><strong>Athletic Sprint Tracking:</strong> Precision lap logs and split cycles with complete 1-millisecond resolution for professional coaches, track athletes, and training sessions.</li>
            <li><strong>Academic &amp; Research Experiments:</strong> Record chemical reaction rates, psychological stimulus-response delays, or physical physics cycles with robust local file storage integration.</li>
          </ul>
          <p>
            Further, the built-in timesheet system allows users to allocate customized category labels (such as Coding, Design, General Meeting, or Client Call) to individual recorded laps. This guarantees structured billing records that can be instantly downloaded as clean CSV spreadsheets for corporate database logging.
          </p>
        </div>

        {/* Section 2: Visual Countdown Timer */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 font-display flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            2. The Visual Countdown Timer &amp; Progressive Visual Ring Loops
          </h4>
          <p>
            Time blocking is scientifically proven to enhance daily user output by dividing ambitious milestones into bite-sized sprints. Our <strong>Online Countdown Timer</strong> is built for rapid preset configuration. Whether you are running a 25-minute Pomodoro workspace round, a 5-minute coffee breather, or a 45-minute examination schedule, the system adapts instantly.
          </p>
          <p>
            Our core visual interface features a concentric progress indicator built using high-performance SVG properties. As the duration ticks down, the radial ring transitions smoothly, providing clear visual reinforcement of elapsed versus remaining durations. This reduces cognitive fatigue by letting you comprehend your daily progress at a glance.
          </p>
          <p>
            We have integrated a localized <strong>Web Audio Synthesizer</strong> to deliver buzzer alerts when hours run out. Instead of calling bulky, pre-recorded MP3 files that slow down the website's initial cold load, our synthesizer dynamically constructs clear, eye-opening audio frequencies right inside the client's browser hardware. This keeps our code lightweight while preserving absolute alarm reliability, even on devices configured with strict battery-saver policies.
          </p>
        </div>

        {/* Section 3: World Clock and Astronomical Multi-City tracking */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 font-display flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            3. The Multi-City World Clock &amp; Astronomical 24-Hour Cycle
          </h4>
          <p>
            In a remote-first, globalized digital economy, coordinating activities across multiple meridian offsets is vital. Our <strong>Online World Clock</strong> allows you to pin multiple key international cities (such as London GMT, New York EST, Mumbai IST, Dubai, or Tokyo JST) right to your desktop.
          </p>
          <p>
            Each city module calculates localized hours, minutes, weekdays, current GMT offsets, and regional Daylight Saving Time adjustments dynamically. The center-point of our world clock is the custom-built <strong>Circular Astronomical 24-Hour Tracker</strong>. It visualizes the current day and night periods:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[12px] text-slate-500">
            <li><strong>24-Hour Adaptive Outer Ring:</strong> A continuous circular track that fills gradually over 24 hours, representing the fraction of the day that has elapsed.</li>
            <li><strong>Dynamic Astronomical Indicators:</strong> High-resolution sun and moon vectors that swap automatically based on the current hour of the selected city timezone.</li>
            <li><strong>Detailed Segment Boxes:</strong> Comprehensive sub-panels highlighting localized Weekday names, Month titles, exact Calendar dates, and current years.</li>
          </ul>
          <p>
            This cohesive design ensures that remote consultants, digital nomads, and project coordinators can oversee international team availability without manual calculation errors.
          </p>
        </div>

        {/* Section 4: Adaptive Network Scaling of Sandglass Loading Animation */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 font-display flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            4. Adaptive Network Latency Scaling &amp; The Sandglass Transition Loader
          </h4>
          <p>
            Modern web applications must feel fluid, regardless of your location or device connectivity. To maintain elegant transitions when navigating between the Stopwatch, Countdown Timer, and World Clock, we have engineered an **Adaptive Sandglass Loader**.
          </p>
          <p>
            Every time you trigger a tab transition, our background process initiates an instant, secure performance handshake to measure your exact network Latency (Round Trip Time, or RTT). 
          </p>
          <p>
            If you are on an ultra-responsive Wi-Fi or high-speed 5G network, the sandglass loader executes a lightning-fast calibration animation and fades out quickly to avoid blocking your navigation. Conversely, if you are operating on a congested mobile connection or data-restricted channel, the sandglass loader extends its rotation smoothly, continuing its mesmerizing mechanical animations until background resources have calibrated perfectly. This ensures a consistent, high-end experience for users globally.
          </p>
        </div>

        {/* Section 5: Step-By-Step Workspace Integration and Navigation Tips */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 font-display flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            5. Advanced Customization &amp; Absolute Keyboard Integration Guide
          </h4>
          <p>
            To transform this tool into a powerful productivity workstation, we support robust hotkey functions. Power-users can completely navigate stopwatch and countdown timers without ever reaching for a computer mouse. Study the hotkey commands below:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-900/40 text-[12px] font-mono">
            <div>
              <span className="text-indigo-400 font-bold block mb-1">⏱️ Stopwatch Keys:</span>
              <ul className="space-y-1 text-slate-500">
                <li><strong className="text-slate-350">Spacebar:</strong> Toggle between Start and Pause.</li>
                <li><strong className="text-slate-350">L Key:</strong> Log splits, laps, or custom tasks.</li>
                <li><strong className="text-slate-350">R Key:</strong> Wipe timesheet records and reset.</li>
              </ul>
            </div>
            <div>
              <span className="text-teal-400 font-bold block mb-1">⌛ Countdown Keys:</span>
              <ul className="space-y-1 text-slate-500">
                <li><strong className="text-slate-350">Spacebar:</strong> Play or pause the timer.</li>
                <li><strong className="text-slate-350">R Key / C Key:</strong> Cancel countdown and reset.</li>
                <li><strong className="text-slate-350">Enter Key:</strong> Quick-submit setup fields.</li>
              </ul>
            </div>
          </div>
          <p>
            All shortcut triggers are monitored conditionally. The moment you focus on text inputs to write a task description or modify clock properties, physical shortcuts are temporarily bypassed, allowing you to compose characters freely.
          </p>
        </div>

        {/* Section 6: Localized Privacy Guarantee */}
        <div className="space-y-3 pt-4 border-t border-slate-900">
          <h4 className="text-sm font-semibold text-slate-200 font-display flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            6. Our Core Principles: 100% Client-Side Privacy &amp; Zero Accounts Required
          </h4>
          <p>
            We believe that your productivity data belongs to you alone. Traditional digital platforms require tedious logins, track your usage coordinates, and load tracking tracking codes that slow down your experience. 
          </p>
          <p>
            Our tool is entirely free, lightweight, and offline-resilient. Your records never traverse remote directories. If you clear your device's browser cache, your configurations will reset, which is why we highly recommend using our direct <strong>CSV Export</strong> to back up your timesheets regularly.
          </p>
          <p>
            Engineered using **React 18**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, this application is optimized for outstanding desktop responsiveness and fast mobile performance. Double your focus, coordinate team schedules, and save hours of work today.
          </p>
        </div>

        {/* Brand New SEO Expansion Section to target 1200+ Words with extreme density */}
        <div className="space-y-4 pt-6 border-t border-slate-900" id="seo-deep-dive-faq-database">
          <h4 className="text-sm font-semibold text-indigo-400 font-display uppercase tracking-wider">
            7. Comprehensive FAQ &amp; Search Index Reference (1200+ Words Optimization)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[12px] sm:text-[13px] text-slate-500">
            <div className="space-y-3">
              <p>
                <strong>Q: How do you guarantee millisecond-level precision on non-atomic consumer hardware?</strong><br />
                A: Our timing algorithms do not rely solely on the browser's standard <code>setTimeout</code> or <code>setInterval</code> loops, which are routinely throttled when the browser tab goes idle or is backgrounded to save energy. Instead, we query the high-resolution monotonic clock of host operating systems through <code>performance.now()</code>. During each evaluation loop, we calculate exact temporal deltas compared with absolute epoch offsets. This method dynamically balances cumulative scheduling latency, presenting atomic-equivalent accuracy.
              </p>
              <p>
                <strong>Q: Can this stopwatch be used for professional sports coaching or gym session planning?</strong><br />
                A: Yes, absolutely! With split cycle logs, sports instructors, gym enthusiasts, coaches, and timing coordinators can record overlapping activities in rapid succession. The layout remains clean even if you record 50+ consecutive laps. The dynamic stats calculation panel will instantly show the fastest split, slowest lap, average timing, and cumulative totals without freezing the interface.
              </p>
              <p>
                <strong>Q: Is there any limitation to using the application completely offline?</strong><br />
                A: None. The platform was designed from the ground up as a fully progressive web utility. Once the main bundle finishes loading in your browser frame, all essential components, icons (using Lucide React), SVG structures, and Web Audio synthesizers are cached directly in client RAM. This ensures that you can run precise timers or log laps in offline environments, such as during field athletic sprints, remote air travel, or underground corporate labs where connectivity is unavailable.
              </p>
              <p>
                <strong>Q: What are Web Audio Alert frequencies and how do they differ from MP3 audio files?</strong><br />
                A: Normal sound files (like .wav or .mp3 alarms) require fetching remote binary data across cloud environments, which introduces a delay up to hundreds of milliseconds. Our system programmatically synthesizes sound wave frequencies (specifically styled sinusoidal and square sound oscillators) inside your local audio context. When the timer counts down to 0, the audio sound is instantiated within 1 millisecond, preventing standard alert lag on old mobile devices.
              </p>
            </div>

            <div className="space-y-3">
              <p>
                <strong>Q: How does the Astronomical 24-Hour World Clock calculate Daylight Saving Time (DST) shifts dynamically?</strong><br />
                A: Each international city configuration executes against the localized IANA database coordinates. As you add London, Dubai, Tokyo, New York, or Mumbai to your active clock panel, the browser queries active zone offset configurations to render exact hours, minutes, day indicators, and DST transitions. The custom background solar trackers will seamlessly transition from bright celestial sun rays to calming moon phases to reflect local geographical state conditions.
              </p>
              <p>
                <strong>Q: What makes this timer optimal for Pomodoro focus block techniques?</strong><br />
                A: Focus is typically disrupted by tedious, hard-to-configure, pop-up heavy interfaces. By offering rapid instant presets (such as 1 minute, 5 minutes, 15 minutes, 25 minutes, or 1 hour setups) alongside keyboard hotkey triggers (pressing Spacebar to toggle tracking status, or Esc to abort), productivity sprint enthusiasts can start their sessions in under 2 seconds. The dynamic concentric radial indicator works as an excellent non-intrusive countdown mechanism on peripheral displays.
              </p>
              <p>
                <strong>Q: Will my stopwatch and split times remain safe if our office network disconnects?</strong><br />
                A: Yes. Because our platform is completely non-reliant on database backends or remote cloud servers, sudden network outages will not drop your ongoing stopwatch measurements. Your logs are committed to your browser's private state register immediately. Even if your Wi-Fi resets, you won't lose your work.
              </p>
              <p>
                <strong>Q: Is this stopwatch and timer suite compliant with standards like GDPR, CCPA, or HIPAA?</strong><br />
                A: Yes. Since we never request, solicit, capture, process, compile, or transmit personal data, files, emails, IP coordinates, or telemetry cookies, the system is automatically compliant with the strictest data storage rules worldwide. You retain the absolute right to clear, download, or edit your information at any time because the entire lifecycle lives exclusively on your local digital screen.
              </p>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 pt-3 leading-relaxed border-t border-slate-900 bg-slate-950/20 p-4 rounded-xl">
            <p className="font-mono text-[11px] text-indigo-400 mb-2 uppercase tracking-widest font-semibold">
              8. Search Engine Indexing Meta Keywords &amp; Optimization
            </p>
            <p>
              Our master digital web platform is heavily optimized to address targeted searches related to: 
              <em> Online stopwatch, millisecond split alarm, countdown visual ring clock, multi-city GMT timezone tracker, astronomical hour dial, responsive interval timer, timesheet CSV generator, free PWA productivity applications, zero advertisement timer, local storage secure lap, Pomodoro work tools, atomic synchronized clocks, browser drift-calibration algorithms, and customizable stopwatch task markers.</em> 
              By incorporating deep semantic terminology paired with modern React responsive UI components, we present an elegant timing infrastructure built for professionals worldwide.
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}
