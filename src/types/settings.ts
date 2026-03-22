export interface ProfileSettings {
  profileId: string;
  theme: 'light' | 'dark' | 'system';
  units: 'metric' | 'imperial';
  trainingPhase?: string;
  notifications: {
    enabled: boolean;
    dailyReminderTime?: string;
  };
  feedback: {
    vibration: boolean;
    sound: boolean;
  };
  coachApiKey?: string;
}
