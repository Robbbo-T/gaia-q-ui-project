import { EnhancedChat } from "@/components/enhanced-chat"
import { SessionProvider } from "@/components/session-manager"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <SessionProvider>
        <EnhancedChat />
      </SessionProvider>
    </main>
  )
}
