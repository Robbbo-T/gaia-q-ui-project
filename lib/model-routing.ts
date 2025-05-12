import { type InputAnalysisResult, type ModelRecommendation, ModelType, FileType, IntentType } from "@/lib/types"

// Define available models
const availableModels = [
  {
    id: "visiongpt",
    name: "VisionGPT",
    type: ModelType.VISION,
    provider: "openai",
    capabilities: ["image_analysis", "object_recognition", "text_in_image", "schematic_analysis"],
    inputTypes: [FileType.IMAGE, FileType.SCHEMATIC],
    intents: [IntentType.IDENTIFICATION, IntentType.DESCRIPTION],
  },
  {
    id: "qwen-vl",
    name: "Qwen-VL",
    type: ModelType.VISION,
    provider: "alibaba",
    capabilities: ["image_analysis", "object_recognition", "text_in_image"],
    inputTypes: [FileType.IMAGE],
    intents: [IntentType.IDENTIFICATION, IntentType.DESCRIPTION],
  },
  {
    id: "llava-next",
    name: "LLaVA-NeXT",
    type: ModelType.VISION,
    provider: "replicate",
    capabilities: ["image_analysis", "object_recognition", "detailed_description"],
    inputTypes: [FileType.IMAGE],
    intents: [IntentType.IDENTIFICATION, IntentType.DESCRIPTION, IntentType.COMPARISON],
  },
  {
    id: "cogvlm",
    name: "CogVLM",
    type: ModelType.VISION,
    provider: "replicate",
    capabilities: ["image_analysis", "object_recognition", "reasoning"],
    inputTypes: [FileType.IMAGE],
    intents: [IntentType.IDENTIFICATION, IntentType.DESCRIPTION, IntentType.REASONING],
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    type: ModelType.MULTIMODAL,
    provider: "openai",
    capabilities: ["text_generation", "reasoning", "knowledge_query", "code_generation", "image_understanding"],
    inputTypes: [FileType.TEXT, FileType.IMAGE],
    intents: [IntentType.KNOWLEDGE_QUERY, IntentType.DESCRIPTION, IntentType.COMPARISON],
  },
  {
    id: "telemetry-analyzer",
    name: "Telemetry Analyzer",
    type: ModelType.TELEMETRY,
    provider: "gaia-q",
    capabilities: ["telemetry_analysis", "anomaly_detection", "pattern_recognition"],
    inputTypes: [FileType.TELEMETRY, FileType.TEXT],
    intents: [IntentType.TELEMETRY_ANALYSIS, IntentType.ANOMALY_DETECTION],
  },
  {
    id: "quantum-simulator",
    name: "Quantum Simulator",
    type: ModelType.QUANTUM,
    provider: "gaia-q",
    capabilities: ["quantum_simulation", "quantum_algorithm_execution"],
    inputTypes: [FileType.QUANTUM_DATA, FileType.TEXT],
    intents: [IntentType.QUANTUM_SIMULATION],
  },
  {
    id: "aerospace-llm",
    name: "Aerospace LLM",
    type: ModelType.SPECIALIZED,
    provider: "gaia-q",
    capabilities: ["aerospace_knowledge", "registry_query_parsing", "technical_documentation"],
    inputTypes: [FileType.TEXT],
    intents: [IntentType.KNOWLEDGE_QUERY, IntentType.REGISTRY_QUERY],
  },
  {
    id: "schematic-analyzer",
    name: "Schematic Analyzer",
    type: ModelType.SPECIALIZED,
    provider: "gaia-q",
    capabilities: ["schematic_analysis", "cad_interpretation", "engineering_drawing_analysis"],
    inputTypes: [FileType.SCHEMATIC, FileType.CAD],
    intents: [IntentType.IDENTIFICATION, IntentType.DESCRIPTION],
  },
]

export async function getModelRecommendations(analysisResult: InputAnalysisResult): Promise<ModelRecommendation[]> {
  // This is a simplified implementation
  // In a real system, this would use more sophisticated matching algorithms

  const recommendations: ModelRecommendation[] = []

  // Step 1: Pre-filter models based on input types
  const eligibleModels = availableModels.filter((model) => {
    // Check if the model supports at least one of the detected input types
    return model.inputTypes.some((type) => analysisResult.detectedTypes.includes(type))
  })

  // Step 2: Score models based on intent match and capabilities
  const scoredModels = eligibleModels.map((model) => {
    let score = 0

    // Score based on intent match
    if (model.intents.includes(analysisResult.primaryIntent)) {
      score += 0.5
    }

    // Score based on input type match
    const inputTypeMatchCount = analysisResult.detectedTypes.filter((type) => model.inputTypes.includes(type)).length
    score += (inputTypeMatchCount / analysisResult.detectedTypes.length) * 0.3

    // Additional scoring based on specific conditions
    if (analysisResult.requiresRegistryQuery && model.capabilities.includes("registry_query_parsing")) {
      score += 0.2
    }

    if (
      analysisResult.detectedTypes.includes(FileType.TELEMETRY) &&
      model.capabilities.includes("telemetry_analysis")
    ) {
      score += 0.2
    }

    if (
      analysisResult.detectedTypes.includes(FileType.QUANTUM_DATA) &&
      model.capabilities.includes("quantum_simulation")
    ) {
      score += 0.2
    }

    return {
      model,
      score,
    }
  })

  // Step 3: Sort models by score
  scoredModels.sort((a, b) => b.score - a.score)

  // Step 4: Select top models (primary and fallbacks)
  const topModels = scoredModels.slice(0, 3)

  // Step 5: Convert to ModelRecommendation format
  topModels.forEach((scoredModel, index) => {
    const model = scoredModel.model
    const confidence = index === 0 ? scoredModel.score : scoredModel.score * 0.8 // Reduce confidence for fallbacks

    recommendations.push({
      modelId: model.id,
      modelName: model.name,
      modelType: model.type,
      provider: model.provider,
      confidence,
      reason: generateReasonText(model, analysisResult, scoredModel.score),
    })
  })

  return recommendations
}

function generateReasonText(model: any, analysisResult: InputAnalysisResult, score: number): string {
  // Generate a human-readable reason for the recommendation

  const reasons: string[] = []

  // Check intent match
  if (model.intents.includes(analysisResult.primaryIntent)) {
    reasons.push(`Supports ${analysisResult.primaryIntent} intent`)
  }

  // Check input type match
  const matchedInputTypes = analysisResult.detectedTypes.filter((type) => model.inputTypes.includes(type))
  if (matchedInputTypes.length > 0) {
    reasons.push(`Handles ${matchedInputTypes.join(", ")} input types`)
  }

  // Check specific capabilities
  if (analysisResult.requiresRegistryQuery && model.capabilities.includes("registry_query_parsing")) {
    reasons.push("Can parse registry queries")
  }

  if (analysisResult.detectedTypes.includes(FileType.TELEMETRY) && model.capabilities.includes("telemetry_analysis")) {
    reasons.push("Specialized in telemetry analysis")
  }

  if (
    analysisResult.detectedTypes.includes(FileType.QUANTUM_DATA) &&
    model.capabilities.includes("quantum_simulation")
  ) {
    reasons.push("Capable of quantum data processing")
  }

  // Format the reason text
  return reasons.join(". ") + `. Overall match score: ${(score * 100).toFixed(0)}%`
}
