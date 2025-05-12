"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { v4 as uuidv4 } from "uuid"
import { generateInfoCode } from "@/lib/info-code-generator"
import { logSessionEvent } from "@/lib/session-logger"

interface SessionContextType {
  sessionId: string
  sessionInfoCode: string
  userId: string | null
  startTime: Date
  isActive: boolean
  startInteraction: (interactionType: string) => string
  endInteraction: (interactionInfoCode: string, details: any) => Promise<void>
  endSession: () => Promise<void>
}

const SessionContext = createContext<SessionContextType | null>(null)

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}

interface SessionProviderProps {
  children: React.ReactNode
  userId?: string | null
}

export function SessionProvider({ children, userId = null }: SessionProviderProps) {
  const [sessionId] = useState(() => uuidv4())
  const [sessionInfoCode] = useState(() => generateInfoCode("QAO-UIF-SESSION", sessionId))
  const [startTime] = useState(() => new Date())
  const [isActive, setIsActive] = useState(true)

  // Initialize session on mount
  useEffect(() => {
    async function initSession() {
      await logSessionEvent({
        sessionId,
        infoCode: sessionInfoCode,
        eventType: "SESSION_STARTED",
        details: {
          userId,
          userAgent: navigator.userAgent,
          startTime: startTime.toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      })
    }

    initSession()

    // Clean up session on unmount if not explicitly ended
    return () => {
      if (isActive) {
        logSessionEvent({
          sessionId,
          infoCode: sessionInfoCode,
          eventType: "SESSION_TERMINATED_UNEXPECTEDLY",
          details: {
            duration: Date.now() - startTime.getTime(),
          },
        }).catch(console.error)
      }
    }
  }, [sessionId, sessionInfoCode, startTime, userId, isActive])

  // Start a new interaction within the session
  const startInteraction = (interactionType: string) => {
    const interactionInfoCode = generateInfoCode(`QAO-UIF-${interactionType}`, sessionId)

    logSessionEvent({
      sessionId,
      infoCode: interactionInfoCode,
      eventType: `${interactionType}_STARTED`,
      details: {
        timestamp: new Date().toISOString(),
      },
    }).catch(console.error)

    return interactionInfoCode
  }

  // End an interaction
  const endInteraction = async (interactionInfoCode: string, details: any) => {
    await logSessionEvent({
      sessionId,
      infoCode: interactionInfoCode,
      eventType: "INTERACTION_COMPLETED",
      details,
    })
  }

  // End the session
  const endSession = async () => {
    if (!isActive) return

    setIsActive(false)

    await logSessionEvent({
      sessionId,
      infoCode: sessionInfoCode,
      eventType: "SESSION_ENDED",
      details: {
        duration: Date.now() - startTime.getTime(),
        endTime: new Date().toISOString(),
      },
    })
  }

  const value = {
    sessionId,
    sessionInfoCode,
    userId,
    startTime,
    isActive,
    startInteraction,
    endInteraction,
    endSession,
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
