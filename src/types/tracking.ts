export interface WeightEntry {
  id: string;
  profileId: string;
  value: number;
  unit: 'kg' | 'lbs';
  date: string;
}

export type MeasurementType =
  | 'chest' | 'waist' | 'hips' | 'leftArm' | 'rightArm'
  | 'leftThigh' | 'rightThigh' | 'neck' | 'shoulders';

export interface MeasurementEntry {
  id: string;
  profileId: string;
  date: string;
  values: Partial<Record<MeasurementType, number>>;
}

export interface ProgressPhoto {
  id: string;
  profileId: string;
  date: string;
  label?: string;
}

export interface SkillEntry {
  id: string;
  profileId: string;
  skill: string;
  value: number;
  date: string;
}

export interface CustomMetric {
  id: string;
  profileId: string;
  name: string;
  unit: string;
}

export interface CustomMetricEntry {
  id: string;
  metricId: string;
  profileId: string;
  value: number;
  date: string;
}

export interface OneRMRecord {
  id: string;
  profileId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  estimated1RM: number;
  date: string;
}
