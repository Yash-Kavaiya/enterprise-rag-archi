import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  Database, 
  Gear, 
  Lightning, 
  CheckCircle, 
  Warning,
  TrendUp,
  Cpu,
  HardDrive,
  CloudCheck
} from '@phosphor-icons/react'

interface VectorIndex {
  id: string
  name: string
  provider: string
  status: 'healthy' | 'degraded' | 'error'
  documents: number
  dimensions: number
  lastUpdated: string
  performance: {
    queryLatency: number
    indexSize: string
    memoryUsage: number
  }
}

interface EmbeddingModel {
  id: string
  name: string
  provider: string
  dimensions: number
  maxTokens: number
  costPer1k: number
  isActive: boolean
}

export function VectorManagement() {
  const [selectedProvider, setSelectedProvider] = useState('pinecone')
  const [autoOptimize, setAutoOptimize] = useKV('auto-optimize', true)
  
  const [vectorIndexes, setVectorIndexes] = useKV<VectorIndex[]>('vector-indexes', [
    {
      id: '1',
      name: 'enterprise-knowledge-base',
      provider: 'Pinecone',
      status: 'healthy',
      documents: 12453,
      dimensions: 1536,
      lastUpdated: '2 hours ago',
      performance: {
        queryLatency: 85,
        indexSize: '2.3 GB',
        memoryUsage: 67
      }
    },
    {
      id: '2',
      name: 'legal-documents',
      provider: 'Weaviate',
      status: 'healthy',
      documents: 8920,
      dimensions: 768,
      lastUpdated: '45 minutes ago',
      performance: {
        queryLatency: 92,
        indexSize: '1.8 GB',
        memoryUsage: 54
      }
    },
    {
      id: '3',
      name: 'product-catalog',
      provider: 'Qdrant',
      status: 'degraded',
      documents: 15670,
      dimensions: 1024,
      lastUpdated: '6 hours ago',
      performance: {
        queryLatency: 156,
        indexSize: '3.1 GB',
        memoryUsage: 89
      }
    }
  ])

  const [embeddingModels, setEmbeddingModels] = useKV<EmbeddingModel[]>('embedding-models', [
    {
      id: '1',
      name: 'text-embedding-ada-002',
      provider: 'OpenAI',
      dimensions: 1536,
      maxTokens: 8191,
      costPer1k: 0.0001,
      isActive: true
    },
    {
      id: '2',
      name: 'embed-english-v3.0',
      provider: 'Cohere',
      dimensions: 1024,
      maxTokens: 512,
      costPer1k: 0.0001,
      isActive: false
    },
    {
      id: '3',
      name: 'all-MiniLM-L6-v2',
      provider: 'Sentence Transformers',
      dimensions: 384,
      maxTokens: 256,
      costPer1k: 0,
      isActive: false
    }
  ])

  const optimizeIndex = (indexId: string) => {
    setVectorIndexes(current => 
      current.map(index => 
        index.id === indexId 
          ? { 
              ...index, 
              status: 'healthy' as const,
              performance: {
                ...index.performance,
                queryLatency: Math.max(50, index.performance.queryLatency - 20),
                memoryUsage: Math.max(30, index.performance.memoryUsage - 10)
              },
              lastUpdated: 'Just now'
            }
          : index
      )
    )
    toast.success('Index optimization completed')
  }

  const toggleModel = (modelId: string) => {
    setEmbeddingModels(current =>
      current.map(model => ({
        ...model,
        isActive: model.id === modelId ? !model.isActive : model.isActive
      }))
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'degraded':
        return <Warning className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <Warning className="w-4 h-4 text-red-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 border-green-600'
      case 'degraded':
        return 'text-yellow-600 border-yellow-600'
      case 'error':
        return 'text-red-600 border-red-600'
      default:
        return 'text-gray-600 border-gray-600'
    }
  }

  const totalDocuments = vectorIndexes.reduce((sum, index) => sum + index.documents, 0)
  const healthyIndexes = vectorIndexes.filter(index => index.status === 'healthy').length
  const avgLatency = Math.round(vectorIndexes.reduce((sum, index) => sum + index.performance.queryLatency, 0) / vectorIndexes.length)

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <div>
        <h1 className="text-3xl font-bold">Vector Database Management</h1>
        <p className="text-muted-foreground mt-1">Configure embeddings, manage indexes, and monitor performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Vectors</p>
                <p className="text-2xl font-bold">{totalDocuments.toLocaleString()}</p>
              </div>
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Healthy Indexes</p>
                <p className="text-2xl font-bold text-green-600">{healthyIndexes}/{vectorIndexes.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Avg Latency</p>
                <p className="text-2xl font-bold">{avgLatency}ms</p>
              </div>
              <Lightning className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Active Models</p>
                <p className="text-2xl font-bold">{embeddingModels.filter(m => m.isActive).length}</p>
              </div>
              <Cpu className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="indexes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="indexes">Vector Indexes</TabsTrigger>
          <TabsTrigger value="models">Embedding Models</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="indexes">
          <Card>
            <CardHeader>
              <CardTitle>Vector Indexes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vectorIndexes.map(index => (
                  <div key={index.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{index.name}</h3>
                        <Badge variant="outline" className={getStatusColor(index.status)}>
                          {getStatusIcon(index.status)}
                          {index.status}
                        </Badge>
                        <Badge variant="secondary">{index.provider}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => optimizeIndex(index.id)}
                          disabled={index.status === 'healthy'}
                        >
                          <Gear className="w-4 h-4 mr-1" />
                          Optimize
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Documents</p>
                        <p className="font-medium">{index.documents.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Dimensions</p>
                        <p className="font-medium">{index.dimensions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Query Latency</p>
                        <p className="font-medium">{index.performance.queryLatency}ms</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Index Size</p>
                        <p className="font-medium">{index.performance.indexSize}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Memory Usage</p>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{index.performance.memoryUsage}%</p>
                          <div className={`w-2 h-2 rounded-full ${
                            index.performance.memoryUsage > 80 ? 'bg-red-500' :
                            index.performance.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-3">
                      Last updated: {index.lastUpdated}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>Embedding Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {embeddingModels.map(model => (
                  <div key={model.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{model.name}</h3>
                        <Badge variant="secondary">{model.provider}</Badge>
                        {model.isActive && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <Switch
                        checked={model.isActive}
                        onCheckedChange={() => toggleModel(model.id)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Dimensions</p>
                        <p className="font-medium">{model.dimensions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Max Tokens</p>
                        <p className="font-medium">{model.maxTokens.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cost per 1K tokens</p>
                        <p className="font-medium">
                          {model.costPer1k === 0 ? 'Free' : `$${model.costPer1k.toFixed(4)}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Performance</p>
                        <div className="flex items-center space-x-1">
                          <TrendUp className="w-3 h-3 text-green-500" />
                          <p className="font-medium">Excellent</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Provider</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="provider">Primary Vector Database</Label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pinecone">Pinecone</SelectItem>
                      <SelectItem value="weaviate">Weaviate</SelectItem>
                      <SelectItem value="qdrant">Qdrant</SelectItem>
                      <SelectItem value="milvus">Milvus</SelectItem>
                      <SelectItem value="chromadb">ChromaDB</SelectItem>
                      <SelectItem value="pgvector">pgvector</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-Optimization</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically optimize indexes for performance
                    </p>
                  </div>
                  <Switch checked={autoOptimize} onCheckedChange={setAutoOptimize} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Hybrid Search</Label>
                    <p className="text-sm text-muted-foreground">
                      Combine dense and sparse retrieval methods
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Tuning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Chunking Strategy</Label>
                  <Select defaultValue="semantic">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semantic">Semantic Chunking</SelectItem>
                      <SelectItem value="fixed">Fixed Size with Overlap</SelectItem>
                      <SelectItem value="structure">Document Structure Aware</SelectItem>
                      <SelectItem value="recursive">Recursive Character Splitting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Search Algorithm</Label>
                  <Select defaultValue="hybrid">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dense">Dense Vector Search</SelectItem>
                      <SelectItem value="sparse">Sparse (BM25) Search</SelectItem>
                      <SelectItem value="hybrid">Hybrid Search</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Embedding Cache</Label>
                    <p className="text-sm text-muted-foreground">
                      Cache embeddings to reduce API calls
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CloudCheck className="w-5 h-5" />
                <span>System Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Vector Operations</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Embedding Service</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Search API</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Storage Usage</span>
                    <span className="text-sm">7.2 GB / 50 GB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Query Rate</span>
                    <span className="text-sm">245 req/min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cache Hit Rate</span>
                    <span className="text-sm">94.3%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Backup</span>
                    <span className="text-sm">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uptime</span>
                    <span className="text-sm">99.97%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Next Maintenance</span>
                    <span className="text-sm">Sunday 2 AM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}