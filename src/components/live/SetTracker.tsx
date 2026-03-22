import { useState } from 'react';
import type { CompletedExercise } from '../../types';

interface SetTrackerProps {
  exercise: CompletedExercise;
  targetSets: number;
  targetReps: number;
  targetWeight: number | undefined;
  currentSetIndex: number;
  onComplete: (reps: number, weight?: number) => void;
}

export function SetTracker({
  exercise,
  targetSets,
  targetReps,
  targetWeight,
  currentSetIndex,
  onComplete,
}: SetTrackerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [reps, setReps] = useState(targetReps);
  const [weight, setWeight] = useState(targetWeight ?? 0);

  const handleTapCurrent = () => {
    setReps(targetReps);
    setWeight(targetWeight ?? 0);
    setIsEditing(true);
  };

  const handleSubmit = () => {
    onComplete(reps, weight > 0 ? weight : undefined);
    setIsEditing(false);
  };

  const sets = Array.from({ length: targetSets }, (_, i) => i);

  return (
    <div className="space-y-4">
      {/* Set circles row */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {sets.map((i) => {
          const isCompleted = i < exercise.sets.length;
          const isCurrent = i === currentSetIndex;
          return (
            <button
              key={i}
              onClick={isCurrent ? handleTapCurrent : undefined}
              disabled={!isCurrent}
              className={`
                relative flex items-center justify-center rounded-full
                font-semibold text-sm transition-all
                ${isCompleted
                  ? 'w-11 h-11 bg-emerald-500 text-white'
                  : isCurrent
                    ? 'w-13 h-13 border-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 animate-pulse'
                    : 'w-11 h-11 border-2 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                }
              `}
            >
              {isCompleted ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Completed set details */}
      {exercise.sets.length > 0 && (
        <div className="space-y-1.5 px-2">
          {exercise.sets.map((s, i) => (
            <div key={i} className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Set {s.setIndex + 1}</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {s.reps} reps{s.weight ? ` @ ${s.weight}kg` : ''}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Inline edit form */}
      {isEditing && (
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Set {currentSetIndex + 1}
          </p>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Reps</label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-center text-lg font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Weight (kg)</label>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={0.5}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-center text-lg font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 active:scale-[0.98] transition-all"
            >
              Complete Set
            </button>
          </div>
        </div>
      )}

      {/* Hint when not editing */}
      {!isEditing && currentSetIndex < targetSets && (
        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          Tap set {currentSetIndex + 1} to log
        </p>
      )}
    </div>
  );
}
