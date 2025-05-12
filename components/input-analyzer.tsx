"use client"

import { useState, useEffect } from "react"
import type { InputAnalysisResult, ModelRecommendation } from "@/lib/types"
import { analyzeInputType } from "@/lib/input-analysis"
import { getModelRecommendations } from "@/lib/model-routing"
import { generateInfoCode } from "@/lib/info-code-generator"
import { logSessionEvent } from "@/lib/session-logger"

interface InputAnalyzerProps {
  input: string
  files: File[]
  sessionId: string
  onAnalysisComplete: (result: InputAnalysisResult, recommendations: ModelRecommendation[]) => void
}

export function InputAnalyzer({ input, files, sessionId, onAnalysisComplete }: InputAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<InputAnalysisResult | null>(null)
  const [modelRecommendations, setModelRecommendations] = useState<ModelRecommendation[]>([])

  useEffect(() => {
    async function performAnalysis() {
      if (!input && files.length === 0) return

      setIsAnalyzing(true)

      try {
        // Generate an InfoCode for this analysis operation
        const analysisInfoCode = generateInfoCode("QAO-UIF-ANALYSIS", sessionId)

        // Log the start of analysis
        await logSessionEvent({
          sessionId,
          infoCode: analysisInfoCode,
          eventType: "ANALYSIS_STARTED",
          details: {
            inputLength: input.length,
            fileCount: files.length,
            fileTypes: files.map((f) => f.type),
          },
        })

        // Analyze the input to determine type, intent, and context
        const result = await analyzeInputType(input, files, analysisInfoCode)
        setAnalysisResult(result)

        // Get model recommendations based on the analysis
        const recommendations = await getModelRecommendations(result)
        setModelRecommendations(recommendations)

        // Log the completion of analysis
        await logSessionEvent({
          sessionId,
          infoCode: analysisInfoCode,
          eventType: "ANALYSIS_COMPLETED",
          details: {
            inputTypes: result.detectedTypes,
            primaryIntent: result.primaryIntent,
            confidence: result.confidence,
            recommendedModels: recommendations.map((r) => r.modelId),
          },
        })

        // Notify parent component
        onAnalysisComplete(result, recommendations)
      } catch (error) {
        console.error("Error analyzing input:", error)

        // Log the error
        await logSessionEvent({
          sessionId,
          infoCode: generateInfoCode("QAO-UIF-ERROR", sessionId),
          eventType: "ANALYSIS_ERROR",
          details: {
            error: error instanceof Error ? error.message : "Unknown error",
          },
        })
      } finally {
        setIsAnalyzing(false)
      }
    }

    performAnalysis()
  }, [input, files, sessionId, onAnalysisComplete])

  return null // This is a logic component with no UI
}
