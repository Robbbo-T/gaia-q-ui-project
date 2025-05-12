"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "@/components/session-manager"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ComplianceTrends } from "@/components/compliance-trends"
import { ComplianceAlerts } from "@/components/compliance-alerts"
import { LiveMetrics } from "@/components/live-metrics"
import { getSessionLogs } from "@/lib/session-logger"
import { generateComplianceReport } from "@/lib/compliance-utils"
import { monitorCompliance, setComplianceThresholds, getComplianceHistory } from "@/lib/compliance-monitor"
import { useToast } from "@/components/ui/use-toast"
import {
  Activity,
  AlertTriangle,
  Bell,
  BellOff,
  CheckCircle2,
  Clock,
  RefreshCw,
  Settings,
  Zap,
  BarChart4,
  History,
} from "lucide-react"
import type {
  ComplianceReport,
  ComplianceLevel,
  ComplianceAlert,
  ComplianceThresholds,
  ComplianceHistoryPoint,
} from "@/lib/types"

export function ComplianceMonitor() {
  const { sessionId, sessionInfoCode } = useSession()
  const { toast } = useToast()
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [monitoringInterval, setMonitoringInterval] = useState(60) // seconds
  const [complianceLevel, setComplianceLevel] = useState<ComplianceLevel>("AGAD-L2")
  const [report, setReport] = useState<ComplianceReport | null>(null)
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([])
  const [history, setHistory] = useState<ComplianceHistoryPoint[]>([])
  const [thresholds, setThresholds] = useState<ComplianceThresholds>({
    overallCompliance: 80,
    criticalViolations: 1,
    infoCodeCompliance: 85,
    sessionCompleteness: 90,
    traceability: 85,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showSettings, setShowSettings] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize monitoring
  useEffect(() => {
    // Load initial compliance data
    fetchComplianceData()

    // Load compliance history
    fetchComplianceHistory()

    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [sessionId])

  // Toggle monitoring
  useEffect(() => {
    if (isMonitoring) {
      startMonitoring()
    } else {
      stopMonitoring()
    }

    return () => stopMonitoring()
  }, [isMonitoring, monitoringInterval, complianceLevel])

  // Start continuous monitoring
  const startMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set monitoring thresholds
    setComplianceThresholds(thresholds)

    // Start interval
    intervalRef.current = setInterval(() => {
      fetchComplianceData()
    }, monitoringInterval * 1000)

    toast({
      title: "Compliance Monitoring Started",
      description: `Monitoring every ${monitoringInterval} seconds at ${complianceLevel} level`,
    })
  }

  // Stop continuous monitoring
  const stopMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Fetch compliance data
  const fetchComplianceData = async () => {
    setIsLoading(true)
    try {
      // Get session logs
      const logs = await getSessionLogs(sessionId)

      // Generate compliance report
      const newReport = await generateComplianceReport(logs, complianceLevel)
      setReport(newReport)

      // Check for compliance alerts
      const newAlerts = await monitorCompliance(newReport, thresholds)

      // Add new alerts
      if (newAlerts.length > 0) {
        setAlerts((prev) => [...newAlerts, ...prev])

        // Show toast notification for critical alerts
        const criticalAlerts = newAlerts.filter((alert) => alert.severity === "CRITICAL")
        if (criticalAlerts.length > 0) {
          toast({
            variant: "destructive",
            title: "Critical Compliance Alert",
            description: criticalAlerts[0].message,
          })
        }
      }

      // Add to history
      addHistoryPoint(newReport)
    } catch (error) {
      console.error("Error fetching compliance data:", error)
      toast({
        variant: "destructive",
        title: "Monitoring Error",
        description: "Failed to fetch compliance data",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch compliance history
  const fetchComplianceHistory = async () => {
    try {
      const historyData = await getComplianceHistory(sessionId)
      setHistory(historyData)
    } catch (error) {
      console.error("Error fetching compliance history:", error)
    }
  }

  // Add history point
  const addHistoryPoint = (report: ComplianceReport) => {
    const newPoint: ComplianceHistoryPoint = {
      timestamp: new Date().toISOString(),
      complianceScore: report.metrics.complianceScore,
      violationCount: report.metrics.violationCount,
      criticalViolations: report.metrics.criticalViolations,
      infoCodeCompliance: report.metrics.infoCodeCompliancePercent,
      sessionCompleteness: report.metrics.sessionCompletenessPercent,
      traceability: report.metrics.traceabilityPercent,
    }

    setHistory((prev) => {
      // Keep only the last 100 points to avoid performance issues
      const newHistory = [newPoint, ...prev]
      if (newHistory.length > 100) {
        return newHistory.slice(0, 100)
      }
      return newHistory
    })
  }

  // Clear alerts
  const clearAlerts = () => {
    setAlerts([])
  }

  // Update threshold
  const updateThreshold = (key: keyof ComplianceThresholds, value: number) => {
    setThresholds((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container flex h-14 items-center px-4">
          <div className="mr-4 flex">
            <Activity className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">Continuous Compliance Monitoring</h2>
          </div>
          <div className="flex flex-1 items-center space-x-2 justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Session: {sessionInfoCode}
              </Badge>
              <Badge variant={isMonitoring ? "default" : "secondary"} className="text-xs">
                {isMonitoring ? (
                  <>
                    <Zap className="h-3 w-3 mr-1" /> Live
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 mr-1" /> Paused
                  </>
                )}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant={isMonitoring ? "destructive" : "default"}
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? (
                  <>
                    <BellOff className="h-4 w-4 mr-2" /> Stop Monitoring
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" /> Start Monitoring
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="border-b">
          <div className="container py-4 px-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Monitoring Settings</CardTitle>
                <CardDescription>Configure continuous monitoring parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="interval">Monitoring Interval (seconds)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="interval"
                          type="number"
                          min="10"
                          max="3600"
                          value={monitoringInterval}
                          onChange={(e) => setMonitoringInterval(Number.parseInt(e.target.value))}
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">
                          {monitoringInterval < 60
                            ? `${monitoringInterval} seconds`
                            : `${Math.floor(monitoringInterval / 60)} minute${monitoringInterval >= 120 ? "s" : ""}`}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="level">Compliance Level</Label>
                      <Select
                        value={complianceLevel}
                        onValueChange={(value) => setComplianceLevel(value as ComplianceLevel)}
                      >
                        <SelectTrigger id="level">
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
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Alert Thresholds</h4>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="overall">Overall Compliance</Label>
                        <span className="text-sm font-medium">{thresholds.overallCompliance}%</span>
                      </div>
                      <Slider
                        id="overall"
                        min={50}
                        max={100}
                        step={1}
                        value={[thresholds.overallCompliance]}
                        onValueChange={(value) => updateThreshold("overallCompliance", value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="critical">Critical Violations</Label>
                        <span className="text-sm font-medium">≤ {thresholds.criticalViolations}</span>
                      </div>
                      <Slider
                        id="critical"
                        min={0}
                        max={10}
                        step={1}
                        value={[thresholds.criticalViolations]}
                        onValueChange={(value) => updateThreshold("criticalViolations", value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="infocode">InfoCode Compliance</Label>
                        <span className="text-sm font-medium">{thresholds.infoCodeCompliance}%</span>
                      </div>
                      <Slider
                        id="infocode"
                        min={50}
                        max={100}
                        step={1}
                        value={[thresholds.infoCodeCompliance]}
                        onValueChange={(value) => updateThreshold("infoCodeCompliance", value[0])}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setComplianceThresholds(thresholds)
                    toast({
                      title: "Settings Updated",
                      description: "Monitoring settings have been updated",
                    })
                  }}
                >
                  Apply Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b px-4">
            <TabsList>
              <TabsTrigger value="dashboard">
                <Activity className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="alerts">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Alerts
                {alerts.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {alerts.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="trends">
                <BarChart4 className="h-4 w-4 mr-2" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="flex-1 p-0 m-0">
            <div className="p-4 h-full">
              {report ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                  <div className="md:col-span-2">
                    <LiveMetrics
                      report={report}
                      isLive={isMonitoring}
                      lastUpdated={new Date().toISOString()}
                      thresholds={thresholds}
                    />
                  </div>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Monitoring Status</CardTitle>
                          {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Status:</span>
                            <Badge variant={isMonitoring ? "default" : "secondary"}>
                              {isMonitoring ? "Active" : "Paused"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Interval:</span>
                            <span className="text-sm font-medium">{monitoringInterval} seconds</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Level:</span>
                            <span className="text-sm font-medium">{complianceLevel}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Last Check:</span>
                            <span className="text-sm font-medium">{new Date().toLocaleTimeString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Next Check:</span>
                            <span className="text-sm font-medium">
                              {isMonitoring
                                ? new Date(Date.now() + monitoringInterval * 1000).toLocaleTimeString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline" onClick={fetchComplianceData} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Checking...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2" /> Check Now
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Recent Alerts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {alerts.length > 0 ? (
                          <ScrollArea className="h-[200px]">
                            <div className="space-y-2">
                              {alerts.slice(0, 5).map((alert, index) => (
                                <Alert
                                  key={index}
                                  variant={alert.severity === "CRITICAL" ? "destructive" : "default"}
                                  className="py-2"
                                >
                                  <AlertTitle className="text-xs font-medium flex items-center">
                                    {alert.severity === "CRITICAL" ? (
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                    ) : (
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                    )}
                                    {alert.title}
                                  </AlertTitle>
                                  <AlertDescription className="text-xs mt-1">{alert.message}</AlertDescription>
                                </Alert>
                              ))}
                            </div>
                          </ScrollArea>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[200px] text-center">
                            <CheckCircle2 className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">No alerts detected</p>
                          </div>
                        )}
                      </CardContent>
                      {alerts.length > 0 && (
                        <CardFooter>
                          <Button variant="link" className="w-full" onClick={() => setActiveTab("alerts")}>
                            View All Alerts
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Activity className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">No Compliance Data</h3>
                  <p className="text-muted-foreground max-w-md mt-2 text-center">
                    Start monitoring to collect compliance data or click "Check Now" to perform a manual check.
                  </p>
                  <Button className="mt-4" onClick={fetchComplianceData} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Checking...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" /> Check Now
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="flex-1 p-0 m-0">
            <div className="p-4 h-full">
              <ComplianceAlerts alerts={alerts} onClearAlerts={clearAlerts} />
            </div>
          </TabsContent>

          <TabsContent value="trends" className="flex-1 p-0 m-0">
            <div className="p-4 h-full">
              <ComplianceTrends history={history} />
            </div>
          </TabsContent>

          <TabsContent value="history" className="flex-1 p-0 m-0">
            <div className="p-4 h-full">
              {/* History component would go here */}
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Compliance History</CardTitle>
                  <CardDescription>Historical compliance data for this session</CardDescription>
                </CardHeader>
                <CardContent>
                  {history.length > 0 ? (
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-2">Timestamp</th>
                            <th className="text-right py-2 px-2">Score</th>
                            <th className="text-right py-2 px-2">Violations</th>
                            <th className="text-right py-2 px-2">InfoCode</th>
                            <th className="text-right py-2 px-2">Traceability</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.map((point, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2 px-2 text-sm">{new Date(point.timestamp).toLocaleString()}</td>
                              <td className="py-2 px-2 text-right">
                                <Badge
                                  variant={
                                    point.complianceScore >= thresholds.overallCompliance ? "success" : "destructive"
                                  }
                                >
                                  {point.complianceScore}%
                                </Badge>
                              </td>
                              <td className="py-2 px-2 text-right">
                                <span
                                  className={
                                    point.criticalViolations > thresholds.criticalViolations
                                      ? "text-red-500"
                                      : "text-muted-foreground"
                                  }
                                >
                                  {point.violationCount} ({point.criticalViolations} critical)
                                </span>
                              </td>
                              <td className="py-2 px-2 text-right">{point.infoCodeCompliance}%</td>
                              <td className="py-2 px-2 text-right">{point.traceability}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[400px]">
                      <History className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold">No History Data</h3>
                      <p className="text-muted-foreground max-w-md mt-2 text-center">
                        Start monitoring to collect historical compliance data.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
