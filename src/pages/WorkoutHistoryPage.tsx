import { PageHeader } from '../components/layout/PageHeader'
import { useWorkouts } from '../hooks/useWorkouts'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { format, parseISO } from 'date-fns'

export default function WorkoutHistoryPage() {
  const { sessions } = useWorkouts()
  const completed = sessions
    .filter(s => s.status === 'completed')
    .sort((a, b) => new Date(b.finishedAt!).getTime() - new Date(a.finishedAt!).getTime())

  return (
    <div>
      <PageHeader title="Workout History" />
      <div className="px-4 space-y-3 pb-4">
        {completed.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No workouts yet"
            description="Complete your first workout to see it here"
          />
        ) : (
          completed.map(session => (
            <Card key={session.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm dark:text-white">{session.workoutName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {format(parseISO(session.finishedAt!), 'MMM d, yyyy · h:mm a')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    {Math.floor(session.durationSeconds / 60)}min
                  </Badge>
                  <Badge variant="success">
                    {session.exercises.reduce((acc, e) => acc + e.sets.length, 0)} sets
                  </Badge>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {session.exercises.map((e, i) => (
                  <span key={i} className="text-xs text-slate-400 dark:text-slate-500">
                    {e.exerciseName}{i < session.exercises.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
