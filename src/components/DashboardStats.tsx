
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMembers } from "@/hooks/useMembers";
import { useBookings } from "@/hooks/useBookings";
import { useResources } from "@/hooks/useResources";
import { CalendarDays, Users, Building, TrendingUp } from "lucide-react";

export const DashboardStats = () => {
  const { data: members, isLoading: membersLoading } = useMembers();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const { data: resources, isLoading: resourcesLoading } = useResources();

  // Calculate stats from real data
  const activeMembers = members?.filter(m => m.membership_status === 'active').length || 0;
  const todayBookings = bookings?.filter(b => {
    const today = new Date().toDateString();
    return new Date(b.start_time).toDateString() === today;
  }).length || 0;
  const availableSpaces = resources?.filter(r => r.is_available).length || 0;
  const monthlyRevenue = members?.reduce((sum, m) => sum + (m.monthly_rate || 0), 0) || 0;

  const stats = [
    {
      title: "Active Members",
      value: membersLoading ? "..." : activeMembers.toString(),
      description: "Currently enrolled",
      icon: Users,
      trend: "+12% from last month",
      color: "text-blue-600"
    },
    {
      title: "Today's Bookings", 
      value: bookingsLoading ? "..." : todayBookings.toString(),
      description: "Scheduled for today",
      icon: CalendarDays,
      trend: "+5% from yesterday",
      color: "text-green-600"
    },
    {
      title: "Available Spaces",
      value: resourcesLoading ? "..." : availableSpaces.toString(),
      description: "Ready for booking",
      icon: Building,
      trend: "2 recently added",
      color: "text-purple-600"
    },
    {
      title: "Monthly Revenue",
      value: membersLoading ? "..." : `$${monthlyRevenue.toLocaleString()}`,
      description: "From memberships",
      icon: TrendingUp,
      trend: "+8% from last month",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            <Badge variant="secondary" className="mt-2 text-xs">
              {stat.trend}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
