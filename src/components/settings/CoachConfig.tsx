import { useState } from 'react';
import { useStorage } from '../../hooks/useStorage';
import { useProfile } from '../../contexts/ProfileContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { ProfileSettings } from '../../types';

export function CoachConfig() {
  const { activeProfile } = useProfile();
  const profileId = activeProfile?.id ?? '';
  const [settings, setSettings] = useStorage<ProfileSettings>(`endurance:settings:${profileId}`, {
    profileId,
    theme: 'light',
    units: 'metric',
    notifications: { enabled: false },
    feedback: { vibration: true, sound: false },
  });

  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);

  const hasKey = !!settings.coachApiKey;

  function handleSave() {
    if (!keyInput.trim()) return;
    setSettings((prev) => ({ ...prev, coachApiKey: keyInput.trim() }));
    setKeyInput('');
  }

  function handleClear() {
    setSettings((prev) => {
      const { coachApiKey: _, ...rest } = prev;
      return { ...rest, coachApiKey: undefined } as ProfileSettings;
    });
  }

  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">AI Coach</h3>
      <div className="space-y-3">
        {hasKey ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-green-50 dark:bg-green-900/20">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-green-700 dark:text-green-400">API key configured</span>
            </div>
            <Button variant="danger" size="sm" onClick={handleClear} className="w-full">
              Clear Key
            </Button>
          </div>
        ) : (
          <>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full px-3.5 py-2.5 pr-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <Button onClick={handleSave} className="w-full" disabled={!keyInput.trim()}>
              Save Key
            </Button>
          </>
        )}
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          Your API key is stored locally only
        </p>
      </div>
    </Card>
  );
}
