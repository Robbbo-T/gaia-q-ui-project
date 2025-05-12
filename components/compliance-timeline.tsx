"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, AlertTriangle, Clock, ChevronDown, ChevronUp, Filter } from "lucide-react"
import type { TimelineEvent } from "@/lib/types"

interface ComplianceTimelineProps {
  events: TimelineEvent[]
}

export function ComplianceTimeline({ events }: ComplianceTimelineProps) {
  const [filters, setFilters] = useState({
    showCompliant: true,
    showViolations: true,
    showInfo: true,
  })
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({})

  // Toggle event expansion
  const toggleEvent = (id: string) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Filter events based on current filters
  const filteredEvents = events.filter((event) => {
    if (event.status === "COMPLIANT" && !filters.showCompliant) return false
    if (event.status === "VIOLATION" && !filters.showViolations) return false
    if (event.status === "INFO" && !filters.showInfo) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Compliance Timeline</h3>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-compliant"
              checked={filters.showCompliant}
              onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, showCompliant: checked === true }))}
            />
            <label htmlFor="show-compliant" className="text-sm cursor-pointer flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
              Compliant
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-violations"
              checked={filters.showViolations}
              onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, showViolations: checked === true }))}
            />
            <label htmlFor="show-violations" className="text-sm cursor-pointer flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
              Violations
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-info"
              checked={filters.showInfo}
              onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, showInfo: checked === true }))}
            />
            <label htmlFor="show-info" className="text-sm cursor-pointer flex items-center">
              <Filter className="h-4 w-4 text-blue-500 mr-1" />
              Info
            </label>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-muted" />

            {filteredEvents.length > 0 ? (
              <div className="space-y-0">
                {filteredEvents.map((event, index) => (
                  <div key={event.id} className="relative">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-6 top-6 w-3 h-3 rounded-full transform -translate-x-1.5 ${
                        event.status === "COMPLIANT"
                          ? "bg-green-500"
                          : event.status === "VIOLATION"
                            ? "bg-red-500"
                            : "bg-blue-500"
                      }`}
                    />

                    <div className={`pl-12 pr-4 py-4 ${index !== filteredEvents.length - 1 ? "border-b" : ""}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{event.title}</h4>
                            <Badge
                              variant={
                                event.status === "COMPLIANT"
                                  ? "success"
                                  : event.status === "VIOLATION"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className="ml-2"
                            >
                              {event.status}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{new Date(event.timestamp).toLocaleString()}</span>
                            {event.infoCode && (
                              <code className="ml-2 text-xs bg-muted px-1 py-0.5 rounded">{event.infoCode}</code>
                            )}
                          </div>
                        </div>

                        <Button variant="ghost" size="sm" onClick={() => toggleEvent(event.id)} className="h-8 w-8 p-0">
                          {expandedEvents[event.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {expandedEvents[event.id] && (
                        <div className="mt-2 space-y-2">
                          <p className="text-sm">{event.description}</p>

                          {event.details && (
                            <div className="bg-muted/50 p-2 rounded text-xs font-mono overflow-x-auto">
                              <pre>{JSON.stringify(event.details, null, 2)}</pre>
                            </div>
                          )}

                          {event.relatedRequirements && event.relatedRequirements.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium">Related Requirements:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {event.relatedRequirements.map((req) => (
                                  <Badge key={req} variant="outline" className="text-xs">
                                    {req}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">No events match the current filters</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
