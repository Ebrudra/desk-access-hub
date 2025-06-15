
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { 
  ClipboardCheck, 
  Users, 
  AlertTriangle, 
  BarChart3, 
  KeyRound, 
  Calendar,
  Activity,
  Settings,
  CheckSquare
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DailyOperations } from "@/components/manager/DailyOperations";
import { StaffManagement } from "@/components/manager/StaffManagement";
import { FacilityMonitoring } from "@/components/manager/FacilityMonitoring";
import { TaskManagement } from "@/components/manager/TaskManagement";

export const ManagerDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('manager-tab') || 'overview';

  const { data: todayStats } = useQuery({
    queryKey: ["manager-today-stats"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [bookingsRes, membersRes, resourcesRes] = await Promise.all([
        supabase
          .from("bookings")
          .select("*")
          .gte("start_time", today.toISOString())
          .lt("start_time", tomorrow.toISOString()),
        supabase.from("profiles").select("*"),
        supabase.from("resources").select("*").eq("is_available", true)
      ]);

      const pendingBookings = bookingsRes.data?.filter(b => b.status === 'pending') || [];
      const activeBookings = bookingsRes.data?.filter(b => b.status === 'confirmed') || [];

      return {
        todayBookings: bookingsRes.data?.length || 0,
        pendingBookings: pendingBookings.length,
        activeBookings: activeBookings.length,
        totalMembers: membersRes.data?.length || 0,
        availableResources: resourcesRes.data?.length || 0
      };
    }
  });

  const setManagerTab = (tab: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('manager-tab', tab);
    setSearchParams(newSearchParams);
  };

  const operationalActions = [
    {
      icon: ClipboardCheck,
      title: "Approve Bookings",
      description: `${todayStats?.pendingBookings || 0} pending`,
      action: () => setManagerTab("operations"),
      color: "bg-yellow-500 hover:bg-yellow-600",
      urgent: (todayStats?.pendingBookings || 0) > 0
    },
    {
      icon: Users,
      title: "Staff Management",
      description: "Monitor team activity",
      action: () => setManagerTab("staff"),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: Settings,
      title: "Facility Control",
      description: "Monitor systems",
      action: () => setManagerTab("facility"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: CheckSquare,
      title: "Task Management",
      description: "Assign & track tasks",
      action: () => setManagerTab("tasks"),
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  const statsCards = [
    {
      title: "Today's Bookings",
      value: todayStats?.todayBookings || 0,
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Active Members",
      value: todayStats?.totalMembers || 0,
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Available Resources",
      value: todayStats?.availableResources || 0,
      icon: BarChart3,
      color: "text-purple-600"
    },
    {
      title: "Pending Approvals",
      value: todayStats?.pendingBookings || 0,
      icon: ClipboardCheck,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setManagerTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="facility">Facility</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {operationalActions.map((action, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${action.color} ${
                      action.urgent ? 'ring-2 ring-red-300 animate-pulse' : ''
                    }`}
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

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">Conference Room A</h4>
                      <p className="text-xs text-gray-600">John Doe • 2:00 PM - 4:00 PM</p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">Hot Desk 3</h4>
                      <p className="text-xs text-gray-600">Jane Smith • 9:00 AM - 5:00 PM</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Confirmed</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => setManagerTab("operations")}>
                  Manage All Operations
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Facility Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">All Systems</h4>
                      <p className="text-xs text-gray-600">Operating normally</p>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">WiFi Network</h4>
                      <p className="text-xs text-gray-600">Intermittent issues reported</p>
                    </div>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => setManagerTab("facility")}>
                  View Facility Controls
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations">
          <DailyOperations />
        </TabsContent>

        <TabsContent value="staff">
          <StaffManagement />
        </TabsContent>

        <TabsContent value="facility">
          <FacilityMonitoring />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
