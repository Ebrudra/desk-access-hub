
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewMetrics } from "./OverviewMetrics";
import { BookingAnalytics } from "./BookingAnalytics";
import { RevenueAnalytics } from "./RevenueAnalytics";
import { MembershipAnalytics } from "./MembershipAnalytics";
import { SpaceUtilizationChart } from "./SpaceUtilizationChart";

export const AnalyticsDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Analytics & Reports
        </h1>
        <p className="text-gray-600">
          Comprehensive insights into your coworking space performance
        </p>
      </div>

      <div className="space-y-6">
        <OverviewMetrics />
        
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
            <TabsTrigger value="utilization">Space Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <BookingAnalytics />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueAnalytics />
          </TabsContent>

          <TabsContent value="membership">
            <MembershipAnalytics />
          </TabsContent>

          <TabsContent value="utilization">
            <SpaceUtilizationChart />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
