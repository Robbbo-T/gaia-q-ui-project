import { FileType, IntentType, type InputAnalysisResult } from "@/lib/types"
import { identifyFileType } from "@/lib/file-utils"
import { extractObjectIds } from "@/lib/object-id-utils"
import { logSessionEvent } from "@/lib/session-logger"

export async function analyzeInputType(
  input: string,
  files: File[],
  analysisInfoCode: string,
): Promise<InputAnalysisResult> {
  // Identify file types
  const fileTypes: FileType[] = await Promise.all(files.map(async (file) => await identifyFileType(file)))

  // Add text type if there's input text
  if (input.trim().length > 0) {
    fileTypes.push(FileType.TEXT)
  }

  // Determine primary intent
  const primaryIntent = determineIntent(input, fileTypes)

  // Extract GAIA-QAO object IDs if present
  const extractedObjectIds = extractObjectIds(input)

  // Determine if registry query is needed
  const requiresRegistryQuery = extractedObjectIds.length > 0 || primaryIntent === IntentType.REGISTRY_QUERY

  // Determine registry query type if needed
  let registryQueryType = undefined
  if (requiresRegistryQuery) {
    registryQueryType = determineRegistryQueryType(input, primaryIntent)
  }

  // Determine if MCP query is needed
  const requiresMCPQuery =
    primaryIntent === IntentType.TELEMETRY_ANALYSIS ||
    primaryIntent === IntentType.QUANTUM_SIMULATION ||
    fileTypes.includes(FileType.TELEMETRY) ||
    fileTypes.includes(FileType.QUANTUM_DATA)

  // Determine MCP agent types if needed
  let mcpAgentTypes = undefined
  let mcpQueryPurpose = undefined
  if (requiresMCPQuery) {
    const mcpInfo = determineMCPQueryInfo(input, primaryIntent, fileTypes)
    mcpAgentTypes = mcpInfo.agentTypes
    mcpQueryPurpose = mcpInfo.purpose
  }

  // Calculate confidence based on clarity of intent and input
  const confidence = calculateConfidence(input, fileTypes, primaryIntent)

  // Log the analysis results
  await logSessionEvent({
    sessionId: analysisInfoCode.split("-").pop() || "",
    infoCode: analysisInfoCode,
    eventType: "INPUT_ANALYSIS_COMPLETED",
    details: {
      detectedTypes: fileTypes,
      primaryIntent,
      confidence,
      extractedObjectIds,
      requiresRegistryQuery,
      registryQueryType,
      requiresMCPQuery,
      mcpAgentTypes,
    },
  })

  return {
    detectedTypes: fileTypes,
    primaryIntent,
    confidence,
    extractedObjectIds,
    requiresRegistryQuery,
    registryQueryType,
    requiresMCPQuery,
    mcpAgentTypes,
    mcpQueryPurpose,
    analysisInfoCode,
  }
}

function determineIntent(input: string, fileTypes: FileType[]): IntentType {
  // This is a simplified implementation
  // In a real system, this would use NLP/ML to determine intent

  const inputLower = input.toLowerCase()

  // Check for registry query intent
  if (
    inputLower.includes("what is") &&
    (inputLower.includes("configuration") || inputLower.includes("status")) &&
    /AS-[MU]-[A-Z]{3}-[A-Z]{2}-[A-Z0-9]{3}-\d{5}/.test(input)
  ) {
    return IntentType.REGISTRY_QUERY
  }

  // Check for telemetry analysis intent
  if (
    (inputLower.includes("telemetry") || inputLower.includes("sensor data")) &&
    (inputLower.includes("analyze") || inputLower.includes("anomaly") || inputLower.includes("detect"))
  ) {
    return IntentType.TELEMETRY_ANALYSIS
  }

  // Check for quantum simulation intent
  if (
    (inputLower.includes("quantum") || inputLower.includes("qbit") || inputLower.includes("qubit")) &&
    (inputLower.includes("simulate") || inputLower.includes("simulation") || inputLower.includes("compute"))
  ) {
    return IntentType.QUANTUM_SIMULATION
  }

  // Check for identification intent
  if (
    inputLower.includes("identify") ||
    inputLower.includes("what is this") ||
    inputLower.includes("recognize") ||
    (fileTypes.includes(FileType.IMAGE) && input.trim().length === 0)
  ) {
    return IntentType.IDENTIFICATION
  }

  // Check for comparison intent
  if (
    inputLower.includes("compare") ||
    inputLower.includes("difference between") ||
    inputLower.includes("versus") ||
    inputLower.includes(" vs ")
  ) {
    return IntentType.COMPARISON
  }

  // Check for prediction intent
  if (
    inputLower.includes("predict") ||
    inputLower.includes("forecast") ||
    inputLower.includes("estimate") ||
    inputLower.includes("will it")
  ) {
    return IntentType.PREDICTION
  }

  // Check for anomaly detection intent
  if (
    inputLower.includes("anomaly") ||
    inputLower.includes("unusual") ||
    inputLower.includes("detect") ||
    inputLower.includes("find issues")
  ) {
    return IntentType.ANOMALY_DETECTION
  }

  // Default to knowledge query if no specific intent is detected
  return IntentType.KNOWLEDGE_QUERY
}

function determineRegistryQueryType(input: string, intent: IntentType): string {
  // This is a simplified implementation
  // In a real system, this would use more sophisticated NLP

  const inputLower = input.toLowerCase()

  if (inputLower.includes("configuration") || inputLower.includes("config")) {
    return "CONFIGURATION_QUERY"
  }

  if (inputLower.includes("status") || inputLower.includes("state")) {
    return "STATUS_QUERY"
  }

  if (inputLower.includes("history") || inputLower.includes("log")) {
    return "HISTORY_QUERY"
  }

  if (inputLower.includes("maintenance") || inputLower.includes("service")) {
    return "MAINTENANCE_QUERY"
  }

  // Default query type
  return "GENERAL_QUERY"
}

function determineMCPQueryInfo(
  input: string,
  intent: IntentType,
  fileTypes: FileType[],
): { agentTypes: string[]; purpose: string } {
  // This is a simplified implementation
  // In a real system, this would use more sophisticated NLP

  const agentTypes: string[] = []
  let purpose = ""

  if (intent === IntentType.TELEMETRY_ANALYSIS || fileTypes.includes(FileType.TELEMETRY)) {
    agentTypes.push("TELEMETRY_ANALYZER")
    purpose = "Analyze telemetry data for patterns or anomalies"
  }

  if (intent === IntentType.QUANTUM_SIMULATION || fileTypes.includes(FileType.QUANTUM_DATA)) {
    agentTypes.push("QUANTUM_SIMULATOR")
    purpose = "Perform quantum simulation or computation"
  }

  if (fileTypes.includes(FileType.SCHEMATIC) || fileTypes.includes(FileType.CAD)) {
    agentTypes.push("ENGINEERING_ANALYZER")
    purpose = "Analyze engineering schematics or CAD files"
  }

  // If no specific agent types were determined, use a general agent
  if (agentTypes.length === 0) {
    agentTypes.push("GENERAL_PROCESSOR")
    purpose = "Process general aerospace data"
  }

  return { agentTypes, purpose }
}

function calculateConfidence(input: string, fileTypes: FileType[], intent: IntentType): number {
  // This is a simplified implementation
  // In a real system, this would use more sophisticated confidence scoring

  let confidence = 0.7 // Base confidence

  // Adjust based on input clarity
  if (input.length > 50) {
    confidence += 0.1 // Longer inputs tend to provide more context
  }

  // Adjust based on file types
  if (fileTypes.length > 0 && fileTypes.some((type) => type !== FileType.UNKNOWN)) {
    confidence += 0.05 // Known file types increase confidence
  }

  // Adjust based on intent clarity
  if (intent !== IntentType.UNKNOWN && intent !== IntentType.KNOWLEDGE_QUERY) {
    confidence += 0.1 // Specific intents increase confidence
  }

  // Cap confidence at 0.95
  return Math.min(confidence, 0.95)
}
