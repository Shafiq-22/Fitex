export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  profileId: string;
  name: string;
  tags: string[];
  exercises: Exercise[];
  source: 'plan' | 'custom' | 'browse';
  createdAt: string;
}

export interface CompletedSet {
  setIndex: number;
  reps: number;
  weight?: number;
  completedAt: string;
}

export interface CompletedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: CompletedSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  profileId: string;
  workoutId: string;
  workoutName: string;
  startedAt: string;
  finishedAt: string | null;
  durationSeconds: number;
  exercises: CompletedExercise[];
  notes?: string;
  status: 'in_progress' | 'completed';
}

export interface WorkoutPlan {
  id: string;
  profileId: string;
  weeklySchedule: PlannedDay[];
  generatedAt: string;
}

export interface PlannedDay {
  dayOfWeek: number;
  workoutId: string;
}
