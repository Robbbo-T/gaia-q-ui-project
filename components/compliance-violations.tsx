"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Search, ChevronDown, ChevronUp } from "lucide-react"
import type { ComplianceViolation } from "@/lib/types"

interface ComplianceViolationsProps {
  violations: ComplianceViolation[]
}

export function ComplianceViolations({ violations }: ComplianceViolationsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("ALL")
  const [expandedViolations, setExpandedViolations] = useState<Record<string, boolean>>({})

  // Toggle violation expansion
  const toggleViolation = (id: string) => {
    setExpandedViolations((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Filter violations based on search term and severity filter
  const filteredViolations = violations.filter((violation) => {
    const matchesSearch =
      searchTerm === "" ||
      violation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.requirementId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = severityFilter === "ALL" || violation.severity === severityFilter

    return matchesSearch && matchesSeverity
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Compliance Violations</h3>
        <Badge variant="destructive">{violations.length} Total</Badge>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search violations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Severities</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="MAJOR">Major</SelectItem>
              <SelectItem value="MINOR">Minor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredViolations.length > 0 ? (
        <div className="space-y-4">
          {filteredViolations.map((violation) => (
            <Card
              key={violation.id}
              className={`border-l-4 ${
                violation.severity === "CRITICAL"
                  ? "border-l-red-500"
                  : violation.severity === "MAJOR"
                    ? "border-l-orange-500"
                    : "border-l-yellow-500"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      <AlertTriangle
                        className={`h-5 w-5 mr-2 ${
                          violation.severity === "CRITICAL"
                            ? "text-red-500"
                            : violation.severity === "MAJOR"
                              ? "text-orange-500"
                              : "text-yellow-500"
                        }`}
                      />
                      <h4 className="font-medium">{violation.description}</h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {violation.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Req: {violation.requirementId}
                      </Badge>
                      {violation.infoCode && (
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">{violation.infoCode}</code>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(violation.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleViolation(violation.id)}
                    className="h-8 w-8 p-0"
                  >
                    {expandedViolations[violation.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {expandedViolations[violation.id] && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <h5 className="text-sm font-medium mb-1">Impact</h5>
                      <p className="text-sm">{violation.impact}</p>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-1">Recommendation</h5>
                      <p className="text-sm">{violation.recommendation}</p>
                    </div>

                    {violation.details && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Details</h5>
                        <div className="bg-muted/50 p-2 rounded text-xs font-mono overflow-x-auto">
                          <pre>{JSON.stringify(violation.details, null, 2)}</pre>
                        </div>
                      </div>
                    )}

                    {violation.relatedEvents && violation.relatedEvents.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Related Events</h5>
                        <div className="space-y-1">
                          {violation.relatedEvents.map((event, index) => (
                            <div key={index} className="text-xs flex items-center">
                              <code className="bg-muted px-1 py-0.5 rounded mr-2">{event.infoCode}</code>
                              <span className="text-muted-foreground">
                                {new Date(event.timestamp).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium">No Violations Found</h4>
            <p className="text-sm text-muted-foreground mt-1">
              No violations match your current search and filter criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
