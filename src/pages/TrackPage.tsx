import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Tabs } from '../components/ui/Tabs'
import { WeightTracker } from '../components/tracking/WeightTracker'
import { BodyMeasurements } from '../components/tracking/BodyMeasurements'
import { ProgressPhotos } from '../components/tracking/ProgressPhotos'
import { SkillTracker } from '../components/tracking/SkillTracker'
import { CustomMetrics } from '../components/tracking/CustomMetrics'
import { OneRMCalculator } from '../components/tracking/OneRMCalculator'

const tabs = [
  { id: 'weight', label: 'Weight' },
  { id: 'body', label: 'Body' },
  { id: 'photos', label: 'Photos' },
  { id: 'skills', label: 'Skills' },
  { id: 'custom', label: 'Custom' },
  { id: '1rm', label: '1RM' },
]

export default function TrackPage() {
  const [activeTab, setActiveTab] = useState('weight')

  return (
    <div>
      <PageHeader title="Track" />
      <div className="px-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="mt-4">
          {activeTab === 'weight' && <WeightTracker />}
          {activeTab === 'body' && <BodyMeasurements />}
          {activeTab === 'photos' && <ProgressPhotos />}
          {activeTab === 'skills' && <SkillTracker />}
          {activeTab === 'custom' && <CustomMetrics />}
          {activeTab === '1rm' && <OneRMCalculator />}
        </div>
      </div>
    </div>
  )
}
