
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Clock, UserCheck, Phone, Mail, Calendar } from "lucide-react";

export const StaffManagement = () => {
  const { data: staffData } = useQuery({
    queryKey: ["staff-management"],
    queryFn: async () => {
      // Get all users with manager or admin roles
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select(`
          *,
          profiles(first_name, last_name)
        `)
        .in("role", ["admin", "manager"]);

      // Mock schedule data
      const schedules = [
        { userId: "1", shift: "Morning", time: "08:00 - 16:00", status: "on-duty" },
        { userId: "2", shift: "Evening", time: "14:00 - 22:00", status: "scheduled" },
        { userId: "3", shift: "Weekend", time: "09:00 - 17:00", status: "off-duty" }
      ];

      return {
        staff: userRoles || [],
        schedules,
        totalStaff: userRoles?.length || 0,
        onDuty: schedules.filter(s => s.status === 'on-duty').length,
        scheduled: schedules.filter(s => s.status === 'scheduled').length
      };
    }
  });

  const getShiftStatusColor = (status: string) => {
    switch (status) {
      case "on-duty": return "bg-green-100 text-green-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "off-duty": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "manager": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Staff Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-blue-600">{staffData?.totalStaff || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On Duty</p>
                <p className="text-2xl font-bold text-green-600">{staffData?.onDuty || 0}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-orange-600">{staffData?.scheduled || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff Directory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Staff Directory</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {staffData?.staff.map((staff, index) => (
                <div key={staff.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {(staff.profiles?.first_name?.charAt(0) || 'U') + (staff.profiles?.last_name?.charAt(0) || 'S')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">
                        {staff.profiles?.first_name} {staff.profiles?.last_name}
                      </h4>
                      <p className="text-sm text-gray-600">ID: {staff.user_id.slice(0, 8)}...</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getRoleColor(staff.role)}>
                          {staff.role}
                        </Badge>
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {(!staffData?.staff || staffData.staff.length === 0) && (
                <p className="text-center text-gray-500 py-4">No staff members found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shift Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Today's Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {staffData?.schedules.map((schedule, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{schedule.shift} Shift</h4>
                    <p className="text-sm text-gray-600">{schedule.time}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getShiftStatusColor(schedule.status)}>
                      {schedule.status.replace('-', ' ')}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button className="w-full mt-4" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View Full Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
