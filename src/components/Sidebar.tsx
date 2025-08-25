import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  ChartBar, 
  Database, 
  Upload, 
  ChatCircle, 
  ShieldCheck, 
  Gauge,
  Zap 
} from '@phosphor-icons/react'

type TabType = 'dashboard' | 'ingestion' | 'vectors' | 'chat' | 'evaluation' | 'security'

interface SidebarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: ChartBar },
  { id: 'ingestion', label: 'Data Ingestion', icon: Upload },
  { id: 'vectors', label: 'Vector Management', icon: Database },
  { id: 'chat', label: 'AI Chat', icon: ChatCircle },
  { id: 'evaluation', label: 'Evaluation', icon: Gauge },
  { id: 'security', label: 'Security', icon: ShieldCheck },
] as const

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Easy AI Labs</h1>
            <p className="text-sm text-muted-foreground">Enterprise RAG</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 h-11',
                activeTab === item.id && 'bg-primary text-primary-foreground'
              )}
              onClick={() => onTabChange(item.id as TabType)}
            >
              <Icon size={20} />
              {item.label}
            </Button>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>Version 1.0.0</p>
          <p className="mt-1">Enterprise Edition</p>
        </div>
      </div>
    </div>
  )
}