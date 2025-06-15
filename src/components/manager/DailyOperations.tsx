import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock, AlertTriangle, Users, Calendar, MapPin } from "lucide-react";

export const DailyOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: dailyTasks } = useQuery({
    queryKey: ["daily-operations"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [bookingsRes, membersRes, spacesRes] = await Promise.all([
        supabase
          .from("bookings")
          .select("*, members(member_id), resources(name)")
          .gte("start_time", today.toISOString())
          .lt("start_time", tomorrow.toISOString())
          .order("start_time"),
        supabase
          .from("members")
          .select("*")
          .eq("membership_status", "pending"),
        supabase
          .from("spaces")
          .select("*")
      ]);

      return {
        todayBookings: bookingsRes.data || [],
        pendingMembers: membersRes.data || [],
        totalSpaces: spacesRes.data?.length || 0,
        checkins: Math.floor(Math.random() * 25) + 5, // Mock data
        pendingApprovals: bookingsRes.data?.filter(b => b.status === 'pending').length || 0,
        maintenanceTasks: 2 // Mock data
      };
    }
  });

  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: "confirmed" | "cancelled" }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Booking status updated" });
      queryClient.invalidateQueries({ queryKey: ["daily-operations"] });
    }
  });

  const quickActions = [
    {
      title: "Morning Setup",
      description: "Unlock spaces & systems check",
      icon: CheckCircle,
      status: "completed",
      time: "08:00"
    },
    {
      title: "Member Check-ins",
      description: `${dailyTasks?.checkins || 0} members checked in`,
      icon: Users,
      status: "active",
      time: "Ongoing"
    },
    {
      title: "Pending Approvals",
      description: `${dailyTasks?.pendingApprovals || 0} bookings to review`,
      icon: Clock,
      status: dailyTasks?.pendingApprovals ? "pending" : "completed",
      time: "Priority"
    },
    {
      title: "Maintenance Tasks",
      description: `${dailyTasks?.maintenanceTasks || 0} items scheduled`,
      icon: AlertTriangle,
      status: "pending",
      time: "14:00"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <action.icon className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(action.status)}>
                    {action.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{action.time}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Today's Bookings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {dailyTasks?.todayBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-sm">{booking.title || "Booking"}</h4>
                      <p className="text-xs text-gray-600">
                        {booking.members?.member_id || "Unknown"} • {booking.resources?.name || "No resource"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getBookingStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                    {booking.status === 'pending' && (
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateBookingStatus.mutate({ id: booking.id, status: 'confirmed' })}
                          disabled={updateBookingStatus.isPending}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateBookingStatus.mutate({ id: booking.id, status: 'cancelled' })}
                          disabled={updateBookingStatus.isPending}
                        >
                          Deny
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {(!dailyTasks?.todayBookings || dailyTasks.todayBookings.length === 0) && (
                <p className="text-center text-gray-500 py-4">No bookings scheduled for today</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Pending Member Approvals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {dailyTasks?.pendingMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">{member.member_id}</h4>
                    <p className="text-xs text-gray-600">
                      Applied: {new Date(member.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-600">
                      Tier: {member.membership_tier || 'Basic'}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                    <Button size="sm">
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
              {(!dailyTasks?.pendingMembers || dailyTasks.pendingMembers.length === 0) && (
                <p className="text-center text-gray-500 py-4">No pending member applications</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
