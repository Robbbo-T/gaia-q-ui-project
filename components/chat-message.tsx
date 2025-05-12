import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Message } from "ai"
import { Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={cn("flex items-start gap-4 pr-5", message.role === "user" ? "flex-row" : "flex-row")}>
      {message.role === "user" ? (
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      ) : (
        <Avatar>
          <AvatarFallback className="bg-muted text-muted-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex-1 space-y-2">
        <div className="font-semibold">{message.role === "user" ? "You" : "GAIA-Q Assistant"}</div>
        <div className="prose prose-sm dark:prose-invert">
          {/* Display image if present */}
          {message.imageUrl && (
            <div className="mb-2">
              <img
                src={message.imageUrl || "/placeholder.svg"}
                alt="User uploaded"
                className="max-h-60 rounded-md object-contain"
              />
            </div>
          )}

          {/* Display text content with markdown support */}
          <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose dark:prose-invert break-words">
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
