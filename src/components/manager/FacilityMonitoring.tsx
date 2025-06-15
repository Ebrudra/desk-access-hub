
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Thermometer, 
  Wifi, 
  Zap, 
  Shield, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Settings,
  Activity
} from "lucide-react";

export const FacilityMonitoring = () => {
  const { data: facilityData } = useQuery({
    queryKey: ["facility-monitoring"],
    queryFn: async () => {
      // Get spaces data for occupancy
      const { data: spaces } = await supabase
        .from("spaces")
        .select("*");

      // Get current bookings for occupancy calculation
      const now = new Date();
      const { data: activeBookings } = await supabase
        .from("bookings")
        .select("*")
        .eq("status", "confirmed")
        .lte("start_time", now.toISOString())
        .gte("end_time", now.toISOString());

      // Mock environmental and system data
      const environmentalData = {
        temperature: 22,
        humidity: 45,
        airQuality: 85,
        lighting: 75
      };

      const systemStatus = [
        { name: "Wi-Fi Network", status: "operational", uptime: 99.9, icon: Wifi },
        { name: "Security System", status: "operational", uptime: 100, icon: Shield },
        { name: "HVAC System", status: "maintenance", uptime: 95.2, icon: Thermometer },
        { name: "Power Grid", status: "operational", uptime: 99.8, icon: Zap },
        { name: "Camera System", status: "warning", uptime: 87.5, icon: Camera }
      ];

      const alerts = [
        { id: 1, type: "warning", message: "Conference Room A - AC unit needs filter replacement", time: "2 hours ago", priority: "medium" },
        { id: 2, type: "info", message: "WiFi router restarted successfully", time: "4 hours ago", priority: "low" },
        { id: 3, type: "alert", message: "Security camera offline in parking area", time: "6 hours ago", priority: "high" }
      ];

      return {
        spaces: spaces || [],
        activeBookings: activeBookings || [],
        occupancyRate: Math.round((activeBookings?.length || 0) / Math.max(spaces?.length || 1, 1) * 100),
        environmentalData,
        systemStatus,
        alerts
      };
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "maintenance": return "bg-blue-100 text-blue-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "alert": return "bg-red-100 text-red-800 border-red-200";
      case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "medium": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "low": return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Environmental Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temperature</p>
                <p className="text-2xl font-bold">{facilityData?.environmentalData.temperature}°C</p>
                <p className="text-xs text-green-600">Optimal</p>
              </div>
              <Thermometer className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy</p>
                <p className="text-2xl font-bold">{facilityData?.occupancyRate}%</p>
                <Progress value={facilityData?.occupancyRate} className="mt-2" />
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Air Quality</p>
                <p className="text-2xl font-bold">{facilityData?.environmentalData.airQuality}%</p>
                <p className="text-xs text-green-600">Good</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Spaces</p>
                <p className="text-2xl font-bold">{facilityData?.activeBookings.length}</p>
                <p className="text-xs text-gray-600">of {facilityData?.spaces.length} total</p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {facilityData?.systemStatus.map((system, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <system.icon className="h-6 w-6 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-sm">{system.name}</h4>
                      <p className="text-xs text-gray-600">Uptime: {system.uptime}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(system.status)}>
                      {system.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Recent Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {facilityData?.alerts.map((alert) => (
                <div key={alert.id} className={`p-3 border rounded-lg ${getAlertColor(alert.type)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getPriorityIcon(alert.priority)}
                      <div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs opacity-75 mt-1">{alert.time}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="ml-2">
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button className="w-full mt-4" variant="outline">
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Temperature</h4>
                <Thermometer className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current: {facilityData?.environmentalData.temperature}°C</span>
                  <span>Target: 23°C</span>
                </div>
                <Progress value={92} />
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">-</Button>
                  <Button size="sm" variant="outline">+</Button>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Lighting</h4>
                <Zap className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Brightness: {facilityData?.environmentalData.lighting}%</span>
                </div>
                <Progress value={facilityData?.environmentalData.lighting} />
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">Dim</Button>
                  <Button size="sm" variant="outline">Auto</Button>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Security</h4>
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div className="space-y-2">
                <Badge className="bg-green-100 text-green-800">All Systems Armed</Badge>
                <div className="flex space-x-2 mt-2">
                  <Button size="sm" variant="outline">Disarm</Button>
                  <Button size="sm" variant="outline">Test</Button>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Network</h4>
                <Wifi className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-2">
                <Badge className="bg-green-100 text-green-800">Connected - Strong</Badge>
                <div className="flex space-x-2 mt-2">
                  <Button size="sm" variant="outline">Restart</Button>
                  <Button size="sm" variant="outline">Settings</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
