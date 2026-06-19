import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, MapPin, Globe, Sparkles, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClockCity } from '../types';
import { audioEngine } from './AudioEngine';

interface WorldClockTabProps {
  soundEnabled: boolean;
}

// Available standard global timezones configuration database
const PRESET_TIMEZONES = [
  { name: 'Kolkata (New Delhi, Mumbai, Bengaluru, Chennai)', zone: 'Asia/Kolkata', icon: 'public' },
  { name: 'London (Edinburgh, Belfast, Dublin)', zone: 'Europe/London', icon: 'public' },
  { name: 'New York (Washington D.C., Boston, Miami, Toronto)', zone: 'America/New_York', icon: 'schedule' },
  { name: 'Los Angeles (San Francisco, Seattle, Las Vegas, Vancouver)', zone: 'America/Los_Angeles', icon: 'compass' },
  { name: 'Chicago (Houston, Dallas, Austin, Winnipeg, Mexico City)', zone: 'America/Chicago', icon: 'schedule' },
  { name: 'Denver (Salt Lake City, Calgary, Edmonton)', zone: 'America/Denver', icon: 'compass' },
  { name: 'Phoenix (Arizona)', zone: 'America/Phoenix', icon: 'map' },
  { name: 'Tokyo (Kyoto, Osaka)', zone: 'Asia/Tokyo', icon: 'map' },
  { name: 'Seoul (Incheon, Busan, Pyongyang)', zone: 'Asia/Seoul', icon: 'map' },
  { name: 'Singapore (Kuala Lumpur, Manila)', zone: 'Asia/Singapore', icon: 'public' },
  { name: 'Hong Kong (Beijing, Shanghai, Taipei)', zone: 'Asia/Hong_Kong', icon: 'map' },
  { name: 'Sydney (Melbourne, Canberra)', zone: 'Australia/Sydney', icon: 'compass' },
  { name: 'Brisbane (AEST, No DST)', zone: 'Australia/Brisbane', icon: 'compass' },
  { name: 'Adelaide (Darwin)', zone: 'Australia/Adelaide', icon: 'schedule' },
  { name: 'Dubai (Abu Dhabi, Muscat)', zone: 'Asia/Dubai', icon: 'pace' },
  { name: 'Paris (Berlin, Rome, Madrid, Amsterdam)', zone: 'Europe/Paris', icon: 'schedule' },
  { name: 'Cairo (Johannesburg, Jerusalem)', zone: 'Africa/Cairo', icon: 'map' },
  { name: 'Athens (Helsinki, Istanbul, Bucharest)', zone: 'Europe/Athens', icon: 'map' },
  { name: 'Moscow (St. Petersburg, Minsk)', zone: 'Europe/Moscow', icon: 'public' },
  { name: 'Riyadh (Nairobi, Baghdad, Addis Ababa)', zone: 'Asia/Riyadh', icon: 'public' },
  { name: 'Bangkok (Jakarta, Hanoi, Ho Chi Minh)', zone: 'Asia/Bangkok', icon: 'pace' },
  { name: 'Dhaka (Almaty, Thimphu)', zone: 'Asia/Dhaka', icon: 'public' },
  { name: 'Karachi (Tashkent, Yekaterinburg)', zone: 'Asia/Karachi', icon: 'schedule' },
  { name: 'Kabul (Afghanistan)', zone: 'Asia/Kabul', icon: 'map' },
  { name: 'Tehran (Iran)', zone: 'Asia/Tehran', icon: 'schedule' },
  { name: 'Kathmandu (Nepal)', zone: 'Asia/Kathmandu', icon: 'pace' },
  { name: 'Yangon (Myanmar)', zone: 'Asia/Yangon', icon: 'public' },
  { name: 'Auckland (Wellington, Fiji)', zone: 'Pacific/Auckland', icon: 'compass' },
  { name: 'Sao Paulo (Brasilia, Rio de Janeiro)', zone: 'America/Sao_Paulo', icon: 'public' },
  { name: 'Buenos Aires (Montevideo)', zone: 'America/Argentina/Buenos_Aires', icon: 'schedule' },
  { name: 'Santiago (Chile)', zone: 'America/Santiago', icon: 'compass' },
  { name: 'Honolulu (Hawaii, Tahiti)', zone: 'Pacific/Honolulu', icon: 'compass' },
  { name: 'Anchorage (Alaska)', zone: 'America/Anchorage', icon: 'map' },
  { name: 'Reykjavik (Iceland, Dakar)', zone: 'Atlantic/Reykjavik', icon: 'public' },
  { name: 'Caracas (Venezuela)', zone: 'America/Caracas', icon: 'map' },
  { name: 'Bogota (Lima, Quito)', zone: 'America/Bogota', icon: 'compass' },
] as const;

const getTimezoneCities = (zone: string): string[] => {
  switch (zone) {
    case 'Asia/Kolkata':
      return ['Kolkata', 'Mumbai', 'New Delhi', 'Bengaluru', 'Chennai'];
    case 'Europe/London':
      return ['London', 'Edinburgh', 'Belfast', 'Dublin'];
    case 'America/New_York':
      return ['New York', 'Washington D.C.', 'Boston', 'Miami', 'Toronto'];
    case 'America/Los_Angeles':
      return ['Los Angeles', 'San Francisco', 'Seattle', 'Las Vegas', 'Vancouver'];
    case 'America/Chicago':
      return ['Chicago', 'Houston', 'Dallas', 'Austin', 'Winnipeg', 'Mexico City'];
    case 'America/Denver':
      return ['Denver', 'Salt Lake City', 'Calgary', 'Edmonton'];
    case 'America/Phoenix':
      return ['Phoenix', 'Tucson', 'Mesa'];
    case 'Asia/Tokyo':
      return ['Tokyo', 'Osaka', 'Kyoto'];
    case 'Asia/Seoul':
      return ['Seoul', 'Incheon', 'Busan', 'Pyongyang'];
    case 'Asia/Singapore':
      return ['Singapore', 'Kuala Lumpur', 'Manila'];
    case 'Asia/Hong_Kong':
      return ['Hong Kong', 'Beijing', 'Shanghai', 'Taipei'];
    case 'Australia/Sydney':
      return ['Sydney', 'Melbourne', 'Canberra', 'Hobart'];
    case 'Australia/Brisbane':
      return ['Brisbane', 'Cairns', 'Gold Coast'];
    case 'Australia/Adelaide':
      return ['Adelaide', 'Darwin', 'Alice Springs'];
    case 'Asia/Dubai':
      return ['Dubai', 'Abu Dhabi', 'Muscat', 'Sharjah'];
    case 'Europe/Paris':
      return ['Paris', 'Berlin', 'Rome', 'Madrid', 'Amsterdam', 'Brussels', 'Vienna'];
    case 'Africa/Cairo':
      return ['Cairo', 'Johannesburg', 'Jerusalem', 'Cape Town'];
    case 'Europe/Athens':
      return ['Athens', 'Helsinki', 'Istanbul', 'Bucharest', 'Sofia'];
    case 'Europe/Moscow':
      return ['Moscow', 'St. Petersburg', 'Minsk', 'Nizhny Novgorod'];
    case 'Asia/Riyadh':
      return ['Riyadh', 'Nairobi', 'Baghdad', 'Addis Ababa', 'Kuwait City'];
    case 'Asia/Bangkok':
      return ['Bangkok', 'Jakarta', 'Hanoi', 'Ho Chi Minh', 'Phnom Penh'];
    case 'Asia/Dhaka':
      return ['Dhaka', 'Almaty', 'Thimphu', 'Astana'];
    case 'Asia/Karachi':
      return ['Karachi', 'Tashkent', 'Yekaterinburg', 'Lahore'];
    case 'Asia/Kabul':
      return ['Kabul', 'Herat', 'Kandahar'];
    case 'Asia/Tehran':
      return ['Tehran', 'Mashhad', 'Isfahan'];
    case 'Asia/Kathmandu':
      return ['Kathmandu', 'Pokhara', 'Lalitpur'];
    case 'Asia/Yangon':
      return ['Yangon', 'Mandalay', 'Naypyidaw'];
    case 'Pacific/Auckland':
      return ['Auckland', 'Wellington', 'Suva', 'Christchurch'];
    case 'America/Sao_Paulo':
      return ['Sao Paulo', 'Brasilia', 'Rio de Janeiro', 'Belo Horizonte'];
    case 'America/Argentina/Buenos_Aires':
      return ['Buenos Aires', 'Cordoba', 'Rosario'];
    case 'America/Santiago':
      return ['Santiago', 'Valparaiso', 'Concepcion'];
    case 'Pacific/Honolulu':
      return ['Honolulu', 'Hilo', 'Kailua', 'Papeete (Tahiti)'];
    case 'America/Anchorage':
      return ['Anchorage', 'Juneau', 'Fairbanks'];
    case 'Atlantic/Reykjavik':
      return ['Reykjavik', 'Dakar', 'Akureyri'];
    case 'America/Caracas':
      return ['Caracas', 'Maracaibo', 'Valencia'];
    case 'America/Bogota':
      return ['Bogota', 'Lima', 'Quito', 'Medellin'];
    default:
      return [];
  }
};

export default function WorldClockTab({ soundEnabled }: WorldClockTabProps) {
  const [now, setNow] = useState<Date>(new Date());
  const [showAddCityDrawer, setShowAddCityDrawer] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<ClockCity | null>(null);

  // Default active monitored cities list (persisted to localStorage)
  const [activeCities, setActiveCities] = useState<ClockCity[]>(() => {
    const saved = localStorage.getItem('world_clock_active_cities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to default
      }
    }
    return [
      { id: 'london-1', name: 'London', timezone: 'Europe/London', offsetHoursLabel: '+8HRS', icon: 'public' },
      { id: 'ny-2', name: 'New York', timezone: 'America/New_York', offsetHoursLabel: '+3HRS', icon: 'schedule' },
      { id: 'tokyo-3', name: 'Tokyo', timezone: 'Asia/Tokyo', offsetHoursLabel: '+16HRS', icon: 'map' },
      { id: 'dubai-4', name: 'Dubai', timezone: 'Asia/Dubai', offsetHoursLabel: '+11HRS', icon: 'pace' },
    ];
  });

  // Keep state saved in localStorage
  useEffect(() => {
    localStorage.setItem('world_clock_active_cities', JSON.stringify(activeCities));
  }, [activeCities]);

  // Keep internal tick running on second intervals
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate local user context settings
  const localTimeInfo = React.useMemo(() => {
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}:${seconds}`;

    const timeZoneStr = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offsetMin = -now.getTimezoneOffset();
    const hoursOffset = Math.floor(Math.abs(offsetMin) / 60);
    const minsOffset = Math.abs(offsetMin) % 60;
    const sign = offsetMin >= 0 ? '+' : '-';
    
    // Day display
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[now.getDay()];

    return {
      formattedTime: timeStr,
      timezone: timeZoneStr,
      offsetLabel: `UTC ${sign}${hoursOffset}:${minsOffset.toString().padStart(2, '0')}`,
      day: currentDay,
    };
  }, [now]);

  // High precision dynamic active time calculator (Local browser timezone or selected city timezone)
  const activeTimeInfo = React.useMemo(() => {
    let tz = localTimeInfo.timezone;
    if (selectedCity) {
      tz = selectedCity.timezone;
    }

    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const parts = formatter.formatToParts(now);
      const hStr = parts.find(p => p.type === 'hour')?.value || '0';
      const mStr = parts.find(p => p.type === 'minute')?.value || '0';
      const sStr = parts.find(p => p.type === 'second')?.value || '0';
      const weekdayStr = parts.find(p => p.type === 'weekday')?.value || 'Friday';
      const monthStr = parts.find(p => p.type === 'month')?.value || 'June';
      const dayStr = parts.find(p => p.type === 'day')?.value || '19';
      const yearStr = parts.find(p => p.type === 'year')?.value || '2026';

      const hr = parseInt(hStr, 10);
      const min = parseInt(mStr, 10);
      const sec = parseInt(sStr, 10);

      // Compute elapsed seconds in the 24-hour cycle
      const totalSecondsInDay = 24 * 60 * 60;
      const elapsedSeconds = (hr * 3600) + (min * 60) + sec;
      const progressPercent = (elapsedSeconds / totalSecondsInDay) * 100;

      // 12-hour AM/PM calculation
      const ampm = hr >= 12 ? 'PM' : 'AM';
      const displayHr12 = hr % 12 === 0 ? 12 : hr % 12;
      const displayTime12 = `${displayHr12.toString().padStart(2, '0')}:${mStr.padStart(2, '0')}:${sStr.padStart(2, '0')} ${ampm}`;
      const displayTime24 = `${hStr.padStart(2, '0')}:${mStr.padStart(2, '0')}:${sStr.padStart(2, '0')}`;

      // Dynamic Day/Night Segment
      let daySegment = 'Night';
      if (hr >= 4 && hr < 12) daySegment = 'Morning';
      else if (hr >= 12 && hr < 16) daySegment = 'Afternoon';
      else if (hr >= 16 && hr < 21) daySegment = 'Evening';

      const isNight = hr >= 19 || hr < 5;

      return {
        progressPercent,
        time24: displayTime24,
        time12: displayTime12,
        daySegment,
        isNight,
        weekDayName: weekdayStr,
        monthName: monthStr,
        dayOfMonth: dayStr,
        yearNum: yearStr,
        timezone: tz
      };
    } catch (e) {
      // Graceful fallback
      const hr = now.getHours();
      const min = now.getMinutes();
      const sec = now.getSeconds();
      const progressPercent = (((hr * 3600) + (min * 60) + sec) / (24 * 3600)) * 100;
      const ampm = hr >= 12 ? 'PM' : 'AM';
      const displayHr12 = hr % 12 === 0 ? 12 : hr % 12;

      return {
        progressPercent,
        time24: `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`,
        time12: `${displayHr12.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')} ${ampm}`,
        daySegment: (hr >= 16 && hr < 21) ? 'Evening' : (hr >= 12 && hr < 16) ? 'Afternoon' : (hr >= 4 && hr < 12) ? 'Morning' : 'Night',
        isNight: hr >= 19 || hr < 5,
        weekDayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()],
        monthName: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][now.getMonth()],
        dayOfMonth: now.getDate().toString(),
        yearNum: now.getFullYear().toString(),
        timezone: tz
      };
    }
  }, [now, selectedCity, localTimeInfo.timezone]);

  // Dynamic timezone calculation helper
  const calculateTimezoneTime = (tz: string) => {
    try {
      // Formatter options
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const parts = formatter.formatToParts(now);
      const h = parts.find(p => p.type === 'hour')?.value || '00';
      const m = parts.find(p => p.type === 'minute')?.value || '00';
      const s = parts.find(p => p.type === 'second')?.value || '00';

      // Date alignment checking (Today / Tomorrow / Yesterday)
      const formatterDate = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      const formattedDateStr = formatterDate.format(now);
      const targetDate = new Date(formattedDateStr);
      
      const localDateStr = formatterDate.format(now); // Comparison key
      const localCompareDate = new Date(localDateStr);

      const diffTime = targetDate.getTime() - localCompareDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let dayTag = 'Today';
      if (diffDays > 0) {
        dayTag = 'Tomorrow';
      } else if (diffDays < 0) {
        dayTag = 'Yesterday';
      }

      // Calculation of simple hour comparison offset relative to client timezone
      const browserOffsetMinutes = now.getTimezoneOffset(); // -60 means UTC+1
      
      // Compute UTC timestamp
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      
      // Compute specific timezone offset
      const formatterTzCheck = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        hour12: false,
      });
      const currentHrStr = formatterTzCheck.format(now);
      
      // Let's keep offset dynamic relative to local timezone
      const formatterUTC = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        hour: 'numeric',
        hour12: false,
      });
      const utcHr = parseInt(formatterUTC.format(now), 10) || 0;
      const targetHr = parseInt(currentHrStr, 10) || 0;

      let hrDiff = targetHr - utcHr;
      if (hrDiff > 12) hrDiff -= 24;
      if (hrDiff < -12) hrDiff += 24;

      const offsetLabel = hrDiff >= 0 ? `+${hrDiff}HRS` : `${hrDiff}HRS`;

      return {
        timeString: `${h}:${m}:${s}`,
        dayLabel: `${dayTag}, ${offsetLabel}`,
      };
    } catch (e) {
      return {
        timeString: '00:00:00',
        dayLabel: 'Conversion Error',
      };
    }
  };

  // Add individual custom city block
  const handleAddCity = (preset: typeof PRESET_TIMEZONES[number]) => {
    // Avoid double entries
    if (activeCities.some(c => c.timezone === preset.zone)) {
      setShowAddCityDrawer(false);
      return;
    }

    const newCity: ClockCity = {
      id: Math.random().toString(36).substring(2, 9),
      name: preset.name,
      timezone: preset.zone,
      offsetHoursLabel: '+0HRS', // Recalculated dynamically in render code
      icon: preset.icon as any,
    };

    setActiveCities(prev => [...prev, newCity]);
    setShowAddCityDrawer(false);
  };

  // Delete designated city
  const handleDeleteCity = (id: string) => {
    setActiveCities(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="w-full flex flex-col gap-6" id="world-clock-tab">
      
      {/* Current User Browser Local Location Display Card */}
      <div className="mb-6">
        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 block mb-2 flex items-center gap-1.5">
          <MapPin className="h-3 w-3 text-emerald-400" />
          {selectedCity ? 'Selected Location timezone' : 'Active Browser Location'}
        </span>
        <div className="bg-slate-900/40 border border-indigo-500/10 rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden" id="local-clock-card">
          <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-6 md:gap-8 z-10 relative">
            
            {/* Left Column: Beautiful Circular Clock With Dynamic 24h Progress */}
            <div className="flex items-center justify-center shrink-0 w-full sm:w-auto">
              <div className="relative w-[190px] h-[190px] flex items-center justify-center rounded-full bg-slate-950 border border-slate-900 shadow-inner">
                {/* SVG circular track and blue animated progress stroke representing 24-hours */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="95"
                    cy="95"
                    r="82"
                    className="stroke-slate-900"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="95"
                    cy="95"
                    r="82"
                    className="stroke-indigo-500"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 82}
                    animate={{ strokeDashoffset: (2 * Math.PI * 82) - (2 * Math.PI * 82 * activeTimeInfo.progressPercent) / 100 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </svg>

                {/* Internal Center Time & Icons */}
                <div className="absolute flex flex-col items-center justify-center text-center p-2">
                  {/* Sun or Moon with label inside circle */}
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 mb-1 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                    {activeTimeInfo.isNight ? '🌙 Night' : '☀️ Day'}
                  </span>

                  {/* Dynamic 24-Hr Time display */}
                  <span className="text-2xl text-slate-100 font-bold tracking-tight glow-active font-mono leading-none">
                    {activeTimeInfo.time24}
                  </span>

                  {/* Slightly smaller 12-hour AM/PM text display */}
                  <span className="text-[11px] text-indigo-400 font-bold font-mono bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-900/30 mt-1.5">
                    {activeTimeInfo.time12}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Information fields layout (Evening, Week Day, Month, Year details) */}
            <div className="flex-1 flex flex-col justify-between w-full space-y-4">
              
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1 pb-1">
                  {selectedCity && (
                    <button
                      onClick={() => { setSelectedCity(null); if (soundEnabled) audioEngine.playTick(); }}
                      className="p-1 px-2.5 rounded bg-slate-950 border border-slate-800 hover:bg-slate-900 text-indigo-400 hover:text-indigo-300 text-[10px] font-semibold transition flex items-center gap-1 cursor-pointer mr-3"
                      title="Back to local timezone"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      <span>Back to Local</span>
                    </button>
                  )}
                  <h2 className="text-xl sm:text-2xl font-display font-medium text-indigo-400 self-center">
                    {selectedCity ? `${selectedCity.name} Timezone` : 'Your Local Timezone'}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-850 font-mono text-slate-400">
                    {selectedCity ? selectedCity.timezone : localTimeInfo.timezone}
                  </span>
                  <span className="text-slate-600 font-bold text-xs">•</span>
                  <span className="text-xs text-slate-400">
                    {selectedCity ? calculateTimezoneTime(selectedCity.timezone).dayLabel : `${localTimeInfo.day}, ${localTimeInfo.offsetLabel}`}
                  </span>
                </div>
              </div>

              {/* Dynamic segmented boxes containing Evening, Week Day, Month, and Year */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-900/60 shadow-inner">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest block">Day Segment</span>
                  <span className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                    {activeTimeInfo.daySegment === 'Morning' && '🌅 Morning'}
                    {activeTimeInfo.daySegment === 'Afternoon' && '☀️ Afternoon'}
                    {activeTimeInfo.daySegment === 'Evening' && '🌇 Evening'}
                    {activeTimeInfo.daySegment === 'Night' && '🌙 Night'}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest block">Week Day</span>
                  <span className="text-sm font-semibold text-slate-300">{activeTimeInfo.weekDayName}</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest block">Month</span>
                  <span className="text-sm font-semibold text-slate-300">
                    {activeTimeInfo.monthName} {activeTimeInfo.dayOfMonth}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest block">Year</span>
                  <span className="text-sm font-semibold text-slate-300">{activeTimeInfo.yearNum}</span>
                </div>
              </div>

              {/* Footer status line inside the box */}
              <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-2 border-t border-slate-950/50">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse animate-duration-[1200ms]" />
                  <span>Atomic Chronometer Feed Active</span>
                </div>
                <span>{selectedCity ? 'Selected City Calibrated' : 'Auto Localized Clock'}</span>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Grid Header and trigger actions */}
      <div className="flex items-center justify-between mt-2 mb-1">
        <div>
          <h3 className="font-display font-medium text-slate-200 text-base">
            {selectedCity ? 'Cities Sharing this Timezone' : 'Global Core Cities'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {selectedCity 
              ? 'Locations aligned with this active timezone (Non-interactive)' 
              : 'Track multi-national client times and development logs'}
          </p>
        </div>

        {selectedCity ? (
          <button 
            onClick={() => { setSelectedCity(null); if (soundEnabled) audioEngine.playTick(); }}
            className="p-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-805 text-slate-300 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Show All Cities</span>
          </button>
        ) : (
          <button 
            onClick={() => setShowAddCityDrawer(true)}
            className="p-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-slate-100 text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-md shadow-indigo-600/10"
            id="add-city-trigger"
          >
            <Plus className="h-4 w-4" />
            <span>Add City</span>
          </button>
        )}
      </div>

      {/* Global cities listing stack container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="world-clock-cities-grid">
        {selectedCity ? (
          // View of Sibling cities sharing this timezone (Non-interactive)
          getTimezoneCities(selectedCity.timezone).map((siblingCityName, idx) => {
            const timeObj = calculateTimezoneTime(selectedCity.timezone);
            return (
              <div
                key={`${siblingCityName}-${idx}`}
                className="bg-slate-900/10 border border-slate-900/60 p-4.5 rounded-2xl flex items-center justify-between select-none pointer-events-none opacity-80"
                id={`sibling-city-${idx}`}
              >
                {/* Left Side Info Details */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-900 text-indigo-400 shrink-0">
                    <Globe className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{siblingCityName}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {timeObj.dayLabel}
                    </p>
                  </div>
                </div>

                {/* Right Side Time calculations */}
                <div className="text-right font-mono pr-2">
                  <span className="text-lg sm:text-xl text-slate-100 font-bold block tracking-tight">
                    {timeObj.timeString}
                  </span>
                  <span className="text-[9px] text-slate-600 block uppercase font-sans font-medium tracking-wider">aligned</span>
                </div>
              </div>
            );
          })
        ) : (
          // Default Dashboard view: All active monitored global towns (Interactive)
          <AnimatePresence>
            {activeCities.map((city) => {
              const timeObj = calculateTimezoneTime(city.timezone);
              return (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  onClick={() => {
                    setSelectedCity(city);
                    if (soundEnabled) audioEngine.playTick();
                  }}
                  className="bg-slate-900/20 border border-slate-900/80 p-4.5 rounded-2xl flex items-center justify-between hover:border-indigo-500/40 hover:bg-slate-900/40 transition duration-200 group cursor-pointer"
                  id={`world-clock-city-${city.id}`}
                  title={`Click to view details of ${city.name}`}
                >
                  
                  {/* Left Side Info details */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-900 text-indigo-400 group-hover:text-indigo-300 transition shrink-0">
                      <Globe className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">{city.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {timeObj.dayLabel}
                      </p>
                    </div>
                  </div>

                  {/* Right Side Time ticker & controls */}
                  <div className="flex items-center gap-3.5">
                    <div className="text-right font-mono">
                      <span className="text-lg sm:text-xl text-slate-100 font-bold block tracking-tight">
                        {timeObj.timeString}
                      </span>
                      <span className="text-[9px] text-slate-600 block uppercase font-sans font-medium tracking-wider">calculated</span>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid selecting city view
                        handleDeleteCity(city.id);
                        if (soundEnabled) audioEngine.playTick();
                      }}
                      className="p-1.5 text-slate-600 hover:text-red-400 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer relative z-10"
                      title={`Delete ${city.name} from dashboard`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {(!selectedCity && activeCities.length === 0) && (
          <div className="md:col-span-2 text-center py-12 px-4 border border-dashed border-slate-900 rounded-2xl text-slate-500 space-y-2">
            <Globe className="h-6 w-6 text-slate-705 mx-auto opacity-40" />
            <p className="text-xs font-display">No additional cities tracked on screen</p>
            <p className="text-[10px] text-slate-600 font-sans">Click the "+ Add City" button above to track international locations.</p>
          </div>
        )}
      </div>

      {/* Elegant Modal Popup for Adding Cities */}
      <AnimatePresence>
        {showAddCityDrawer && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 relative shadow-2xl"
              id="add-city-modal"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-950">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-base font-semibold text-slate-100 font-display">Select Worldwide Location</h3>
                </div>
                <button 
                  onClick={() => setShowAddCityDrawer(false)}
                  className="text-slate-400 hover:text-slate-200 text-sm font-semibold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-400 mb-4">
                Choose a major international hub city to monitor live offsets relative to your standard local performance:
              </p>

              {/* Predefined zones list scroll */}
              <div className="max-h-[385px] overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
                {(() => {
                  const sortedPresets = [...PRESET_TIMEZONES].sort((a, b) => {
                    const aAdded = activeCities.some(c => c.timezone === a.zone);
                    const bAdded = activeCities.some(c => c.timezone === b.zone);
                    if (aAdded && !bAdded) return 1;  // push added to bottom
                    if (!aAdded && bAdded) return -1; // keep unadded at top
                    return 0;
                  });

                  return sortedPresets.map((pz, idx) => {
                    const isAlreadyAdded = activeCities.some(c => c.timezone === pz.zone);
                    return (
                      <button
                        key={pz.zone}
                        disabled={isAlreadyAdded}
                        onClick={() => handleAddCity(pz)}
                        className="w-full text-left p-3 rounded-xl border border-slate-950 bg-slate-950/40 hover:bg-slate-950 hover:border-slate-800/80 disabled:opacity-40 disabled:hover:bg-slate-950/40 disabled:hover:border-slate-900 flex items-center justify-between text-xs text-slate-300 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          {/* Numeric index display for identification */}
                          <span className="h-5 w-5 shrink-0 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-slate-400">
                            {idx + 1}
                          </span>
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-200 block">{pz.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono block">{pz.zone}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-indigo-400 font-semibold font-mono pr-1">
                          {isAlreadyAdded ? 'Added' : 'Select'}
                        </span>
                      </button>
                    );
                  });
                })()}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-950 text-[10px] text-slate-500 leading-normal">
                🌍 Zones adjust dynamically in accordance with seasonal Daylight Savings Time (DST) automatically.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
