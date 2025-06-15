import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useBookings } from "@/hooks/useBookings";
import { format, isSameDay, isToday } from "date-fns";
import { CalendarPlus, Clock, MapPin, Users, Calendar as CalendarIcon } from "lucide-react"; // <-- Lucide's icon

interface BookingCalendarProps {
  expanded?: boolean;
}

export const BookingCalendar = ({ expanded = false }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const navigate = useNavigate();
  const { data: bookings, isLoading } = useBookings();

  const selectedDateBookings = bookings?.filter(booking =>
    isSameDay(new Date(booking.start_time), selectedDate)
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Mark dates that have bookings
  const datesWithBookings = bookings?.map(booking => new Date(booking.start_time)) || [];

  if (isLoading) {
    return (
      <Card className={expanded ? "col-span-full h-full" : "h-full"}>
        <CardHeader>
          <CardTitle>Booking Calendar</CardTitle>
          <CardDescription>Loading booking data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={expanded ? "col-span-full h-full flex flex-col" : "h-full flex flex-col"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Booking Calendar</CardTitle>
            <CardDescription>
              View and manage space bookings
            </CardDescription>
          </div>
          <Button onClick={() => navigate("/bookings/new")}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 flex flex-col">
        <div
          className={`grid ${expanded ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"} gap-6 flex-1 min-h-0`}
        >
          {/* Calendar column */}
          <div className="rounded-md border w-full flex flex-col h-full min-h-0">
            <div className="flex-1 min-h-0 flex">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={date => date && setSelectedDate(date)}
                className="rounded-md border w-full h-full"
                modifiers={{
                  hasBooking: datesWithBookings,
                  today: [new Date()],
                }}
                modifiersClassNames={{
                  hasBooking: "bg-blue-100 text-blue-900 font-semibold",
                  today: "bg-orange-100 text-orange-900",
                }}
              />
            </div>
          </div>
          {/* Bookings column */}
          <div className="flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {isToday(selectedDate) ? "Today's Bookings" : format(selectedDate, "PPP")}
              </h3>
              <Badge variant="secondary">
                {selectedDateBookings.length} bookings
              </Badge>
            </div>
            <div className="space-y-3 flex-1 min-h-0 overflow-y-auto">
              {selectedDateBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500 flex flex-col items-center justify-center">
                  <p>No bookings for this date</p>
                </div>
              ) : (
                selectedDateBookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/bookings/${booking.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">
                          {booking.title || "Untitled Booking"}
                        </h4>
                        <Badge className={getStatusColor(booking.status || "pending")}>
                          {booking.status || "pending"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {format(new Date(booking.start_time), "p")} - {format(new Date(booking.end_time), "p")}
                        </div>
                        {booking.resources && (
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {booking.resources.name}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          {booking.attendees || 1} attendees
                        </div>
                        {booking.total_amount && (
                          <div className="text-green-600 font-medium">
                            ${booking.total_amount}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
