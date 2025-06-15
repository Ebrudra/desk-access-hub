import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { EnhancedDashboard } from "@/components/dashboards/EnhancedDashboard";
import { MobileDashboard } from "@/components/dashboards/MobileDashboard";
import { BookingCalendar } from "@/components/BookingCalendar";
import { SmartBookingDashboard } from "@/components/booking/SmartBookingDashboard";
import { CrudManagement } from "@/components/crud/CrudManagement";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { AccessCodesDisplay } from "@/components/member/AccessCodesDisplay";
import { AccessControl } from "@/components/AccessControl";
import { PaymentIntegration } from "@/components/payments/PaymentIntegration";
import { CalendarSync } from "@/components/integrations/CalendarSync";
import { BillingDashboard } from "@/components/billing/BillingDashboard";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { UserRoleManager } from "@/components/admin/UserRoleManager";
import { useAuthRole } from "@/hooks/useAuthRole";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { useDebounce } from "@/hooks/useDebounce";

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { hasRole } = useAuthRole();
  const isMobile = useIsMobile();
  const activeTab = searchParams.get("tab") || "dashboard";
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Only show GlobalSearch bar for EnhancedDashboard and dashboard tab
  const shouldShowGlobalSearch =
    (activeTab === "dashboard" || activeTab === "enhanced-dashboard") &&
    !isMobile;

  // Determine which dashboard/content to show based on tab param
  const getContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <EnhancedDashboard />;
      case "calendar":
        return <BookingCalendar />;
      case "smart-booking":
        return <SmartBookingDashboard />;
      case "crud":
        return (
          <CrudManagement />
        );
      case "analytics":
        return <AnalyticsDashboard />;
      case "access-codes":
        return <AccessCodesDisplay />;
      case "payments":
        return <PaymentIntegration />;
      case "billing":
        return <BillingDashboard />;
      default:
        return <EnhancedDashboard />;
    }
  };

  if (isMobile) {
    return (
      <ProtectedRoute>
        <MobileDashboard />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 p-6">
              {/* Show Global Search Bar only in dashboard/EnhancedDashboard */}
              {shouldShowGlobalSearch && (
                <div>
                  <GlobalSearch />
                </div>
              )}

              {/* Search Results Block, only appears after searching (debouncedQuery) and only when GlobalSearch is visible */}
              {shouldShowGlobalSearch && debouncedQuery && debouncedQuery.length >= 2 && (
                <div className="bg-background border rounded-lg shadow-sm mt-6 mb-6 p-4">
                  <div className="font-semibold mb-2 text-gray-800">
                    Search Results for &quot;{debouncedQuery}&quot;:
                  </div>
                  <div className="text-gray-500 text-sm">
                    (See detailed results in the block below.)
                  </div>
                </div>
              )}

              {/* Main dynamic page content */}
              {getContent()}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
