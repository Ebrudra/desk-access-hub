
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { TrendingUp, DollarSign, Building2, Users, Settings, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: adminStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [bookingsRes, membersRes, resourcesRes, eventsRes] = await Promise.all([
        supabase.from("bookings").select("*"),
        supabase.from("profiles").select("*"),
        supabase.from("resources").select("*"),
        supabase.from("events").select("*")
      ]);

      const totalRevenue = bookingsRes.data?.reduce((sum, booking) => {
        return sum + (booking.total_price || 0);
      }, 0) || 0;

      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const monthlyBookings = bookingsRes.data?.filter(b => 
        new Date(b.created_at) >= thisMonth
      ) || [];

      return {
        totalRevenue,
        monthlyRevenue: monthlyBookings.reduce((sum, b) => sum + (b.total_price || 0), 0),
        totalMembers: membersRes.data?.length || 0,
        totalSpaces: resourcesRes.data?.length || 0,
        totalBookings: bookingsRes.data?.length || 0,
        monthlyBookings: monthlyBookings.length,
        totalEvents: eventsRes.data?.length || 0
      };
    }
  });

  const strategicActions = [
    {
      icon: Building2,
      title: "Manage Spaces",
      description: "Add, edit, and configure spaces",
      action: () => setSearchParams({ tab: "crud", subtab: "spaces" }),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      description: "View detailed reports",
      action: () => setSearchParams({ tab: "analytics" }),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: Users,
      title: "User Management",
      description: "Manage roles and permissions",
      action: () => setSearchParams({ tab: "roles" }),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: Settings,
      title: "System Settings",
      description: "Configure platform settings",
      action: () => setSearchParams({ tab: "crud" }),
      color: "bg-gray-500 hover:bg-gray-600"
    }
  ];

  const kpiCards = [
    {
      title: "Total Revenue",
      value: `$${(adminStats?.totalRevenue || 0).toLocaleString()}`,
      subtitle: `$${(adminStats?.monthlyRevenue || 0).toLocaleString()} this month`,
      icon: DollarSign,
      color: "text-green-600",
      trend: "+12%"
    },
    {
      title: "Active Members",
      value: adminStats?.totalMembers || 0,
      subtitle: "Total registered users",
      icon: Users,
      color: "text-blue-600",
      trend: "+8%"
    },
    {
      title: "Total Bookings",
      value: adminStats?.totalBookings || 0,
      subtitle: `${adminStats?.monthlyBookings || 0} this month`,
      icon: BarChart3,
      color: "text-purple-600",
      trend: "+15%"
    },
    {
      title: "Spaces",
      value: adminStats?.totalSpaces || 0,
      subtitle: "Available resources",
      icon: Building2,
      color: "text-orange-600",
      trend: "+2%"
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                <span className="text-xs text-green-600 font-medium">{kpi.trend}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpi.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strategic Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Administration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {strategicActions.map((action, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg cursor-pointer transition-all ${action.color}`}
                onClick={action.action}
              >
                <div className="flex items-center justify-between text-white">
                  <div>
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                    <p className="text-xs opacity-90 mt-1">{action.description}</p>
                  </div>
                  <action.icon className="h-6 w-6" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Monthly Growth</h4>
                  <p className="text-xs text-gray-600">Revenue increased by 12%</p>
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Popular Spaces</h4>
                  <p className="text-xs text-gray-600">Conference rooms leading bookings</p>
                </div>
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setSearchParams({ tab: "analytics" })}>
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Platform Performance</h4>
                  <p className="text-xs text-gray-600">99.9% uptime</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Database Status</h4>
                  <p className="text-xs text-gray-600">Optimal performance</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Storage Usage</h4>
                  <p className="text-xs text-gray-600">78% capacity</p>
                </div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setSearchParams({ tab: "crud" })}>
              System Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
