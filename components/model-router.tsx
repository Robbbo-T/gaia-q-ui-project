"use client"

import { useState, useEffect } from "react"
import type { ModelRecommendation, InputAnalysisResult, ModelResponse } from "@/lib/types"
import { executeModel } from "@/lib/model-execution"
import { generateInfoCode } from "@/lib/info-code-generator"
import { logSessionEvent } from "@/lib/session-logger"
import { queryRegistry } from "@/lib/registry-client"
import { queryMCPAgents } from "@/lib/mcp-client"

interface ModelRouterProps {
  analysisResult: InputAnalysisResult
  modelRecommendations: ModelRecommendation[]
  sessionId: string
  input: string
  files: File[]
  onModelResponse: (responses: ModelResponse[]) => void
  onRegistryResponse: (data: any) => void
  onMCPResponse: (data: any) => void
  onError: (error: Error) => void
}

export function ModelRouter({
  analysisResult,
  modelRecommendations,
  sessionId,
  input,
  files,
  onModelResponse,
  onRegistryResponse,
  onMCPResponse,
  onError,
}: ModelRouterProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [modelResponses, setModelResponses] = useState<ModelResponse[]>([])

  useEffect(() => {
    async function routeAndExecute() {
      if (!analysisResult || modelRecommendations.length === 0) return

      setIsProcessing(true)

      try {
        // Generate an InfoCode for this routing operation
        const routingInfoCode = generateInfoCode("QAO-UIF-ROUTING", sessionId)

        // Log the start of model routing
        await logSessionEvent({
          sessionId,
          infoCode: routingInfoCode,
          eventType: "MODEL_ROUTING_STARTED",
          details: {
            recommendedModels: modelRecommendations.map((r) => r.modelId),
            confidence: modelRecommendations[0].confidence,
            inputTypes: analysisResult.detectedTypes,
          },
        })

        // Execute models in parallel
        const modelPromises = modelRecommendations.map(async (recommendation) => {
          // Generate an InfoCode for this specific model execution
          const modelInfoCode = generateInfoCode(`QAO-UIF-MODEL-${recommendation.modelId}`, sessionId)

          // Log the start of model execution
          await logSessionEvent({
            sessionId,
            infoCode: modelInfoCode,
            eventType: "MODEL_EXECUTION_STARTED",
            details: {
              modelId: recommendation.modelId,
              modelType: recommendation.modelType,
              provider: recommendation.provider,
              confidence: recommendation.confidence,
            },
          })

          try {
            // Execute the model
            const response = await executeModel({
              modelId: recommendation.modelId,
              input,
              files,
              analysisResult,
              infoCode: modelInfoCode,
            })

            // Log successful model execution
            await logSessionEvent({
              sessionId,
              infoCode: modelInfoCode,
              eventType: "MODEL_EXECUTION_COMPLETED",
              details: {
                modelId: recommendation.modelId,
                executionTimeMs: response.executionTimeMs,
                responseLength: response.content.length,
                confidence: response.confidence,
              },
            })

            return response
          } catch (error) {
            // Log model execution error
            await logSessionEvent({
              sessionId,
              infoCode: modelInfoCode,
              eventType: "MODEL_EXECUTION_ERROR",
              details: {
                modelId: recommendation.modelId,
                error: error instanceof Error ? error.message : "Unknown error",
              },
            })

            throw error
          }
        })

        // Check if we need to query the GAIA-QAO Registry
        if (analysisResult.requiresRegistryQuery) {
          const registryInfoCode = generateInfoCode("QAO-UIF-REGISTRY", sessionId)

          // Log registry query start
          await logSessionEvent({
            sessionId,
            infoCode: registryInfoCode,
            eventType: "REGISTRY_QUERY_STARTED",
            details: {
              queryType: analysisResult.registryQueryType,
              extractedIds: analysisResult.extractedObjectIds,
            },
          })

          try {
            // Query the registry
            const registryData = await queryRegistry({
              queryType: analysisResult.registryQueryType,
              objectIds: analysisResult.extractedObjectIds,
              infoCode: registryInfoCode,
            })

            // Log successful registry query
            await logSessionEvent({
              sessionId,
              infoCode: registryInfoCode,
              eventType: "REGISTRY_QUERY_COMPLETED",
              details: {
                resultCount: Array.isArray(registryData) ? registryData.length : 1,
              },
            })

            // Notify parent component
            onRegistryResponse(registryData)
          } catch (error) {
            // Log registry query error
            await logSessionEvent({
              sessionId,
              infoCode: registryInfoCode,
              eventType: "REGISTRY_QUERY_ERROR",
              details: {
                error: error instanceof Error ? error.message : "Unknown error",
              },
            })
          }
        }

        // Check if we need to query MCP agents
        if (analysisResult.requiresMCPQuery) {
          const mcpInfoCode = generateInfoCode("QAO-UIF-MCP", sessionId)

          // Log MCP query start
          await logSessionEvent({
            sessionId,
            infoCode: mcpInfoCode,
            eventType: "MCP_QUERY_STARTED",
            details: {
              agentTypes: analysisResult.mcpAgentTypes,
              queryPurpose: analysisResult.mcpQueryPurpose,
            },
          })

          try {
            // Query MCP agents
            const mcpData = await queryMCPAgents({
              agentTypes: analysisResult.mcpAgentTypes,
              input,
              analysisResult,
              infoCode: mcpInfoCode,
            })

            // Log successful MCP query
            await logSessionEvent({
              sessionId,
              infoCode: mcpInfoCode,
              eventType: "MCP_QUERY_COMPLETED",
              details: {
                agentsResponded: mcpData.agentsResponded,
                resultCount: mcpData.results.length,
              },
            })

            // Notify parent component
            onMCPResponse(mcpData)
          } catch (error) {
            // Log MCP query error
            await logSessionEvent({
              sessionId,
              infoCode: mcpInfoCode,
              eventType: "MCP_QUERY_ERROR",
              details: {
                error: error instanceof Error ? error.message : "Unknown error",
              },
            })
          }
        }

        // Wait for all model executions to complete
        const responses = await Promise.all(modelPromises)
        setModelResponses(responses)

        // Log completion of all model routing
        await logSessionEvent({
          sessionId,
          infoCode: routingInfoCode,
          eventType: "MODEL_ROUTING_COMPLETED",
          details: {
            modelCount: responses.length,
            successfulModels: responses.map((r) => r.modelId),
          },
        })

        // Notify parent component
        onModelResponse(responses)
      } catch (error) {
        console.error("Error in model routing:", error)

        // Log the error
        await logSessionEvent({
          sessionId,
          infoCode: generateInfoCode("QAO-UIF-ERROR", sessionId),
          eventType: "MODEL_ROUTING_ERROR",
          details: {
            error: error instanceof Error ? error.message : "Unknown error",
          },
        })

        onError(error instanceof Error ? error : new Error("Unknown error in model routing"))
      } finally {
        setIsProcessing(false)
      }
    }

    routeAndExecute()
  }, [
    analysisResult,
    modelRecommendations,
    sessionId,
    input,
    files,
    onModelResponse,
    onRegistryResponse,
    onMCPResponse,
    onError,
  ])

  return null // This is a logic component with no UI
}
