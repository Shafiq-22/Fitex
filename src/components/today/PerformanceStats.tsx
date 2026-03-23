import { useMemo } from 'react';
import { useWorkouts } from '../../hooks/useWorkouts';
import { useProfile } from '../../contexts/ProfileContext';
import { useStorage } from '../../hooks/useStorage';
import { calculateStreak, getWeeklySessions } from '../../lib/calc';

interface WeightEntry {
  date: string;
  value: number;
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4">
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
    </div>
  );
}

export function PerformanceStats() {
  const { sessions } = useWorkouts();
  const { activeProfile } = useProfile();
  const profileId = activeProfile?.id ?? '__none__';

  const [weightEntries] = useStorage<WeightEntry[]>(
    `endurance:weight:${profileId}`,
    [],
  );

  const completedSessions = useMemo(
    () => sessions.filter((s) => s.status === 'completed'),
    [sessions],
  );

  const totalWorkouts = completedSessions.length;
  const thisWeek = getWeeklySessions(sessions);
  const streak = calculateStreak(sessions);

  const latestWeight = useMemo(() => {
    if (weightEntries.length === 0) return '--';
    const sorted = [...weightEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return `${sorted[0].value}`;
  }, [weightEntries]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard value={totalWorkouts} label="Total Workouts" />
      <StatCard value={thisWeek} label="This Week" />
      <StatCard value={streak} label="Current Streak" />
      <StatCard value={latestWeight} label="Body Weight" />
    </div>
  );
}
