import { PageHeader } from '../components/layout/PageHeader'
import { ChatInterface } from '../components/coach/ChatInterface'

export default function CoachPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <PageHeader title="Coach" />
      <ChatInterface />
    </div>
  )
}
