export interface Lap {
  id: string;
  lapNumber: number;
  durationMs: number; // Duration of this specific lap
  cumulativeMs: number; // Total overall elapsed time up to this lap
  timestamp: number; // Chronological time recorded
}

export type TimerStatus = 'IDLE' | 'RUNNING' | 'PAUSED';

export interface StopwatchStats {
  totalTimeMs: number;
  totalLaps: number;
  fastestLap: Lap | null;
  slowestLap: Lap | null;
  averageLapMs: number;
}

export type ActiveTab = 'STOPWATCH' | 'TIMER' | 'WORLD_CLOCK' | 'PRIVACY' | 'TERMS' | 'CONTACT';

export interface ClockCity {
  id: string;
  name: string;
  timezone: string; // IANA timezone dynamic name
  offsetHoursLabel: string; // e.g. "+5:30 HRS"
  icon: 'public' | 'schedule' | 'pace' | 'map' | 'compass';
}

