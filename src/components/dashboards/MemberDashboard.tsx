
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Clock, CreditCard, MapPin, QrCode } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const MemberDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const { data: userBookings } = useQuery({
    queryKey: ["user-bookings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          resources (name, type)
        `)
        .eq("user_id", user?.id)
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const quickActions = [
    {
      icon: Calendar,
      title: "Book Space",
      description: "Find and book your workspace",
      action: () => setSearchParams({ tab: "smart-booking" }),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: Clock,
      title: "My Bookings",
      description: "View your reservations",
      action: () => setSearchParams({ tab: "bookings" }),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: CreditCard,
      title: "Billing",
      description: "Manage payments",
      action: () => navigate("/billing"),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: QrCode,
      title: "Access Codes",
      description: "View your access codes",
      action: () => setSearchParams({ tab: "access-codes" }),
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={action.action}>
            <CardContent className="p-4">
              <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-sm">{action.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userBookings && userBookings.length > 0 ? (
              <div className="space-y-3">
                {userBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">{booking.resources?.name}</h4>
                      <p className="text-xs text-gray-600">
                        {new Date(booking.start_time).toLocaleDateString()} at{" "}
                        {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming bookings</p>
                <Button className="mt-4" onClick={() => setSearchParams({ tab: "smart-booking" })}>
                  Book Your First Space
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Available Spaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Conference Room A</h4>
                  <p className="text-xs text-gray-600">Available now • 8 seats</p>
                </div>
                <Button size="sm">Book</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Hot Desk 1</h4>
                  <p className="text-xs text-gray-600">Available now • Individual</p>
                </div>
                <Button size="sm">Book</Button>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setSearchParams({ tab: "spaces" })}>
              View All Spaces
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
