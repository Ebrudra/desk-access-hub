
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { DashboardStats } from "@/components/DashboardStats";
import { BookingCalendar } from "@/components/BookingCalendar";
import { QuickActions } from "@/components/QuickActions";
import { SpaceUtilization } from "@/components/SpaceUtilization";
import { MemberList } from "@/components/MemberList";
import { RoleManagement } from "@/components/RoleManagement";
import { CrudManagement } from "@/components/crud/CrudManagement";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { AdvancedAnalytics } from "@/components/analytics/AdvancedAnalytics";
import { CalendarSync } from "@/components/integrations/CalendarSync";
import { PaymentIntegration } from "@/components/payments/PaymentIntegration";
import { SmartBookingSuggestions } from "@/components/booking/SmartBookingSuggestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRole } from "@/hooks/useAuthRole";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GlobalKeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { user, loading } = useAuth();
  const { role, loading: roleLoading } = useAuthRole();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'dashboard';

  const handleTabChange = (newTab: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', newTab);
    setSearchParams(newSearchParams);
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton.Dashboard />
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Navigation />
          <GlobalKeyboardShortcuts />
          
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.email?.split('@')[0]}!
              </h1>
              <p className="text-gray-600">
                Manage your workspace efficiently with our comprehensive platform
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="advanced-analytics">AI Analytics</TabsTrigger>
                <TabsTrigger value="smart-booking">Smart Booking</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="crud">Management</TabsTrigger>
                {role === 'admin' && <TabsTrigger value="roles">Roles</TabsTrigger>}
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                <DashboardStats />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BookingCalendar />
                  <div className="space-y-6">
                    <QuickActions />
                    <SpaceUtilization />
                  </div>
                </div>
                <MemberList />
              </TabsContent>

              <TabsContent value="calendar">
                <div className="max-w-4xl mx-auto">
                  <BookingCalendar />
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <AnalyticsDashboard />
              </TabsContent>

              <TabsContent value="advanced-analytics">
                <AdvancedAnalytics />
              </TabsContent>

              <TabsContent value="smart-booking">
                <div className="max-w-4xl mx-auto space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Smart Booking Assistant</CardTitle>
                      <CardDescription>
                        AI-powered booking suggestions and conflict resolution
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SmartBookingSuggestions
                        date={new Date().toISOString().split('T')[0]}
                        duration={2}
                        capacity={10}
                        amenities={['WiFi', 'Projector']}
                        onSelectSuggestion={(suggestion) => {
                          console.log('Selected suggestion:', suggestion);
                        }}
                      />
                    </CardContent>
                  </Card>
                  
                  <PaymentIntegration
                    amount={150.00}
                    onPaymentSuccess={() => {
                      console.log('Payment successful');
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="integrations">
                <div className="max-w-4xl mx-auto">
                  <CalendarSync />
                </div>
              </TabsContent>

              <TabsContent value="crud">
                <CrudManagement />
              </TabsContent>

              {role === 'admin' && (
                <TabsContent value="roles">
                  <RoleManagement />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  );
};

export default Index;
