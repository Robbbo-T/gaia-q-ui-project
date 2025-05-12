import { ComplianceMonitor } from "@/components/compliance-monitor"
import { SessionProvider } from "@/components/session-manager"

export default function ContinuousMonitoringPage() {
  return (
    <SessionProvider>
      <ComplianceMonitor />
    </SessionProvider>
  )
}
