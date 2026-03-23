import { useStorage } from '../../hooks/useStorage';
import { useProfile } from '../../contexts/ProfileContext';
import { Card } from '../ui/Card';
import { Toggle } from '../ui/Toggle';
import type { ProfileSettings } from '../../types';

export function NotificationSection() {
  const { activeProfile } = useProfile();
  const profileId = activeProfile?.id ?? '';
  const [settings, setSettings] = useStorage<ProfileSettings>(`endurance:settings:${profileId}`, {
    profileId,
    theme: 'light',
    units: 'metric',
    notifications: { enabled: false },
    feedback: { vibration: true, sound: false },
  });

  async function handleToggle(enabled: boolean) {
    if (enabled && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;
    }
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, enabled },
    }));
  }

  function handleTimeChange(time: string) {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, dailyReminderTime: time },
    }));
  }

  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Notifications</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-700 dark:text-slate-300">Daily Reminders</span>
          <Toggle
            checked={settings.notifications.enabled}
            onChange={handleToggle}
          />
        </div>
        {settings.notifications.enabled && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Reminder Time
            </label>
            <input
              type="time"
              value={settings.notifications.dailyReminderTime ?? '09:00'}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
