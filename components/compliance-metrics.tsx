"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ComplianceMetrics as ComplianceMetricsType } from "@/lib/types"

interface ComplianceMetricsProps {
  metrics: ComplianceMetricsType
}

export function ComplianceMetrics({ metrics }: ComplianceMetricsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Compliance Metrics</h3>

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="infocode">InfoCode Coverage</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Overall Compliance"
              value={`${metrics.complianceScore}%`}
              description="Overall compliance score based on all requirements"
              color={metrics.complianceScore >= 90 ? "green" : metrics.complianceScore >= 70 ? "yellow" : "red"}
            />

            <MetricCard
              title="Event Coverage"
              value={`${metrics.eventCoveragePercent}%`}
              description={`${metrics.eventsAnalyzed} of ${metrics.totalEvents} events analyzed`}
              color={
                metrics.eventCoveragePercent >= 90 ? "green" : metrics.eventCoveragePercent >= 70 ? "yellow" : "red"
              }
            />

            <MetricCard
              title="InfoCode Compliance"
              value={`${metrics.infoCodeCompliancePercent}%`}
              description={`${metrics.validInfoCodes} of ${metrics.totalInfoCodes} InfoCodes valid`}
              color={
                metrics.infoCodeCompliancePercent >= 90
                  ? "green"
                  : metrics.infoCodeCompliancePercent >= 70
                    ? "yellow"
                    : "red"
              }
            />

            <MetricCard
              title="Violations"
              value={metrics.violationCount.toString()}
              description={`${metrics.criticalViolations} critical, ${metrics.majorViolations} major, ${metrics.minorViolations} minor`}
              color={metrics.violationCount === 0 ? "green" : metrics.criticalViolations === 0 ? "yellow" : "red"}
            />

            <MetricCard
              title="Session Completeness"
              value={`${metrics.sessionCompletenessPercent}%`}
              description="Percentage of sessions with proper start/end events"
              color={
                metrics.sessionCompletenessPercent >= 90
                  ? "green"
                  : metrics.sessionCompletenessPercent >= 70
                    ? "yellow"
                    : "red"
              }
            />

            <MetricCard
              title="Traceability"
              value={`${metrics.traceabilityPercent}%`}
              description="Percentage of events with proper parent-child relationships"
              color={metrics.traceabilityPercent >= 90 ? "green" : metrics.traceabilityPercent >= 70 ? "yellow" : "red"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Event Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(metrics.eventTypeDistribution).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm">{type}</span>
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-muted rounded-full mr-2 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(count / metrics.totalEvents) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Component Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(metrics.componentCoverage).map(([component, percent]) => (
                    <div key={component} className="flex items-center justify-between">
                      <span className="text-sm">{component}</span>
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-muted rounded-full mr-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              percent >= 90 ? "bg-green-500" : percent >= 70 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="infocode" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">InfoCode Prefix Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(metrics.infoCodePrefixDistribution).map(([prefix, count]) => (
                  <div key={prefix} className="flex items-center justify-between">
                    <span className="text-sm font-mono">{prefix}</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-muted rounded-full mr-2 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(count / metrics.totalInfoCodes) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Valid InfoCodes"
              value={`${metrics.validInfoCodes} / ${metrics.totalInfoCodes}`}
              description={`${metrics.infoCodeCompliancePercent}% of InfoCodes are valid`}
              color={
                metrics.infoCodeCompliancePercent >= 90
                  ? "green"
                  : metrics.infoCodeCompliancePercent >= 70
                    ? "yellow"
                    : "red"
              }
            />

            <MetricCard
              title="InfoCode Hierarchy"
              value={`${metrics.infoCodeHierarchyPercent}%`}
              description="Percentage of InfoCodes with proper parent-child relationships"
              color={
                metrics.infoCodeHierarchyPercent >= 90
                  ? "green"
                  : metrics.infoCodeHierarchyPercent >= 70
                    ? "yellow"
                    : "red"
              }
            />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Common InfoCode Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Issue Type</th>
                    <th className="text-right py-2">Count</th>
                    <th className="text-right py-2">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.infoCodeIssues.map((issue, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{issue.type}</td>
                      <td className="text-right py-2">{issue.count}</td>
                      <td className="text-right py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            issue.impact === "HIGH"
                              ? "bg-red-100 text-red-800"
                              : issue.impact === "MEDIUM"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {issue.impact}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Requirement Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Requirement ID</th>
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Status</th>
                    <th className="text-right py-2">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.requirementCompliance.map((req) => (
                    <tr key={req.id} className="border-b">
                      <td className="py-2 font-mono">{req.id}</td>
                      <td className="py-2">{req.description}</td>
                      <td className="text-right py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            req.status === "COMPLIANT"
                              ? "bg-green-100 text-green-800"
                              : req.status === "PARTIAL"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="text-right py-2">{req.score}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  description: string
  color: "red" | "yellow" | "green" | "blue"
}

function MetricCard({ title, value, description, color }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center">
          <span
            className={`text-2xl font-bold ${
              color === "green"
                ? "text-green-500"
                : color === "yellow"
                  ? "text-yellow-500"
                  : color === "red"
                    ? "text-red-500"
                    : "text-blue-500"
            }`}
          >
            {value}
          </span>
          <span className="text-xs text-muted-foreground text-center mt-1">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}
