
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
    <div className="space-y-4 pb-20">
      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <GlobalSearch />
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
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
                    className="h-20 flex-col space-y-2"
                    onClick={action.action}
                  >
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-xs">{action.label}</div>
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
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
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
                />
              </SwipeActions>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-semibold">3</div>
                <div className="text-xs text-gray-600">Active Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-semibold">12</div>
                <div className="text-xs text-gray-600">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
