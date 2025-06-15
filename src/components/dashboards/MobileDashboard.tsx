
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileOptimizedCard } from "@/components/mobile/MobileOptimizedCard";
import { SwipeActions } from "@/components/mobile/SwipeActions";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { useAuthRole } from "@/hooks/useAuthRole";
import { 
  Calendar, 
  Users, 
  BarChart3, 
  Plus, 
  Star, 
  Edit, 
  Trash,
  Clock,
  MapPin
} from "lucide-react";

export const MobileDashboard = () => {
  const { hasRole } = useAuthRole();
  const [bookings] = useState([
    {
      id: "1",
      title: "Conference Room A",
      time: "2:00 PM - 4:00 PM",
      status: "confirmed",
      attendees: 8
    },
    {
      id: "2", 
      title: "Hot Desk #12",
      time: "9:00 AM - 5:00 PM",
      status: "pending",
      attendees: 1
    }
  ]);

  const quickActions = [
    {
      icon: Plus,
      label: "Book Space",
      description: "Reserve a workspace",
      color: "bg-blue-500",
      action: () => console.log("Book space"),
      available: hasRole('member')
    },
    {
      icon: Calendar,
      label: "My Bookings",
      description: "View reservations",
      color: "bg-green-500",
      action: () => console.log("View bookings"),
      available: hasRole('member')
    },
    {
      icon: BarChart3,
      label: "Analytics",
      description: "Performance data",
      color: "bg-purple-500",
      action: () => console.log("View analytics"),
      available: hasRole('manager')
    },
    {
      icon: Users,
      label: "Members",
      description: "Manage users",
      color: "bg-orange-500",
      action: () => console.log("Manage members"),
      available: hasRole('manager')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3 pb-28 flex flex-col gap-4">
      {/* Search */}
      <Card className="rounded-2xl shadow-xs mb-1">
        <CardContent className="pt-4 pb-2">
          <GlobalSearch />
        </CardContent>
      </Card>

      {/* Quick Actions and Status */}
      <Card className="rounded-2xl shadow-xs mb-1 p-0 bg-white/80 border border-slate-100">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-base font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-3 pb-3">
          <div className="flex gap-2 w-full">
            {quickActions
              .filter(action => action.available)
              .map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={`flex-1 flex flex-col items-center justify-center h-16 p-2 space-y-1 rounded-xl border-2 border-slate-100 bg-white shadow-sm text-xs focus:outline-none`}
                    onClick={action.action}
                    style={{ minWidth: 0 }}
                  >
                    <span className={`p-2 rounded-full ${action.color} flex items-center justify-center mb-1`}>
                      <Icon className="h-5 w-5 text-white" />
                    </span>
                    <span className="font-semibold text-xs text-gray-700 truncate">{action.label}</span>
                  </Button>
                );
              })}
          </div>
        </CardContent>
        <CardContent className="pb-4 px-3 pt-0">
          <div className="flex gap-2">
            {/* Status indicators */}
            <div className="flex-1 rounded-xl border bg-white flex flex-col items-center p-2 shadow-sm min-w-0">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-bold text-base text-gray-800">3</span>
              </div>
              <div className="text-xs text-gray-500 font-medium mt-1">Active Today</div>
            </div>
            <div className="flex-1 rounded-xl border bg-white flex flex-col items-center p-2 shadow-sm min-w-0">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="font-bold text-base text-gray-800">12</span>
              </div>
              <div className="text-xs text-gray-500 font-medium mt-1">Available</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings with Swipe Actions */}
      {hasRole('member') && (
        <Card className="rounded-2xl shadow-xs mb-2 p-0 bg-white/85 border border-slate-100">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="font-bold text-base">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-1 px-2 pb-2">
            {bookings.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-4">No bookings found.</div>
            ) : (
              bookings.map((booking) => (
                <SwipeActions
                  key={booking.id}
                  leftActions={[
                    {
                      label: "Edit",
                      color: "blue",
                      icon: <Edit className="h-4 w-4" />,
                      onClick: () => console.log("Edit booking", booking.id)
                    },
                    {
                      label: "Star",
                      color: "orange",
                      icon: <Star className="h-4 w-4" />,
                      onClick: () => console.log("Star booking", booking.id)
                    }
                  ]}
                  rightActions={[
                    {
                      label: "Cancel",
                      color: "red",
                      icon: <Trash className="h-4 w-4" />,
                      onClick: () => console.log("Cancel booking", booking.id)
                    }
                  ]}
                >
                  <MobileOptimizedCard
                    title={booking.title}
                    subtitle={booking.time}
                    description={`${booking.attendees} attendee${booking.attendees > 1 ? 's' : ''} • ${booking.status}`}
                    onTap={() => console.log("View booking", booking.id)}
                    className="rounded-lg"
                  />
                </SwipeActions>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
