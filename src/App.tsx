import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ProfileProvider, useProfile } from './contexts/ProfileContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { LiveWorkoutProvider } from './contexts/LiveWorkoutContext'
import { TabBar } from './components/layout/TabBar'
import { SafeArea } from './components/layout/SafeArea'
import TodayPage from './pages/TodayPage'
import TrainPage from './pages/TrainPage'
import TrackPage from './pages/TrackPage'
import CoachPage from './pages/CoachPage'
import SettingsPage from './pages/SettingsPage'
import LiveWorkoutPage from './pages/LiveWorkoutPage'
import WorkoutHistoryPage from './pages/WorkoutHistoryPage'
import OnboardingPage from './pages/OnboardingPage'
import ProfileSelectPage from './pages/ProfileSelectPage'

function TabLayout() {
  return (
    <SafeArea className="min-h-screen pb-20">
      <Outlet />
      <TabBar />
    </SafeArea>
  )
}

function AppRoutes() {
  const { activeProfile, profiles } = useProfile()

  if (profiles.length === 0) {
    return (
      <Routes>
        <Route path="*" element={<ProfileSelectPage />} />
      </Routes>
    )
  }

  if (!activeProfile) {
    return (
      <Routes>
        <Route path="*" element={<ProfileSelectPage />} />
      </Routes>
    )
  }

  if (!activeProfile.onboardingComplete) {
    return (
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route element={<TabLayout />}>
        <Route path="/" element={<TodayPage />} />
        <Route path="/train" element={<TrainPage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/coach" element={<CoachPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/history" element={<WorkoutHistoryPage />} />
      </Route>
      <Route path="/live-workout/:workoutId" element={<LiveWorkoutPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/profile-select" element={<ProfileSelectPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <LiveWorkoutProvider>
          <AppRoutes />
        </LiveWorkoutProvider>
      </ProfileProvider>
    </ThemeProvider>
  )
}
