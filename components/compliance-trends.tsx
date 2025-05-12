"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart4, TrendingDown, TrendingUp } from "lucide-react"
import type { ComplianceHistoryPoint } from "@/lib/types"

interface ComplianceTrendsProps {
  history: ComplianceHistoryPoint[]
}

export function ComplianceTrends({ history }: ComplianceTrendsProps) {
  const [timeRange, setTimeRange] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overall")

  // Filter history based on time range
  const filteredHistory = filterHistoryByTimeRange(history, timeRange)

  // Reverse for chronological order (oldest to newest)
  const chronologicalHistory = [...filteredHistory].reverse()

  // Calculate trends
  const trends = calculateTrends(filteredHistory)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Compliance Trends</CardTitle>
            <CardDescription>Analyze compliance metrics over time</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Data</SelectItem>
              <SelectItem value="hour">Last Hour</SelectItem>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <div className="px-6 pb-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overall">Overall Compliance</TabsTrigger>
            <TabsTrigger value="violations">Violations</TabsTrigger>
            <TabsTrigger value="infocode">InfoCode Compliance</TabsTrigger>
            <TabsTrigger value="traceability">Traceability</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CardContent className="flex-1 p-0 pt-4 px-6 pb-6">
        {filteredHistory.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TrendCard
                title="Overall Compliance"
                current={filteredHistory[0].complianceScore}
                change={trends.complianceScoreChange}
                unit="%"
                higherIsBetter={true}
              />

              <TrendCard
                title="Critical Violations"
                current={filteredHistory[0].criticalViolations}
                change={trends.criticalViolationsChange}
                unit=""
                higherIsBetter={false}
              />

              <TrendCard
                title="InfoCode Compliance"
                current={filteredHistory[0].infoCodeCompliance}
                change={trends.infoCodeComplianceChange}
                unit="%"
                higherIsBetter={true}
              />

              <TrendCard
                title="Traceability"
                current={filteredHistory[0].traceability}
                change={trends.traceabilityChange}
                unit="%"
                higherIsBetter={true}
              />
            </div>

            <TabsContent value="overall" className="m-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Overall Compliance Score Trend</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px] flex items-end space-x-1">
                    {chronologicalHistory.map((point, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div
                          className={`w-full ${
                            point.complianceScore >= 90
                              ? "bg-green-500"
                              : point.complianceScore >= 80
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ height: `${point.complianceScore * 0.9}%` }}
                        />
                        {index % Math.max(1, Math.floor(chronologicalHistory.length / 10)) === 0 && (
                          <div className="text-xs text-muted-foreground mt-1 rotate-45 origin-left">
                            {new Date(point.timestamp).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="violations" className="m-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Violations Trend</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px] flex items-end space-x-1">
                    {chronologicalHistory.map((point, index) => {
                      const maxHeight = Math.max(...chronologicalHistory.map((p) => p.violationCount))
                      const heightPercent = maxHeight > 0 ? (point.violationCount / maxHeight) * 100 : 0

                      return (
                        <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                          <div className="w-full flex flex-col">
                            {point.criticalViolations > 0 && (
                              <div
                                className="w-full bg-red-500"
                                style={{
                                  height: `${(point.criticalViolations / point.violationCount) * heightPercent}%`,
                                }}
                              />
                            )}
                            {point.violationCount - point.criticalViolations > 0 && (
                              <div
                                className="w-full bg-yellow-500"
                                style={{
                                  height: `${((point.violationCount - point.criticalViolations) / point.violationCount) * heightPercent}%`,
                                }}
                              />
                            )}
                          </div>
                          {index % Math.max(1, Math.floor(chronologicalHistory.length / 10)) === 0 && (
                            <div className="text-xs text-muted-foreground mt-1 rotate-45 origin-left">
                              {new Date(point.timestamp).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="infocode" className="m-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">InfoCode Compliance Trend</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px] flex items-end space-x-1">
                    {chronologicalHistory.map((point, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div
                          className={`w-full ${
                            point.infoCodeCompliance >= 90
                              ? "bg-green-500"
                              : point.infoCodeCompliance >= 80
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ height: `${point.infoCodeCompliance * 0.9}%` }}
                        />
                        {index % Math.max(1, Math.floor(chronologicalHistory.length / 10)) === 0 && (
                          <div className="text-xs text-muted-foreground mt-1 rotate-45 origin-left">
                            {new Date(point.timestamp).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="traceability" className="m-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Traceability Trend</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px] flex items-end space-x-1">
                    {chronologicalHistory.map((point, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div
                          className={`w-full ${
                            point.traceability >= 90
                              ? "bg-green-500"
                              : point.traceability >= 80
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ height: `${point.traceability * 0.9}%` }}
                        />
                        {index % Math.max(1, Math.floor(chronologicalHistory.length / 10)) === 0 && (
                          <div className="text-xs text-muted-foreground mt-1 rotate-45 origin-left">
                            {new Date(point.timestamp).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-center">
            <BarChart4 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Trend Data Available</h3>
            <p className="text-muted-foreground max-w-md mt-2">Start monitoring to collect compliance trend data.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface TrendCardProps {
  title: string
  current: number
  change: number
  unit: string
  higherIsBetter: boolean
}

function TrendCard({ title, current, change, unit, higherIsBetter }: TrendCardProps) {
  const isPositive = higherIsBetter ? change > 0 : change < 0
  const isNeutral = change === 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">
            {current}
            {unit}
          </span>

          <div className="flex items-center mt-2">
            {isNeutral ? (
              <Badge variant="outline">No Change</Badge>
            ) : (
              <Badge variant={isPositive ? "success" : "destructive"} className="flex items-center">
                {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(change).toFixed(1)}
                {unit}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to filter history by time range
function filterHistoryByTimeRange(history: ComplianceHistoryPoint[], timeRange: string): ComplianceHistoryPoint[] {
  if (history.length === 0) return []
  if (timeRange === "all") return history

  const now = new Date()
  let cutoff: Date

  switch (timeRange) {
    case "hour":
      cutoff = new Date(now.getTime() - 60 * 60 * 1000) // 1 hour ago
      break
    case "day":
      cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000) // 24 hours ago
      break
    case "week":
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      break
    default:
      cutoff = new Date(0) // Beginning of time
  }

  return history.filter((point) => new Date(point.timestamp) >= cutoff)
}

// Helper function to calculate trends
function calculateTrends(history: ComplianceHistoryPoint[]) {
  if (history.length < 2) {
    return {
      complianceScoreChange: 0,
      violationCountChange: 0,
      criticalViolationsChange: 0,
      infoCodeComplianceChange: 0,
      sessionCompletenessChange: 0,
      traceabilityChange: 0,
    }
  }

  // Get first (newest) and last (oldest) points in the filtered history
  const newest = history[0]
  const oldest = history[history.length - 1]

  return {
    complianceScoreChange: newest.complianceScore - oldest.complianceScore,
    violationCountChange: newest.violationCount - oldest.violationCount,
    criticalViolationsChange: newest.criticalViolations - oldest.criticalViolations,
    infoCodeComplianceChange: newest.infoCodeCompliance - oldest.infoCodeCompliance,
    sessionCompletenessChange: newest.sessionCompleteness - oldest.sessionCompleteness,
    traceabilityChange: newest.traceability - oldest.traceability,
  }
}
