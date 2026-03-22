export interface Profile {
  id: string;
  name: string;
  avatarColor: string;
  createdAt: string;
  onboardingComplete: boolean;
  onboardingData: OnboardingData | null;
}

export interface OnboardingData {
  goal: 'strength' | 'endurance' | 'hybrid' | 'weight_loss';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  sessionMinutes: number;
  bodyWeight?: number;
  height?: number;
  units: 'metric' | 'imperial';
}
