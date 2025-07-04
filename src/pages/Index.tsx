
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function Index() {
  const [searchParams] = useSearchParams();
  const { hasRole } = useAuthRole();
  const isMobile = useIsMobile();
  const activeTab = searchParams.get("tab") || "dashboard";

  if (isMobile) {
    return (
      <ProtectedRoute>
        <MobileDashboard />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="smart-booking">Smart Booking</TabsTrigger>
            <TabsTrigger value="crud">Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="access-codes">Access Codes</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <EnhancedDashboard />
          </TabsContent>

          <TabsContent value="calendar">
            <BookingCalendar />
          </TabsContent>

          <TabsContent value="smart-booking">
            <SmartBookingDashboard />
          </TabsContent>

          <TabsContent value="crud">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="access-control">Access Control</TabsTrigger>
                <TabsTrigger value="calendar-sync">Calendar Sync</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                {hasRole('admin') && (
                  <TabsTrigger value="user-roles">User Roles</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview">
                <CrudManagement />
              </TabsContent>

              <TabsContent value="access-control">
                <AccessControl />
              </TabsContent>

              <TabsContent value="calendar-sync">
                <CalendarSync />
              </TabsContent>

              <TabsContent value="notifications">
                <NotificationCenter />
              </TabsContent>

              {hasRole('admin') && (
                <TabsContent value="user-roles">
                  <UserRoleManager />
                </TabsContent>
              )}
            </Tabs>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="access-codes">
            <AccessCodesDisplay />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentIntegration />
          </TabsContent>

          <TabsContent value="billing">
            <BillingDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
