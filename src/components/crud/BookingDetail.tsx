
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Users, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          members(member_id),
          resources(name, type)
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading booking details...</div>;
  }

  if (!booking) {
    return <div className="text-center p-8">Booking not found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Bookings", href: "/" },
            { label: booking.title || "Booking Details" }
          ]}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">
              {booking.title || "Booking Details"}
            </CardTitle>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Start Time</p>
                  <p className="text-sm text-gray-600">{formatDateTime(booking.start_time)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">End Time</p>
                  <p className="text-sm text-gray-600">{formatDateTime(booking.end_time)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Resource</p>
                  <p className="text-sm text-gray-600">
                    {booking.resources?.name || "No resource assigned"}
                    {booking.resources?.type && (
                      <Badge variant="outline" className="ml-2">
                        {booking.resources.type}
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Member</p>
                  <p className="text-sm text-gray-600">
                    {booking.members?.member_id || "No member assigned"}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-medium">Attendees</p>
                <p className="text-sm text-gray-600">{booking.attendees || 1}</p>
              </div>

              {booking.total_amount && (
                <div>
                  <p className="font-medium">Total Amount</p>
                  <p className="text-sm text-gray-600">${booking.total_amount}</p>
                </div>
              )}
            </div>
          </div>

          {booking.description && (
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-gray-600">{booking.description}</p>
            </div>
          )}

          {booking.special_requests && (
            <div>
              <h3 className="font-medium mb-2">Special Requests</h3>
              <p className="text-sm text-gray-600">{booking.special_requests}</p>
            </div>
          )}

          {booking.is_recurring && (
            <div>
              <h3 className="font-medium mb-2">Recurring Information</h3>
              <Badge variant="outline">Recurring Booking</Badge>
              {booking.recurring_pattern && (
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
                  {JSON.stringify(booking.recurring_pattern, null, 2)}
                </pre>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
