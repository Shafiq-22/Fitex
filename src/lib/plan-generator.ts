import { generateId } from './id';
import { workoutTemplates, type WorkoutTemplate } from '../data/workouts';
import type { OnboardingData } from '../types/profile';
import type { Workout, Exercise, WorkoutPlan, PlannedDay } from '../types/workout';

// ── Helpers ────────────────────────────────────────────────

function getTemplateById(id: string): WorkoutTemplate | undefined {
  return workoutTemplates.find((t) => t.id === id);
}

/** Pick a subset of templates by their IDs. */
function pickTemplates(ids: string[]): WorkoutTemplate[] {
  return ids
    .map(getTemplateById)
    .filter((t): t is WorkoutTemplate => t !== undefined);
}

/**
 * Determine which template IDs to use based on days-per-week.
 * Returns an array whose length equals daysPerWeek.
 */
function selectTemplateIds(daysPerWeek: number): string[] {
  switch (daysPerWeek) {
    case 2:
      return ['tmpl-full-body-a', 'tmpl-full-body-b'];
    case 3:
      return ['tmpl-push-day', 'tmpl-pull-day', 'tmpl-legs-day'];
    case 4:
      return [
        'tmpl-upper-body',
        'tmpl-lower-body',
        'tmpl-upper-body',
        'tmpl-lower-body',
      ];
    case 5:
      return [
        'tmpl-push-day',
        'tmpl-pull-day',
        'tmpl-legs-day',
        'tmpl-upper-body',
        'tmpl-lower-body',
      ];
    case 6:
      return [
        'tmpl-push-day',
        'tmpl-pull-day',
        'tmpl-legs-day',
        'tmpl-push-day',
        'tmpl-pull-day',
        'tmpl-legs-day',
      ];
    default:
      // 1 day or fallback
      return ['tmpl-full-body-a'];
  }
}

/**
 * Distribute N workout days across the week as evenly as possible.
 * Returns an array of dayOfWeek values (1=Mon ... 5=Fri, 6=Sat, 0=Sun).
 */
function distributeWeekdays(count: number): number[] {
  // Preference order: Mon(1), Wed(3), Fri(5), Tue(2), Thu(4), Sat(6), Sun(0)
  const preference = [1, 3, 5, 2, 4, 6, 0];

  if (count <= 0) return [];
  if (count >= 7) return [1, 2, 3, 4, 5, 6, 0];

  const picked = preference.slice(0, count);
  // Sort so the schedule reads in calendar order Mon→Sun
  const dayOrder = [1, 2, 3, 4, 5, 6, 0];
  return picked.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
}

// ── Adjustment logic ───────────────────────────────────────

interface AdjustmentParams {
  goal: OnboardingData['goal'];
  experienceLevel: OnboardingData['experienceLevel'];
}

/** How many exercises to keep per workout. */
function targetExerciseCount(level: OnboardingData['experienceLevel']): { min: number; max: number } {
  switch (level) {
    case 'beginner':
      return { min: 4, max: 5 };
    case 'intermediate':
      return { min: 5, max: 6 };
    case 'advanced':
      return { min: 6, max: 8 };
  }
}

/**
 * Adjust sets, reps, and weight for a single exercise based on
 * the user's goal and experience level.
 */
function adjustExercise(
  ex: WorkoutTemplate['exercises'][number],
  params: AdjustmentParams,
): Omit<Exercise, 'id'> {
  let { sets, reps, weight, notes } = ex;

  // ── Goal-based adjustments ───────────────────────────────
  switch (params.goal) {
    case 'strength':
      // Heavier, fewer reps
      reps = Math.max(3, Math.min(6, Math.round(reps * 0.6)));
      sets = Math.min(sets + 1, 5);
      weight = weight ? Math.round(weight * 1.15) : undefined;
      break;

    case 'endurance':
      // Lighter, more reps
      reps = Math.max(12, Math.min(20, Math.round(reps * 1.5)));
      sets = Math.max(sets - 1, 2);
      weight = weight ? Math.round(weight * 0.65) : undefined;
      break;

    case 'weight_loss':
      // Moderate weight, moderate-high reps, circuit style
      reps = Math.max(10, Math.min(15, Math.round(reps * 1.2)));
      weight = weight ? Math.round(weight * 0.7) : undefined;
      notes = notes ? `${notes} — minimal rest` : 'Minimal rest between sets';
      break;

    case 'hybrid':
      // Balanced — keep roughly as-is with small tweaks
      reps = Math.max(6, Math.min(12, reps));
      break;
  }

  // ── Experience-level adjustments ─────────────────────────
  switch (params.experienceLevel) {
    case 'beginner':
      sets = Math.max(2, sets - 1);
      weight = weight ? Math.round(weight * 0.75) : undefined;
      break;
    case 'advanced':
      sets = Math.min(sets + 1, 6);
      weight = weight ? Math.round(weight * 1.1) : undefined;
      break;
    // intermediate → no additional change
  }

  return { name: ex.name, sets, reps, weight: weight || undefined, notes };
}

// ── Main generator ─────────────────────────────────────────

export interface GeneratedPlan {
  workouts: Workout[];
  plan: WorkoutPlan;
}

/**
 * Generate a personalised workout plan from onboarding preferences.
 *
 * @param data   The user's onboarding selections
 * @param profileId  The active profile's id
 * @returns An object containing the Workout array and the WorkoutPlan
 */
export function generatePlan(
  data: OnboardingData,
  profileId: string,
): GeneratedPlan {
  const now = new Date().toISOString();
  const adjustParams: AdjustmentParams = {
    goal: data.goal,
    experienceLevel: data.experienceLevel,
  };

  const { min, max } = targetExerciseCount(data.experienceLevel);
  const templateIds = selectTemplateIds(data.daysPerWeek);
  const templates = pickTemplates(templateIds);
  const weekdays = distributeWeekdays(data.daysPerWeek);

  // For the 4-day or 6-day schedule where templates repeat,
  // we still create separate Workout objects so each has a unique id.
  const workouts: Workout[] = templates.map((tmpl, idx) => {
    // Trim or pad exercises to the target range
    let exercisePool = tmpl.exercises;
    if (exercisePool.length > max) {
      exercisePool = exercisePool.slice(0, max);
    }
    // If we have fewer than min, that's fine — keep them all
    if (exercisePool.length > min) {
      // trim to max (already done above), keep at least min
      exercisePool = exercisePool.slice(0, Math.max(min, exercisePool.length));
    }

    const exercises: Exercise[] = exercisePool.map((ex) => ({
      id: generateId(),
      ...adjustExercise(ex, adjustParams),
    }));

    // Suffix duplicate template names with a day label
    const nameOccurrences = templateIds
      .slice(0, idx)
      .filter((id) => id === templateIds[idx]).length;
    const displayName =
      nameOccurrences > 0 ? `${tmpl.name} (${nameOccurrences + 1})` : tmpl.name;

    return {
      id: generateId(),
      profileId,
      name: displayName,
      tags: [...tmpl.tags],
      exercises,
      source: 'plan' as const,
      createdAt: now,
    };
  });

  const weeklySchedule: PlannedDay[] = workouts.map((w, idx) => ({
    dayOfWeek: weekdays[idx],
    workoutId: w.id,
  }));

  const plan: WorkoutPlan = {
    id: generateId(),
    profileId,
    weeklySchedule,
    generatedAt: now,
  };

  return { workouts, plan };
}
