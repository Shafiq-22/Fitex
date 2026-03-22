import { PageHeader } from '../components/layout/PageHeader'
import { AppearanceSection } from '../components/settings/AppearanceSection'
import { ProfileSection } from '../components/settings/ProfileSection'
import { NotificationSection } from '../components/settings/NotificationSection'
import { FeedbackSection } from '../components/settings/FeedbackSection'
import { CoachConfig } from '../components/settings/CoachConfig'
import { AccountControls } from '../components/settings/AccountControls'
import { DataManagement } from '../components/settings/DataManagement'

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" />
      <div className="px-4 space-y-6 pb-8">
        <AppearanceSection />
        <ProfileSection />
        <NotificationSection />
        <FeedbackSection />
        <CoachConfig />
        <AccountControls />
        <DataManagement />
      </div>
    </div>
  )
}
