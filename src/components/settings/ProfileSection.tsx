import { useProfile } from '../../contexts/ProfileContext';
import { useStorage } from '../../hooks/useStorage';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import type { ProfileSettings } from '../../types';

export function ProfileSection() {
  const { activeProfile, updateProfile } = useProfile();
  const profileId = activeProfile?.id ?? '';
  const [settings, setSettings] = useStorage<ProfileSettings>(`endurance:settings:${profileId}`, {
    profileId,
    theme: 'light',
    units: 'metric',
    notifications: { enabled: false },
    feedback: { vibration: true, sound: false },
  });

  const height = activeProfile?.onboardingData?.height?.toString() ?? '';

  function handleHeightChange(val: string) {
    if (!activeProfile || !activeProfile.onboardingData) return;
    const num = parseFloat(val) || undefined;
    updateProfile({
      ...activeProfile,
      onboardingData: {
        ...activeProfile.onboardingData,
        height: num,
      },
    });
  }

  function handleTrainingPhaseChange(val: string) {
    setSettings((prev) => ({ ...prev, trainingPhase: val || undefined }));
  }

  function handleUnitsChange(units: 'metric' | 'imperial') {
    setSettings((prev) => ({ ...prev, units }));
    if (activeProfile?.onboardingData) {
      updateProfile({
        ...activeProfile,
        onboardingData: {
          ...activeProfile.onboardingData,
          units,
        },
      });
    }
  }

  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Profile</h3>
      <div className="space-y-3">
        <Input
          label="Height"
          type="number"
          value={height}
          onChange={handleHeightChange}
          placeholder={settings.units === 'metric' ? 'cm' : 'inches'}
          min="0"
        />
        <Input
          label="Training Phase"
          value={settings.trainingPhase ?? ''}
          onChange={handleTrainingPhaseChange}
          placeholder="e.g., Cutting, Bulking, Maintenance"
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Units</label>
          <div className="flex gap-2">
            {(['metric', 'imperial'] as const).map((u) => (
              <button
                key={u}
                onClick={() => handleUnitsChange(u)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  settings.units === u
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {u.charAt(0).toUpperCase() + u.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
