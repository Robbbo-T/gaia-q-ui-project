export interface SessionEvent {
  sessionId: string
  infoCode: string
  eventType: string
  timestamp?: string
  details?: Record<string, any>
}

export interface InputAnalysisResult {
  detectedTypes: FileType[]
  primaryIntent: IntentType
  confidence: number
  extractedObjectIds: string[]
  requiresRegistryQuery: boolean
  registryQueryType?: string
  requiresMCPQuery: boolean
  mcpAgentTypes?: string[]
  mcpQueryPurpose?: string
  analysisInfoCode: string
}

export interface ModelRecommendation {
  modelId: string
  modelName: string
  modelType: ModelType
  provider: string
  confidence: number
  reason: string
}

export interface ModelResponse {
  modelId: string
  modelName: string
  modelType: ModelType
  content: string
  confidence: number
  executionTimeMs?: number
}

export enum FileType {
  UNKNOWN = "unknown",
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  PDF = "pdf",
  CAD = "cad",
  SCHEMATIC = "schematic",
  TELEMETRY = "telemetry",
  QUANTUM_DATA = "quantum_data",
}

export enum IntentType {
  UNKNOWN = "unknown",
  KNOWLEDGE_QUERY = "knowledge_query",
  REGISTRY_QUERY = "registry_query",
  TELEMETRY_ANALYSIS = "telemetry_analysis",
  QUANTUM_SIMULATION = "quantum_simulation",
  IDENTIFICATION = "identification",
  COMPARISON = "comparison",
  PREDICTION = "prediction",
  ANOMALY_DETECTION = "anomaly_detection",
}

export interface MCPQueryOptions {
  agentTypes: string[]
  input: string
  analysisResult: InputAnalysisResult
  infoCode: string
}

export interface MCPQueryResponse {
  agentsResponded: string[]
  results: any[]
}

export enum ModelType {
  TEXT = "text",
  VISION = "vision",
  QUANTUM = "quantum",
  SPECIALIZED = "specialized",
  MULTIMODAL = "multimodal",
  TELEMETRY = "telemetry",
}

export interface RegistryQueryOptions {
  queryType: string
  objectIds: string[]
  infoCode: string
}

// Compliance Types
export type ComplianceLevel = "AGAD-L1" | "AGAD-L2" | "AGAD-L3" | "COAFI-BASIC" | "COAFI-FULL"

export interface ComplianceReport {
  title: string
  executiveSummary: string
  complianceStatus: "COMPLIANT" | "NON_COMPLIANT"
  metrics: ComplianceMetrics
  violations: ComplianceViolation[]
  timelineEvents: TimelineEvent[]
  complianceMatrix: ComplianceMatrix
  keyFindings: Finding[]
  recommendations: string[]
  generatedAt: string
  level: ComplianceLevel
}

export interface ComplianceMetrics {
  complianceScore: number
  totalEvents: number
  eventsAnalyzed: number
  eventCoveragePercent: number
  totalInfoCodes: number
  validInfoCodes: number
  infoCodeCompliancePercent: number
  eventTypeDistribution: Record<string, number>
  infoCodePrefixDistribution: Record<string, number>
  componentCoverage: Record<string, number>
  sessionCompletenessPercent: number
  traceabilityPercent: number
  infoCodeHierarchyPercent: number
  violationCount: number
  criticalViolations: number
  majorViolations: number
  minorViolations: number
  infoCodeIssues: Array<{
    type: string
    count: number
    impact: "HIGH" | "MEDIUM" | "LOW"
  }>
  requirementCompliance: Array<{
    id: string
    description: string
    status: "COMPLIANT" | "PARTIAL" | "NON_COMPLIANT"
    score: number
  }>
}

export interface ComplianceViolation {
  id: string
  requirementId: string
  description: string
  severity: "CRITICAL" | "MAJOR" | "MINOR"
  impact: string
  recommendation: string
  timestamp: string
  infoCode?: string
  details?: Record<string, any>
  relatedEvents?: Array<{
    infoCode: string
    timestamp: string
  }>
}

export interface TimelineEvent {
  id: string
  title: string
  description: string
  timestamp: string
  infoCode?: string
  status: "INFO" | "COMPLIANT" | "VIOLATION"
  details?: Record<string, any>
  relatedRequirements?: string[]
}

export interface ComplianceMatrix {
  requirements: Array<{
    id: string
    category: string
    description: string
    status: "COMPLIANT" | "PARTIAL" | "NON_COMPLIANT"
    score: number
    evidenceCount: number
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  }>
  summary: {
    compliantCount: number
    partiallyCompliantCount: number
    nonCompliantCount: number
    totalCount: number
    compliantPercent: number
    partiallyCompliantPercent: number
    nonCompliantPercent: number
    categoryCounts: Record<string, number>
    priorityCounts: Record<string, number>
  }
}

export interface Finding {
  type: "POSITIVE" | "NEGATIVE" | "NEUTRAL"
  description: string
}

// Continuous Monitoring Types
export interface ComplianceThresholds {
  overallCompliance: number
  criticalViolations: number
  infoCodeCompliance: number
  sessionCompleteness: number
  traceability: number
}

export interface ComplianceAlert {
  id: string
  timestamp: string
  severity: "CRITICAL" | "WARNING" | "INFO"
  title: string
  message: string
  details?: Record<string, any>
  relatedRequirements?: string[]
}

export interface ComplianceHistoryPoint {
  timestamp: string
  complianceScore: number
  violationCount: number
  criticalViolations: number
  infoCodeCompliance: number
  sessionCompleteness: number
  traceability: number
}
