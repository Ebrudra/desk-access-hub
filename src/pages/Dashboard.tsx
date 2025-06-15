
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

  console.log("Dashboard - isMobile:", isMobile, "window.innerWidth:", window.innerWidth);

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

  // Force mobile dashboard for mobile screens
  if (isMobile) {
    console.log("Rendering MobileDashboard");
    return (
      <ProtectedRoute>
        <MobileDashboard />
      </ProtectedRoute>
    );
  }

  console.log("Rendering Desktop Dashboard");
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 p-6">
              {getContent()}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
