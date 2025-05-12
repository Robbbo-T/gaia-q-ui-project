"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, Clock } from "lucide-react"
import type { ComplianceReport, ComplianceThresholds } from "@/lib/types"

interface LiveMetricsProps {
  report: ComplianceReport
  isLive: boolean
  lastUpdated: string
  thresholds: ComplianceThresholds
}

export function LiveMetrics({ report, isLive, lastUpdated, thresholds }: LiveMetricsProps) {
  const { metrics } = report

  // Check if metrics are below thresholds
  const isOverallBelowThreshold = metrics.complianceScore < thresholds.overallCompliance
  const isCriticalAboveThreshold = metrics.criticalViolations > thresholds.criticalViolations
  const isInfoCodeBelowThreshold = metrics.infoCodeCompliancePercent < thresholds.infoCodeCompliance
  const isSessionBelowThreshold = metrics.sessionCompletenessPercent < thresholds.sessionCompleteness
  const isTraceabilityBelowThreshold = metrics.traceabilityPercent < thresholds.traceability

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          {isLive && (
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          )}
          Live Compliance Metrics
        </h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={isOverallBelowThreshold ? "border-red-300" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overall Compliance</CardTitle>
            <CardDescription>Threshold: {thresholds.overallCompliance}%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted-foreground/20"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className={`${
                      isOverallBelowThreshold
                        ? "text-red-500"
                        : metrics.complianceScore >= 90
                          ? "text-green-500"
                          : "text-yellow-500"
                    }`}
                    strokeWidth="10"
                    strokeDasharray={`${metrics.complianceScore * 2.51} 251`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${isOverallBelowThreshold ? "text-red-500" : ""}`}>
                    {metrics.complianceScore}%
                  </span>
                </div>
              </div>
              {isOverallBelowThreshold && (
                <Badge variant="destructive" className="mt-2">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Below Threshold
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={isCriticalAboveThreshold ? "border-red-300" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Violations</CardTitle>
            <CardDescription>Critical Threshold: {thresholds.criticalViolations}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="grid grid-cols-3 gap-2 w-full">
                <div className="flex flex-col items-center p-2 bg-red-50 rounded-md">
                  <span className={`text-xl font-bold ${isCriticalAboveThreshold ? "text-red-500" : "text-red-400"}`}>
                    {metrics.criticalViolations}
                  </span>
                  <span className="text-xs text-muted-foreground">Critical</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-yellow-50 rounded-md">
                  <span className="text-xl font-bold text-yellow-500">{metrics.majorViolations}</span>
                  <span className="text-xs text-muted-foreground">Major</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-blue-50 rounded-md">
                  <span className="text-xl font-bold text-blue-500">{metrics.minorViolations}</span>
                  <span className="text-xs text-muted-foreground">Minor</span>
                </div>
              </div>

              <div className="mt-2 text-center">
                <span className="text-sm font-medium">Total: {metrics.violationCount} violations</span>

                {isCriticalAboveThreshold && (
                  <Badge variant="destructive" className="mt-2 block">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Critical Violations Exceed Threshold
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isInfoCodeBelowThreshold ? "border-red-300" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">InfoCode Compliance</CardTitle>
            <CardDescription>Threshold: {thresholds.infoCodeCompliance}%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isInfoCodeBelowThreshold
                      ? "bg-red-500"
                      : metrics.infoCodeCompliancePercent >= 90
                        ? "bg-green-500"
                        : "bg-yellow-500"
                  }`}
                  style={{ width: `${metrics.infoCodeCompliancePercent}%` }}
                />
              </div>
              <div className="mt-2 text-center">
                <span className={`text-xl font-bold ${isInfoCodeBelowThreshold ? "text-red-500" : ""}`}>
                  {metrics.infoCodeCompliancePercent}%
                </span>
                <span className="text-sm text-muted-foreground block">
                  {metrics.validInfoCodes} of {metrics.totalInfoCodes} valid
                </span>

                {isInfoCodeBelowThreshold && (
                  <Badge variant="destructive" className="mt-2">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Below Threshold
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={isSessionBelowThreshold ? "border-red-300" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Session Completeness</CardTitle>
            <CardDescription>Threshold: {thresholds.sessionCompleteness}%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-muted">
                <span className={`text-xl font-bold ${isSessionBelowThreshold ? "text-red-500" : ""}`}>
                  {metrics.sessionCompletenessPercent}%
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Percentage of sessions with proper start/end events</p>
                {isSessionBelowThreshold ? (
                  <Badge variant="destructive" className="mt-1">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Below Threshold
                  </Badge>
                ) : (
                  <Badge variant="success" className="mt-1">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Compliant
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isTraceabilityBelowThreshold ? "border-red-300" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Traceability</CardTitle>
            <CardDescription>Threshold: {thresholds.traceability}%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-muted">
                <span className={`text-xl font-bold ${isTraceabilityBelowThreshold ? "text-red-500" : ""}`}>
                  {metrics.traceabilityPercent}%
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Percentage of events with proper parent-child relationships
                </p>
                {isTraceabilityBelowThreshold ? (
                  <Badge variant="destructive" className="mt-1">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Below Threshold
                  </Badge>
                ) : (
                  <Badge variant="success" className="mt-1">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Compliant
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Component Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(metrics.componentCoverage).map(([component, percent]) => (
              <div key={component} className="flex flex-col items-center">
                <div className="w-16 h-16 relative">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-muted-foreground/20"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className={`${
                        percent < thresholds.overallCompliance
                          ? "text-red-500"
                          : percent >= 90
                            ? "text-green-500"
                            : "text-yellow-500"
                      }`}
                      strokeWidth="8"
                      strokeDasharray={`${percent * 2.51} 251`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">{percent}%</span>
                  </div>
                </div>
                <span className="text-xs text-center mt-1">{component}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
