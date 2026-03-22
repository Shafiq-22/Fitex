import { useState } from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { WorkoutCard } from './WorkoutCard'
import { ExerciseForm } from './ExerciseForm'
import { useWorkouts } from '../../hooks/useWorkouts'
import { useProfile } from '../../contexts/ProfileContext'
import { generateId } from '../../lib/id'
import type { Exercise, Workout } from '../../types'

export function CustomBuilder() {
  const { workouts, addWorkout, deleteWorkout } = useWorkouts()
  const { activeProfile } = useProfile()
  const [isBuilding, setIsBuilding] = useState(false)
  const [workoutName, setWorkoutName] = useState('')
  const [workoutTags, setWorkoutTags] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [showExerciseForm, setShowExerciseForm] = useState(false)

  const customWorkouts = workouts.filter(w => w.source === 'custom')

  const handleAddExercise = (exercise: Exercise) => {
    setExercises(prev => [...prev, exercise])
    setShowExerciseForm(false)
  }

  const handleRemoveExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id))
  }

  const handleSave = () => {
    if (!workoutName.trim() || exercises.length === 0 || !activeProfile) return
    const workout: Workout = {
      id: generateId(),
      profileId: activeProfile.id,
      name: workoutName.trim(),
      tags: workoutTags.split(',').map(t => t.trim()).filter(Boolean),
      exercises,
      source: 'custom',
      createdAt: new Date().toISOString(),
    }
    addWorkout(workout)
    setIsBuilding(false)
    setWorkoutName('')
    setWorkoutTags('')
    setExercises([])
  }

  const handleCancel = () => {
    setIsBuilding(false)
    setWorkoutName('')
    setWorkoutTags('')
    setExercises([])
    setShowExerciseForm(false)
  }

  if (isBuilding) {
    return (
      <div className="space-y-3">
        <Card>
          <h3 className="font-semibold text-sm dark:text-white mb-3">New Custom Workout</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Workout name"
              value={workoutName}
              onChange={e => setWorkoutName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm dark:text-white focus:outline-none focus:border-primary"
              autoFocus
            />
            <input
              type="text"
              placeholder="Tags (comma separated, e.g. upper, push)"
              value={workoutTags}
              onChange={e => setWorkoutTags(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm dark:text-white focus:outline-none focus:border-primary"
            />
          </div>
        </Card>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Exercises ({exercises.length})
          </h4>
          {exercises.map((ex, i) => (
            <Card key={ex.id}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 mr-2">{i + 1}.</span>
                  <span className="text-sm font-medium dark:text-white">{ex.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                    {ex.sets}×{ex.reps}{ex.weight ? ` @ ${ex.weight}kg` : ''}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveExercise(ex.id)}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </Card>
          ))}
        </div>

        {showExerciseForm ? (
          <ExerciseForm onAdd={handleAddExercise} onCancel={() => setShowExerciseForm(false)} />
        ) : (
          <Button variant="secondary" onClick={() => setShowExerciseForm(true)} className="w-full">
            + Add Exercise
          </Button>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" onClick={handleCancel} className="flex-1">Cancel</Button>
          <Button onClick={handleSave} className="flex-1" disabled={!workoutName.trim() || exercises.length === 0}>
            Save Workout
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Button onClick={() => setIsBuilding(true)} className="w-full">
        + Create New Workout
      </Button>
      {customWorkouts.length === 0 ? (
        <EmptyState
          icon="🏋️"
          title="No custom workouts"
          description="Build your own workout from scratch"
        />
      ) : (
        customWorkouts.map(w => (
          <WorkoutCard
            key={w.id}
            workout={w}
            onDelete={() => deleteWorkout(w.id)}
          />
        ))
      )}
    </div>
  )
}
