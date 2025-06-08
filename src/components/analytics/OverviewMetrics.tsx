
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Building } from "lucide-react";

export const OverviewMetrics = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: async () => {
      const [membersRes, bookingsRes, revenueRes, spacesRes] = await Promise.all([
        supabase.from("members").select("*"),
        supabase.from("bookings").select("*"),
        supabase.from("members").select("monthly_rate"),
        supabase.from("spaces").select("*")
      ]);

      const activeMembers = membersRes.data?.filter(m => m.membership_status === 'active').length || 0;
      const totalBookings = bookingsRes.data?.length || 0;
      const monthlyRevenue = membersRes.data?.reduce((sum, m) => sum + (m.monthly_rate || 0), 0) || 0;
      const totalSpaces = spacesRes.data?.length || 0;

      // Calculate some growth metrics (simulated for demo)
      return {
        activeMembers: { value: activeMembers, growth: 12, trend: 'up' },
        totalBookings: { value: totalBookings, growth: 8, trend: 'up' },
        monthlyRevenue: { value: monthlyRevenue, growth: 15, trend: 'up' },
        totalSpaces: { value: totalSpaces, growth: 0, trend: 'stable' }
      };
    }
  });

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </CardContent>
        </Card>
      ))}
    </div>;
  }

  const cards = [
    {
      title: "Active Members",
      value: metrics?.activeMembers.value || 0,
      growth: metrics?.activeMembers.growth || 0,
      trend: metrics?.activeMembers.trend || 'stable',
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Total Bookings",
      value: metrics?.totalBookings.value || 0,
      growth: metrics?.totalBookings.growth || 0,
      trend: metrics?.totalBookings.trend || 'stable',
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Monthly Revenue",
      value: `$${(metrics?.monthlyRevenue.value || 0).toLocaleString()}`,
      growth: metrics?.monthlyRevenue.growth || 0,
      trend: metrics?.monthlyRevenue.trend || 'stable',
      icon: DollarSign,
      color: "text-orange-600"
    },
    {
      title: "Total Spaces",
      value: metrics?.totalSpaces.value || 0,
      growth: metrics?.totalSpaces.growth || 0,
      trend: metrics?.totalSpaces.trend || 'stable',
      icon: Building,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="flex items-center space-x-1 mt-2">
              {card.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : card.trend === 'down' ? (
                <TrendingDown className="h-3 w-3 text-red-500" />
              ) : null}
              <Badge variant={card.trend === 'up' ? 'default' : card.trend === 'down' ? 'destructive' : 'secondary'} className="text-xs">
                {card.growth > 0 ? '+' : ''}{card.growth}% this month
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
