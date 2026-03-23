import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import type { OnboardingData } from '../../types';
import { StepWelcome } from './StepWelcome';
import { StepGoals } from './StepGoals';
import { StepExperience } from './StepExperience';
import { StepSchedule } from './StepSchedule';
import { StepComplete } from './StepComplete';

const TOTAL_STEPS = 5;
const STEP_LABELS = ['Welcome', 'Goals', 'Experience', 'Schedule', 'Complete'];

type FlowData = Partial<OnboardingData> & { name?: string };

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FlowData>({ units: 'metric' });
  const { activeProfile, updateProfile } = useProfile();
  const navigate = useNavigate();

  const handleChange = useCallback((update: Partial<FlowData>) => {
    setData((prev) => ({ ...prev, ...update }));
  }, []);

  const canAdvance = (): boolean => {
    switch (step) {
      case 0:
        return Boolean(data.name?.trim());
      case 1:
        return Boolean(data.goal);
      case 2:
        return Boolean(data.experienceLevel);
      case 3:
        return Boolean(data.daysPerWeek && data.sessionMinutes);
      default:
        return true;
    }
  };

  const handleFinish = useCallback(() => {
    if (!activeProfile) return;

    const onboardingData: OnboardingData = {
      goal: data.goal!,
      experienceLevel: data.experienceLevel!,
      daysPerWeek: data.daysPerWeek!,
      sessionMinutes: data.sessionMinutes!,
      units: data.units ?? 'metric',
      ...(data.bodyWeight != null && { bodyWeight: data.bodyWeight }),
      ...(data.height != null && { height: data.height }),
    };

    updateProfile({
      ...activeProfile,
      name: data.name?.trim() || activeProfile.name,
      onboardingComplete: true,
      onboardingData,
    });

    navigate('/');
  }, [activeProfile, data, updateProfile, navigate]);

  return (
    <div className="min-h-dvh flex flex-col bg-surface-secondary dark:bg-surface-dark">
      {/* Progress bar */}
      <div className="px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {STEP_LABELS[step]}
          </span>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {step + 1} / {TOTAL_STEPS}
          </span>
        </div>
        <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        {step === 0 && <StepWelcome data={data} onChange={handleChange} />}
        {step === 1 && <StepGoals data={data} onChange={handleChange} />}
        {step === 2 && <StepExperience data={data} onChange={handleChange} />}
        {step === 3 && <StepSchedule data={data} onChange={handleChange} />}
        {step === 4 && <StepComplete data={data} onFinish={handleFinish} />}
      </div>

      {/* Navigation buttons */}
      {step < 4 && (
        <div className="fixed bottom-0 left-0 right-0 px-5 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3 bg-gradient-to-t from-surface-secondary via-surface-secondary dark:from-surface-dark dark:via-surface-dark">
          <div className="flex gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium transition-all hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98]"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance()}
              className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm transition-all hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
