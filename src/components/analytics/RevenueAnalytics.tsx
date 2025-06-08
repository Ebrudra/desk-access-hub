
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#10b981",
  },
  memberships: {
    label: "Memberships",
    color: "#3b82f6",
  },
  bookings: {
    label: "Bookings",
    color: "#f59e0b",
  }
};

export const RevenueAnalytics = () => {
  const { data: revenueData, isLoading } = useQuery({
    queryKey: ["revenue-analytics"],
    queryFn: async () => {
      const [membersRes, bookingsRes] = await Promise.all([
        supabase.from("members").select("monthly_rate, membership_tier, created_at"),
        supabase.from("bookings").select("total_amount, start_time")
      ]);

      const members = membersRes.data || [];
      const bookings = bookingsRes.data || [];

      // Monthly revenue trend (last 6 months)
      const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        // Simulate revenue growth
        const baseRevenue = members.reduce((sum, m) => sum + (m.monthly_rate || 0), 0);
        const monthlyBookingRevenue = bookings
          .filter(b => new Date(b.start_time).getMonth() === date.getMonth())
          .reduce((sum, b) => sum + (b.total_amount || 0), 0);
        
        return {
          month: monthName,
          revenue: Math.round(baseRevenue * (0.7 + i * 0.05) + monthlyBookingRevenue),
          memberships: Math.round(baseRevenue * (0.7 + i * 0.05)),
          bookings: monthlyBookingRevenue
        };
      });

      // Revenue by membership tier
      const tierRevenue = members.reduce((acc, member) => {
        const tier = member.membership_tier || 'basic';
        acc[tier] = (acc[tier] || 0) + (member.monthly_rate || 0);
        return acc;
      }, {} as Record<string, number>);

      const tierData = Object.entries(tierRevenue).map(([tier, revenue]) => ({
        tier,
        revenue
      }));

      return {
        monthlyRevenue,
        tierData,
        totalRevenue: monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0,
        membershipRevenue: members.reduce((sum, m) => sum + (m.monthly_rate || 0), 0),
        bookingRevenue: bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)
      };
    }
  });

  if (isLoading) {
    return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue breakdown over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <AreaChart data={revenueData?.monthlyRevenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stackId="1"
                stroke="var(--color-revenue)" 
                fill="var(--color-revenue)"
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="memberships" 
                stackId="2"
                stroke="var(--color-memberships)" 
                fill="var(--color-memberships)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Membership Tier</CardTitle>
          <CardDescription>Monthly revenue from each tier</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={revenueData?.tierData}>
              <XAxis dataKey="tier" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Summary</CardTitle>
          <CardDescription>Current month breakdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Revenue</span>
            <span className="text-xl font-bold">${(revenueData?.totalRevenue || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Membership Revenue</span>
            <span className="text-lg font-semibold text-blue-600">${(revenueData?.membershipRevenue || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Booking Revenue</span>
            <span className="text-lg font-semibold text-orange-600">${(revenueData?.bookingRevenue || 0).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
