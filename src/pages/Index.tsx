
import { useAuth } from "@/hooks/useAuth";
import LandingPage from "@/components/landing/LandingPage";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/components/DashboardStats";
import { BookingCalendar } from "@/components/BookingCalendar";
import { MemberList } from "@/components/MemberList";
import { AccessControl } from "@/components/AccessControl";
import { SpaceUtilization } from "@/components/SpaceUtilization";
import { QuickActions } from "@/components/QuickActions";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!user) {
    return <LandingPage />;
  }

  // Show dashboard for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Workspace Hub
          </h1>
          <p className="text-xl text-gray-600">
            Streamline your coworking space operations
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit">
            <TabsTrigger value="dashboard" className="text-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="bookings" className="text-sm">Bookings</TabsTrigger>
            <TabsTrigger value="members" className="text-sm">Members</TabsTrigger>
            <TabsTrigger value="access" className="text-sm">Access</TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 animate-slide-up">
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BookingCalendar />
              </div>
              <div className="space-y-6">
                <QuickActions />
                <SpaceUtilization />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="animate-slide-up">
            <BookingCalendar expanded />
          </TabsContent>

          <TabsContent value="members" className="animate-slide-up">
            <MemberList />
          </TabsContent>

          <TabsContent value="access" className="animate-slide-up">
            <AccessControl />
          </TabsContent>

          <TabsContent value="analytics" className="animate-slide-up">
            <SpaceUtilization expanded />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
