import type { SessionEvent } from "@/lib/types"

// In a real implementation, this would send logs to a server or service
// For this example, we'll just log to console and localStorage

export async function logSessionEvent(event: SessionEvent): Promise<void> {
  // Add timestamp if not provided
  if (!event.timestamp) {
    event.timestamp = new Date().toISOString()
  }

  // Log to console for development
  console.log(`[${event.infoCode}] ${event.eventType}:`, event.details)

  // Store in localStorage for persistence
  try {
    const logs = JSON.parse(localStorage.getItem("sessionLogs") || "[]")
    logs.push(event)
    localStorage.setItem("sessionLogs", JSON.stringify(logs))
  } catch (error) {
    console.error("Error storing log in localStorage:", error)
  }

  // In a real implementation, this would send the log to a server
  // await fetch('/api/logs', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(event)
  // })
}

export async function getSessionLogs(sessionId: string): Promise<SessionEvent[]> {
  // In a real implementation, this would fetch logs from a server
  // For this example, we'll just get from localStorage

  try {
    const allLogs = JSON.parse(localStorage.getItem("sessionLogs") || "[]")
    return allLogs.filter((log: SessionEvent) => log.sessionId === sessionId)
  } catch (error) {
    console.error("Error retrieving logs from localStorage:", error)
    return []
  }
}

export async function clearSessionLogs(sessionId: string): Promise<void> {
  // In a real implementation, this would delete logs from a server
  // For this example, we'll just update localStorage

  try {
    const allLogs = JSON.parse(localStorage.getItem("sessionLogs") || "[]")
    const filteredLogs = allLogs.filter((log: SessionEvent) => log.sessionId !== sessionId)
    localStorage.setItem("sessionLogs", JSON.stringify(filteredLogs))
  } catch (error) {
    console.error("Error clearing logs from localStorage:", error)
  }
}
