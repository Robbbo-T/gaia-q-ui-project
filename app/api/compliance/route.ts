import { NextResponse } from "next/server"
import { generateComplianceReport } from "@/lib/compliance-utils"
import type { ComplianceLevel } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const { logs, level } = await request.json()

    if (!logs || !Array.isArray(logs) || !level) {
      return NextResponse.json(
        { error: "Invalid request. Logs array and compliance level are required." },
        { status: 400 },
      )
    }

    const report = await generateComplianceReport(logs, level as ComplianceLevel)

    return NextResponse.json({ report })
  } catch (error) {
    console.error("Error generating compliance report:", error)
    return NextResponse.json({ error: "Failed to generate compliance report" }, { status: 500 })
  }
}
