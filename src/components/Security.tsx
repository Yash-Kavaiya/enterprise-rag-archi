import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  Shield, 
  Lock, 
  Eye, 
  UserCheck,
  FileShield,
  Globe,
  Key,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Database,
  FileX
} from '@phosphor-icons/react'

interface SecurityEvent {
  id: string
  type: 'login' | 'access' | 'export' | 'config' | 'alert'
  user: string
  action: string
  resource: string
  timestamp: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'allowed' | 'blocked' | 'flagged'
}

interface AccessPolicy {
  id: string
  name: string
  description: string
  resources: string[]
  permissions: string[]
  users: number
  enabled: boolean
}

interface ComplianceStatus {
  framework: string
  status: 'compliant' | 'partial' | 'non-compliant'
  score: number
  lastAudit: string
  nextReview: string
  requirements: {
    total: number
    passed: number
    failed: number
  }
}

export function Security() {
  const [encryptionEnabled, setEncryptionEnabled] = useKV('encryption-enabled', true)
  const [auditLogging, setAuditLogging] = useKV('audit-logging', true)
  const [piiDetection, setPiiDetection] = useKV('pii-detection', true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')

  const [securityEvents, setSecurityEvents] = useKV<SecurityEvent[]>('security-events', [
    {
      id: '1',
      type: 'login',
      user: 'sarah.chen@company.com',
      action: 'Successful login',
      resource: 'Dashboard',
      timestamp: '2024-01-15T10:30:00Z',
      severity: 'low',
      status: 'allowed'
    },
    {
      id: '2',
      type: 'access',
      user: 'mike.johnson@company.com',
      action: 'Accessed sensitive documents',
      resource: 'Legal Documents Index',
      timestamp: '2024-01-15T09:45:00Z',
      severity: 'medium',
      status: 'allowed'
    },
    {
      id: '3',
      type: 'alert',
      user: 'external.user@gmail.com',
      action: 'Failed authentication attempt',
      resource: 'API Endpoint',
      timestamp: '2024-01-15T09:20:00Z',
      severity: 'high',
      status: 'blocked'
    },
    {
      id: '4',
      type: 'export',
      user: 'admin@company.com',
      action: 'Exported conversation data',
      resource: 'Chat Interface',
      timestamp: '2024-01-15T08:15:00Z',
      severity: 'medium',
      status: 'flagged'
    }
  ])

  const [accessPolicies, setAccessPolicies] = useKV<AccessPolicy[]>('access-policies', [
    {
      id: '1',
      name: 'Data Scientists',
      description: 'Full access to data ingestion and vector management',
      resources: ['Data Ingestion', 'Vector Management', 'Chat Interface'],
      permissions: ['read', 'write', 'configure'],
      users: 12,
      enabled: true
    },
    {
      id: '2',
      name: 'Business Analysts',
      description: 'Read-only access to chat interface and dashboards',
      resources: ['Dashboard', 'Chat Interface', 'Evaluation'],
      permissions: ['read'],
      users: 45,
      enabled: true
    },
    {
      id: '3',
      name: 'Administrators',
      description: 'Full system access including security configuration',
      resources: ['All Resources'],
      permissions: ['read', 'write', 'configure', 'admin'],
      users: 3,
      enabled: true
    },
    {
      id: '4',
      name: 'Guests',
      description: 'Limited access to demo features only',
      resources: ['Dashboard'],
      permissions: ['read'],
      users: 8,
      enabled: false
    }
  ])

  const [complianceStatus, setComplianceStatus] = useKV<ComplianceStatus[]>('compliance-status', [
    {
      framework: 'GDPR',
      status: 'compliant',
      score: 96.2,
      lastAudit: '2024-01-10',
      nextReview: '2024-04-10',
      requirements: { total: 47, passed: 45, failed: 2 }
    },
    {
      framework: 'HIPAA',
      status: 'partial',
      score: 87.5,
      lastAudit: '2024-01-08',
      nextReview: '2024-03-08',
      requirements: { total: 32, passed: 28, failed: 4 }
    },
    {
      framework: 'SOC 2',
      status: 'compliant',
      score: 94.8,
      lastAudit: '2024-01-05',
      nextReview: '2024-07-05',
      requirements: { total: 64, passed: 61, failed: 3 }
    },
    {
      framework: 'ISO 27001',
      status: 'compliant',
      score: 92.1,
      lastAudit: '2023-12-15',
      nextReview: '2024-06-15',
      requirements: { total: 114, passed: 105, failed: 9 }
    }
  ])

  const togglePolicy = (policyId: string) => {
    setAccessPolicies(current =>
      current.map(policy =>
        policy.id === policyId ? { ...policy, enabled: !policy.enabled } : policy
      )
    )
    toast.success('Policy updated successfully')
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 border-red-600'
      case 'high':
        return 'text-red-500 border-red-500'
      case 'medium':
        return 'text-yellow-600 border-yellow-600'
      case 'low':
        return 'text-green-600 border-green-600'
      default:
        return 'text-gray-600 border-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'allowed':
        return 'text-green-600 border-green-600'
      case 'blocked':
        return 'text-red-600 border-red-600'
      case 'flagged':
        return 'text-yellow-600 border-yellow-600'
      default:
        return 'text-gray-600 border-gray-600'
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 border-green-600'
      case 'partial':
        return 'text-yellow-600 border-yellow-600'
      case 'non-compliant':
        return 'text-red-600 border-red-600'
      default:
        return 'text-gray-600 border-gray-600'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <UserCheck className="w-4 h-4" />
      case 'access':
        return <Eye className="w-4 h-4" />
      case 'export':
        return <FileX className="w-4 h-4" />
      case 'config':
        return <Key className="w-4 h-4" />
      case 'alert':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  const totalEvents = securityEvents.length
  const blockedEvents = securityEvents.filter(e => e.status === 'blocked').length
  const criticalEvents = securityEvents.filter(e => e.severity === 'critical' || e.severity === 'high').length
  const complianceScore = Math.round(complianceStatus.reduce((sum, comp) => sum + comp.score, 0) / complianceStatus.length)

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <div>
        <h1 className="text-3xl font-bold">Security & Compliance</h1>
        <p className="text-muted-foreground mt-1">Manage access controls, monitor threats, and ensure compliance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Security Events</p>
                <p className="text-2xl font-bold">{totalEvents}</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Blocked Attempts</p>
                <p className="text-2xl font-bold text-red-600">{blockedEvents}</p>
              </div>
              <Lock className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Critical Alerts</p>
                <p className="text-2xl font-bold text-yellow-600">{criticalEvents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Compliance Score</p>
                <p className="text-2xl font-bold text-green-600">{complianceScore}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="access-control" className="space-y-4">
        <TabsList>
          <TabsTrigger value="access-control">Access Control</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="encryption">Data Protection</TabsTrigger>
        </TabsList>

        <TabsContent value="access-control">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Role-Based Access Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accessPolicies.map(policy => (
                    <div key={policy.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium">{policy.name}</h3>
                          <Badge variant={policy.enabled ? 'default' : 'secondary'}>
                            {policy.enabled ? 'Active' : 'Disabled'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {policy.users} users
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{policy.description}</p>
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-muted-foreground mr-2">Resources:</span>
                          {policy.resources.slice(0, 3).map((resource, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {resource}
                            </Badge>
                          ))}
                          {policy.resources.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{policy.resources.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Switch
                          checked={policy.enabled}
                          onCheckedChange={() => togglePolicy(policy.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Single Sign-On (SSO)</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable SAML/OAuth2 authentication
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Multi-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require MFA for all users
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Auto-logout after inactivity
                      </p>
                    </div>
                    <Select defaultValue="4h">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1h</SelectItem>
                        <SelectItem value="4h">4h</SelectItem>
                        <SelectItem value="8h">8h</SelectItem>
                        <SelectItem value="24h">24h</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Users</span>
                      <span className="font-medium">68</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Sessions</span>
                      <span className="font-medium">42</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Admin Users</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending Invitations</span>
                      <span className="font-medium">5</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-border">
                    <Button size="sm" className="w-full">
                      <Users className="w-4 h-4 mr-1" />
                      Manage Users
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit-logs">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Security Event Log</CardTitle>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Last 24h</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityEvents.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1 rounded ${getSeverityColor(event.severity)}`}>
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{event.action}</span>
                          <Badge variant="outline" className={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.user} → {event.resource}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {complianceStatus.map(framework => (
                <Card key={framework.framework}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">{framework.framework}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={getComplianceColor(framework.status)}>
                          {framework.status}
                        </Badge>
                        <span className="font-bold">{framework.score.toFixed(1)}%</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Passed</span>
                          <span>{framework.requirements.passed}/{framework.requirements.total}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Failed</span>
                          <span className="text-red-600">{framework.requirements.failed}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Next Review</span>
                          <span>{new Date(framework.nextReview).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Actions Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">HIPAA: Data retention policy update required</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Update data retention policies to comply with latest HIPAA requirements
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">Due: 2024-02-15</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">ISO 27001: Risk assessment documentation</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Complete annual risk assessment documentation for certification renewal
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">Due: 2024-03-01</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 border border-green-200 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">GDPR: Privacy policy updates completed</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Privacy policy has been updated to reflect current data processing practices
                      </p>
                      <p className="text-xs text-green-600 mt-1">Completed: 2024-01-10</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="encryption">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Encryption</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Encryption at Rest</Label>
                      <p className="text-sm text-muted-foreground">
                        AES-256 encryption for stored data
                      </p>
                    </div>
                    <Switch checked={encryptionEnabled} onCheckedChange={setEncryptionEnabled} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Encryption in Transit</Label>
                      <p className="text-sm text-muted-foreground">
                        TLS 1.3 for data transmission
                      </p>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Field-Level Encryption</Label>
                      <p className="text-sm text-muted-foreground">
                        Encrypt sensitive document fields
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="pt-3 border-t border-border">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Encryption Key Status</span>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Key Rotation</span>
                        <span className="text-muted-foreground">Next: 2024-04-15</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Protection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>PII Detection</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically detect and mask PII
                      </p>
                    </div>
                    <Switch checked={piiDetection} onCheckedChange={setPiiDetection} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Anonymization</Label>
                      <p className="text-sm text-muted-foreground">
                        Remove personally identifiable information
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Audit Logging</Label>
                      <p className="text-sm text-muted-foreground">
                        Log all data access and modifications
                      </p>
                    </div>
                    <Switch checked={auditLogging} onCheckedChange={setAuditLogging} />
                  </div>
                  
                  <div className="pt-3 border-t border-border">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>PII Detected (Last 30 days)</span>
                        <span className="font-medium">47 instances</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Auto-masked</span>
                        <span className="font-medium text-green-600">45 (95.7%)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Data Residency & Backup</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Primary Region</Label>
                    <Select defaultValue="us-east-1">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                        <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                        <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                        <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Backup Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Retention Period</Label>
                    <Select defaultValue="90d">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30d">30 days</SelectItem>
                        <SelectItem value="90d">90 days</SelectItem>
                        <SelectItem value="1y">1 year</SelectItem>
                        <SelectItem value="7y">7 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Backup</span>
                      <span className="font-medium">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Backup Size</span>
                      <span className="font-medium">12.4 GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Recovery Time</span>
                      <span className="font-medium">{'< 4 hours'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}