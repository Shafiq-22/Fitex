import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useWorkouts } from '../../hooks/useWorkouts';
import { useProfile } from '../../contexts/ProfileContext';
import { useLiveWorkout } from '../../contexts/LiveWorkoutContext';

export function NextWorkout() {
  const { workouts, plan } = useWorkouts();
  const { activeProfile } = useProfile();
  const { startWorkout } = useLiveWorkout();
  const navigate = useNavigate();

  const todayDow = new Date().getDay(); // 0 = Sunday

  const scheduledWorkout = useMemo(() => {
    if (!plan?.weeklySchedule) return null;
    const planned = plan.weeklySchedule.find((d) => d.dayOfWeek === todayDow);
    if (!planned) return null;
    return workouts.find((w) => w.id === planned.workoutId) ?? null;
  }, [plan, workouts, todayDow]);

  const handleStart = () => {
    if (!scheduledWorkout || !activeProfile) return;
    startWorkout(scheduledWorkout, activeProfile.id);
    navigate(`/live-workout/${scheduledWorkout.id}`);
  };

  if (!scheduledWorkout) {
    return (
      <Card>
        <div className="text-center py-6">
          <p className="text-3xl mb-2">😴</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            Rest Day
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Recovery is part of the process
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
        Next Workout
      </h3>
      <p className="text-lg font-semibold text-slate-900 dark:text-white">
        {scheduledWorkout.name}
      </p>

      <div className="flex flex-wrap gap-1.5 mt-2">
        {scheduledWorkout.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
        {scheduledWorkout.exercises.length} exercise
        {scheduledWorkout.exercises.length !== 1 ? 's' : ''}
      </p>

      <Button className="w-full mt-4" onClick={handleStart}>
        Start Workout
      </Button>
    </Card>
  );
}
