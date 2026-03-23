import type { OnboardingData } from '../../types';

interface StepCompleteProps {
  data: Partial<OnboardingData> & { name?: string };
  onFinish: () => void;
}

const GOAL_LABELS: Record<OnboardingData['goal'], string> = {
  strength: 'Strength',
  endurance: 'Endurance',
  hybrid: 'Hybrid',
  weight_loss: 'Weight Loss',
};

const LEVEL_LABELS: Record<OnboardingData['experienceLevel'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function StepComplete({ data, onFinish }: StepCompleteProps) {
  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      {/* Checkmark animation */}
      <div className="pt-8">
        <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center animate-[scale-in_0.4s_ease-out]">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          You're all set{data.name ? `, ${data.name}` : ''}!
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
          Here's a summary of your preferences.
        </p>
      </div>

      {/* Summary card */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
        <div className="flex flex-col gap-3">
          <SummaryRow label="Goal" value={data.goal ? GOAL_LABELS[data.goal] : '—'} />
          <SummaryRow label="Experience" value={data.experienceLevel ? LEVEL_LABELS[data.experienceLevel] : '—'} />
          <SummaryRow label="Days / week" value={data.daysPerWeek ? `${data.daysPerWeek} days` : '—'} />
          <SummaryRow label="Session length" value={data.sessionMinutes ? `${data.sessionMinutes} min` : '—'} />
          <SummaryRow label="Units" value={data.units === 'imperial' ? 'Imperial' : 'Metric'} />
          {data.bodyWeight != null && (
            <SummaryRow
              label="Body weight"
              value={`${data.bodyWeight} ${data.units === 'imperial' ? 'lb' : 'kg'}`}
            />
          )}
          {data.height != null && (
            <SummaryRow
              label="Height"
              value={`${data.height} ${data.units === 'imperial' ? 'in' : 'cm'}`}
            />
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onFinish}
        className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-sm hover:bg-primary-dark transition-all active:scale-[0.98]"
      >
        Start Training
      </button>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );
}
