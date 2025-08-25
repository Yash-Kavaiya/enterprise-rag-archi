import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  Upload, 
  File, 
  CheckCircle, 
  Clock, 
  X,
  FileText,
  FilePdf,
  FileDoc,
  Table,
  Warning
} from '@phosphor-icons/react'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: 'processing' | 'completed' | 'failed'
  progress: number
  uploadedAt: string
  chunks?: number
  metadata?: Record<string, any>
}

export function DataIngestion() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useKV<UploadedFile[]>('uploaded-files', [])
  const [processingQueue, setProcessingQueue] = useKV<UploadedFile[]>('processing-queue', [])

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FilePdf className="w-5 h-5 text-red-500" />
    if (type.includes('word') || type.includes('document')) return <FileDoc className="w-5 h-5 text-blue-500" />
    if (type.includes('csv') || type.includes('excel')) return <Table className="w-5 h-5 text-green-500" />
    return <FileText className="w-5 h-5 text-gray-500" />
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }, [])

  const handleFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'processing' as const,
      progress: 0,
      uploadedAt: new Date().toISOString(),
      chunks: Math.ceil(file.size / 1000000) // Estimate chunks based on file size
    }))

    setUploadedFiles(current => [...current, ...newFiles])
    setProcessingQueue(current => [...current, ...newFiles])

    // Simulate processing
    newFiles.forEach(file => {
      simulateProcessing(file.id)
    })

    toast.success(`Started processing ${files.length} file(s)`)
  }

  const simulateProcessing = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles(current => {
        const updated = current.map(file => {
          if (file.id === fileId && file.status === 'processing') {
            const newProgress = Math.min(file.progress + Math.random() * 20, 100)
            const isCompleted = newProgress >= 100
            
            return {
              ...file,
              progress: newProgress,
              status: isCompleted ? (Math.random() > 0.1 ? 'completed' : 'failed') as const : 'processing' as const,
              metadata: isCompleted ? {
                chunks: file.chunks,
                embeddings: Math.floor(Math.random() * 1000) + 100,
                processingTime: `${Math.floor(Math.random() * 30 + 5)}s`
              } : file.metadata
            }
          }
          return file
        })
        
        const file = updated.find(f => f.id === fileId)
        if (file && file.status !== 'processing') {
          clearInterval(interval)
          setProcessingQueue(current => current.filter(f => f.id !== fileId))
          
          if (file.status === 'completed') {
            toast.success(`${file.name} processed successfully`)
          } else {
            toast.error(`Failed to process ${file.name}`)
          }
        }
        
        return updated
      })
    }, 500)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(current => current.filter(f => f.id !== fileId))
    setProcessingQueue(current => current.filter(f => f.id !== fileId))
  }

  const retryFile = (fileId: string) => {
    setUploadedFiles(current => 
      current.map(file => 
        file.id === fileId 
          ? { ...file, status: 'processing' as const, progress: 0 }
          : file
      )
    )
    simulateProcessing(fileId)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const completedFiles = uploadedFiles.filter(f => f.status === 'completed')
  const failedFiles = uploadedFiles.filter(f => f.status === 'failed')
  const processingFiles = uploadedFiles.filter(f => f.status === 'processing')

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <div>
        <h1 className="text-3xl font-bold">Data Ingestion Portal</h1>
        <p className="text-muted-foreground mt-1">Upload and process documents for your knowledge base</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Files</p>
                <p className="text-2xl font-bold">{uploadedFiles.length}</p>
              </div>
              <File className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedFiles.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{processingFiles.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Failed</p>
                <p className="text-2xl font-bold text-red-600">{failedFiles.length}</p>
              </div>
              <Warning className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Drop files here or click to upload</h3>
            <p className="text-muted-foreground mb-4">
              Supported formats: PDF, DOCX, TXT, CSV, JSON, XML, HTML, Markdown
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.csv,.json,.xml,.html,.md"
              className="hidden"
              id="file-upload"
              onChange={handleFileInput}
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Select Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Files ({uploadedFiles.length})</TabsTrigger>
          <TabsTrigger value="processing">Processing ({processingFiles.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedFiles.length})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({failedFiles.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Uploaded Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadedFiles.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No files uploaded yet</p>
                ) : (
                  uploadedFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3 flex-1">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleString()}
                          </p>
                          {file.status === 'processing' && (
                            <Progress value={file.progress} className="mt-2 w-32" />
                          )}
                          {file.metadata && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {file.metadata.chunks} chunks • {file.metadata.embeddings} embeddings • {file.metadata.processingTime}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          file.status === 'completed' ? 'default' : 
                          file.status === 'processing' ? 'secondary' : 'destructive'
                        }>
                          {file.status}
                        </Badge>
                        {file.status === 'failed' && (
                          <Button size="sm" variant="outline" onClick={() => retryFile(file.id)}>
                            Retry
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => removeFile(file.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing">
          <Card>
            <CardHeader>
              <CardTitle>Processing Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processingFiles.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No files currently processing</p>
                ) : (
                  processingFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3 flex-1">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                          <Progress value={file.progress} className="mt-2 w-48" />
                          <p className="text-xs text-muted-foreground mt-1">{Math.round(file.progress)}% complete</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Processing</Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedFiles.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No completed files</p>
                ) : (
                  completedFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3 flex-1">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleString()}
                          </p>
                          {file.metadata && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {file.metadata.chunks} chunks • {file.metadata.embeddings} embeddings • {file.metadata.processingTime}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default">Completed</Badge>
                        <Button size="sm" variant="ghost" onClick={() => removeFile(file.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card>
            <CardHeader>
              <CardTitle>Failed Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {failedFiles.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No failed files</p>
                ) : (
                  failedFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3 flex-1">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleString()}
                          </p>
                          <p className="text-xs text-red-600 mt-1">Processing failed - check file format and size</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="destructive">Failed</Badge>
                        <Button size="sm" variant="outline" onClick={() => retryFile(file.id)}>
                          Retry
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => removeFile(file.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}