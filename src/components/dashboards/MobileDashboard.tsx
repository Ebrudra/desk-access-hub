
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileOptimizedCard } from "@/components/mobile/MobileOptimizedCard";
import { SwipeActions } from "@/components/mobile/SwipeActions";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { MobileTabNavigation } from "@/components/ui/mobile-tab-navigation";
import { useAuthRole } from "@/hooks/useAuthRole";
import { useSearchParams } from "react-router-dom";
import { 
  Calendar, 
  Users, 
  BarChart3, 
  Plus, 
  Star, 
  Edit, 
  Trash,
  Clock,
  MapPin,
  Home,
  Brain,
  Building2,
  Settings
} from "lucide-react";

export const MobileDashboard = () => {
  const { hasRole } = useAuthRole();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";
  
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

  const tabs = [
    { value: "dashboard", label: "Home", icon: "Home" },
    { value: "calendar", label: "Calendar", icon: "Calendar" },
    { value: "smart-booking", label: "Smart", icon: "Brain" },
    { value: "analytics", label: "Analytics", icon: "BarChart3" },
    { value: "crud", label: "Manage", icon: "Settings" },
    { value: "spaces", label: "Spaces", icon: "Building2" },
    { value: "members", label: "Members", icon: "Users" }
  ];

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    setSearchParams(params);
  };

  const renderDashboardContent = () => (
    <div className="space-y-4">
      {/* Search Block */}
      <Card className="rounded-xl shadow-sm border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-800">Search</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <GlobalSearch />
        </CardContent>
      </Card>

      {/* Quick Actions Block */}
      <Card className="rounded-xl shadow-sm border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            {quickActions
              .filter(action => action.available)
              .map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex flex-col items-center justify-center h-20 p-3 space-y-2 rounded-lg border-2 border-slate-200 bg-white shadow-sm hover:shadow-md transition-all"
                    onClick={action.action}
                  >
                    <span className={`p-2 rounded-full ${action.color} flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </span>
                    <span className="font-medium text-xs text-gray-700 text-center leading-tight">{action.label}</span>
                  </Button>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights Block */}
      <Card className="rounded-xl shadow-sm border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-800">Quick Insights</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-800">3</div>
              <div className="text-xs text-blue-600 font-medium">Active Today</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-800">12</div>
              <div className="text-xs text-green-600 font-medium">Available</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      {hasRole('member') && (
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-800">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
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
                    className="rounded-lg border border-slate-200"
                  />
                </SwipeActions>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardContent();
      case "calendar":
        return (
          <div className="p-4">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
                <p className="text-gray-600">Calendar functionality will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        );
      case "smart-booking":
        return (
          <div className="p-4">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Smart Booking</h2>
                <p className="text-gray-600">AI-powered booking suggestions will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        );
      case "analytics":
        return (
          <div className="p-4">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Analytics</h2>
                <p className="text-gray-600">Performance metrics will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-40">
        <h1 className="text-xl font-bold text-gray-900">WorkSpace Hub</h1>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <MobileTabNavigation
        tabs={tabs}
        currentTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
};
