"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSession } from "@/components/session-manager"
import { InputAnalyzer } from "@/components/input-analyzer"
import { ModelRouter } from "@/components/model-router"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "@/components/chat-message"
import { FileUpload } from "@/components/file-upload"
import { Settings } from "@/components/settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, Settings2, FileText, Database, Cpu } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { InputAnalysisResult, ModelRecommendation, ModelResponse } from "@/lib/types"
import { generateInfoCode } from "@/lib/info-code-generator"
import { logSessionEvent } from "@/lib/session-logger"

export function EnhancedChat() {
  const { sessionId, sessionInfoCode, startInteraction, endInteraction } = useSession()
  const [input, setInput] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [analysisResult, setAnalysisResult] = useState<InputAnalysisResult | null>(null)
  const [modelRecommendations, setModelRecommendations] = useState<ModelRecommendation[]>([])
  const [registryData, setRegistryData] = useState<any | null>(null)
  const [mcpData, setMcpData] = useState<any | null>(null)
  const [sessionLogs, setSessionLogs] = useState<any[]>([])
  const [inputHeight, setInputHeight] = useState(56)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const newHeight = Math.min(Math.max(56, textareaRef.current.scrollHeight), 200)
      setInputHeight(newHeight)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [input])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim() && files.length === 0) {
      toast({
        description: "Please enter a message or upload files",
      })
      return
    }

    // Start a new user query interaction
    const interactionInfoCode = startInteraction("QUERY")

    try {
      setIsProcessing(true)

      // Log the user query
      await logSessionEvent({
        sessionId,
        infoCode: interactionInfoCode,
        eventType: "USER_QUERY_SUBMITTED",
        details: {
          inputText: input,
          fileCount: files.length,
          fileTypes: files.map((f) => f.type),
        },
      })

      // Add user message to chat
      const userMessage = {
        role: "user",
        content: input,
        files: files,
        timestamp: new Date().toISOString(),
        infoCode: interactionInfoCode,
      }

      setMessages((prev) => [...prev, userMessage])

      // Clear input and files
      setInput("")
      setFiles([])

      // Analysis and routing will be handled by the InputAnalyzer and ModelRouter components
    } catch (error) {
      console.error("Error submitting query:", error)

      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive",
      })

      // Log the error
      await logSessionEvent({
        sessionId,
        infoCode: interactionInfoCode,
        eventType: "USER_QUERY_ERROR",
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      })

      setIsProcessing(false)
    }
  }

  // Handle analysis completion
  const handleAnalysisComplete = (result: InputAnalysisResult, recommendations: ModelRecommendation[]) => {
    setAnalysisResult(result)
    setModelRecommendations(recommendations)
  }

  // Handle model responses
  const handleModelResponse = async (responses: ModelResponse[]) => {
    // Create a system message showing the models used
    const modelInfoMessage = {
      role: "system",
      content: `Query processed using: ${responses.map((r) => r.modelName).join(", ")}`,
      timestamp: new Date().toISOString(),
      infoCode: generateInfoCode("QAO-UIF-INFO", sessionId),
    }

    // Create the assistant message with the aggregated response
    const assistantMessage = {
      role: "assistant",
      content: responses[0].content, // We'll use the primary model's response for now
      modelResponses: responses, // Store all responses for potential display
      timestamp: new Date().toISOString(),
      infoCode: generateInfoCode("QAO-UIF-RESPONSE", sessionId),
    }

    // Add messages to chat
    setMessages((prev) => [...prev, modelInfoMessage, assistantMessage])

    // Log the response
    await logSessionEvent({
      sessionId,
      infoCode: assistantMessage.infoCode,
      eventType: "AI_RESPONSE_GENERATED",
      details: {
        modelCount: responses.length,
        primaryModel: responses[0].modelId,
        responseLength: responses[0].content.length,
        confidence: responses[0].confidence,
      },
    })

    setIsProcessing(false)
  }

  // Handle registry response
  const handleRegistryResponse = async (data: any) => {
    setRegistryData(data)

    // Create a system message showing the registry data
    const registryMessage = {
      role: "system",
      content: "GAIA-QAO Registry data retrieved",
      registryData: data,
      timestamp: new Date().toISOString(),
      infoCode: generateInfoCode("QAO-UIF-REGISTRY-RESPONSE", sessionId),
    }

    // Add message to chat
    setMessages((prev) => [...prev, registryMessage])

    // Log the registry response
    await logSessionEvent({
      sessionId,
      infoCode: registryMessage.infoCode,
      eventType: "REGISTRY_DATA_RECEIVED",
      details: {
        dataSize: JSON.stringify(data).length,
        objectCount: Array.isArray(data) ? data.length : 1,
      },
    })
  }

  // Handle MCP response
  const handleMCPResponse = async (data: any) => {
    setMcpData(data)

    // Create a system message showing the MCP data
    const mcpMessage = {
      role: "system",
      content: `MCP Agent response received from ${data.agentsResponded.join(", ")}`,
      mcpData: data,
      timestamp: new Date().toISOString(),
      infoCode: generateInfoCode("QAO-UIF-MCP-RESPONSE", sessionId),
    }

    // Add message to chat
    setMessages((prev) => [...prev, mcpMessage])

    // Log the MCP response
    await logSessionEvent({
      sessionId,
      infoCode: mcpMessage.infoCode,
      eventType: "MCP_DATA_RECEIVED",
      details: {
        agentsResponded: data.agentsResponded,
        resultCount: data.results.length,
      },
    })
  }

  // Handle errors
  const handleError = async (error: Error) => {
    console.error("Error in processing:", error)

    toast({
      title: "Error",
      description: error.message || "An error occurred during processing",
      variant: "destructive",
    })

    // Create an error message
    const errorMessage = {
      role: "system",
      content: `Error: ${error.message}`,
      error: true,
      timestamp: new Date().toISOString(),
      infoCode: generateInfoCode("QAO-UIF-ERROR", sessionId),
    }

    // Add error message to chat
    setMessages((prev) => [...prev, errorMessage])

    // Log the error
    await logSessionEvent({
      sessionId,
      infoCode: errorMessage.infoCode,
      eventType: "PROCESSING_ERROR",
      details: {
        error: error.message,
        stack: error.stack,
      },
    })

    setIsProcessing(false)
  }

  // Clear chat history
  const handleClearChat = async () => {
    const clearInfoCode = startInteraction("CLEAR")

    await logSessionEvent({
      sessionId,
      infoCode: clearInfoCode,
      eventType: "CHAT_CLEARED",
      details: {
        messageCount: messages.length,
      },
    })

    setMessages([])
    setAnalysisResult(null)
    setModelRecommendations([])
    setRegistryData(null)
    setMcpData(null)

    await endInteraction(clearInfoCode, { success: true })

    toast({
      description: "Chat history cleared",
    })
  }

  // Load session logs
  const loadSessionLogs = async () => {
    // This would typically fetch logs from your logging service
    // For now, we'll just set a placeholder
    setSessionLogs([
      {
        timestamp: new Date().toISOString(),
        infoCode: sessionInfoCode,
        eventType: "SESSION_STARTED",
        details: { userId: "user123" },
      },
      // More logs would be here
    ])
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    if (value === "logs" && sessionLogs.length === 0) {
      loadSessionLogs()
    }
  }

  return (
    <div className="flex flex-col h-full max-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container flex h-14 items-center px-4">
          <div className="mr-4 flex">
            <a href="/" className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="font-bold">GAIA-Q-UI</span>
            </a>
          </div>
          <div className="flex flex-1 items-center space-x-2 justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Session: {sessionInfoCode}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => setShowSettings(!showSettings)}>
                <Settings2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
            <div className="border-b px-4">
              <TabsList>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="logs">Session Logs</TabsTrigger>
                <TabsTrigger value="registry">Registry Data</TabsTrigger>
                <TabsTrigger value="mcp">MCP Agents</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-2 text-center">
                      <h2 className="text-2xl font-bold">Welcome to GAIA-Q-UI</h2>
                      <p className="text-muted-foreground">
                        Start a conversation by typing a message or uploading files.
                      </p>
                      <div className="mt-4 max-w-md text-sm text-muted-foreground">
                        <p className="mb-2">Suggested aerospace queries:</p>
                        <div className="grid grid-cols-1 gap-2">
                          <Button
                            variant="outline"
                            className="justify-start text-left h-auto py-2"
                            onClick={() => {
                              setInput("Analyze telemetry data for AS-M-PAX-BW-Q1H-00001 and identify any anomalies")
                            }}
                          >
                            Analyze telemetry data for AS-M-PAX-BW-Q1H-00001 and identify any anomalies
                          </Button>
                          <Button
                            variant="outline"
                            className="justify-start text-left h-auto py-2"
                            onClick={() => {
                              setInput("What is the current configuration of AS-U-ISR-UA-Q2L-00077?")
                            }}
                          >
                            What is the current configuration of AS-U-ISR-UA-Q2L-00077?
                          </Button>
                          <Button
                            variant="outline"
                            className="justify-start text-left h-auto py-2"
                            onClick={() => {
                              setInput(
                                "Compare quantum gravimeter QSX-01A with traditional sensors for geological surveys",
                              )
                            }}
                          >
                            Compare quantum gravimeter QSX-01A with traditional sensors for geological surveys
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    messages.map((message, index) => <ChatMessage key={index} message={message} showInfoCode={true} />)
                  )}
                  {isProcessing && (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm text-muted-foreground">Processing your request...</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input area */}
              <div className="border-t bg-background p-4">
                <div className="max-w-3xl mx-auto">
                  {files.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {files.map((file, index) => (
                        <div key={index} className="relative inline-block">
                          <Badge variant="secondary" className="px-2 py-1">
                            <FileText className="h-3 w-3 mr-1" />
                            {file.name}
                            <button
                              className="ml-1 text-xs"
                              onClick={() => setFiles(files.filter((_, i) => i !== index))}
                            >
                              ×
                            </button>
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="flex space-x-2">
                    <div className="flex-1 flex">
                      <Textarea
                        ref={textareaRef}
                        placeholder="Type a message or upload files..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 resize-none border rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        style={{ height: `${inputHeight}px` }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit(e as any)
                          }
                        }}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={isProcessing || (!input.trim() && files.length === 0)}
                        className="rounded-l-none"
                      >
                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FileUpload onFilesSelected={setFiles} disabled={isProcessing} />
                  </form>
                  <div className="flex justify-center mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearChat}
                      className="text-xs text-muted-foreground"
                    >
                      Clear chat
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="flex-1 p-0 m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Session Logs</h2>
                    <Badge variant="outline">{sessionInfoCode}</Badge>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-2 text-left">Timestamp</th>
                          <th className="p-2 text-left">InfoCode</th>
                          <th className="p-2 text-left">Event Type</th>
                          <th className="p-2 text-left">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessionLogs.length > 0 ? (
                          sessionLogs.map((log, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-2">{new Date(log.timestamp).toLocaleTimeString()}</td>
                              <td className="p-2">
                                <code className="text-xs bg-muted px-1 py-0.5 rounded">{log.infoCode}</code>
                              </td>
                              <td className="p-2">{log.eventType}</td>
                              <td className="p-2">
                                <pre className="text-xs overflow-x-auto">{JSON.stringify(log.details, null, 2)}</pre>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-muted-foreground">
                              Loading session logs...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="registry" className="flex-1 p-0 m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                  <div className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    <h2 className="text-xl font-bold">GAIA-QAO Registry Data</h2>
                  </div>

                  {registryData ? (
                    <div className="border rounded-md p-4 bg-muted/20">
                      <pre className="text-sm overflow-x-auto">{JSON.stringify(registryData, null, 2)}</pre>
                    </div>
                  ) : (
                    <div className="border rounded-md p-8 text-center">
                      <p className="text-muted-foreground">No registry data has been queried yet.</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Ask a question about a specific GAIA-QAO object ID to query the registry.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="mcp" className="flex-1 p-0 m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                  <div className="flex items-center">
                    <Cpu className="h-5 w-5 mr-2" />
                    <h2 className="text-xl font-bold">MCP Agent Responses</h2>
                  </div>

                  {mcpData ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {mcpData.agentsResponded.map((agent: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {agent}
                          </Badge>
                        ))}
                      </div>

                      <div className="border rounded-md p-4 bg-muted/20">
                        <pre className="text-sm overflow-x-auto">{JSON.stringify(mcpData.results, null, 2)}</pre>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-md p-8 text-center">
                      <p className="text-muted-foreground">No MCP agent data has been received yet.</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Complex queries may trigger MCP agent responses for specialized processing.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="w-80 border-l bg-background p-4 overflow-auto">
            <Settings onClose={() => setShowSettings(false)} />
          </div>
        )}
      </div>

      {/* Input analyzer and model router (invisible components) */}
      {input || files.length > 0 ? (
        <InputAnalyzer input={input} files={files} sessionId={sessionId} onAnalysisComplete={handleAnalysisComplete} />
      ) : null}

      {analysisResult && modelRecommendations.length > 0 ? (
        <ModelRouter
          analysisResult={analysisResult}
          modelRecommendations={modelRecommendations}
          sessionId={sessionId}
          input={input}
          files={files}
          onModelResponse={handleModelResponse}
          onRegistryResponse={handleRegistryResponse}
          onMCPResponse={handleMCPResponse}
          onError={handleError}
        />
      ) : null}
    </div>
  )
}
