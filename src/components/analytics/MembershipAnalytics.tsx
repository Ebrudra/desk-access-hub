
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, BarChart, Bar } from "recharts";

const chartConfig = {
  active: {
    label: "Active",
    color: "#10b981",
  },
  pending: {
    label: "Pending",
    color: "#f59e0b",
  },
  inactive: {
    label: "Inactive",
    color: "#ef4444",
  },
  basic: {
    label: "Basic",
    color: "#6b7280",
  },
  premium: {
    label: "Premium",
    color: "#3b82f6",
  },
  enterprise: {
    label: "Enterprise",
    color: "#8b5cf6",
  }
};

export const MembershipAnalytics = () => {
  const { data: membershipData, isLoading } = useQuery({
    queryKey: ["membership-analytics"],
    queryFn: async () => {
      const { data: members } = await supabase.from("members").select("*");
      
      if (!members) return null;

      // Membership status distribution
      const statusCounts = members.reduce((acc, member) => {
        acc[member.membership_status] = (acc[member.membership_status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        fill: chartConfig[status as keyof typeof chartConfig]?.color || "#6b7280"
      }));

      // Membership tier distribution
      const tierCounts = members.reduce((acc, member) => {
        acc[member.membership_tier] = (acc[member.membership_tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const tierData = Object.entries(tierCounts).map(([tier, count]) => ({
        tier,
        count,
        fill: chartConfig[tier as keyof typeof chartConfig]?.color || "#6b7280"
      }));

      // Member growth over time (last 6 months)
      const monthlyGrowth = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        const membersUntilMonth = members.filter(m => 
          new Date(m.created_at) <= date
        ).length;
        
        return {
          month: monthName,
          members: membersUntilMonth
        };
      });

      return {
        statusData,
        tierData,
        monthlyGrowth,
        totalMembers: members.length,
        activeMembers: members.filter(m => m.membership_status === 'active').length
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
          <CardTitle>Member Growth</CardTitle>
          <CardDescription>Total members over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <LineChart data={membershipData?.monthlyGrowth}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="members" 
                stroke="var(--color-active)" 
                strokeWidth={3}
                dot={{ fill: "var(--color-active)", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Membership Status</CardTitle>
          <CardDescription>Distribution of member statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <PieChart>
              <Pie
                data={membershipData?.statusData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ status, count }) => `${status}: ${count}`}
              >
                {membershipData?.statusData?.map((entry, index) => (
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
          <CardTitle>Membership Tiers</CardTitle>
          <CardDescription>Distribution by tier level</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={membershipData?.tierData}>
              <XAxis dataKey="tier" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-premium)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
