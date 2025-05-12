"use client"

import { useState, useEffect } from "react"
import type { ModelResponse } from "@/lib/types"
import { generateInfoCode } from "@/lib/info-code-generator"
import { logSessionEvent } from "@/lib/session-logger"

interface ResultsAggregatorProps {
  modelResponses: ModelResponse[]
  registryData?: any
  mcpData?: any
  sessionId: string
  onAggregatedResult: (result: string) => void
}

export function ResultsAggregator({
  modelResponses,
  registryData,
  mcpData,
  sessionId,
  onAggregatedResult,
}: ResultsAggregatorProps) {
  const [isAggregating, setIsAggregating] = useState(false)
  const [aggregatedResult, setAggregatedResult] = useState<string>("")

  useEffect(() => {
    async function aggregateResults() {
      if (modelResponses.length === 0) return

      setIsAggregating(true)

      try {
        // Generate an InfoCode for this aggregation operation
        const aggregationInfoCode = generateInfoCode("QAO-UIF-AGGREGATION", sessionId)

        // Log the start of aggregation
        await logSessionEvent({
          sessionId,
          infoCode: aggregationInfoCode,
          eventType: "RESULT_AGGREGATION_STARTED",
          details: {
            modelCount: modelResponses.length,
            hasRegistryData: !!registryData,
            hasMcpData: !!mcpData,
          },
        })

        // Simple aggregation strategy:
        // 1. Use the highest confidence model response as the base
        // 2. Enhance with registry data if available
        // 3. Enhance with MCP data if available

        // Sort responses by confidence
        const sortedResponses = [...modelResponses].sort((a, b) => b.confidence - a.confidence)

        // Use the highest confidence response as the base
        let result = sortedResponses[0].content

        // If we have registry data, enhance the result
        if (registryData) {
          // In a real implementation, this would be more sophisticated
          // For now, we'll just append a note about the registry data
          result += "\n\n**Registry Data:** Additional information was retrieved from the GAIA-QAO Registry."
        }

        // If we have MCP data, enhance the result
        if (mcpData) {
          // In a real implementation, this would be more sophisticated
          // For now, we'll just append a note about the MCP data
          result += "\n\n**MCP Agent Data:** Additional processing was performed by MCP agents."
        }

        // Set the aggregated result
        setAggregatedResult(result)

        // Log the completion of aggregation
        await logSessionEvent({
          sessionId,
          infoCode: aggregationInfoCode,
          eventType: "RESULT_AGGREGATION_COMPLETED",
          details: {
            resultLength: result.length,
            primaryModel: sortedResponses[0].modelId,
            enhancedWithRegistry: !!registryData,
            enhancedWithMcp: !!mcpData,
          },
        })

        // Notify parent component
        onAggregatedResult(result)
      } catch (error) {
        console.error("Error aggregating results:", error)

        // Log the error
        await logSessionEvent({
          sessionId,
          infoCode: generateInfoCode("QAO-UIF-ERROR", sessionId),
          eventType: "RESULT_AGGREGATION_ERROR",
          details: {
            error: error instanceof Error ? error.message : "Unknown error",
          },
        })

        // Use the first response as a fallback
        const fallbackResult = modelResponses[0].content
        setAggregatedResult(fallbackResult)
        onAggregatedResult(fallbackResult)
      } finally {
        setIsAggregating(false)
      }
    }

    aggregateResults()
  }, [modelResponses, registryData, mcpData, sessionId, onAggregatedResult])

  return null // This is a logic component with no UI
}
