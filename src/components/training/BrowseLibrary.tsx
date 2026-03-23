import { useState } from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { useWorkouts } from '../../hooks/useWorkouts'
import { useProfile } from '../../contexts/ProfileContext'
import { workoutTemplates } from '../../data/workouts'
import { generateId } from '../../lib/id'
import type { Workout } from '../../types'

interface Props {
  onStart: (workout: Workout) => void;
}

export function BrowseLibrary({ onStart: _onStart }: Props) {
  const { addWorkout } = useWorkouts()
  const { activeProfile } = useProfile()
  const [selectedTemplate, setSelectedTemplate] = useState<typeof workoutTemplates[0] | null>(null)

  const handleAddToWorkouts = (template: typeof workoutTemplates[0]) => {
    if (!activeProfile) return
    const workout: Workout = {
      id: generateId(),
      profileId: activeProfile.id,
      name: template.name,
      tags: template.tags,
      exercises: template.exercises.map(e => ({
        id: generateId(),
        name: e.name,
        sets: e.sets,
        reps: e.reps,
        weight: e.weight,
        notes: e.notes,
      })),
      source: 'browse',
      createdAt: new Date().toISOString(),
    }
    addWorkout(workout)
    setSelectedTemplate(null)
  }

  return (
    <div className="space-y-3">
      {workoutTemplates.map(template => (
        <Card key={template.id}>
          <button
            className="w-full text-left"
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-sm dark:text-white">{template.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant={
                    template.difficulty === 'beginner' ? 'success' :
                    template.difficulty === 'intermediate' ? 'warning' : 'primary'
                  }>
                    {template.difficulty}
                  </Badge>
                  {template.tags.map(tag => (
                    <Badge key={tag} variant="default">{tag}</Badge>
                  ))}
                </div>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap ml-2">
                {template.exercises.length} exercises
              </span>
            </div>
          </button>
        </Card>
      ))}

      <Modal
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        title={selectedTemplate?.name || ''}
      >
        {selectedTemplate && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">{selectedTemplate.description}</p>
            <div className="space-y-2">
              {selectedTemplate.exercises.map((ex, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <div>
                    <span className="text-xs text-slate-400 mr-2">{i + 1}.</span>
                    <span className="text-sm dark:text-white">{ex.name}</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {ex.sets}×{ex.reps}{ex.weight ? ` @ ${ex.weight}kg` : ''}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" onClick={() => setSelectedTemplate(null)} className="flex-1">
                Close
              </Button>
              <Button onClick={() => handleAddToWorkouts(selectedTemplate)} className="flex-1">
                Add to Workouts
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
