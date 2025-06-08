
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "#3b82f6",
  },
  confirmed: {
    label: "Confirmed",
    color: "#10b981",
  },
  pending: {
    label: "Pending", 
    color: "#f59e0b",
  },
  cancelled: {
    label: "Cancelled",
    color: "#ef4444",
  }
};

export const BookingAnalytics = () => {
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["booking-analytics"],
    queryFn: async () => {
      const { data: bookings } = await supabase
        .from("bookings")
        .select("*, resources(name, type)");

      if (!bookings) return null;

      // Bookings by day (last 7 days)
      const dailyBookings = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayBookings = bookings.filter(b => 
          new Date(b.start_time).toDateString() === date.toDateString()
        );
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          bookings: dayBookings.length
        };
      });

      // Bookings by status
      const statusCounts = bookings.reduce((acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        fill: chartConfig[status as keyof typeof chartConfig]?.color || "#6b7280"
      }));

      // Bookings by resource type
      const resourceTypeData = bookings.reduce((acc, booking) => {
        const type = booking.resources?.type || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const resourceData = Object.entries(resourceTypeData).map(([type, count]) => ({
        type,
        count
      }));

      return {
        dailyBookings,
        statusData,
        resourceData
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
          <CardTitle>Daily Bookings Trend</CardTitle>
          <CardDescription>Bookings over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <LineChart data={bookingsData?.dailyBookings}>
              <XAxis dataKey="day" />
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

      <Card>
        <CardHeader>
          <CardTitle>Booking Status</CardTitle>
          <CardDescription>Distribution of booking statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <PieChart>
              <Pie
                data={bookingsData?.statusData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ status, count }) => `${status}: ${count}`}
              >
                {bookingsData?.statusData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bookings by Resource Type</CardTitle>
          <CardDescription>Most popular resource types</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={bookingsData?.resourceData}>
              <XAxis dataKey="type" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-bookings)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
