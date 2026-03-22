import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { Tabs } from '../components/ui/Tabs'
import { WorkoutModeSelector } from '../components/training/WorkoutModeSelector'
import { CustomBuilder } from '../components/training/CustomBuilder'
import { BrowseLibrary } from '../components/training/BrowseLibrary'
import { useWorkouts } from '../hooks/useWorkouts'
import { useProfile } from '../contexts/ProfileContext'
import { useLiveWorkout } from '../contexts/LiveWorkoutContext'
import type { Workout } from '../types'

const tabs = [
  { id: 'plan', label: 'My Plan' },
  { id: 'custom', label: 'Custom' },
  { id: 'browse', label: 'Browse' },
]

export default function TrainPage() {
  const [activeTab, setActiveTab] = useState('plan')
  const { workouts, plan } = useWorkouts()
  const { activeProfile } = useProfile()
  const { startWorkout } = useLiveWorkout()
  const navigate = useNavigate()

  const handleStartWorkout = (workout: Workout) => {
    if (activeProfile) {
      startWorkout(workout, activeProfile.id)
      navigate(`/live-workout/${workout.id}`)
    }
  }

  return (
    <div>
      <PageHeader title="Train" />
      <div className="px-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="mt-4">
          {activeTab === 'plan' && (
            <WorkoutModeSelector
              workouts={workouts}
              plan={plan}
              onStart={handleStartWorkout}
            />
          )}
          {activeTab === 'custom' && <CustomBuilder />}
          {activeTab === 'browse' && <BrowseLibrary onStart={handleStartWorkout} />}
        </div>
      </div>
    </div>
  )
}
