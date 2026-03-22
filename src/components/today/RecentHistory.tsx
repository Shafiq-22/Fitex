import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useWorkouts } from '../../hooks/useWorkouts';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h ${remainMins}m`;
}

export function RecentHistory() {
  const { sessions } = useWorkouts();

  const recentSessions = useMemo(() => {
    return sessions
      .filter((s) => s.status === 'completed' && s.finishedAt)
      .sort(
        (a, b) =>
          new Date(b.finishedAt!).getTime() - new Date(a.finishedAt!).getTime(),
      )
      .slice(0, 5);
  }, [sessions]);

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
        Recent Workouts
      </h3>

      {recentSessions.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-500 py-4 text-center">
          No workouts yet. Start your first session!
        </p>
      ) : (
        <div className="space-y-2">
          {recentSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {session.workoutName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {format(parseISO(session.finishedAt!), 'MMM d, yyyy')}
                </p>
              </div>
              <Badge>{formatDuration(session.durationSeconds)}</Badge>
            </div>
          ))}
        </div>
      )}

      {recentSessions.length > 0 && (
        <Link
          to="/history"
          className="block text-center text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mt-3 pt-2 border-t border-slate-50 dark:border-slate-800"
        >
          View All History
        </Link>
      )}
    </Card>
  );
}
