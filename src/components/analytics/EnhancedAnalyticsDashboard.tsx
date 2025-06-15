
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OverviewMetrics } from "./OverviewMetrics";
import { BookingAnalytics } from "./BookingAnalytics";
import { RevenueAnalytics } from "./RevenueAnalytics";
import { MembershipAnalytics } from "./MembershipAnalytics";
import { SpaceUtilizationChart } from "./SpaceUtilizationChart";
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Building, Clock, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const EnhancedAnalyticsDashboard = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Real-time summary metrics
  const { data: realtimeMetrics, refetch } = useQuery({
    queryKey: ["realtime-metrics"],
    queryFn: async () => {
      const now = new Date();
      const today = now.toDateString();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      const [bookingsRes, membersRes, revenueRes] = await Promise.all([
        supabase.from("bookings").select("*"),
        supabase.from("members").select("*"),
        supabase.from("bookings").select("total_amount, start_time")
      ]);

      const bookings = bookingsRes.data || [];
      const members = membersRes.data || [];

      // Today's metrics
      const todayBookings = bookings.filter(b => 
        new Date(b.start_time).toDateString() === today
      );

      // This month's metrics
      const thisMonthBookings = bookings.filter(b => {
        const bookingDate = new Date(b.start_time);
        return bookingDate.getMonth() === thisMonth && bookingDate.getFullYear() === thisYear;
      });

      const monthlyRevenue = thisMonthBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
      const activeMembers = members.filter(m => m.membership_status === 'active').length;

      // Status distribution
      const bookingStatuses = bookings.reduce((acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        todayBookings: todayBookings.length,
        totalBookings: bookings.length,
        monthlyRevenue,
        activeMembers,
        totalMembers: members.length,
        bookingStatuses,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        upcomingBookings: bookings.filter(b => 
          new Date(b.start_time) > now && b.status === 'confirmed'
        ).length
      };
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Set up real-time subscription for bookings
  useEffect(() => {
    const channel = supabase
      .channel('booking-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          refetch();
          setLastUpdated(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const alertCards = [
    {
      title: "Pending Bookings",
      value: realtimeMetrics?.pendingBookings || 0,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Require approval"
    },
    {
      title: "Today's Bookings",
      value: realtimeMetrics?.todayBookings || 0,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Scheduled for today"
    },
    {
      title: "Upcoming Bookings",
      value: realtimeMetrics?.upcomingBookings || 0,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Confirmed future bookings"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Enhanced Analytics & Reports
            </h1>
            <p className="text-gray-600">
              Real-time insights into your coworking space performance
            </p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="mb-2">
              Live Data
            </Badge>
            <p className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {alertCards.map((card, index) => (
          <Card key={index} className={`${card.bgColor} border-l-4 border-l-current`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-gray-500">{card.description}</p>
                </div>
                <card.icon className={`h-8 w-8 ${card.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <OverviewMetrics />
        
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
            <TabsTrigger value="utilization">Space Usage</TabsTrigger>
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
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

          <TabsContent value="realtime">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Booking Status</CardTitle>
                  <CardDescription>Current booking status distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(realtimeMetrics?.bookingStatuses || {}).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            status === 'confirmed' ? 'bg-green-500' :
                            status === 'pending' ? 'bg-yellow-500' :
                            status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                          }`} />
                          <span className="capitalize font-medium">{status}</span>
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Bookings</span>
                    <span className="text-xl font-bold">{realtimeMetrics?.totalBookings || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Members</span>
                    <span className="text-xl font-bold text-green-600">{realtimeMetrics?.activeMembers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Revenue</span>
                    <span className="text-xl font-bold text-orange-600">
                      ${(realtimeMetrics?.monthlyRevenue || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Member Utilization</span>
                    <span className="text-xl font-bold text-blue-600">
                      {realtimeMetrics?.totalMembers > 0 
                        ? Math.round((realtimeMetrics.activeMembers / realtimeMetrics.totalMembers) * 100)
                        : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
