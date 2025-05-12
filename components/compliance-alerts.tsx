"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle2, Clock, Filter, Trash2 } from "lucide-react"
import type { ComplianceAlert } from "@/lib/types"

interface ComplianceAlertsProps {
  alerts: ComplianceAlert[]
  onClearAlerts: () => void
}

export function ComplianceAlerts({ alerts, onClearAlerts }: ComplianceAlertsProps) {
  const [filter, setFilter] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("ALL")
  const [activeTab, setActiveTab] = useState("all")

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    // Text filter
    const textMatch =
      filter === "" ||
      alert.title.toLowerCase().includes(filter.toLowerCase()) ||
      alert.message.toLowerCase().includes(filter.toLowerCase())

    // Severity filter
    const severityMatch = severityFilter === "ALL" || alert.severity === severityFilter

    // Tab filter
    const tabMatch =
      activeTab === "all" ||
      (activeTab === "critical" && alert.severity === "CRITICAL") ||
      (activeTab === "warning" && alert.severity === "WARNING") ||
      (activeTab === "info" && alert.severity === "INFO")

    return textMatch && severityMatch && tabMatch
  })

  // Count alerts by severity
  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL").length
  const warningCount = alerts.filter((a) => a.severity === "WARNING").length
  const infoCount = alerts.filter((a) => a.severity === "INFO").length

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Compliance Alerts</CardTitle>
            <CardDescription>{alerts.length} alerts detected during compliance monitoring</CardDescription>
          </div>
          <Button variant="destructive" size="sm" onClick={onClearAlerts} disabled={alerts.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </CardHeader>

      <div className="px-6 pb-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {alerts.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="critical">
              Critical
              <Badge variant="destructive" className="ml-2">
                {criticalCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="warning">
              Warning
              <Badge variant="default" className="ml-2">
                {warningCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="info">
              Info
              <Badge variant="outline" className="ml-2">
                {infoCount}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="px-6 pb-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              placeholder="Filter alerts..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Severities</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="WARNING">Warning</SelectItem>
              <SelectItem value="INFO">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <CardContent className="flex-1 p-0 overflow-hidden">
        {filteredAlerts.length > 0 ? (
          <ScrollArea className="h-[calc(100vh-350px)]">
            <div className="px-6 space-y-4 pb-6">
              {filteredAlerts.map((alert, index) => (
                <AlertCard key={index} alert={alert} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-center">
            <Filter className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Alerts Found</h3>
            <p className="text-muted-foreground max-w-md mt-2">
              {alerts.length > 0
                ? "Try adjusting your filters to see more alerts."
                : "No compliance alerts have been detected."}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t px-6 py-4">
        <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
          <div>
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

interface AlertCardProps {
  alert: ComplianceAlert
}

function AlertCard({ alert }: AlertCardProps) {
  return (
    <Card
      className={`
      ${
        alert.severity === "CRITICAL"
          ? "border-red-300"
          : alert.severity === "WARNING"
            ? "border-yellow-300"
            : "border-blue-300"
      }
    `}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
              {alert.severity === "CRITICAL" ? (
                <div className="bg-red-100 p-1 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              ) : alert.severity === "WARNING" ? (
                <div className="bg-yellow-100 p-1 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
              ) : (
                <div className="bg-blue-100 p-1 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-base">{alert.title}</CardTitle>
              <CardDescription className="mt-1">{new Date(alert.timestamp).toLocaleString()}</CardDescription>
            </div>
          </div>
          <Badge
            variant={
              alert.severity === "CRITICAL" ? "destructive" : alert.severity === "WARNING" ? "default" : "outline"
            }
          >
            {alert.severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm">{alert.message}</p>

        {alert.details && (
          <div className="mt-2 text-xs text-muted-foreground">
            <div className="bg-muted p-2 rounded">
              <pre className="whitespace-pre-wrap font-mono text-xs">{JSON.stringify(alert.details, null, 2)}</pre>
            </div>
          </div>
        )}

        {alert.relatedRequirements && alert.relatedRequirements.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {alert.relatedRequirements.map((req, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {req}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
