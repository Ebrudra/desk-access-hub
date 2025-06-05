
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Calendar } from "lucide-react";

interface SpaceUtilizationProps {
  expanded?: boolean;
}

export const SpaceUtilization = ({ expanded = false }: SpaceUtilizationProps) => {
  const utilizationData = [
    { name: "Mon", desks: 75, meetingRooms: 60, offices: 90 },
    { name: "Tue", desks: 82, meetingRooms: 75, offices: 85 },
    { name: "Wed", desks: 88, meetingRooms: 80, offices: 95 },
    { name: "Thu", desks: 85, meetingRooms: 70, offices: 88 },
    { name: "Fri", desks: 78, meetingRooms: 85, offices: 92 },
    { name: "Sat", desks: 45, meetingRooms: 40, offices: 60 },
    { name: "Sun", desks: 25, meetingRooms: 20, offices: 35 }
  ];

  const spaceBreakdown = [
    { name: "Hot Desks", value: 45, color: "#3B82F6" },
    { name: "Meeting Rooms", value: 25, color: "#10B981" },
    { name: "Private Offices", value: 20, color: "#8B5CF6" },
    { name: "Common Areas", value: 10, color: "#F59E0B" }
  ];

  const currentUtilization = [
    { space: "Hot Desks", current: 23, total: 30, percentage: 77 },
    { space: "Meeting Room A", current: 1, total: 1, percentage: 100 },
    { space: "Meeting Room B", current: 0, total: 1, percentage: 0 },
    { space: "Private Offices", current: 8, total: 10, percentage: 80 },
    { space: "Phone Booths", current: 3, total: 4, percentage: 75 }
  ];

  if (!expanded) {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Space Utilization</span>
          </CardTitle>
          <CardDescription>Real-time occupancy overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentUtilization.slice(0, 3).map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.space}</span>
                  <span className="text-gray-500">
                    {item.current}/{item.total}
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Weekly Utilization Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart className="h-5 w-5" />
            <span>Weekly Utilization Trends</span>
          </CardTitle>
          <CardDescription>
            Space utilization percentages over the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="desks" fill="#3B82F6" name="Hot Desks" />
                <Bar dataKey="meetingRooms" fill="#10B981" name="Meeting Rooms" />
                <Bar dataKey="offices" fill="#8B5CF6" name="Private Offices" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Space Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Space Distribution</CardTitle>
            <CardDescription>
              Breakdown of available space types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spaceBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {spaceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {spaceBreakdown.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Occupancy</CardTitle>
            <CardDescription>
              Real-time space availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentUtilization.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.space}</span>
                    <span className="text-gray-500">
                      {item.current}/{item.total} ({item.percentage}%)
                    </span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
