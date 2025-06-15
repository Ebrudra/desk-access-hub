
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings, 
  Database,
  TrendingUp,
  AlertTriangle,
  Activity,
  DollarSign,
  Calendar
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { AdvancedMetrics } from "@/components/analytics/AdvancedMetrics";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { UserRoleManager } from "@/components/admin/UserRoleManager";

export const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('admin-tab') || 'overview';

  const { data: systemStats } = useQuery({
    queryKey: ["admin-system-stats"],
    queryFn: async () => {
      const [usersRes, bookingsRes, paymentsRes, spacesRes] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("bookings").select("*"),
        supabase.from("payments").select("*"),
        supabase.from("spaces").select("*")
      ]);

      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      
      const recentBookings = bookingsRes.data?.filter(b => 
        new Date(b.created_at) >= lastMonth
      ) || [];

      const totalRevenue = paymentsRes.data?.reduce((sum, p) => 
        sum + (p.status === 'completed' ? Number(p.amount) : 0), 0
      ) || 0;

      return {
        totalUsers: usersRes.data?.length || 0,
        totalBookings: bookingsRes.data?.length || 0,
        totalRevenue,
        totalSpaces: spacesRes.data?.length || 0,
        recentBookings: recentBookings.length,
        activeUsers: Math.floor((usersRes.data?.length || 0) * 0.7), // Mock active ratio
        systemUptime: 99.8,
        errorRate: 0.2
      };
    }
  });

  const setAdminTab = (tab: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('admin-tab', tab);
    setSearchParams(newSearchParams);
  };

  const quickActions = [
    {
      icon: Users,
      title: "User Management",
      description: "Manage user roles and permissions",
      action: () => setAdminTab("users"),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "View detailed analytics",
      action: () => setAdminTab("analytics"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: Settings,
      title: "System Settings",
      description: "Configure system settings",
      action: () => setAdminTab("settings"),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Backup and maintenance",
      action: () => setAdminTab("data"),
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  const systemMetrics = [
    {
      title: "Total Users",
      value: systemStats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      change: "+12%"
    },
    {
      title: "Total Revenue",
      value: `$${systemStats?.totalRevenue?.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: "text-green-600",
      change: "+8.5%"
    },
    {
      title: "Active Bookings",
      value: systemStats?.totalBookings || 0,
      icon: Calendar,
      color: "text-purple-600",
      change: "+15%"
    },
    {
      title: "System Uptime",
      value: `${systemStats?.systemUptime || 0}%`,
      icon: Activity,
      color: "text-orange-600",
      change: "+0.1%"
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setAdminTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-600">{metric.change}</span>
                      </div>
                    </div>
                    <metric.icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Administrative Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${action.color}`}
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

          {/* System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium text-sm">System Status</h4>
                        <p className="text-xs text-gray-600">All systems operational</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Healthy</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-sm">Database</h4>
                        <p className="text-xs text-gray-600">Response time: 45ms</p>
                      </div>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Optimal</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <h4 className="font-medium text-sm">Storage Usage</h4>
                        <p className="text-xs text-gray-600">78% of quota used</p>
                      </div>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Monitor</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 border-l-4 border-blue-500">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">New user registration</p>
                      <p className="text-xs text-gray-600">john.doe@example.com</p>
                    </div>
                    <span className="text-xs text-gray-500">2m ago</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 border-l-4 border-green-500">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-gray-600">$250.00 membership fee</p>
                    </div>
                    <span className="text-xs text-gray-500">5m ago</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 border-l-4 border-purple-500">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Booking confirmed</p>
                      <p className="text-xs text-gray-600">Conference Room A</p>
                    </div>
                    <span className="text-xs text-gray-500">8m ago</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UserRoleManager />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <AdvancedMetrics />
            <AnalyticsDashboard />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <SystemSettings />
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Database Operations</h3>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Create Backup
                    </Button>
                    <Button className="w-full" variant="outline">
                      Export Data
                    </Button>
                    <Button className="w-full" variant="outline">
                      Import Data
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Maintenance</h3>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      Clear Cache
                    </Button>
                    <Button className="w-full" variant="outline">
                      Optimize Database
                    </Button>
                    <Button className="w-full" variant="destructive">
                      Reset System
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Warning</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  These operations can affect system performance. Use with caution and during maintenance windows.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
