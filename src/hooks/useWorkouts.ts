import { useCallback } from 'react';
import { useStorage } from './useStorage';
import { useProfile } from '../contexts/ProfileContext';
import { generateId } from '../lib/id';
import type { Workout, WorkoutPlan, WorkoutSession } from '../types/workout';

export function useWorkouts() {
  const { activeProfile } = useProfile();
  const profileId = activeProfile?.id ?? '__none__';

  const [workouts, setWorkouts] = useStorage<Workout[]>(
    `endurance:workouts:${profileId}`,
    [],
  );

  const [plan, setPlan] = useStorage<WorkoutPlan | null>(
    `endurance:plan:${profileId}`,
    null,
  );

  const [sessions, setSessions] = useStorage<WorkoutSession[]>(
    `endurance:sessions:${profileId}`,
    [],
  );

  // ── Workouts CRUD ────────────────────────────────────────

  const addWorkout = useCallback(
    (workout: Omit<Workout, 'id' | 'profileId' | 'createdAt'>) => {
      const newWorkout: Workout = {
        ...workout,
        id: generateId(),
        profileId,
        createdAt: new Date().toISOString(),
      };
      setWorkouts((prev) => [...prev, newWorkout]);
      return newWorkout;
    },
    [profileId, setWorkouts],
  );

  const updateWorkout = useCallback(
    (updated: Workout) => {
      setWorkouts((prev) =>
        prev.map((w) => (w.id === updated.id ? updated : w)),
      );
    },
    [setWorkouts],
  );

  const deleteWorkout = useCallback(
    (workoutId: string) => {
      setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));

      // Also clean up any plan references
      setPlan((prev) => {
        if (!prev) return prev;
        const filtered = prev.weeklySchedule.filter(
          (d) => d.workoutId !== workoutId,
        );
        if (filtered.length === prev.weeklySchedule.length) return prev;
        return { ...prev, weeklySchedule: filtered };
      });
    },
    [setWorkouts, setPlan],
  );

  // ── Plan ─────────────────────────────────────────────────

  const savePlan = useCallback(
    (newPlan: WorkoutPlan, planWorkouts?: Workout[]) => {
      setPlan(newPlan);
      if (planWorkouts && planWorkouts.length > 0) {
        setWorkouts((prev) => {
          // Merge: replace existing by id, append new ones
          const existingIds = new Set(prev.map((w) => w.id));
          const updates = planWorkouts.filter((w) => existingIds.has(w.id));
          const additions = planWorkouts.filter((w) => !existingIds.has(w.id));
          const merged = prev.map((w) => {
            const update = updates.find((u) => u.id === w.id);
            return update ?? w;
          });
          return [...merged, ...additions];
        });
      }
    },
    [setPlan, setWorkouts],
  );

  // ── Sessions ─────────────────────────────────────────────

  const addSession = useCallback(
    (session: Omit<WorkoutSession, 'id' | 'profileId'>) => {
      const newSession: WorkoutSession = {
        ...session,
        id: generateId(),
        profileId,
      };
      setSessions((prev) => [...prev, newSession]);
      return newSession;
    },
    [profileId, setSessions],
  );

  const getSessionsForWorkout = useCallback(
    (workoutId: string): WorkoutSession[] => {
      return sessions.filter((s) => s.workoutId === workoutId);
    },
    [sessions],
  );

  return {
    workouts,
    plan,
    sessions,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    savePlan,
    addSession,
    getSessionsForWorkout,
  };
}
