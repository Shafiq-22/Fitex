import type { WorkoutSession, CompletedExercise } from '../types';
import { format, subDays, parseISO, isSameDay } from 'date-fns';

export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

export function calculateStreak(sessions: WorkoutSession[]): number {
  const completed = sessions
    .filter(s => s.status === 'completed' && s.finishedAt)
    .sort((a, b) => new Date(b.finishedAt!).getTime() - new Date(a.finishedAt!).getTime());

  if (completed.length === 0) return 0;

  let streak = 0;
  let currentDay = new Date();
  currentDay.setHours(0, 0, 0, 0);

  const hasSessionOnDate = (date: Date) =>
    completed.some(s => isSameDay(parseISO(s.finishedAt!), date));

  // Check today or yesterday as starting point
  if (!hasSessionOnDate(currentDay)) {
    currentDay = subDays(currentDay, 1);
    if (!hasSessionOnDate(currentDay)) return 0;
  }

  while (hasSessionOnDate(currentDay)) {
    streak++;
    currentDay = subDays(currentDay, 1);
  }

  return streak;
}

export function getWeeklySessions(sessions: WorkoutSession[]): number {
  const weekAgo = subDays(new Date(), 7);
  return sessions.filter(
    s => s.status === 'completed' && s.finishedAt && new Date(s.finishedAt) >= weekAgo
  ).length;
}

export function getWeeklyVolume(sessions: WorkoutSession[]): { day: string; count: number }[] {
  const result: { day: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dayStr = format(date, 'EEE');
    const count = sessions.filter(
      s => s.status === 'completed' && s.finishedAt && isSameDay(parseISO(s.finishedAt), date)
    ).length;
    result.push({ day: dayStr, count });
  }
  return result;
}

export function getActivityData(sessions: WorkoutSession[], weeks: number = 12): { date: string; count: number }[] {
  const result: { date: string; count: number }[] = [];
  const totalDays = weeks * 7;
  for (let i = totalDays - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = sessions.filter(
      s => s.status === 'completed' && s.finishedAt && format(parseISO(s.finishedAt), 'yyyy-MM-dd') === dateStr
    ).length;
    result.push({ date: dateStr, count });
  }
  return result;
}

export function detectPersonalBests(
  currentSession: WorkoutSession,
  history: WorkoutSession[]
): string[] {
  const pbs: string[] = [];
  const pastSessions = history.filter(s => s.id !== currentSession.id && s.status === 'completed');

  for (const exercise of currentSession.exercises) {
    const maxWeight = Math.max(0, ...exercise.sets.filter(s => s.weight).map(s => s.weight!));
    const maxReps = Math.max(0, ...exercise.sets.map(s => s.reps));

    if (maxWeight === 0 && maxReps === 0) continue;

    let bestPastWeight = 0;
    let bestPastReps = 0;

    for (const session of pastSessions) {
      const pastExercise = session.exercises.find(
        (e: CompletedExercise) => e.exerciseName === exercise.exerciseName
      );
      if (pastExercise) {
        for (const set of pastExercise.sets) {
          if (set.weight && set.weight > bestPastWeight) bestPastWeight = set.weight;
          if (set.reps > bestPastReps) bestPastReps = set.reps;
        }
      }
    }

    if (maxWeight > bestPastWeight && maxWeight > 0) {
      pbs.push(`${exercise.exerciseName}: New weight PB - ${maxWeight}kg`);
    }
    if (maxReps > bestPastReps && maxReps > 0 && pastSessions.length > 0) {
      pbs.push(`${exercise.exerciseName}: New reps PB - ${maxReps} reps`);
    }
  }

  return pbs;
}
