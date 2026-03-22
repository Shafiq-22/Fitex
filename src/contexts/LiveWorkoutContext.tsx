import { createContext, useContext, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { useStorage } from '../hooks/useStorage';
import { generateId } from '../lib/id';
import type { Workout, WorkoutSession, CompletedExercise, CompletedSet } from '../types';

interface LiveWorkoutState {
  session: WorkoutSession | null;
  currentExerciseIndex: number;
  currentSetIndex: number;
  isResting: boolean;
  restSeconds: number;
}

interface LiveWorkoutContextValue {
  state: LiveWorkoutState;
  startWorkout: (workout: Workout, profileId: string) => void;
  completeSet: (reps: number, weight?: number) => void;
  skipRest: () => void;
  setRestSeconds: (seconds: number) => void;
  addExerciseNote: (exerciseIndex: number, note: string) => void;
  finishWorkout: (notes?: string) => WorkoutSession | null;
  saveAndExit: () => void;
  moveToNextExercise: () => void;
  isActive: boolean;
}

const LiveWorkoutContext = createContext<LiveWorkoutContextValue | null>(null);

const DEFAULT_REST = 90;

export function LiveWorkoutProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useStorage<LiveWorkoutState>('endurance:liveWorkout', {
    session: null,
    currentExerciseIndex: 0,
    currentSetIndex: 0,
    isResting: false,
    restSeconds: DEFAULT_REST,
  });

  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (state.session?.startedAt) {
      startTimeRef.current = new Date(state.session.startedAt).getTime();
    }
  }, [state.session?.startedAt]);

  const startWorkout = useCallback((workout: Workout, profileId: string) => {
    const exercises: CompletedExercise[] = workout.exercises.map(e => ({
      exerciseId: e.id,
      exerciseName: e.name,
      sets: [],
      notes: e.notes,
    }));

    const session: WorkoutSession = {
      id: generateId(),
      profileId,
      workoutId: workout.id,
      workoutName: workout.name,
      startedAt: new Date().toISOString(),
      finishedAt: null,
      durationSeconds: 0,
      exercises,
      status: 'in_progress',
    };

    setState({
      session,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      isResting: false,
      restSeconds: DEFAULT_REST,
    });
  }, [setState]);

  const completeSet = useCallback((reps: number, weight?: number) => {
    setState(prev => {
      if (!prev.session) return prev;

      const set: CompletedSet = {
        setIndex: prev.currentSetIndex,
        reps,
        weight,
        completedAt: new Date().toISOString(),
      };

      const exercises = [...prev.session.exercises];
      const currentExercise = { ...exercises[prev.currentExerciseIndex] };
      currentExercise.sets = [...currentExercise.sets, set];
      exercises[prev.currentExerciseIndex] = currentExercise;

      const session = { ...prev.session, exercises };

      return {
        ...prev,
        session,
        currentSetIndex: prev.currentSetIndex + 1,
        isResting: true,
      };
    });
  }, [setState]);

  const skipRest = useCallback(() => {
    setState(prev => ({ ...prev, isResting: false }));
  }, [setState]);

  const setRestSeconds = useCallback((seconds: number) => {
    setState(prev => ({ ...prev, restSeconds: Math.max(0, seconds) }));
  }, [setState]);

  const addExerciseNote = useCallback((exerciseIndex: number, note: string) => {
    setState(prev => {
      if (!prev.session) return prev;
      const exercises = [...prev.session.exercises];
      exercises[exerciseIndex] = { ...exercises[exerciseIndex], notes: note };
      return { ...prev, session: { ...prev.session, exercises } };
    });
  }, [setState]);

  const finishWorkout = useCallback((notes?: string) => {
    let finished: WorkoutSession | null = null;
    setState(prev => {
      if (!prev.session) return prev;
      const now = new Date();
      const duration = Math.floor((now.getTime() - new Date(prev.session.startedAt).getTime()) / 1000);
      finished = {
        ...prev.session,
        finishedAt: now.toISOString(),
        durationSeconds: duration,
        status: 'completed' as const,
        notes,
      };
      return {
        session: null,
        currentExerciseIndex: 0,
        currentSetIndex: 0,
        isResting: false,
        restSeconds: DEFAULT_REST,
      };
    });
    return finished;
  }, [setState]);

  const saveAndExit = useCallback(() => {
    setState(prev => {
      if (!prev.session) return prev;
      const now = new Date();
      const duration = Math.floor((now.getTime() - new Date(prev.session.startedAt).getTime()) / 1000);
      return {
        ...prev,
        session: { ...prev.session, durationSeconds: duration },
      };
    });
  }, [setState]);

  const moveToNextExercise = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentExerciseIndex: prev.currentExerciseIndex + 1,
      currentSetIndex: 0,
      isResting: false,
    }));
  }, [setState]);

  const value: LiveWorkoutContextValue = {
    state,
    startWorkout,
    completeSet,
    skipRest,
    setRestSeconds,
    addExerciseNote,
    finishWorkout,
    saveAndExit,
    moveToNextExercise,
    isActive: state.session !== null,
  };

  return (
    <LiveWorkoutContext.Provider value={value}>
      {children}
    </LiveWorkoutContext.Provider>
  );
}

export function useLiveWorkout() {
  const context = useContext(LiveWorkoutContext);
  if (!context) throw new Error('useLiveWorkout must be used within LiveWorkoutProvider');
  return context;
}
