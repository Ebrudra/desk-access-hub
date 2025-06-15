
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export function MobileAnalyticsTab() {
  // Could wrap with mobile UI optimizations if needed
  return (
    <div className="p-0 pt-4">
      <AnalyticsDashboard isMobile />
    </div>
  );
}
