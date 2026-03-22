import type { OnboardingData } from '../../types';

interface StepScheduleProps {
  data: Partial<OnboardingData>;
  onChange: (update: Partial<OnboardingData>) => void;
}

const DAYS_OPTIONS = [2, 3, 4, 5, 6];
const DURATION_OPTIONS = [30, 45, 60, 90];

export function StepSchedule({ data, onChange }: StepScheduleProps) {
  const units = data.units ?? 'metric';
  const weightLabel = units === 'metric' ? 'kg' : 'lb';
  const heightLabel = units === 'metric' ? 'cm' : 'in';

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Your schedule
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          How often and how long can you train?
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Days per week */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Days per week
          </label>
          <div className="flex gap-2">
            {DAYS_OPTIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onChange({ daysPerWeek: d })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  data.daysPerWeek === d
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Session duration */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Session duration
          </label>
          <div className="flex gap-2">
            {DURATION_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onChange({ sessionMinutes: m })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  data.sessionMinutes === m
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        {/* Body weight */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Body weight ({weightLabel})
            <span className="text-slate-400 dark:text-slate-500 font-normal"> — optional</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={data.bodyWeight ?? ''}
            onChange={(e) =>
              onChange({ bodyWeight: e.target.value ? Number(e.target.value) : undefined })
            }
            placeholder={units === 'metric' ? 'e.g. 75' : 'e.g. 165'}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>

        {/* Height */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Height ({heightLabel})
            <span className="text-slate-400 dark:text-slate-500 font-normal"> — optional</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={data.height ?? ''}
            onChange={(e) =>
              onChange({ height: e.target.value ? Number(e.target.value) : undefined })
            }
            placeholder={units === 'metric' ? 'e.g. 178' : 'e.g. 70'}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
      </div>
    </div>
  );
}
