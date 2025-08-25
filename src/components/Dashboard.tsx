import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'
import { 
  Database, 
  Upload, 
  ChatCircle, 
  TrendUp,
  Users,
  Clock,
  CheckCircle,
  WarningCircle
} from '@phosphor-icons/react'

export function Dashboard() {
  const [metrics] = useKV('dashboard-metrics', {
    totalDocuments: 2847,
    activeUsers: 156,
    queriesProcessed: 12453,
    systemHealth: 98.5,
    storageUsed: 85.2,
    lastBackup: '2 hours ago'
  })

  const [recentActivity] = useKV('recent-activity', [
    { id: 1, type: 'upload', user: 'Sarah Chen', action: 'Uploaded 25 documents', time: '5 min ago', status: 'success' },
    { id: 2, type: 'query', user: 'Mike Johnson', action: 'Complex query processed', time: '12 min ago', status: 'success' },
    { id: 3, type: 'system', user: 'System', action: 'Vector index optimized', time: '1 hour ago', status: 'success' },
    { id: 4, type: 'alert', user: 'System', action: 'High query volume detected', time: '2 hours ago', status: 'warning' }
  ])

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <div>
        <h1 className="text-3xl font-bold">Enterprise RAG Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor your AI-powered knowledge system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalDocuments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendUp className="inline h-3 w-3 mr-1" />
              +8 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queries Processed</CardTitle>
            <ChatCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.queriesProcessed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendUp className="inline h-3 w-3 mr-1" />
              +24% today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.systemHealth}%</div>
            <Progress value={metrics.systemHealth} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Storage Usage</span>
              <span className="text-sm text-muted-foreground">{metrics.storageUsed}%</span>
            </div>
            <Progress value={metrics.storageUsed} />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Vector Database</span>
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Healthy
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Backup</span>
              <span className="text-sm text-muted-foreground flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {metrics.lastBackup}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">by {activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Upload className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium mb-1">Upload Documents</h3>
              <p className="text-sm text-muted-foreground">Add new data sources to your knowledge base</p>
            </div>
            
            <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <ChatCircle className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium mb-1">Start Chat</h3>
              <p className="text-sm text-muted-foreground">Query your data using natural language</p>
            </div>
            
            <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Database className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium mb-1">Manage Vectors</h3>
              <p className="text-sm text-muted-foreground">Configure embeddings and search parameters</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}