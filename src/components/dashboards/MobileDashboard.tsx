
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-2 pb-24 flex flex-col gap-3">
      {/* Search */}
      <Card className="rounded-2xl shadow-xs mb-2">
        <CardContent className="pt-4 pb-2">
          <GlobalSearch />
        </CardContent>
      </Card>

      {/* Quick Actions and Status */}
      <Card className="rounded-2xl shadow-xs mb-2 px-0">
        <CardHeader className="pb-3 pt-3 px-4">
          <CardTitle className="text-base font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-2 pb-3">
          <div className="grid grid-cols-2 gap-2">
            {quickActions
              .filter(action => action.available)
              .map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex flex-col items-center h-20 py-2 space-y-1 rounded-lg border bg-white shadow-none text-xs focus:outline-none"
                    onClick={action.action}
                  >
                    <div className={`p-1 rounded-md ${action.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-xs text-gray-800">{action.label}</span>
                  </Button>
                );
              })}
          </div>
        </CardContent>
        <CardContent className="pb-4 px-2 pt-0">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white border flex items-center p-2 space-x-2 shadow-sm">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-semibold leading-tight text-base text-gray-900">3</div>
                <div className="text-xs text-gray-500">Active Today</div>
              </div>
            </div>
            <div className="rounded-lg bg-white border flex items-center p-2 space-x-2 shadow-sm">
              <MapPin className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-semibold leading-tight text-base text-gray-900">12</div>
                <div className="text-xs text-gray-500">Available</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings with Swipe Actions */}
      {hasRole('member') && (
        <Card className="rounded-2xl shadow-xs mb-2">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="font-bold text-base">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-1 px-2">
            {bookings.map((booking) => (
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
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
