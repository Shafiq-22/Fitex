import type { OnboardingData } from '../../types';

interface StepExperienceProps {
  data: Partial<OnboardingData>;
  onChange: (update: Partial<OnboardingData>) => void;
}

const LEVELS: { value: OnboardingData['experienceLevel']; label: string; description: string; emoji: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'Less than 6 months of training', emoji: '🌱' },
  { value: 'intermediate', label: 'Intermediate', description: '6 months to 2 years of training', emoji: '🌿' },
  { value: 'advanced', label: 'Advanced', description: 'More than 2 years of training', emoji: '🌳' },
];

export function StepExperience({ data, onChange }: StepExperienceProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Experience level
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This helps us set the right intensity.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {LEVELS.map(({ value, label, description, emoji }) => {
          const selected = data.experienceLevel === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ experienceLevel: value })}
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
