import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/s
import { DropdownMenu, DropdownMenuContent, D
import { useKV } from '@github/spark/hooks'
import { 
  Robot, 
  FileText, 
  ThumbsUp,
  Download,
  ChatCir
  FilePdf,
  FileCsv
  Trash,
} from '@pho
interfa
  role: 'us
  timestamp: 
  feedback?

  id: string
  excerpt: s
  page?: n
}
interface 
  title: st
  create
}
export function ChatInterface(

  const [activeConv
  const [sho


    messagesEndRef.

    scrollToBottom()


      title: 'New 
      create
    }
    setConversati
  }
  const simulat
    await new 
 

          { id: '1', tit
          { 
      },
        content: "I'v
          { id: '4'
          { id: '6', t
 

  }
  const sendMessage = async () => {

    
    if (!conversationId) {
        id: Date.now().toString(),
        messages: [],

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

  const exportConversation = () => {
    if (!currentConversation) return
    
    const exportData = {
      title: currentConversation.title,
      messages: currentConversation.messages,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation-${currentConversation.id}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Conversation exported')
  }

  return (
    <div className="p-6 h-full flex space-x-6">
      {/* Conversation Sidebar */}
      <div className="w-80 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <Button size="sm" onClick={createNewConversation}>
            <Sparkle className="w-4 h-4 mr-1" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {conversations.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No conversations yet. Start a new chat!
              </p>
            ) : (
              conversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                    activeConversation === conversation.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <h3 className="font-medium text-sm truncate">{conversation.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conversation.messages.length} messages • {new Date(conversation.lastActivity).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
            <p><
          </div>
        

            <div class="role
            <div class="content">${msg.conte
          
            htmlContent += `<div class="sources"><strong>
              htmlContent += `
                <strong>${source.title}</strong> (${Math.round(so
              </div>`
            htmlContent += `</div>`
          
        })
        htmlContent += `</body></html>`
        const blob = new Blob([htmlContent], { typ
        toast.success('HTML file ex
      }
    
  }
  const downloadFile = (blob: Blob, filename: string) => {
    const a = document.createElement('a')
    a.download = filename
    URL.revokeObjectURL(url)

    setConversations(current => current.f
      setActiveConversation(null)
    toast.success('Conversation deleted')

    <div className="p-6 h-f
      <Sheet open=
          <Button 
            varian
          >

        <SheetContent side="left" className="w-80 p-0">
            <SheetTitle clas
              <Button size="sm" onClick={create
                New Chat
            </SheetTitle>
          <div className="flex-1 overflow-hidde
              conversations={conversations}
              onSelectConversation={(id) => {
                setShowConversations(false)
              onDeleteConversation={deleteConversation}
          </div>
      </Sheet>
      {/* Desktop Conversation Sidebar */}
        <div className="flex items-center
          <Button size="sm" onC
            New Chat
        </div>
        <ConversationList 
          activeConversation={activeConversation}
          onDeleteConversation={deleteCon
      </div>
      {/* Chat Interface */}
        <Card className="flex-1 flex 
            <div className="fle
                <Robot cla
                {current
                    {c
                )}
              <div className="flex items-ce
                  <SelectTrigger className="w-32">
                  </SelectTrigger>
                    <SelectItem value="gpt-4">GPT-4</
                    <SelectItem value="claude">Claud
                  </SelectContent>
                {currentConversation && (
                    <DropdownMen
                        <Down
                        <CaretDown className="w-3 h-3 ml-1" />
                    </DropdownMenuTrigger>
                      <DropdownM
                        JS
                      <Dropd
                      
                      <DropdownMenuItem onClick={() => e
                        Markdown
                      <DropdownMenuItem onClick={() => e
                        CSV Data
                      <DropdownMe
                        PDF (HTML)
                    </DropdownMenuContent>
                )}
            </div>

            {/* Messages */}
              {!currentConversation || currentConversation.messages.length === 0 ? (
                  <div classNa

                      Ask questions abo
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 m
                        Quarterly Metrics
                      <Button variant="outline" size="sm" onClick={() => setInput("Show
                      </Button>
                        Customer Feedback
                      <Button var
                      </Button>
                  </div>
              ) : (
                  {currentConversation.messages.map(message => (
                      <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center j
                          </div>
                          <div className="w-8 h-8 bg-se
                          </div>
                      </div>
                      <div className="flex
                          <span className="font-medium">
                          </span>
                            {new Date(messag
                        </div>
                        <div className
                        </div>
                        {/* Source
                          <div c
                          

                              {message.
                                  <div className="flex ite
                                      <h5 className="font-medium text-sm">{s
                                   
                                      )
                                    <Badge va
                                    </Badge>
                             
                            </div>
                        )}
                        {/* Actions *
                          <div clas
                              size="sm"
                              onClick={() => 
                              <Copy className="w-3 h-3 mr-1" />
                            </Button>
                             
                              onClick={() => provideFeedback(messag
                            >
                              Helpful
                            <Button
                              variant="
                              className={mess
                              <ThumbsDown className="w-3 h-3 mr-1" />
                            </Button>
                        )}
                    </div>
                  
                    <div className="f
                        <Robot c
                      <div
                          <s
                        </
                     
                  
                      </div>
                  )}
                  <div ref={messagesEndRef} />
              )}

            <div className="border-t border-bo
                <Input
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  className="f
                <Button 
                  disabled={!input.trim() || isLoading}
                >
                </Button>
              <p className="te
              </p>
          </CardContent>
      </div>
  )

function ConversationL
  activeConversa
  onDeleteConversation 

  onSelectConversation: (
}) {
    <ScrollArea className="flex-1 conversation
        {conversations
            No conversations ye
        ) : (
            <div
              className={`group p-3 rounded-lg cursor-pointer border transition-colors
                  ? 'bg-primary/10 bor
              }`}
            >
                <div cla
                  <p className="text-xs 
                  </p>
                <Button
                 
                  onClick={(e) => {
                    onDel
                >
                </Button>
            </div>
        )}
    </ScrollArea>
}




