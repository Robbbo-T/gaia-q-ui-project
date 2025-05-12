"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModelSelector } from "@/components/model-selector"
import { ChatMessage } from "@/components/chat-message"
import { ImageUpload } from "@/components/image-upload"
import { Settings } from "@/components/settings"
import { Loader2, Send, Settings2, Save, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { ModelType, type SupportedModel } from "@/lib/models"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Chat() {
  const [selectedModel, setSelectedModel] = useLocalStorage<SupportedModel>("selectedModel", {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    type: ModelType.TEXT,
  })
  const [apiKeys, setApiKeys] = useLocalStorage<Record<string, string>>("apiKeys", {})
  const [showSettings, setShowSettings] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [inputHeight, setInputHeight] = useState(56) // Default height
  const [activeTab, setActiveTab] = useState("chat")
  const [savedConversations, setSavedConversations] = useLocalStorage<
    Array<{
      id: string
      title: string
      messages: any[]
      date: string
    }>
  >("savedConversations", [])

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append, setMessages } = useChat({
    api: "/api/chat",
    body: {
      model: selectedModel,
      imageUrl: imageDataUrl,
      apiKey: apiKeys[selectedModel.provider] || "",
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      })
    },
  })

  // Handle image file selection
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageDataUrl(e.target?.result as string)
      }
      reader.readAsDataURL(imageFile)
    } else {
      setImageDataUrl(null)
    }
  }, [imageFile])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto"
      // Set the height to the scrollHeight
      const newHeight = Math.min(Math.max(56, textareaRef.current.scrollHeight), 200)
      setInputHeight(newHeight)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [input])

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim() && !imageFile) {
      toast({
        description: "Please enter a message or upload an image",
      })
      return
    }

    if (selectedModel.type === ModelType.VISION && !imageFile && !imageDataUrl) {
      toast({
        description: "Please upload an image to use with this vision model",
      })
      return
    }

    if (!apiKeys[selectedModel.provider]) {
      toast({
        title: "API Key Missing",
        description: `Please add your ${selectedModel.provider.toUpperCase()} API key in settings`,
        variant: "destructive",
      })
      setShowSettings(true)
      return
    }

    // If we have an image, add it to the message content
    if (imageDataUrl) {
      append({
        role: "user",
        content: input || "What's in this image?",
        imageUrl: imageDataUrl,
      })

      // Clear the image after sending
      setImageFile(null)
      setImageDataUrl(null)
    } else {
      handleSubmit(e)
    }
  }

  // Clear chat history
  const handleClearChat = () => {
    setMessages([])
    setImageFile(null)
    setImageDataUrl(null)
  }

  // Save current conversation
  const saveConversation = () => {
    if (messages.length === 0) {
      toast({
        description: "No conversation to save",
      })
      return
    }

    const title = messages[0]?.content.substring(0, 30) + "..." || "New Conversation"
    const newConversation = {
      id: Date.now().toString(),
      title,
      messages: messages,
      date: new Date().toISOString(),
    }

    setSavedConversations([...savedConversations, newConversation])

    toast({
      title: "Conversation Saved",
      description: "Your conversation has been saved successfully",
    })
  }

  // Load a saved conversation
  const loadConversation = (conversation: any) => {
    setMessages(conversation.messages)
    setActiveTab("chat")

    toast({
      title: "Conversation Loaded",
      description: "Your saved conversation has been loaded",
    })
  }

  // Delete a saved conversation
  const deleteConversation = (id: string) => {
    setSavedConversations(savedConversations.filter((conv) => conv.id !== id))

    toast({
      title: "Conversation Deleted",
      description: "The conversation has been deleted",
    })
  }

  // Export conversation as JSON
  const exportConversation = () => {
    if (messages.length === 0) {
      toast({
        description: "No conversation to export",
      })
      return
    }

    const dataStr = JSON.stringify(messages, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `gaia-q-conversation-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
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
            <ModelSelector selectedModel={selectedModel} onModelSelect={setSelectedModel} />
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={saveConversation} title="Save Conversation">
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={exportConversation} title="Export Conversation">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b px-4">
              <TabsList>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="saved">Saved Conversations</TabsTrigger>
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
                        Start a conversation with an AI model by typing a message below.
                        {selectedModel.type === ModelType.VISION && (
                          <span> You can also upload an image to analyze.</span>
                        )}
                      </p>
                      <div className="mt-4 max-w-md text-sm text-muted-foreground">
                        <p className="mb-2">Suggested prompts:</p>
                        <div className="grid grid-cols-1 gap-2">
                          <Button
                            variant="outline"
                            className="justify-start text-left h-auto py-2"
                            onClick={() => {
                              if (textareaRef.current) {
                                textareaRef.current.value =
                                  "Explain the GAIA-QAO Object Identification System and how it's used in aerospace applications."
                                handleInputChange({
                                  target: {
                                    value:
                                      "Explain the GAIA-QAO Object Identification System and how it's used in aerospace applications.",
                                  },
                                } as any)
                              }
                            }}
                          >
                            Explain the GAIA-QAO Object Identification System and how it's used in aerospace
                            applications.
                          </Button>
                          <Button
                            variant="outline"
                            className="justify-start text-left h-auto py-2"
                            onClick={() => {
                              if (textareaRef.current) {
                                textareaRef.current.value =
                                  "What are the key components of a quantum-enhanced aerospace system?"
                                handleInputChange({
                                  target: {
                                    value: "What are the key components of a quantum-enhanced aerospace system?",
                                  },
                                } as any)
                              }
                            }}
                          >
                            What are the key components of a quantum-enhanced aerospace system?
                          </Button>
                          <Button
                            variant="outline"
                            className="justify-start text-left h-auto py-2"
                            onClick={() => {
                              if (textareaRef.current) {
                                textareaRef.current.value =
                                  "Generate a sample GAIA-QAO ID for a new unmanned aerial vehicle with quantum navigation capabilities."
                                handleInputChange({
                                  target: {
                                    value:
                                      "Generate a sample GAIA-QAO ID for a new unmanned aerial vehicle with quantum navigation capabilities.",
                                  },
                                } as any)
                              }
                            }}
                          >
                            Generate a sample GAIA-QAO ID for a new unmanned aerial vehicle with quantum navigation
                            capabilities.
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    messages.map((message, index) => <ChatMessage key={index} message={message} />)
                  )}
                  {isLoading && (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm text-muted-foreground">The AI is thinking...</p>
                    </div>
                  )}
                  {error && (
                    <div className="p-4 rounded-lg bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                      <p className="text-sm">Error: {error.message}</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input area */}
              <div className="border-t bg-background p-4">
                <div className="max-w-3xl mx-auto">
                  {imageDataUrl && (
                    <div className="mb-2 relative">
                      <img
                        src={imageDataUrl || "/placeholder.svg"}
                        alt="Uploaded"
                        className="h-32 object-contain rounded-md"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                        onClick={() => {
                          setImageFile(null)
                          setImageDataUrl(null)
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                  <form onSubmit={handleFormSubmit} className="flex space-x-2">
                    <div className="flex-1 flex">
                      <Textarea
                        ref={textareaRef}
                        placeholder={
                          selectedModel.type === ModelType.VISION
                            ? "Ask about an image or upload one..."
                            : "Type a message..."
                        }
                        value={input}
                        onChange={handleInputChange}
                        className={cn(
                          "flex-1 resize-none border rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0",
                          selectedModel.type === ModelType.VISION ? "rounded-l-none" : "rounded-l-md",
                        )}
                        style={{ height: `${inputHeight}px` }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleFormSubmit(e as any)
                          }
                        }}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || (!input.trim() && !imageFile)}
                        className="rounded-l-none"
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                    {selectedModel.type === ModelType.VISION && (
                      <ImageUpload onImageSelect={(file) => setImageFile(file)} disabled={isLoading} />
                    )}
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

            <TabsContent value="saved" className="flex-1 p-0 m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                  <h2 className="text-xl font-bold">Saved Conversations</h2>

                  {savedConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-muted-foreground">No saved conversations yet.</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your conversations will appear here once you save them.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {savedConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{conversation.title}</h3>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => loadConversation(conversation)}>
                                Load
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteConversation(conversation.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(conversation.date).toLocaleString()} • {conversation.messages.length} messages
                          </p>
                        </div>
                      ))}
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
            <Settings apiKeys={apiKeys} onApiKeysChange={setApiKeys} onClose={() => setShowSettings(false)} />
          </div>
        )}
      </div>
    </div>
  )
}
