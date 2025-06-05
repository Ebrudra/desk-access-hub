
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";

interface BookingCalendarProps {
  expanded?: boolean;
}

export const BookingCalendar = ({ expanded = false }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const bookings = [
    {
      id: 1,
      title: "Team Meeting",
      member: "Sarah Johnson",
      space: "Conference Room A",
      time: "09:00 - 10:30",
      status: "confirmed",
      type: "meeting-room"
    },
    {
      id: 2,
      title: "Hot Desk",
      member: "Mike Chen",
      space: "Desk #23",
      time: "08:00 - 17:00",
      status: "checked-in",
      type: "desk"
    },
    {
      id: 3,
      title: "Client Presentation",
      member: "Emma Wilson",
      space: "Conference Room B",
      time: "14:00 - 15:30",
      status: "pending",
      type: "meeting-room"
    },
    {
      id: 4,
      title: "Focus Work",
      member: "David Lee",
      space: "Private Office #5",
      time: "10:00 - 18:00",
      status: "confirmed",
      type: "office"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "checked-in": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting-room": return "🏢";
      case "desk": return "💼";
      case "office": return "🏠";
      default: return "📍";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Today's Bookings</span>
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </div>
          <Button size="sm" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Booking</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div 
              key={booking.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">
                  {getTypeIcon(booking.type)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {booking.title}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{booking.space}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{booking.time}</span>
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {booking.member}
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </div>
          ))}
          
          {expanded && (
            <div className="text-center py-4">
              <Button variant="outline" className="w-full">
                View All Bookings
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
