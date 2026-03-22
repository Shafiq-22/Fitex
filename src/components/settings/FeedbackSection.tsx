import { useStorage } from '../../hooks/useStorage';
import { useProfile } from '../../contexts/ProfileContext';
import { Card } from '../ui/Card';
import { Toggle } from '../ui/Toggle';
import type { ProfileSettings } from '../../types';

export function FeedbackSection() {
  const { activeProfile } = useProfile();
  const profileId = activeProfile?.id ?? '';
  const [settings, setSettings] = useStorage<ProfileSettings>(`endurance:settings:${profileId}`, {
    profileId,
    theme: 'light',
    units: 'metric',
    notifications: { enabled: false },
    feedback: { vibration: true, sound: false },
  });

  function handleVibrationChange(vibration: boolean) {
    setSettings((prev) => ({
      ...prev,
      feedback: { ...prev.feedback, vibration },
    }));
  }

  function handleSoundChange(sound: boolean) {
    setSettings((prev) => ({
      ...prev,
      feedback: { ...prev.feedback, sound },
    }));
  }

  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Feedback</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-700 dark:text-slate-300">Vibration</span>
          <Toggle
            checked={settings.feedback.vibration}
            onChange={handleVibrationChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-700 dark:text-slate-300">Sound Alerts</span>
          <Toggle
            checked={settings.feedback.sound}
            onChange={handleSoundChange}
          />
        </div>
      </div>
    </Card>
  );
}
