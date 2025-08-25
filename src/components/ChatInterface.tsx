import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  PaperPlaneRight, 
  Robot, 
  User, 
  FileText, 
  Copy,
  ThumbsUp,
  ThumbsDown,
  Download,
  Sparkle,
  ChatCircle,
  CaretDown,
  FilePdf,
  FileDoc,
  FileCsv,
  FileCode,
  Trash,
  Sidebar
} from '@phosphor-icons/react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  sources?: Source[]
  feedback?: 'positive' | 'negative'
}

interface Source {
  id: string
  title: string
  excerpt: string
  confidence: number
  page?: number
  url?: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  lastActivity: string
}

export function ChatInterface() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [conversations, setConversations] = useKV<Conversation[]>('conversations', [])
  const [showConversations, setShowConversations] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentConversation = conversations.find(c => c.id === activeConversation)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentConversation?.messages])

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    }
    
    setConversations(current => [newConversation, ...current])
    setActiveConversation(newConversation.id)
  }

  const simulateAIResponse = async (userMessage: string): Promise<{ content: string; sources: Source[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500))
    
    const responses = [
      {
        content: "Based on the enterprise documentation I've analyzed, here are the key insights regarding your query:\n\n**Strategic Overview:**\nThe quarterly performance metrics indicate a 23% improvement in operational efficiency, primarily driven by the implementation of automated workflow systems. This aligns with our digital transformation roadmap outlined in the Q4 strategic planning documents.\n\n**Key Findings:**\n- Process automation reduced manual intervention by 67%\n- Customer satisfaction scores improved to 4.7/5\n- Cost savings of approximately $2.3M annually\n\n**Recommendations:**\n1. Scale automation to additional departments\n2. Implement advanced analytics for predictive insights\n3. Consider expanding the customer feedback loop\n\nWould you like me to dive deeper into any specific aspect of these findings?",
        sources: [
          { id: '1', title: 'Q4 Strategic Planning Document', excerpt: 'Digital transformation roadmap emphasizes automation...', confidence: 0.94, page: 15 },
          { id: '2', title: 'Operational Efficiency Report', excerpt: '23% improvement in operational efficiency through...', confidence: 0.89, page: 7 },
          { id: '3', title: 'Customer Satisfaction Analysis', excerpt: 'Customer satisfaction scores improved to 4.7/5...', confidence: 0.87, page: 12 }
        ]
      },
      {
        content: "I've found comprehensive information about this topic in your knowledge base:\n\n**Executive Summary:**\nThe compliance framework has been successfully updated to meet the latest regulatory requirements. All departments have completed the mandatory training, and audit procedures are now fully digitized.\n\n**Compliance Status:**\n- **GDPR Compliance**: 100% compliant with updated privacy controls\n- **SOX Requirements**: All financial controls tested and verified\n- **Industry Standards**: ISO 27001 certification renewed\n\n**Risk Assessment:**\nLow to moderate risk across all operational areas. The implementation of automated monitoring has significantly reduced compliance gaps.\n\n**Next Steps:**\n- Quarterly compliance reviews scheduled\n- Staff training updates planned for Q2\n- Enhanced monitoring tools deployment\n\nIs there a specific compliance area you'd like me to elaborate on?",
        sources: [
          { id: '4', title: 'Compliance Framework Update', excerpt: 'Updated regulatory requirements and implementation...', confidence: 0.96, page: 3 },
          { id: '5', title: 'Risk Assessment Q1 2024', excerpt: 'Low to moderate risk across operational areas...', confidence: 0.91, page: 18 },
          { id: '6', title: 'ISO 27001 Certification Report', excerpt: 'Certification renewed with full compliance...', confidence: 0.88, page: 5 }
        ]
      }
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    let conversationId = activeConversation
    
    // Create new conversation if none exists
    if (!conversationId) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: input.slice(0, 50) + (input.length > 50 ? '...' : ''),
        messages: [],
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      }
      
      setConversations(current => [newConversation, ...current])
      conversationId = newConversation.id
      setActiveConversation(conversationId)
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    }

    // Add user message
    setConversations(current =>
      current.map(conv =>
        conv.id === conversationId
          ? { 
              ...conv, 
              messages: [...conv.messages, userMessage],
              lastActivity: new Date().toISOString(),
              title: conv.messages.length === 0 ? input.slice(0, 50) + (input.length > 50 ? '...' : '') : conv.title
            }
          : conv
      )
    )

    setInput('')
    setIsLoading(true)

    try {
      const { content, sources } = await simulateAIResponse(input)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
        timestamp: new Date().toISOString(),
        sources
      }

      setConversations(current =>
        current.map(conv =>
          conv.id === conversationId
            ? { 
                ...conv, 
                messages: [...conv.messages, assistantMessage],
                lastActivity: new Date().toISOString()
              }
            : conv
        )
      )
    } catch (error) {
      toast.error('Failed to get response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const provideFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setConversations(current =>
      current.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg =>
          msg.id === messageId ? { ...msg, feedback } : msg
        )
      }))
    )
    toast.success('Feedback recorded')
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Message copied to clipboard')
  }

  const exportConversation = (format: 'json' | 'txt' | 'pdf' | 'csv' | 'md') => {
    if (!currentConversation) return
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `conversation-${currentConversation.id}-${timestamp}`
    
    switch (format) {
      case 'json': {
        const exportData = {
          title: currentConversation.title,
          messages: currentConversation.messages,
          exportedAt: new Date().toISOString(),
          model: selectedModel
        }
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
        downloadFile(blob, `${filename}.json`)
        break
      }
      
      case 'txt': {
        let content = `Conversation: ${currentConversation.title}\n`
        content += `Exported: ${new Date().toLocaleString()}\n`
        content += `Model: ${selectedModel}\n`
        content += `Messages: ${currentConversation.messages.length}\n\n`
        content += '=' .repeat(60) + '\n\n'
        
        currentConversation.messages.forEach(msg => {
          content += `${msg.role === 'user' ? 'USER' : 'AI ASSISTANT'} [${new Date(msg.timestamp).toLocaleString()}]\n`
          content += `${msg.content}\n\n`
          
          if (msg.sources && msg.sources.length > 0) {
            content += `Sources:\n`
            msg.sources.forEach(source => {
              content += `- ${source.title} (${Math.round(source.confidence * 100)}% confidence)\n`
              content += `  ${source.excerpt}\n`
            })
            content += '\n'
          }
          
          content += '-'.repeat(40) + '\n\n'
        })
        
        const blob = new Blob([content], { type: 'text/plain' })
        downloadFile(blob, `${filename}.txt`)
        break
      }
      
      case 'csv': {
        const headers = ['Timestamp', 'Role', 'Content', 'Sources Count', 'Feedback']
        const rows = currentConversation.messages.map(msg => [
          new Date(msg.timestamp).toISOString(),
          msg.role,
          `"${msg.content.replace(/"/g, '""')}"`,
          msg.sources?.length || 0,
          msg.feedback || ''
        ])
        
        const csvContent = [headers, ...rows]
          .map(row => row.join(','))
          .join('\n')
        
        const blob = new Blob([csvContent], { type: 'text/csv' })
        downloadFile(blob, `${filename}.csv`)
        break
      }
      
      case 'md': {
        let content = `# ${currentConversation.title}\n\n`
        content += `**Exported:** ${new Date().toLocaleString()}  \n`
        content += `**Model:** ${selectedModel}  \n`
        content += `**Messages:** ${currentConversation.messages.length}  \n\n`
        content += '---\n\n'
        
        currentConversation.messages.forEach(msg => {
          const role = msg.role === 'user' ? '👤 **You**' : '🤖 **AI Assistant**'
          content += `## ${role}\n`
          content += `*${new Date(msg.timestamp).toLocaleString()}*\n\n`
          content += `${msg.content}\n\n`
          
          if (msg.sources && msg.sources.length > 0) {
            content += `### 📚 Sources\n\n`
            msg.sources.forEach(source => {
              content += `- **${source.title}** (${Math.round(source.confidence * 100)}% confidence)\n`
              content += `  > ${source.excerpt}\n\n`
            })
          }
          
          content += '---\n\n'
        })
        
        const blob = new Blob([content], { type: 'text/markdown' })
        downloadFile(blob, `${filename}.md`)
        break
      }
      
      case 'pdf': {
        // For PDF, we'll create a formatted HTML string that can be printed/saved as PDF
        let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${currentConversation.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .message { margin-bottom: 30px; page-break-inside: avoid; }
            .role { font-weight: bold; color: #333; margin-bottom: 5px; }
            .timestamp { color: #666; font-size: 0.9em; margin-bottom: 10px; }
            .content { margin-bottom: 15px; white-space: pre-wrap; }
            .sources { background: #f5f5f5; padding: 15px; border-left: 4px solid #007acc; }
            .source-item { margin-bottom: 10px; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${currentConversation.title}</h1>
            <p><strong>Exported:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Model:</strong> ${selectedModel}</p>
            <p><strong>Messages:</strong> ${currentConversation.messages.length}</p>
          </div>
        `
        
        currentConversation.messages.forEach(msg => {
          htmlContent += `
          <div class="message">
            <div class="role">${msg.role === 'user' ? '👤 You' : '🤖 AI Assistant'}</div>
            <div class="timestamp">${new Date(msg.timestamp).toLocaleString()}</div>
            <div class="content">${msg.content}</div>
          `
          
          if (msg.sources && msg.sources.length > 0) {
            htmlContent += `<div class="sources"><strong>Sources:</strong><br>`
            msg.sources.forEach(source => {
              htmlContent += `
              <div class="source-item">
                <strong>${source.title}</strong> (${Math.round(source.confidence * 100)}% confidence)<br>
                <em>${source.excerpt}</em>
              </div>`
            })
            htmlContent += `</div>`
          }
          
          htmlContent += `</div>`
        })
        
        htmlContent += `</body></html>`
        
        const blob = new Blob([htmlContent], { type: 'text/html' })
        downloadFile(blob, `${filename}.html`)
        toast.success('HTML file exported - Open in browser and print to PDF')
        return
      }
    }
    
    toast.success(`Conversation exported as ${format.toUpperCase()}`)
  }
  
  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const deleteConversation = (conversationId: string) => {
    setConversations(current => current.filter(c => c.id !== conversationId))
    if (activeConversation === conversationId) {
      setActiveConversation(null)
    }
    toast.success('Conversation deleted')
  }

  return (
    <div className="p-6 h-full flex space-x-6">
      {/* Mobile Conversation Sheet */}
      <Sheet open={showConversations} onOpenChange={setShowConversations}>
        <SheetTrigger asChild>
          <Button 
            size="sm" 
            variant="outline" 
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Sidebar className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center justify-between">
              <span>Conversations</span>
              <Button size="sm" onClick={createNewConversation}>
                <Sparkle className="w-4 h-4 mr-1" />
                New Chat
              </Button>
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">
            <ConversationList 
              conversations={conversations}
              activeConversation={activeConversation}
              onSelectConversation={(id) => {
                setActiveConversation(id)
                setShowConversations(false)
              }}
              onDeleteConversation={deleteConversation}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Conversation Sidebar */}
      <div className="hidden md:flex w-80 flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <Button size="sm" onClick={createNewConversation}>
            <Sparkle className="w-4 h-4 mr-1" />
            New Chat
          </Button>
        </div>

        <ConversationList 
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={setActiveConversation}
          onDeleteConversation={deleteConversation}
        />
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Robot className="w-5 h-5" />
                <span>Enterprise AI Assistant</span>
                {currentConversation && (
                  <Badge variant="outline" className="ml-2">
                    {currentConversation.messages.length} messages
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                    <SelectItem value="llama">Llama 2</SelectItem>
                  </SelectContent>
                </Select>
                {currentConversation && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                        <CaretDown className="w-3 h-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => exportConversation('json')}>
                        <FileCode className="w-4 h-4 mr-2" />
                        JSON Format
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportConversation('txt')}>
                        <FileText className="w-4 h-4 mr-2" />
                        Text File
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportConversation('md')}>
                        <FileText className="w-4 h-4 mr-2" />
                        Markdown
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportConversation('csv')}>
                        <FileCsv className="w-4 h-4 mr-2" />
                        CSV Data
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportConversation('pdf')}>
                        <FilePdf className="w-4 h-4 mr-2" />
                        PDF (HTML)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-6 chat-scroll">
              {!currentConversation || currentConversation.messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Robot className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Welcome to Enterprise RAG</h3>
                    <p className="text-muted-foreground mb-4">
                      Ask questions about your enterprise data and get AI-powered insights with citations.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
                      <Button variant="outline" size="sm" onClick={() => setInput("What are our latest quarterly performance metrics?")}>
                        Quarterly Metrics
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setInput("Show me compliance status updates")}>
                        Compliance Status
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setInput("Analyze customer feedback trends")}>
                        Customer Feedback
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setInput("What are the key risk factors?")}>
                        Risk Analysis
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {currentConversation.messages.map(message => (
                    <div key={message.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        {message.role === 'user' ? (
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-primary-foreground" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                            <Robot className="w-4 h-4 text-secondary-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {message.role === 'user' ? 'You' : 'AI Assistant'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <div className="prose prose-sm max-w-none text-foreground">
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>

                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              Sources ({message.sources.length})
                            </h4>
                            <div className="space-y-2">
                              {message.sources.map(source => (
                                <div key={source.id} className="p-3 border border-border rounded-lg bg-muted/30">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h5 className="font-medium text-sm">{source.title}</h5>
                                      <p className="text-xs text-muted-foreground mt-1">{source.excerpt}</p>
                                      {source.page && (
                                        <p className="text-xs text-muted-foreground mt-1">Page {source.page}</p>
                                      )}
                                    </div>
                                    <Badge variant="outline" className="ml-2">
                                      {Math.round(source.confidence * 100)}%
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        {message.role === 'assistant' && (
                          <div className="flex items-center space-x-2 pt-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyMessage(message.content)}
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => provideFeedback(message.id, 'positive')}
                              className={message.feedback === 'positive' ? 'text-green-600' : ''}
                            >
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              Helpful
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => provideFeedback(message.id, 'negative')}
                              className={message.feedback === 'negative' ? 'text-red-600' : ''}
                            >
                              <ThumbsDown className="w-3 h-3 mr-1" />
                              Not Helpful
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <Robot className="w-4 h-4 text-secondary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">AI Assistant</span>
                          <span className="text-xs text-muted-foreground">thinking...</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your enterprise data..."
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!input.trim() || isLoading}
                  size="icon"
                >
                  <PaperPlaneRight className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send • AI responses include source citations for transparency
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Separate component for conversation list to reduce duplication
function ConversationList({ 
  conversations, 
  activeConversation, 
  onSelectConversation, 
  onDeleteConversation 
}: {
  conversations: Conversation[]
  activeConversation: string | null
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
}) {
  return (
    <ScrollArea className="flex-1 conversation-scroll">
      <div className="space-y-2 p-4">
        {conversations.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No conversations yet. Start a new chat!
          </p>
        ) : (
          conversations.map(conversation => (
            <div
              key={conversation.id}
              className={`group p-3 rounded-lg cursor-pointer border transition-colors relative ${
                activeConversation === conversation.id
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card border-border hover:bg-muted/50'
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate pr-2">{conversation.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conversation.messages.length} messages • {new Date(conversation.lastActivity).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteConversation(conversation.id)
                  }}
                >
                  <Trash className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  )
}