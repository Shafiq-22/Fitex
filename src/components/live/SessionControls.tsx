interface SessionControlsProps {
  onSaveExit: () => void;
  onNextExercise: () => void;
  onFinish: () => void;
  canMoveNext: boolean;
  canFinish: boolean;
}

export function SessionControls({
  onSaveExit,
  onNextExercise,
  onFinish,
  canMoveNext,
  canFinish,
}: SessionControlsProps) {
  return (
    <div className="flex items-center gap-3 pt-4 pb-safe">
      <button
        onClick={onSaveExit}
        className="flex-1 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] transition-all"
      >
        Save & Exit
      </button>

      {canFinish ? (
        <button
          onClick={onFinish}
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-sm"
        >
          Finish Workout
        </button>
      ) : canMoveNext ? (
        <button
          onClick={onNextExercise}
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 active:scale-[0.98] transition-all shadow-sm"
        >
          Next Exercise
        </button>
      ) : null}
    </div>
  );
}
