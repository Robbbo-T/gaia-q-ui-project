"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Panel,
  MiniMap,
  type NodeTypes,
} from "reactflow"
import "reactflow/dist/style.css"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TableNode } from "@/components/table-node"
import { schemaData } from "@/lib/schema-data"
import { Search, Maximize2, RefreshCw } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define node types
const nodeTypes: NodeTypes = {
  tableNode: TableNode,
}

export function SchemaExplorer() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showPrimaryKeys, setShowPrimaryKeys] = useState(true)
  const [showForeignKeys, setShowForeignKeys] = useState(true)
  const [showIndexes, setShowIndexes] = useState(true)

  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  // Initialize nodes and edges from schema data
  useEffect(() => {
    const initialNodes = schemaData.tables.map((table, index) => ({
      id: table.name,
      type: "tableNode",
      position: {
        x: (index % 4) * 300,
        y: Math.floor(index / 4) * 400,
      },
      data: {
        ...table,
        isSelected: table.name === selectedTable,
        showPrimaryKeys,
        showForeignKeys,
        showIndexes,
      },
    }))

    const initialEdges = schemaData.relationships.map((rel, index) => ({
      id: `e${index}`,
      source: rel.source,
      target: rel.target,
      animated: false,
      style: { stroke: "#888", strokeWidth: 1.5 },
      markerEnd: {
        type: "arrowclosed",
        width: 20,
        height: 20,
        color: "#888",
      },
      label: rel.type,
    }))

    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [selectedTable, showPrimaryKeys, showForeignKeys, showIndexes, setNodes, setEdges])

  // Filter nodes based on search term and category
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        const table = schemaData.tables.find((t) => t.name === node.id)
        if (!table) return node

        // Check if node matches search term
        const matchesSearch =
          searchTerm === "" ||
          node.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          table.columns.some((col) => col.name.toLowerCase().includes(searchTerm.toLowerCase()))

        // Check if node matches selected category
        const matchesCategory = selectedCategory === "all" || table.category === selectedCategory

        // Update node visibility
        return {
          ...node,
          hidden: !(matchesSearch && matchesCategory),
        }
      }),
    )
  }, [searchTerm, selectedCategory, setNodes])

  // Handle table selection
  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName === selectedTable ? null : tableName)
  }

  // Fit view to visible nodes
  const fitView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 })
    }
  }, [reactFlowInstance])

  // Reset view
  const resetView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 })
    }
  }, [reactFlowInstance])

  // Get table details for the selected table
  const selectedTableDetails = selectedTable ? schemaData.tables.find((table) => table.name === selectedTable) : null

  // Get relationships for the selected table
  const selectedTableRelationships = selectedTable
    ? schemaData.relationships.filter((rel) => rel.source === selectedTable || rel.target === selectedTable)
    : []

  return (
    <div className="flex h-[calc(100vh-220px)] border rounded-lg overflow-hidden">
      <div className="w-64 border-r flex flex-col">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tables or columns..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-3 border-b">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="core">Core ID Components</SelectItem>
              <SelectItem value="instance">Object Instances</SelectItem>
              <SelectItem value="config">Configurations</SelectItem>
              <SelectItem value="registry">Registry Management</SelectItem>
              <SelectItem value="reference">Reference Tables</SelectItem>
              <SelectItem value="integration">Integration</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            {schemaData.tables
              .filter(
                (table) =>
                  (selectedCategory === "all" || table.category === selectedCategory) &&
                  (searchTerm === "" ||
                    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    table.columns.some((col) => col.name.toLowerCase().includes(searchTerm.toLowerCase()))),
              )
              .map((table) => (
                <Button
                  key={table.name}
                  variant={selectedTable === table.name ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm h-auto py-2"
                  onClick={() => handleTableSelect(table.name)}
                >
                  <div className="flex flex-col items-start">
                    <span>{table.name}</span>
                    <span className="text-xs text-muted-foreground">{table.description.substring(0, 30)}...</span>
                  </div>
                </Button>
              ))}
          </div>
        </ScrollArea>

        <div className="p-3 border-t space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showPrimaryKeys"
              checked={showPrimaryKeys}
              onCheckedChange={(checked) => setShowPrimaryKeys(!!checked)}
            />
            <Label htmlFor="showPrimaryKeys">Show Primary Keys</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showForeignKeys"
              checked={showForeignKeys}
              onCheckedChange={(checked) => setShowForeignKeys(!!checked)}
            />
            <Label htmlFor="showForeignKeys">Show Foreign Keys</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="showIndexes" checked={showIndexes} onCheckedChange={(checked) => setShowIndexes(!!checked)} />
            <Label htmlFor="showIndexes">Show Indexes</Label>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              onInit={setReactFlowInstance}
              fitView
              minZoom={0.1}
              maxZoom={2}
              onNodeClick={(_, node) => handleTableSelect(node.id)}
            >
              <Controls />
              <MiniMap />
              <Background />
              <Panel position="top-right" className="space-x-2">
                <Button size="sm" variant="outline" onClick={fitView}>
                  <Maximize2 className="h-4 w-4 mr-1" />
                  Fit View
                </Button>
                <Button size="sm" variant="outline" onClick={resetView}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </Panel>
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {selectedTableDetails && (
          <div className="h-80 border-t overflow-hidden">
            <Tabs defaultValue="details">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <TabsList>
                  <TabsTrigger value="details">Table Details</TabsTrigger>
                  <TabsTrigger value="columns">Columns</TabsTrigger>
                  <TabsTrigger value="relationships">Relationships</TabsTrigger>
                  <TabsTrigger value="sql">SQL Definition</TabsTrigger>
                </TabsList>
                <Badge variant="outline">{selectedTableDetails.category}</Badge>
              </div>

              <ScrollArea className="h-[calc(80px*4-48px)]">
                <TabsContent value="details" className="p-4 m-0">
                  <h3 className="text-lg font-semibold">{selectedTableDetails.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{selectedTableDetails.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm">Primary Key</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedTableDetails.columns
                          .filter((col) => col.isPrimaryKey)
                          .map((col) => (
                            <Badge key={col.name} variant="outline" className="mr-1">
                              {col.name}
                            </Badge>
                          ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm">Indexes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedTableDetails.indexes?.map((index, i) => (
                          <Badge key={i} variant="outline" className="mr-1">
                            {index.name}
                          </Badge>
                        )) || "No indexes defined"}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="columns" className="p-0 m-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Nullable</th>
                        <th className="text-left p-2">Default</th>
                        <th className="text-left p-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTableDetails.columns.map((column) => (
                        <tr key={column.name} className="border-b hover:bg-muted/50">
                          <td className="p-2">
                            {column.name}
                            {column.isPrimaryKey && (
                              <Badge className="ml-2" variant="secondary">
                                PK
                              </Badge>
                            )}
                            {column.isForeignKey && (
                              <Badge className="ml-2" variant="outline">
                                FK
                              </Badge>
                            )}
                          </td>
                          <td className="p-2">{column.type}</td>
                          <td className="p-2">{column.isNullable ? "Yes" : "No"}</td>
                          <td className="p-2">{column.default || "-"}</td>
                          <td className="p-2 text-sm">{column.description || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TabsContent>

                <TabsContent value="relationships" className="p-4 m-0">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Incoming Relationships</h4>
                      {selectedTableRelationships
                        .filter((rel) => rel.target === selectedTable)
                        .map((rel, i) => (
                          <Card key={i} className="mb-2">
                            <CardContent className="p-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <Badge variant="outline" className="mr-2">
                                    {rel.source}
                                  </Badge>
                                  <span className="text-sm">{rel.type}</span>
                                  <Badge variant="secondary" className="ml-2">
                                    {rel.target}
                                  </Badge>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleTableSelect(rel.source)}>
                                  View
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      {selectedTableRelationships.filter((rel) => rel.target === selectedTable).length === 0 && (
                        <p className="text-sm text-muted-foreground">No incoming relationships</p>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Outgoing Relationships</h4>
                      {selectedTableRelationships
                        .filter((rel) => rel.source === selectedTable)
                        .map((rel, i) => (
                          <Card key={i} className="mb-2">
                            <CardContent className="p-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <Badge variant="secondary" className="mr-2">
                                    {rel.source}
                                  </Badge>
                                  <span className="text-sm">{rel.type}</span>
                                  <Badge variant="outline" className="ml-2">
                                    {rel.target}
                                  </Badge>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleTableSelect(rel.target)}>
                                  View
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      {selectedTableRelationships.filter((rel) => rel.source === selectedTable).length === 0 && (
                        <p className="text-sm text-muted-foreground">No outgoing relationships</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sql" className="p-4 m-0">
                  <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                    {selectedTableDetails.sqlDefinition}
                  </pre>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
