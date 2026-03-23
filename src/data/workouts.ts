export interface WorkoutTemplate {
  id: string;
  name: string;
  tags: string[];
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    notes?: string;
  }[];
}

export const workoutTemplates: WorkoutTemplate[] = [
  // ── PPL Split ────────────────────────────────────────────
  {
    id: 'tmpl-push-day',
    name: 'Push Day',
    tags: ['push', 'chest', 'shoulders', 'triceps', 'upper'],
    description:
      'Chest, shoulders, and triceps with compound presses and isolation finishers.',
    difficulty: 'intermediate',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8, weight: 60 },
      { name: 'Overhead Press', sets: 4, reps: 8, weight: 40 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 24 },
      { name: 'Lateral Raise', sets: 3, reps: 15, weight: 8 },
      { name: 'Tricep Pushdown', sets: 3, reps: 12, weight: 25 },
      { name: 'Cable Fly', sets: 3, reps: 12, weight: 15 },
    ],
  },
  {
    id: 'tmpl-pull-day',
    name: 'Pull Day',
    tags: ['pull', 'back', 'biceps', 'upper'],
    description:
      'Back and biceps focused with heavy rows, pull-ups, and curls.',
    difficulty: 'intermediate',
    exercises: [
      { name: 'Deadlift', sets: 4, reps: 5, weight: 100 },
      { name: 'Barbell Row', sets: 4, reps: 8, weight: 60 },
      { name: 'Pull-ups', sets: 3, reps: 8, notes: 'Add weight if needed' },
      { name: 'Seated Cable Row', sets: 3, reps: 10, weight: 50 },
      { name: 'Face Pull', sets: 3, reps: 15, weight: 20 },
      { name: 'Barbell Curl', sets: 3, reps: 10, weight: 25 },
    ],
  },
  {
    id: 'tmpl-legs-day',
    name: 'Legs Day',
    tags: ['legs', 'lower', 'glutes', 'quads', 'hamstrings'],
    description:
      'Complete lower-body session targeting quads, hamstrings, glutes, and calves.',
    difficulty: 'intermediate',
    exercises: [
      { name: 'Barbell Squat', sets: 4, reps: 8, weight: 80 },
      { name: 'Romanian Deadlift', sets: 3, reps: 10, weight: 60 },
      { name: 'Leg Press', sets: 4, reps: 10, weight: 120 },
      { name: 'Walking Lunges', sets: 3, reps: 12, weight: 20, notes: 'Per leg' },
      { name: 'Leg Curl', sets: 3, reps: 12, weight: 35 },
      { name: 'Standing Calf Raise', sets: 4, reps: 15, weight: 60 },
    ],
  },

  // ── Upper / Lower Split ──────────────────────────────────
  {
    id: 'tmpl-upper-body',
    name: 'Upper Body',
    tags: ['upper', 'chest', 'back', 'shoulders', 'arms'],
    description:
      'Balanced upper-body session hitting chest, back, shoulders, and arms.',
    difficulty: 'intermediate',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8, weight: 60 },
      { name: 'Barbell Row', sets: 4, reps: 8, weight: 60 },
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: 10, weight: 20 },
      { name: 'Lat Pulldown', sets: 3, reps: 10, weight: 50 },
      { name: 'Hammer Curl', sets: 3, reps: 12, weight: 14 },
      { name: 'Tricep Pushdown', sets: 3, reps: 12, weight: 25 },
      { name: 'Lateral Raise', sets: 3, reps: 15, weight: 8 },
    ],
  },
  {
    id: 'tmpl-lower-body',
    name: 'Lower Body',
    tags: ['lower', 'legs', 'glutes', 'quads', 'hamstrings'],
    description:
      'Heavy lower-body workout with squats, deadlifts, and accessory work.',
    difficulty: 'intermediate',
    exercises: [
      { name: 'Barbell Squat', sets: 4, reps: 8, weight: 80 },
      { name: 'Romanian Deadlift', sets: 3, reps: 10, weight: 60 },
      { name: 'Bulgarian Split Squat', sets: 3, reps: 10, weight: 16, notes: 'Per leg' },
      { name: 'Leg Extension', sets: 3, reps: 12, weight: 40 },
      { name: 'Leg Curl', sets: 3, reps: 12, weight: 35 },
      { name: 'Hip Thrust', sets: 3, reps: 10, weight: 60 },
      { name: 'Standing Calf Raise', sets: 4, reps: 15, weight: 60 },
    ],
  },

  // ── Full Body ────────────────────────────────────────────
  {
    id: 'tmpl-full-body-a',
    name: 'Full Body A',
    tags: ['full-body', 'compound', 'strength'],
    description:
      'Squat-focused full-body session pairing major compounds with accessories.',
    difficulty: 'beginner',
    exercises: [
      { name: 'Barbell Squat', sets: 4, reps: 8, weight: 80 },
      { name: 'Bench Press', sets: 4, reps: 8, weight: 60 },
      { name: 'Barbell Row', sets: 3, reps: 8, weight: 60 },
      { name: 'Overhead Press', sets: 3, reps: 10, weight: 30 },
      { name: 'Barbell Curl', sets: 3, reps: 10, weight: 25 },
      { name: 'Plank', sets: 3, reps: 1, notes: 'Hold 45-60 seconds' },
    ],
  },
  {
    id: 'tmpl-full-body-b',
    name: 'Full Body B',
    tags: ['full-body', 'compound', 'strength'],
    description:
      'Deadlift-focused full-body session with pressing and pulling balance.',
    difficulty: 'beginner',
    exercises: [
      { name: 'Deadlift', sets: 4, reps: 5, weight: 100 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 24 },
      { name: 'Pull-ups', sets: 3, reps: 8, notes: 'Use band assistance if needed' },
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: 10, weight: 20 },
      { name: 'Walking Lunges', sets: 3, reps: 12, weight: 20, notes: 'Per leg' },
      { name: 'Hanging Leg Raise', sets: 3, reps: 12 },
    ],
  },

  // ── Core & Abs ───────────────────────────────────────────
  {
    id: 'tmpl-core-abs',
    name: 'Core & Abs',
    tags: ['core', 'abs', 'stability'],
    description:
      'Dedicated core session building stability, anti-rotation, and ab strength.',
    difficulty: 'beginner',
    exercises: [
      { name: 'Plank', sets: 3, reps: 1, notes: 'Hold 60 seconds' },
      { name: 'Hanging Leg Raise', sets: 3, reps: 12 },
      { name: 'Cable Crunch', sets: 3, reps: 15, weight: 30 },
      { name: 'Russian Twist', sets: 3, reps: 20, weight: 10, notes: 'Total reps (both sides)' },
      { name: 'Ab Wheel Rollout', sets: 3, reps: 10, notes: 'Use kneeling variation for beginners' },
      { name: 'Cable Woodchop', sets: 3, reps: 12, weight: 20, notes: 'Per side' },
    ],
  },

  // ── HIIT Cardio ──────────────────────────────────────────
  {
    id: 'tmpl-hiit-cardio',
    name: 'HIIT Cardio',
    tags: ['cardio', 'hiit', 'conditioning', 'fat-loss'],
    description:
      'High-intensity interval circuit combining bodyweight and light-weight exercises.',
    difficulty: 'intermediate',
    exercises: [
      { name: 'Push-ups', sets: 4, reps: 15, notes: '30s rest between sets' },
      { name: 'Barbell Squat', sets: 4, reps: 15, weight: 40, notes: 'Light weight, explosive' },
      { name: 'Walking Lunges', sets: 3, reps: 20, notes: 'Bodyweight, fast pace' },
      { name: 'Dips', sets: 3, reps: 12, notes: 'Bench dips acceptable' },
      { name: 'Plank', sets: 3, reps: 1, notes: 'Hold 45 seconds' },
      { name: 'Russian Twist', sets: 3, reps: 20, weight: 8 },
    ],
  },

  // ── Arms & Shoulders ────────────────────────────────────
  {
    id: 'tmpl-arms-shoulders',
    name: 'Arms & Shoulders',
    tags: ['arms', 'shoulders', 'biceps', 'triceps', 'isolation'],
    description:
      'Dedicated arm and shoulder day with supersets for maximum pump.',
    difficulty: 'intermediate',
    exercises: [
      { name: 'Arnold Press', sets: 3, reps: 10, weight: 18 },
      { name: 'Barbell Curl', sets: 3, reps: 10, weight: 25 },
      { name: 'Skull Crusher', sets: 3, reps: 10, weight: 20 },
      { name: 'Lateral Raise', sets: 3, reps: 15, weight: 8 },
      { name: 'Hammer Curl', sets: 3, reps: 12, weight: 14, notes: 'Superset with kickbacks' },
      { name: 'Tricep Kickback', sets: 3, reps: 12, weight: 8 },
      { name: 'Face Pull', sets: 3, reps: 15, weight: 20 },
    ],
  },
];
