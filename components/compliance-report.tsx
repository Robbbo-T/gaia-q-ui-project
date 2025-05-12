"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/components/session-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/date-range-picker"
import { ComplianceMetrics } from "@/components/compliance-metrics"
import { ComplianceTimeline } from "@/components/compliance-timeline"
import { ComplianceMatrix } from "@/components/compliance-matrix"
import { ComplianceViolations } from "@/components/compliance-violations"
import { getSessionLogs } from "@/lib/session-logger"
import { generateComplianceReport, exportReportAsPDF, exportReportAsCSV } from "@/lib/compliance-utils"
import { Download, FileText, AlertTriangle, CheckCircle2, Filter, RefreshCw, FileSpreadsheet } from "lucide-react"
import type { SessionEvent, ComplianceReport, ComplianceLevel } from "@/lib/types"

export function ComplianceReportGenerator() {
  const { sessionId, sessionInfoCode } = useSession()
  const [logs, setLogs] = useState<SessionEvent[]>([])
  const [report, setReport] = useState<ComplianceReport | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  })
  const [complianceLevel, setComplianceLevel] = useState<ComplianceLevel>("AGAD-L1")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Load session logs
  useEffect(() => {
    async function loadLogs() {
      setIsLoading(true)
      try {
        const sessionLogs = await getSessionLogs(sessionId)
        setLogs(sessionLogs)
      } catch (error) {
        console.error("Error loading session logs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadLogs()
  }, [sessionId])

  // Generate compliance report
  const handleGenerateReport = async () => {
    setIsLoading(true)
    try {
      // Filter logs by date range
      const filteredLogs = logs.filter((log) => {
        const logDate = new Date(log.timestamp || "")
        return logDate >= dateRange.from && logDate <= dateRange.to
      })

      // Generate the report
      const newReport = await generateComplianceReport(filteredLogs, complianceLevel)
      setReport(newReport)
      setActiveTab("overview")
    } catch (error) {
      console.error("Error generating compliance report:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Export report as PDF
  const handleExportPDF = async () => {
    if (!report) return

    try {
      await exportReportAsPDF(report, sessionInfoCode, complianceLevel)
    } catch (error) {
      console.error("Error exporting report as PDF:", error)
    }
  }

  // Export report as CSV
  const handleExportCSV = async () => {
    if (!report) return

    try {
      await exportReportAsCSV(report, sessionInfoCode)
    } catch (error) {
      console.error("Error exporting report as CSV:", error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container flex h-14 items-center px-4">
          <div className="mr-4 flex">
            <h2 className="text-lg font-semibold">AGAD/COAFI Compliance Report</h2>
          </div>
          <div className="flex flex-1 items-center space-x-2 justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Session: {sessionInfoCode}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              {report && (
                <>
                  <Button variant="outline" size="sm" onClick={handleExportPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportCSV}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 h-full">
          {/* Filters and Controls */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Report Parameters</CardTitle>
                <CardDescription>Configure compliance report settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Compliance Level</label>
                  <Select
                    value={complianceLevel}
                    onValueChange={(value) => setComplianceLevel(value as ComplianceLevel)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select compliance level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AGAD-L1">AGAD Level 1 (Basic)</SelectItem>
                      <SelectItem value="AGAD-L2">AGAD Level 2 (Standard)</SelectItem>
                      <SelectItem value="AGAD-L3">AGAD Level 3 (Advanced)</SelectItem>
                      <SelectItem value="COAFI-BASIC">COAFI Basic</SelectItem>
                      <SelectItem value="COAFI-FULL">COAFI Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-2">
                  <Button className="w-full" onClick={handleGenerateReport} disabled={isLoading || logs.length === 0}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start px-6 pt-0">
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium">Log Statistics:</p>
                  <p>Total Events: {logs.length}</p>
                  <p>
                    Date Range:{" "}
                    {logs.length > 0
                      ? `${new Date(logs[0].timestamp || "").toLocaleDateString()} - 
                     ${new Date(logs[logs.length - 1].timestamp || "").toLocaleDateString()}`
                      : "No data"}
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Report Content */}
          <div className="md:col-span-3 flex flex-col h-full">
            {report ? (
              <Card className="flex flex-col h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{report.title}</CardTitle>
                    <Badge
                      variant={report.complianceStatus === "COMPLIANT" ? "success" : "destructive"}
                      className="ml-2"
                    >
                      {report.complianceStatus === "COMPLIANT" ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {report.complianceStatus}
                    </Badge>
                  </div>
                  <CardDescription>
                    Generated on {new Date().toLocaleString()} • Compliance Level: {complianceLevel}
                  </CardDescription>
                </CardHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                  <div className="border-b px-6">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="metrics">
                        Metrics
                        {report.metrics.violationCount > 0 && (
                          <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                            {report.metrics.violationCount}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                      <TabsTrigger value="matrix">Compliance Matrix</TabsTrigger>
                      <TabsTrigger value="violations">
                        Violations
                        {report.violations.length > 0 && (
                          <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                            {report.violations.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="overview" className="flex-1 p-0 m-0">
                    <ScrollArea className="h-full">
                      <div className="p-6 space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
                          <p className="text-muted-foreground">{report.executiveSummary}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Compliance Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-center">
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
                                        report.metrics.complianceScore >= 90
                                          ? "text-green-500"
                                          : report.metrics.complianceScore >= 70
                                            ? "text-yellow-500"
                                            : "text-red-500"
                                      }`}
                                      strokeWidth="10"
                                      strokeDasharray={`${report.metrics.complianceScore * 2.51} 251`}
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
                                    <span className="text-2xl font-bold">{report.metrics.complianceScore}%</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Event Coverage</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold">{report.metrics.eventCoveragePercent}%</span>
                                <span className="text-sm text-muted-foreground">
                                  {report.metrics.eventsAnalyzed} of {report.metrics.totalEvents} events
                                </span>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Violations</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold">{report.metrics.violationCount}</span>
                                <span className="text-sm text-muted-foreground">
                                  {report.violations.filter((v) => v.severity === "CRITICAL").length} critical
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2">Key Findings</h3>
                          <ul className="space-y-2">
                            {report.keyFindings.map((finding, index) => (
                              <li key={index} className="flex items-start">
                                <span
                                  className={`inline-flex items-center justify-center rounded-full p-1 mr-2 ${
                                    finding.type === "POSITIVE"
                                      ? "bg-green-100 text-green-600"
                                      : finding.type === "NEGATIVE"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-yellow-100 text-yellow-600"
                                  }`}
                                >
                                  {finding.type === "POSITIVE" ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : finding.type === "NEGATIVE" ? (
                                    <AlertTriangle className="h-4 w-4" />
                                  ) : (
                                    <Filter className="h-4 w-4" />
                                  )}
                                </span>
                                <span>{finding.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                          <ul className="space-y-2">
                            {report.recommendations.map((recommendation, index) => (
                              <li key={index} className="flex items-start">
                                <span className="inline-flex items-center justify-center rounded-full p-1 mr-2 bg-blue-100 text-blue-600">
                                  {index + 1}
                                </span>
                                <span>{recommendation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="metrics" className="flex-1 p-0 m-0">
                    <ScrollArea className="h-full">
                      <div className="p-6">
                        <ComplianceMetrics metrics={report.metrics} />
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="timeline" className="flex-1 p-0 m-0">
                    <ScrollArea className="h-full">
                      <div className="p-6">
                        <ComplianceTimeline events={report.timelineEvents} />
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="matrix" className="flex-1 p-0 m-0">
                    <ScrollArea className="h-full">
                      <div className="p-6">
                        <ComplianceMatrix matrix={report.complianceMatrix} level={complianceLevel} />
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="violations" className="flex-1 p-0 m-0">
                    <ScrollArea className="h-full">
                      <div className="p-6">
                        <ComplianceViolations violations={report.violations} />
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </Card>
            ) : (
              <Card className="flex flex-col items-center justify-center h-full p-8 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Compliance Report Generated</h3>
                <p className="text-muted-foreground max-w-md mt-2">
                  Configure the report parameters and click "Generate Report" to create an AGAD/COAFI compliance report
                  from your session logs.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
