
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-24 px-2 sm:px-0">
      {/* Search */}
      <Card className="rounded-2xl shadow-sm mt-4 mb-4">
        <CardContent className="pt-6 pb-4">
          <GlobalSearch />
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <Card className="rounded-2xl shadow-md mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="font-bold text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions
              .filter(action => action.available)
              .map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex flex-col items-center h-24 py-2 space-y-2 rounded-xl shadow group hover-scale focus:outline-none"
                    onClick={action.action}
                  >
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-center flex-1 flex flex-col items-center justify-center">
                      <div className="font-medium text-xs text-gray-900">{action.label}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                  </Button>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings with Swipe Actions */}
      {hasRole('member') && (
        <Card className="rounded-2xl shadow mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="font-bold text-base">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Card className="rounded-xl shadow-sm">
          <CardContent className="pt-4 pb-3 flex flex-col items-center">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-semibold text-lg text-gray-900">3</div>
                <div className="text-xs text-gray-600">Active Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="pt-4 pb-3 flex flex-col items-center">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-semibold text-lg text-gray-900">12</div>
                <div className="text-xs text-gray-600">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
