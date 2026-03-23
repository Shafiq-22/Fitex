import { PageHeader } from '../components/layout/PageHeader'
import { DailyOverview } from '../components/today/DailyOverview'
import { PerformanceStats } from '../components/today/PerformanceStats'
import { ActivityHeatmap } from '../components/today/ActivityHeatmap'
import { NextWorkout } from '../components/today/NextWorkout'
import { WorkoutVolume } from '../components/today/WorkoutVolume'
import { RecentHistory } from '../components/today/RecentHistory'

export default function TodayPage() {
  return (
    <div>
      <PageHeader title="Today" />
      <div className="px-4 space-y-4 pb-4">
        <DailyOverview />
        <PerformanceStats />
        <ActivityHeatmap />
        <NextWorkout />
        <WorkoutVolume />
        <RecentHistory />
      </div>
    </div>
  )
}
