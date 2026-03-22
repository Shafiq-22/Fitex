import { WorkoutCard } from './WorkoutCard'
import { EmptyState } from '../ui/EmptyState'
import type { Workout, WorkoutPlan } from '../../types'

interface Props {
  workouts: Workout[];
  plan: WorkoutPlan | null;
  onStart: (workout: Workout) => void;
}

export function WorkoutModeSelector({ workouts, plan, onStart }: Props) {
  const planWorkouts = plan
    ? plan.weeklySchedule
        .map(day => workouts.find(w => w.id === day.workoutId))
        .filter((w): w is Workout => w !== undefined)
    : [];

  const uniquePlanWorkouts = [...new Map(planWorkouts.map(w => [w.id, w])).values()];

  if (uniquePlanWorkouts.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No workout plan yet"
        description="Complete onboarding to generate your personalized plan, or create custom workouts"
      />
    );
  }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        Your Weekly Plan
      </h3>
      {plan?.weeklySchedule.map((day, i) => {
        const workout = workouts.find(w => w.id === day.workoutId);
        if (!workout) return null;
        const isToday = day.dayOfWeek === today;
        return (
          <div key={i} className="relative">
            {isToday && (
              <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
            )}
            <div className={`ml-3 ${isToday ? 'ring-2 ring-primary/20 rounded-2xl' : ''}`}>
              <div className="text-xs text-slate-400 dark:text-slate-500 mb-1 font-medium">
                {days[day.dayOfWeek]}
                {isToday && <span className="text-primary ml-1">Today</span>}
              </div>
              <WorkoutCard workout={workout} onStart={() => onStart(workout)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
