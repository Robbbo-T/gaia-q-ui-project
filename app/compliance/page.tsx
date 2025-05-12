import { ComplianceReportGenerator } from "@/components/compliance-report"
import { SessionProvider } from "@/components/session-manager"

export default function CompliancePage() {
  return (
    <SessionProvider>
      <ComplianceReportGenerator />
    </SessionProvider>
  )
}
