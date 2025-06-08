
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

const chartConfig = {
  utilization: {
    label: "Utilization %",
    color: "#3b82f6",
  },
  bookings: {
    label: "Bookings",
    color: "#10b981",
  }
};

export const SpaceUtilizationChart = () => {
  const { data: utilizationData, isLoading } = useQuery({
    queryKey: ["space-utilization"],
    queryFn: async () => {
      const [spacesRes, resourcesRes, bookingsRes] = await Promise.all([
        supabase.from("spaces").select("*"),
        supabase.from("resources").select("*, space_id"),
        supabase.from("bookings").select("*, resources(name, space_id)")
      ]);

      const spaces = spacesRes.data || [];
      const resources = resourcesRes.data || [];
      const bookings = bookingsRes.data || [];

      // Space utilization data
      const spaceUtilization = spaces.map(space => {
        const spaceResources = resources.filter(r => r.space_id === space.id);
        const spaceBookings = bookings.filter(b => 
          spaceResources.some(r => r.id === b.resource_id)
        );
        
        // Calculate utilization percentage (simplified calculation)
        const totalPossibleBookings = spaceResources.length * 30; // 30 days
        const actualBookings = spaceBookings.length;
        const utilization = totalPossibleBookings > 0 ? 
          Math.min(100, Math.round((actualBookings / totalPossibleBookings) * 100)) : 0;

        return {
          name: space.name,
          utilization,
          bookings: actualBookings,
          resources: spaceResources.length
        };
      });

      // Resource type utilization
      const resourceTypeUtilization = resources.reduce((acc, resource) => {
        const resourceBookings = bookings.filter(b => b.resource_id === resource.id);
        const type = resource.type;
        
        if (!acc[type]) {
          acc[type] = { type, bookings: 0, resources: 0 };
        }
        
        acc[type].bookings += resourceBookings.length;
        acc[type].resources += 1;
        
        return acc;
      }, {} as Record<string, any>);

      const typeData = Object.values(resourceTypeUtilization).map((item: any) => ({
        ...item,
        utilization: item.resources > 0 ? Math.round((item.bookings / (item.resources * 30)) * 100) : 0
      }));

      // Hourly utilization pattern (simulated data for demo)
      const hourlyPattern = Array.from({ length: 24 }, (_, hour) => {
        let utilization = 0;
        if (hour >= 8 && hour <= 18) {
          utilization = 40 + Math.random() * 50;
        } else if (hour >= 19 && hour <= 22) {
          utilization = 20 + Math.random() * 30;
        } else {
          utilization = Math.random() * 15;
        }
        
        return {
          hour: hour.toString().padStart(2, '0') + ':00',
          utilization: Math.round(utilization)
        };
      });

      return {
        spaceUtilization,
        typeData,
        hourlyPattern
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
          <CardTitle>Space Utilization</CardTitle>
          <CardDescription>Utilization percentage by space</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={utilizationData?.spaceUtilization}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="utilization" fill="var(--color-utilization)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resource Type Utilization</CardTitle>
          <CardDescription>Usage by resource type</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <RadarChart data={utilizationData?.typeData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="type" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Utilization"
                dataKey="utilization"
                stroke="var(--color-utilization)"
                fill="var(--color-utilization)"
                fillOpacity={0.3}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hourly Usage Pattern</CardTitle>
          <CardDescription>Average utilization by hour of day</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={utilizationData?.hourlyPattern}>
              <XAxis dataKey="hour" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="utilization" fill="var(--color-bookings)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
