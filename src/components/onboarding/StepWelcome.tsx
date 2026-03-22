import type { OnboardingData } from '../../types';

interface StepWelcomeProps {
  data: Partial<OnboardingData> & { name?: string };
  onChange: (update: Partial<OnboardingData> & { name?: string }) => void;
}

export function StepWelcome({ data, onChange }: StepWelcomeProps) {
  const units = data.units ?? 'metric';

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      <div className="flex flex-col items-center gap-3 pt-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span className="text-3xl">💪</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Endurance
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-center text-sm">
          Your personal fitness system
        </p>
      </div>

      <div className="w-full flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            What should we call you?
          </label>
          <input
            type="text"
            value={data.name ?? ''}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Your name"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Preferred units
          </label>
          <div className="flex gap-2">
            {(['metric', 'imperial'] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => onChange({ units: u })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  units === u
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {u === 'metric' ? 'Metric (kg/cm)' : 'Imperial (lb/in)'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
