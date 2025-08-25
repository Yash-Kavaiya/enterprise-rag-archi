import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Dashboard } from '@/components/Dashboard'
import { DataIngestion } from '@/components/DataIngestion'
import { VectorManagement } from '@/components/VectorManagement'
import { ChatInterface } from '@/components/ChatInterface'
import { Evaluation } from '@/components/Evaluation'
import { Security } from '@/components/Security'
import { Toaster } from '@/components/ui/sonner'

type TabType = 'dashboard' | 'ingestion' | 'vectors' | 'chat' | 'evaluation' | 'security'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'ingestion':
        return <DataIngestion />
      case 'vectors':
        return <VectorManagement />
      case 'chat':
        return <ChatInterface />
      case 'evaluation':
        return <Evaluation />
      case 'security':
        return <Security />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
      <Toaster />
    </div>
  )
}

export default App