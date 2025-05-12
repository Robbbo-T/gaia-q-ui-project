import { memo } from "react"
import { Handle, Position } from "reactflow"
import { Badge } from "@/components/ui/badge"

export interface TableNodeProps {
  data: {
    name: string
    description: string
    columns: {
      name: string
      type: string
      isPrimaryKey: boolean
      isForeignKey: boolean
      isNullable: boolean
      default?: string
      description?: string
    }[]
    category: string
    isSelected: boolean
    showPrimaryKeys: boolean
    showForeignKeys: boolean
    showIndexes: boolean
  }
  isConnectable: boolean
}

export const TableNode = memo(({ data, isConnectable }: TableNodeProps) => {
  // Get primary key columns
  const primaryKeys = data.columns.filter((col) => col.isPrimaryKey)

  // Get foreign key columns
  const foreignKeys = data.columns.filter((col) => col.isForeignKey)

  // Determine which columns to show
  const columnsToShow = data.columns.filter((col) => {
    if (col.isPrimaryKey && !data.showPrimaryKeys) return false
    if (col.isForeignKey && !data.showForeignKeys) return false
    return true
  })

  return (
    <div
      className={`rounded-md border shadow-sm bg-card text-card-foreground w-64 ${data.isSelected ? "ring-2 ring-primary" : ""}`}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-primary" />

      <div className="p-3 border-b bg-muted/50">
        <div className="font-medium">{data.name}</div>
        <div className="text-xs text-muted-foreground truncate">{data.description}</div>
        <div className="mt-1">
          <Badge variant="outline" className="text-xs">
            {data.category}
          </Badge>
        </div>
      </div>

      <div className="p-2 max-h-60 overflow-y-auto">
        <table className="w-full text-xs">
          <tbody>
            {columnsToShow.map((column) => (
              <tr key={column.name} className="border-b last:border-0">
                <td className="py-1 pr-2">
                  {column.name}
                  {column.isPrimaryKey && <span className="text-primary ml-1">🔑</span>}
                  {column.isForeignKey && <span className="text-muted-foreground ml-1">🔗</span>}
                </td>
                <td className="py-1 text-muted-foreground">{column.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-primary" />
    </div>
  )
})

TableNode.displayName = "TableNode"
