import { useState } from 'react';
import type { WorkoutSession } from '../../types';

interface CompletionSummaryProps {
  session: WorkoutSession;
  personalBests: string[];
  onComplete: (notes?: string) => void;
}

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function CompletionSummary({ session, personalBests, onComplete }: CompletionSummaryProps) {
  const [notes, setNotes] = useState(session.notes ?? '');

  const totalSets = session.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const totalExercises = session.exercises.filter((ex) => ex.sets.length > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Success header */}
        <div className="bg-emerald-500 px-6 pt-8 pb-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 animate-[bounce_0.6s_ease-in-out]">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Workout Complete!</h2>
          <p className="text-emerald-100 text-sm mt-1">{session.workoutName}</p>
        </div>

        {/* Stats */}
        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatDuration(session.durationSeconds)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Duration</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalExercises}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Exercises</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalSets}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sets</p>
            </div>
          </div>

          {/* Personal bests */}
          {personalBests.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3 space-y-1.5">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Personal Bests
              </p>
              {personalBests.map((pb, i) => (
                <p key={i} className="text-sm text-amber-800 dark:text-amber-300">{pb}</p>
              ))}
            </div>
          )}

          {/* Session notes */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Session Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it feel?"
              rows={2}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Done button */}
          <button
            onClick={() => onComplete(notes || undefined)}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
