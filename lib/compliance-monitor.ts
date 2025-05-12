import type { ComplianceReport, ComplianceAlert, ComplianceThresholds, ComplianceHistoryPoint } from "@/lib/types"

// Default thresholds
let complianceThresholds: ComplianceThresholds = {
  overallCompliance: 80,
  criticalViolations: 1,
  infoCodeCompliance: 85,
  sessionCompleteness: 90,
  traceability: 85,
}

// In-memory storage for compliance history (in a real app, this would be in a database)
const complianceHistory: Record<string, ComplianceHistoryPoint[]> = {}

/**
 * Set compliance thresholds for monitoring
 */
export function setComplianceThresholds(thresholds: ComplianceThresholds): void {
  complianceThresholds = {
    ...complianceThresholds,
    ...thresholds,
  }
}

/**
 * Monitor compliance report against thresholds and generate alerts
 */
export async function monitorCompliance(
  report: ComplianceReport,
  thresholds: ComplianceThresholds = complianceThresholds,
): Promise<ComplianceAlert[]> {
  const alerts: ComplianceAlert[] = []
  const timestamp = new Date().toISOString()

  // Check overall compliance
  if (report.metrics.complianceScore < thresholds.overallCompliance) {
    alerts.push({
      id: `ALERT-${Date.now()}-1`,
      timestamp,
      severity: "CRITICAL",
      title: "Overall Compliance Below Threshold",
      message: `Overall compliance score (${report.metrics.complianceScore}%) is below the threshold of ${thresholds.overallCompliance}%.`,
      details: {
        currentScore: report.metrics.complianceScore,
        threshold: thresholds.overallCompliance,
        gap: thresholds.overallCompliance - report.metrics.complianceScore,
      },
      relatedRequirements: ["AGAD-COMP-001"],
    })
  }

  // Check critical violations
  if (report.metrics.criticalViolations > thresholds.criticalViolations) {
    alerts.push({
      id: `ALERT-${Date.now()}-2`,
      timestamp,
      severity: "CRITICAL",
      title: "Critical Violations Exceed Threshold",
      message: `${report.metrics.criticalViolations} critical violations detected, exceeding the threshold of ${thresholds.criticalViolations}.`,
      details: {
        currentViolations: report.metrics.criticalViolations,
        threshold: thresholds.criticalViolations,
        violationIds: report.violations.filter((v) => v.severity === "CRITICAL").map((v) => v.id),
      },
      relatedRequirements: ["AGAD-COMP-002"],
    })
  }

  // Check InfoCode compliance
  if (report.metrics.infoCodeCompliancePercent < thresholds.infoCodeCompliance) {
    alerts.push({
      id: `ALERT-${Date.now()}-3`,
      timestamp,
      severity: "WARNING",
      title: "InfoCode Compliance Below Threshold",
      message: `InfoCode compliance (${report.metrics.infoCodeCompliancePercent}%) is below the threshold of ${thresholds.infoCodeCompliance}%.`,
      details: {
        currentCompliance: report.metrics.infoCodeCompliancePercent,
        threshold: thresholds.infoCodeCompliance,
        validInfoCodes: report.metrics.validInfoCodes,
        totalInfoCodes: report.metrics.totalInfoCodes,
      },
      relatedRequirements: ["AGAD-LOG-002"],
    })
  }

  // Check session completeness
  if (report.metrics.sessionCompletenessPercent < thresholds.sessionCompleteness) {
    alerts.push({
      id: `ALERT-${Date.now()}-4`,
      timestamp,
      severity: "WARNING",
      title: "Session Completeness Below Threshold",
      message: `Session completeness (${report.metrics.sessionCompletenessPercent}%) is below the threshold of ${thresholds.sessionCompleteness}%.`,
      details: {
        currentCompleteness: report.metrics.sessionCompletenessPercent,
        threshold: thresholds.sessionCompleteness,
      },
      relatedRequirements: ["AGAD-LOG-001"],
    })
  }

  // Check traceability
  if (report.metrics.traceabilityPercent < thresholds.traceability) {
    alerts.push({
      id: `ALERT-${Date.now()}-5`,
      timestamp,
      severity: "WARNING",
      title: "Traceability Below Threshold",
      message: `Traceability (${report.metrics.traceabilityPercent}%) is below the threshold of ${thresholds.traceability}%.`,
      details: {
        currentTraceability: report.metrics.traceabilityPercent,
        threshold: thresholds.traceability,
      },
      relatedRequirements: ["AGAD-LOG-003"],
    })
  }

  // Add info alerts for positive metrics
  if (report.metrics.complianceScore >= 95) {
    alerts.push({
      id: `ALERT-${Date.now()}-6`,
      timestamp,
      severity: "INFO",
      title: "Excellent Compliance Score",
      message: `Overall compliance score (${report.metrics.complianceScore}%) exceeds 95%, indicating excellent compliance.`,
      details: {
        currentScore: report.metrics.complianceScore,
      },
    })
  }

  if (report.metrics.criticalViolations === 0 && report.metrics.majorViolations === 0) {
    alerts.push({
      id: `ALERT-${Date.now()}-7`,
      timestamp,
      severity: "INFO",
      title: "No Critical or Major Violations",
      message: "No critical or major violations detected in this compliance check.",
      details: {
        minorViolations: report.metrics.minorViolations,
      },
    })
  }

  return alerts
}

/**
 * Get compliance history for a session
 */
export async function getComplianceHistory(sessionId: string): Promise<ComplianceHistoryPoint[]> {
  return complianceHistory[sessionId] || []
}

/**
 * Add a compliance history point
 */
export async function addComplianceHistoryPoint(sessionId: string, point: ComplianceHistoryPoint): Promise<void> {
  if (!complianceHistory[sessionId]) {
    complianceHistory[sessionId] = []
  }

  complianceHistory[sessionId].unshift(point)

  // Limit history to 100 points to prevent memory issues
  if (complianceHistory[sessionId].length > 100) {
    complianceHistory[sessionId] = complianceHistory[sessionId].slice(0, 100)
  }
}

/**
 * Clear compliance history for a session
 */
export async function clearComplianceHistory(sessionId: string): Promise<void> {
  complianceHistory[sessionId] = []
}
