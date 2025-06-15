
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts";

const chartConfig = {
  utilization: {
    label: "Utilization %",
    color: "#3b82f6",
  },
  bookings: {
    label: "Bookings",
    color: "#10b981",
  },
  revenue: {
    label: "Revenue",
    color: "#f59e0b",
  }
};

export const SpaceUtilizationChart = () => {
  const { data: utilizationData, isLoading } = useQuery({
    queryKey: ["space-utilization"],
    queryFn: async () => {
      const [spacesRes, resourcesRes, bookingsRes] = await Promise.all([
        supabase.from("spaces").select("*"),
        supabase.from("resources").select("*"),
        supabase.from("bookings").select("*, resources(name, type)")
      ]);

      const spaces = spacesRes.data || [];
      const resources = resourcesRes.data || [];
      const bookings = bookingsRes.data || [];

      // Space utilization over time (last 7 days)
      const dailyUtilization = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        
        const dayBookings = bookings.filter(b => 
          new Date(b.start_time).toDateString() === date.toDateString()
        );
        
        const totalHours = dayBookings.reduce((sum, booking) => {
          const start = new Date(booking.start_time);
          const end = new Date(booking.end_time);
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        }, 0);
        
        // Assume 8 working hours per day, utilization as percentage
        const utilizationPercent = Math.min((totalHours / (resources.length * 8)) * 100, 100);
        
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          utilization: Math.round(utilizationPercent),
          bookings: dayBookings.length,
          revenue: dayBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)
        };
      });

      // Resource type utilization
      const resourceUtilization = resources.reduce((acc, resource) => {
        const resourceBookings = bookings.filter(b => b.resource_id === resource.id);
        const totalHours = resourceBookings.reduce((sum, booking) => {
          const start = new Date(booking.start_time);
          const end = new Date(booking.end_time);
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        }, 0);
        
        const type = resource.type;
        if (!acc[type]) {
          acc[type] = { type, totalHours: 0, bookings: 0, revenue: 0 };
        }
        
        acc[type].totalHours += totalHours;
        acc[type].bookings += resourceBookings.length;
        acc[type].revenue += resourceBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
        
        return acc;
      }, {} as Record<string, any>);

      const resourceData = Object.values(resourceUtilization);

      // Peak hours analysis
      const hourlyBookings = Array.from({ length: 24 }, (_, hour) => {
        const hourBookings = bookings.filter(b => {
          const startHour = new Date(b.start_time).getHours();
          return startHour === hour;
        });
        
        return {
          hour: `${hour}:00`,
          bookings: hourBookings.length,
          displayHour: hour
        };
      }).filter(h => h.displayHour >= 6 && h.displayHour <= 22); // Show business hours only

      return {
        dailyUtilization,
        resourceData,
        hourlyBookings,
        totalSpaces: spaces.length,
        totalResources: resources.length,
        avgUtilization: Math.round(dailyUtilization.reduce((sum, d) => sum + d.utilization, 0) / dailyUtilization.length)
      };
    }
  });

  if (isLoading) {
    return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
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
          <CardTitle>Space Utilization Trend</CardTitle>
          <CardDescription>Daily utilization percentage over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <AreaChart data={utilizationData?.dailyUtilization}>
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="utilization" 
                stroke="var(--color-utilization)" 
                fill="var(--color-utilization)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resource Type Usage</CardTitle>
          <CardDescription>Bookings by resource type</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={utilizationData?.resourceData}>
              <XAxis dataKey="type" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="bookings" fill="var(--color-bookings)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Peak Hours Analysis</CardTitle>
          <CardDescription>Booking patterns throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <LineChart data={utilizationData?.hourlyBookings}>
              <XAxis dataKey="hour" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="var(--color-bookings)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-bookings)" }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Utilization Summary</CardTitle>
          <CardDescription>Key metrics for space management</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{utilizationData?.totalSpaces || 0}</div>
            <div className="text-sm text-gray-600">Total Spaces</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{utilizationData?.totalResources || 0}</div>
            <div className="text-sm text-gray-600">Total Resources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{utilizationData?.avgUtilization || 0}%</div>
            <div className="text-sm text-gray-600">Avg Utilization</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              ${utilizationData?.dailyUtilization?.reduce((sum, d) => sum + d.revenue, 0)?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-600">Weekly Revenue</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
