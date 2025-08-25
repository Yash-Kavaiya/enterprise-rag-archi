import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useKV } from '@github/spark/hooks'
import { 
  ChartBar, 
  Target, 
  TrendUp, 
  TrendDown,
  Warning,
  CheckCircle,
  Star,
  Clock,
  Users,
  Brain
} from '@phosphor-icons/react'

interface EvaluationMetric {
  id: string
  name: string
  score: number
  trend: 'up' | 'down' | 'stable'
  benchmark: number
  description: string
}

interface TestResult {
  id: string
  query: string
  response: string
  groundTruth: string
  scores: {
    relevance: number
    accuracy: number
    coherence: number
    hallucination: number
  }
  timestamp: string
  model: string
}

export function Evaluation() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [selectedModel, setSelectedModel] = useState('all')

  const [metrics, setMetrics] = useKV<EvaluationMetric[]>('evaluation-metrics', [
    {
      id: '1',
      name: 'Response Relevance',
      score: 87.3,
      trend: 'up',
      benchmark: 85.0,
      description: 'How well responses match user queries'
    },
    {
      id: '2',
      name: 'Factual Accuracy',
      score: 92.1,
      trend: 'up',
      benchmark: 90.0,
      description: 'Accuracy of information provided'
    },
    {
      id: '3',
      name: 'Response Coherence',
      score: 89.7,
      trend: 'stable',
      benchmark: 88.0,
      description: 'Logical flow and readability'
    },
    {
      id: '4',
      name: 'Hallucination Rate',
      score: 5.2,
      trend: 'down',
      benchmark: 8.0,
      description: 'Percentage of fabricated information'
    },
    {
      id: '5',
      name: 'Citation Accuracy',
      score: 94.8,
      trend: 'up',
      benchmark: 92.0,
      description: 'Accuracy of source citations'
    },
    {
      id: '6',
      name: 'User Satisfaction',
      score: 4.6,
      trend: 'up',
      benchmark: 4.3,
      description: 'Average user rating (1-5 scale)'
    }
  ])

  const [testResults, setTestResults] = useKV<TestResult[]>('test-results', [
    {
      id: '1',
      query: 'What are our Q4 revenue projections?',
      response: 'Based on current market trends and pipeline analysis, Q4 revenue projections indicate a 15% increase over Q3...',
      groundTruth: 'Q4 revenue is projected to increase by 15% based on pipeline analysis and market conditions.',
      scores: {
        relevance: 0.95,
        accuracy: 0.92,
        coherence: 0.89,
        hallucination: 0.03
      },
      timestamp: '2024-01-15T10:30:00Z',
      model: 'gpt-4'
    },
    {
      id: '2',
      query: 'Explain our compliance requirements for GDPR',
      response: 'GDPR compliance requires data protection measures including consent management, data minimization...',
      groundTruth: 'GDPR requires consent management, data protection, and user rights implementation.',
      scores: {
        relevance: 0.88,
        accuracy: 0.94,
        coherence: 0.91,
        hallucination: 0.02
      },
      timestamp: '2024-01-15T09:15:00Z',
      model: 'claude'
    },
    {
      id: '3',
      query: 'What is our customer retention strategy?',
      response: 'Our customer retention strategy focuses on personalized engagement, proactive support, and value-added services...',
      groundTruth: 'Customer retention strategy includes personalized engagement and proactive support.',
      scores: {
        relevance: 0.93,
        accuracy: 0.89,
        coherence: 0.87,
        hallucination: 0.04
      },
      timestamp: '2024-01-15T08:45:00Z',
      model: 'gpt-4'
    }
  ])

  const [userFeedback] = useKV('user-feedback', {
    totalRatings: 1247,
    averageRating: 4.6,
    ratingDistribution: {
      5: 58.2,
      4: 31.4,
      3: 7.8,
      2: 1.9,
      1: 0.7
    },
    commonPraise: [
      'Accurate and relevant responses',
      'Good source citations',
      'Fast response times'
    ],
    commonComplaints: [
      'Occasionally verbose responses',
      'Some outdated information',
      'Complex queries need clarification'
    ]
  })

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendDown className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4" />
    }
  }

  const getTrendColor = (trend: string, isInverted = false) => {
    if (isInverted) {
      switch (trend) {
        case 'up':
          return 'text-red-600'
        case 'down':
          return 'text-green-600'
        default:
          return 'text-muted-foreground'
      }
    }
    
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const getScoreColor = (score: number, benchmark: number, isInverted = false) => {
    const isAboveBenchmark = isInverted ? score < benchmark : score > benchmark
    return isAboveBenchmark ? 'text-green-600' : 'text-red-600'
  }

  const runEvaluation = () => {
    // Simulate running evaluation
    setMetrics(current =>
      current.map(metric => ({
        ...metric,
        score: metric.score + (Math.random() - 0.5) * 4,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
      }))
    )
  }

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Evaluation & Quality Assurance</h1>
          <p className="text-muted-foreground mt-1">Monitor AI performance and response quality</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={runEvaluation}>
            <Target className="w-4 h-4 mr-1" />
            Run Evaluation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map(metric => {
          const isHallucination = metric.name === 'Hallucination Rate'
          const isUserSat = metric.name === 'User Satisfaction'
          
          return (
            <Card key={metric.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                {getTrendIcon(metric.trend)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center space-x-2">
                  <span className={getScoreColor(metric.score, metric.benchmark, isHallucination)}>
                    {isUserSat ? metric.score.toFixed(1) : `${metric.score.toFixed(1)}${isHallucination ? '%' : '%'}`}
                  </span>
                  {isUserSat && (
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  )}
                </div>
                <div className="mt-2">
                  <Progress 
                    value={isUserSat ? (metric.score / 5) * 100 : isHallucination ? 100 - metric.score : metric.score} 
                    className="h-2"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    Benchmark: {isUserSat ? metric.benchmark.toFixed(1) : `${metric.benchmark.toFixed(1)}%`}
                  </span>
                  <span className={`text-xs ${getTrendColor(metric.trend, isHallucination)}`}>
                    {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="test-results">Test Results</TabsTrigger>
          <TabsTrigger value="user-feedback">User Feedback</TabsTrigger>
          <TabsTrigger value="drift-detection">Drift Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ChartBar className="w-5 h-5" />
                  <span>Performance Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Score</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg">89.2%</span>
                      <TrendUp className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Queries Evaluated</span>
                      <span className="text-sm font-medium">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Response Time</span>
                      <span className="text-sm font-medium">1.2s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Accuracy Improvement</span>
                      <span className="text-sm font-medium text-green-600">+3.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Satisfaction</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium">4.6/5</span>
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>Model Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">GPT-4</span>
                        <Badge variant="outline" className="text-green-600 border-green-600">Primary</Badge>
                      </div>
                      <span className="text-sm font-medium">92.1%</span>
                    </div>
                    <Progress value={92.1} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Claude</span>
                      <span className="text-sm font-medium">89.8%</span>
                    </div>
                    <Progress value={89.8} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Llama 2</span>
                      <span className="text-sm font-medium">85.3%</span>
                    </div>
                    <Progress value={85.3} className="h-2" />
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Model routing optimization improved overall performance by 7.2%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="test-results">
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map(result => (
                  <div key={result.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{result.query}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(result.timestamp).toLocaleString()} • Model: {result.model}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Relevance</p>
                        <p className="font-medium">{Math.round(result.scores.relevance * 100)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                        <p className="font-medium">{Math.round(result.scores.accuracy * 100)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Coherence</p>
                        <p className="font-medium">{Math.round(result.scores.coherence * 100)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Hallucination</p>
                        <p className="font-medium text-green-600">{Math.round(result.scores.hallucination * 100)}%</p>
                      </div>
                    </div>
                    
                    <div className="text-xs">
                      <p className="text-muted-foreground mb-1"><strong>Response:</strong></p>
                      <p className="mb-2">{result.response.substring(0, 200)}...</p>
                      <p className="text-muted-foreground mb-1"><strong>Expected:</strong></p>
                      <p>{result.groundTruth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-feedback">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Rating Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(userFeedback.ratingDistribution).reverse().map(([rating, percentage]) => (
                    <div key={rating} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 w-16">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      </div>
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {percentage}%
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Rating</span>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold">{userFeedback.averageRating.toFixed(1)}</span>
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on {userFeedback.totalRatings.toLocaleString()} ratings
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-green-600 mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Common Praise
                    </h4>
                    <ul className="space-y-1">
                      {userFeedback.commonPraise.map((item, index) => (
                        <li key={index} className="text-sm text-muted-foreground">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-yellow-600 mb-2 flex items-center">
                      <Warning className="w-4 h-4 mr-1" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {userFeedback.commonComplaints.map((item, index) => (
                        <li key={index} className="text-sm text-muted-foreground">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="drift-detection">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Performance Drift Detection</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Response Quality</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold">Stable</p>
                    <p className="text-xs text-muted-foreground">No significant drift detected</p>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Model Performance</span>
                      <Warning className="w-4 h-4 text-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold">Monitoring</p>
                    <p className="text-xs text-muted-foreground">Slight decrease in accuracy</p>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Data Quality</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold">Excellent</p>
                    <p className="text-xs text-muted-foreground">Consistent data patterns</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Recent Alerts</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Warning className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium">Model accuracy decreased by 2.1%</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Response latency improved by 15ms</span>
                      </div>
                      <span className="text-xs text-muted-foreground">6 hours ago</span>
                    </div>
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