import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveWorkout } from '../../contexts/LiveWorkoutContext';
import { useTimer } from '../../hooks/useTimer';
import { useWorkouts } from '../../hooks/useWorkouts';
import { detectPersonalBests } from '../../lib/calc';
import { SetTracker } from './SetTracker';
import { RestTimer } from './RestTimer';
import { ExerciseNotes } from './ExerciseNotes';
import { SessionControls } from './SessionControls';
import { CompletionSummary } from './CompletionSummary';
import type { WorkoutSession } from '../../types';

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function LiveWorkoutScreen() {
  const navigate = useNavigate();
  const { state, completeSet, skipRest, setRestSeconds, addExerciseNote, finishWorkout, saveAndExit, moveToNextExercise } = useLiveWorkout();
  const { sessions, addSession } = useWorkouts();

  const [completedSession, setCompletedSession] = useState<WorkoutSession | null>(null);
  const [personalBests, setPersonalBests] = useState<string[]>([]);

  const elapsed = useTimer({ mode: 'stopwatch' });

  // Start the stopwatch on mount
  useEffect(() => {
    elapsed.start();
    return () => elapsed.pause();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const session = state.session;

  // Derive the original workout exercises for target info.
  // The session stores completed exercises; we need target sets/reps/weight from the original workout.
  // Since we don't have the original workout object here, we infer targets from the session structure.
  // The context populates exercises from the workout on start, so we can use the workout data
  // that was stored when starting. For target sets/reps/weight we need the original Workout.
  // We'll get it from useWorkouts.
  const { workouts } = useWorkouts();

  const originalWorkout = useMemo(
    () => (session ? workouts.find((w) => w.id === session.workoutId) : undefined),
    [session, workouts],
  );

  // Compute progress
  const { progressPercent } = useMemo(() => {
    if (!session || !originalWorkout) return { totalExpected: 0, totalCompleted: 0, progressPercent: 0 };
    const expected = originalWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
    const completed = session.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    return {
      totalExpected: expected,
      totalCompleted: completed,
      progressPercent: expected > 0 ? Math.round((completed / expected) * 100) : 0,
    };
  }, [session, originalWorkout]);

  const currentExercise = session?.exercises[state.currentExerciseIndex];
  const originalExercise = originalWorkout?.exercises[state.currentExerciseIndex];

  const allSetsForCurrentDone = currentExercise && originalExercise
    ? currentExercise.sets.length >= originalExercise.sets
    : false;

  const isLastExercise = session
    ? state.currentExerciseIndex >= session.exercises.length - 1
    : false;

  const canMoveNext = allSetsForCurrentDone && !isLastExercise;
  const canFinish = allSetsForCurrentDone && isLastExercise;

  // Handle set completion
  const handleCompleteSet = useCallback(
    (reps: number, weight?: number) => {
      completeSet(reps, weight);
    },
    [completeSet],
  );

  // Handle finish
  const handleFinish = useCallback(() => {
    const finished = finishWorkout();
    if (finished) {
      const pbs = detectPersonalBests(finished, sessions);
      setPersonalBests(pbs);
      setCompletedSession(finished);
    }
  }, [finishWorkout, sessions]);

  // Handle save & exit
  const handleSaveExit = useCallback(() => {
    saveAndExit();
    navigate(-1);
  }, [saveAndExit, navigate]);

  // Handle completion summary done
  const handleCompletionDone = useCallback(
    (notes?: string) => {
      if (completedSession) {
        addSession({
          ...completedSession,
          notes: notes ?? completedSession.notes,
        });
      }
      setCompletedSession(null);
      navigate('/');
    },
    [completedSession, addSession, navigate],
  );

  // Handle close button
  const handleClose = useCallback(() => {
    handleSaveExit();
  }, [handleSaveExit]);

  // If no active session, redirect
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <p className="text-slate-500 dark:text-slate-400 mb-4">No active workout session.</p>
        <button
          onClick={() => navigate('/')}
          className="text-sm font-medium text-blue-500 hover:text-blue-600"
        >
          Go Home
        </button>
      </div>
    );
  }

  // Completion summary overlay
  if (completedSession) {
    return (
      <CompletionSummary
        session={completedSession}
        personalBests={personalBests}
        onComplete={handleCompletionDone}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 pt-safe pb-2 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={handleClose}
          className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          aria-label="Close workout"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <h1 className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
            {session.workoutName}
          </h1>
          <p className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
            {formatTime(elapsed.seconds)}
          </p>
        </div>

        <button
          onClick={handleSaveExit}
          className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
        >
          Save
        </button>
      </header>

      {/* Progress bar */}
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Exercise {state.currentExerciseIndex + 1} of {session.exercises.length}
          </span>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {progressPercent}%
          </span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-4 space-y-5">
        {/* Current exercise card */}
        {currentExercise && originalExercise && (
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {currentExercise.exerciseName}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {originalExercise.sets} sets x {originalExercise.reps} reps
                {originalExercise.weight ? ` @ ${originalExercise.weight}kg` : ''}
              </p>
            </div>

            <SetTracker
              exercise={currentExercise}
              targetSets={originalExercise.sets}
              targetReps={originalExercise.reps}
              targetWeight={originalExercise.weight}
              currentSetIndex={state.currentSetIndex}
              onComplete={handleCompleteSet}
            />

            <ExerciseNotes
              notes={currentExercise.notes}
              onChange={(note) => addExerciseNote(state.currentExerciseIndex, note)}
            />
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="px-4 border-t border-slate-100 dark:border-slate-800">
        <SessionControls
          onSaveExit={handleSaveExit}
          onNextExercise={moveToNextExercise}
          onFinish={handleFinish}
          canMoveNext={canMoveNext}
          canFinish={canFinish}
        />
      </div>

      {/* Rest timer overlay */}
      {state.isResting && (
        <RestTimer
          restSeconds={state.restSeconds}
          onSkip={skipRest}
          onAddTime={(s) => setRestSeconds(state.restSeconds + s)}
        />
      )}
    </div>
  );
}
