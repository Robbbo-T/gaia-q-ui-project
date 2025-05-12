"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CheckCircle2, AlertTriangle, HelpCircle, Search } from "lucide-react"
import type { ComplianceMatrix as ComplianceMatrixType, ComplianceLevel } from "@/lib/types"

interface ComplianceMatrixProps {
  matrix: ComplianceMatrixType
  level: ComplianceLevel
}

export function ComplianceMatrix({ matrix, level }: ComplianceMatrixProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Filter requirements based on search term and active category
  const filteredRequirements = matrix.requirements.filter((req) => {
    const matchesSearch =
      searchTerm === "" ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = activeCategory === null || req.category === activeCategory

    return matchesSearch && matchesCategory
  })

  // Get unique categories
  const categories = Array.from(new Set(matrix.requirements.map((req) => req.category)))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Compliance Matrix</h3>
        <Badge variant="outline">Level: {level}</Badge>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search requirements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Badge
          variant={activeCategory === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setActiveCategory(null)}
        >
          All
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3">Requirement ID</th>
                <th className="text-left p-3">Description</th>
                <th className="text-center p-3">Status</th>
                <th className="text-center p-3">Score</th>
                <th className="text-center p-3">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequirements.length > 0 ? (
                filteredRequirements.map((req) => (
                  <tr key={req.id} className="border-b">
                    <td className="p-3 font-mono">{req.id}</td>
                    <td className="p-3">{req.description}</td>
                    <td className="p-3 text-center">
                      {req.status === "COMPLIANT" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                      ) : req.status === "NON_COMPLIANT" ? (
                        <AlertTriangle className="h-5 w-5 text-red-500 mx-auto" />
                      ) : (
                        <HelpCircle className="h-5 w-5 text-yellow-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`${
                          req.score >= 90 ? "text-green-500" : req.score >= 70 ? "text-yellow-500" : "text-red-500"
                        }`}
                      >
                        {req.score}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline">{req.evidenceCount} items</Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No requirements match your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Compliance Summary</h4>
          <div className="flex items-center space-x-2">
            <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
              <div className="flex h-full">
                <div className="bg-green-500 h-full" style={{ width: `${matrix.summary.compliantPercent}%` }} />
                <div
                  className="bg-yellow-500 h-full"
                  style={{ width: `${matrix.summary.partiallyCompliantPercent}%` }}
                />
                <div className="bg-red-500 h-full" style={{ width: `${matrix.summary.nonCompliantPercent}%` }} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
              <span>Compliant ({matrix.summary.compliantPercent}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1" />
              <span>Partial ({matrix.summary.partiallyCompliantPercent}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
              <span>Non-Compliant ({matrix.summary.nonCompliantPercent}%)</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Requirements by Category</h4>
          <div className="space-y-1">
            {Object.entries(matrix.summary.categoryCounts).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between text-xs">
                <span>{category}</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Requirements by Priority</h4>
          <div className="space-y-1">
            {Object.entries(matrix.summary.priorityCounts).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between text-xs">
                <span>{priority}</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
