import type { OnboardingData } from '../../types';

interface StepGoalsProps {
  data: Partial<OnboardingData>;
  onChange: (update: Partial<OnboardingData>) => void;
}

const GOALS: { value: OnboardingData['goal']; emoji: string; label: string; description: string }[] = [
  { value: 'strength', emoji: '🏋️', label: 'Strength', description: 'Build muscle and increase max lifts' },
  { value: 'endurance', emoji: '🏃', label: 'Endurance', description: 'Improve stamina and cardiovascular fitness' },
  { value: 'hybrid', emoji: '⚡', label: 'Hybrid', description: 'Balance of strength and conditioning' },
  { value: 'weight_loss', emoji: '🔥', label: 'Weight Loss', description: 'Burn fat and improve body composition' },
];

export function StepGoals({ data, onChange }: StepGoalsProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          What's your goal?
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          We'll tailor your experience to match.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {GOALS.map(({ value, emoji, label, description }) => {
          const selected = data.goal === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ goal: value })}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                selected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 shrink-0">
                {emoji}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className={`text-sm font-semibold ${selected ? 'text-primary' : 'text-slate-900 dark:text-slate-100'}`}>
                  {label}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {description}
                </span>
              </div>
              {selected && (
                <span className="ml-auto text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
