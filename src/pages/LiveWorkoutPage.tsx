import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveWorkout } from '../contexts/LiveWorkoutContext'
import { LiveWorkoutScreen } from '../components/live/LiveWorkoutScreen'

export default function LiveWorkoutPage() {
  const { isActive } = useLiveWorkout()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isActive) {
      navigate('/', { replace: true })
    }
  }, [isActive, navigate])

  if (!isActive) return null

  return <LiveWorkoutScreen />
}
