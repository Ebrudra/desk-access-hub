
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Calendar, KeyRound } from "lucide-react";

export const DashboardStats = () => {
  const stats = [
    {
      title: "Active Members",
      value: "247",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      description: "from last month"
    },
    {
      title: "Today's Bookings",
      value: "34",
      change: "85%",
      changeType: "neutral",
      icon: Calendar,
      description: "occupancy rate"
    },
    {
      title: "Revenue",
      value: "$18,420",
      change: "+8.2%",
      changeType: "positive",
      icon: TrendingUp,
      description: "this month"
    },
    {
      title: "Access Requests",
      value: "12",
      change: "pending",
      changeType: "neutral",
      icon: KeyRound,
      description: "awaiting approval"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={stat.changeType === "positive" ? "default" : "secondary"}
                className={stat.changeType === "positive" ? "bg-green-100 text-green-800" : ""}
              >
                {stat.change}
              </Badge>
              <span className="text-xs text-gray-500">
                {stat.description}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
