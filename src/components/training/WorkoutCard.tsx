import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import type { Workout } from '../../types'

interface Props {
  workout: Workout;
  onStart?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

export function WorkoutCard({ workout, onStart, onEdit, onDelete, compact }: Props) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm dark:text-white truncate">{workout.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {workout.exercises.length} exercises
          </p>
          {!compact && (
            <div className="flex flex-wrap gap-1 mt-2">
              {workout.tags.map(tag => (
                <Badge key={tag} variant="primary">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 ml-2">
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </Button>
          )}
          {onStart && (
            <Button size="sm" onClick={onStart}>Start</Button>
          )}
        </div>
      </div>
      {!compact && (
        <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          {workout.exercises.slice(0, 3).map(e => e.name).join(' · ')}
          {workout.exercises.length > 3 && ` +${workout.exercises.length - 3} more`}
        </div>
      )}
    </Card>
  )
}
