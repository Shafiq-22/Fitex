import { useState } from 'react'
import { Button } from '../ui/Button'
import type { Exercise } from '../../types'
import { generateId } from '../../lib/id'

interface Props {
  onAdd: (exercise: Exercise) => void;
  onCancel: () => void;
  initial?: Exercise;
}

export function ExerciseForm({ onAdd, onCancel, initial }: Props) {
  const [name, setName] = useState(initial?.name || '')
  const [sets, setSets] = useState(initial?.sets?.toString() || '3')
  const [reps, setReps] = useState(initial?.reps?.toString() || '10')
  const [weight, setWeight] = useState(initial?.weight?.toString() || '')
  const [notes, setNotes] = useState(initial?.notes || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({
      id: initial?.id || generateId(),
      name: name.trim(),
      sets: parseInt(sets) || 3,
      reps: parseInt(reps) || 10,
      weight: weight ? parseFloat(weight) : undefined,
      notes: notes || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
      <input
        type="text"
        placeholder="Exercise name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm dark:text-white focus:outline-none focus:border-primary"
        autoFocus
      />
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Sets</label>
          <input
            type="number"
            value={sets}
            onChange={e => setSets(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm dark:text-white focus:outline-none focus:border-primary text-center"
            min="1"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Reps</label>
          <input
            type="number"
            value={reps}
            onChange={e => setReps(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm dark:text-white focus:outline-none focus:border-primary text-center"
            min="1"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Weight</label>
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="kg"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm dark:text-white focus:outline-none focus:border-primary text-center"
            min="0"
            step="0.5"
          />
        </div>
      </div>
      <input
        type="text"
        placeholder="Notes (optional)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm dark:text-white focus:outline-none focus:border-primary"
      />
      <div className="flex gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" size="sm" className="flex-1" disabled={!name.trim()}>
          {initial ? 'Update' : 'Add Exercise'}
        </Button>
      </div>
    </form>
  )
}
