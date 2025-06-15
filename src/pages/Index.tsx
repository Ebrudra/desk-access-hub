
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/components/DashboardStats";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { Navigation } from "@/components/Navigation";
import { QuickActions } from "@/components/QuickActions";
import { SpaceUtilization } from "@/components/SpaceUtilization";
import { BookingCalendar } from "@/components/BookingCalendar";
import { MemberList } from "@/components/MemberList";
import { SmartBookingDashboard } from "@/components/booking/SmartBookingDashboard";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            WorkSpace Hub
          </h1>
          <p className="text-gray-600">
            Comprehensive coworking space management platform
          </p>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="smart-booking">Smart Booking</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="spaces">Spaces</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SpaceUtilization />
              </div>
              <div>
                <QuickActions />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="smart-booking">
            <SmartBookingDashboard />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="bookings">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Management</h2>
              <p className="text-gray-600 mb-6">Comprehensive booking management coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <MemberList />
          </TabsContent>

          <TabsContent value="spaces">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Space Management</h2>
              <p className="text-gray-600 mb-6">Manage your coworking spaces and resources</p>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <BookingCalendar />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
