"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { schemaData } from "@/lib/schema-data"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

export function SchemaOverview() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Group tables by category
  const tablesByCategory = schemaData.tables.reduce(
    (acc, table) => {
      if (!acc[table.category]) {
        acc[table.category] = []
      }
      acc[table.category].push(table)
      return acc
    },
    {} as Record<string, typeof schemaData.tables>,
  )

  // Get category counts
  const categoryCounts = Object.entries(tablesByCategory).map(([category, tables]) => ({
    category,
    count: tables.length,
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Schema Statistics</CardTitle>
            <CardDescription>Overview of the GAIA-QAO database schema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Total Tables</div>
                <div className="text-2xl font-bold">{schemaData.tables.length}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Total Relationships</div>
                <div className="text-2xl font-bold">{schemaData.relationships.length}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Categories</div>
                <div className="text-2xl font-bold">{Object.keys(tablesByCategory).length}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Schema Version</div>
                <div className="text-2xl font-bold">1.2.0</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm font-medium mb-2">Tables by Category</div>
              <div className="space-y-2">
                {categoryCounts.map(({ category, count }) => (
                  <div key={category} className="flex items-center">
                    <div className="w-32 text-sm">{category}</div>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(count / schemaData.tables.length) * 100}%` }}
                      />
                    </div>
                    <div className="w-10 text-right text-sm">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schema Diagrams</CardTitle>
            <CardDescription>Visual representations of the database schema</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="core">
              <TabsList className="mb-4">
                <TabsTrigger value="core">Core Components</TabsTrigger>
                <TabsTrigger value="objects">Object Instances</TabsTrigger>
                <TabsTrigger value="registry">Registry Management</TabsTrigger>
              </TabsList>

              <TabsContent value="core" className="m-0">
                <div className="border rounded-md overflow-hidden">
                  <Image
                    src="/database-core-components.png"
                    alt="Core Components Diagram"
                    width={400}
                    height={200}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Core ID component tables including domains, autonomy levels, functional classes, subtypes, and models.
                </p>
              </TabsContent>

              <TabsContent value="objects" className="m-0">
                <div className="border rounded-md overflow-hidden">
                  <Image
                    src="/database-object-instances.png"
                    alt="Object Instances Diagram"
                    width={400}
                    height={200}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Object instances and configurations tables showing relationships between physical objects and their
                  configurations.
                </p>
              </TabsContent>

              <TabsContent value="registry" className="m-0">
                <div className="border rounded-md overflow-hidden">
                  <Image
                    src="/database-registry-management.png"
                    alt="Registry Management Diagram"
                    width={400}
                    height={200}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Registry management tables including users, audit logs, and allocation requests.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Table Categories</CardTitle>
          <CardDescription>Explore tables by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.keys(tablesByCategory).map((category) => (
              <Badge
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveCategory(activeCategory === category ? null : category)}
              >
                {category} ({tablesByCategory[category].length})
              </Badge>
            ))}
            {activeCategory && (
              <Badge variant="secondary" className="cursor-pointer ml-2" onClick={() => setActiveCategory(null)}>
                Clear Filter
              </Badge>
            )}
          </div>

          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {Object.entries(tablesByCategory)
                .filter(([category]) => activeCategory === null || category === activeCategory)
                .map(([category, tables]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold mb-2">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {tables.map((table) => (
                        <Card key={table.name} className="overflow-hidden">
                          <CardHeader className="p-3 pb-2">
                            <CardTitle className="text-sm">{table.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{table.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {table.columns
                                .filter((col) => col.isPrimaryKey || col.isForeignKey)
                                .slice(0, 3)
                                .map((col) => (
                                  <Badge key={col.name} variant="outline" className="text-xs">
                                    {col.name}
                                    {col.isPrimaryKey && <span className="ml-1">🔑</span>}
                                    {col.isForeignKey && <span className="ml-1">🔗</span>}
                                  </Badge>
                                ))}
                              {table.columns.filter((col) => col.isPrimaryKey || col.isForeignKey).length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{table.columns.filter((col) => col.isPrimaryKey || col.isForeignKey).length - 3} more
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
