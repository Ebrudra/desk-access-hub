import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileOptimizedCard } from "@/components/mobile/MobileOptimizedCard";
import { SwipeActions } from "@/components/mobile/SwipeActions";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { MobileTabNavigation } from "@/components/ui/mobile-tab-navigation";
import { useAuthRole } from "@/hooks/useAuthRole";
import { useSearchParams } from "react-router-dom";
import { BookingCalendar } from "@/components/BookingCalendar";
import { SmartBookingDashboard } from "@/components/booking/SmartBookingDashboard";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { CrudManagement } from "@/components/crud/CrudManagement";
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
  Settings,
  KeyRound
} from "lucide-react";
import { MobileHeaderMenu } from "@/components/mobile/MobileHeaderMenu";

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

  // Only two quick actions
  const quickActions = [
    {
      icon: "Calendar",
      label: "New Booking",
      description: "Create a new booking",
      color: "bg-blue-500",
      action: () => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', 'calendar');
        setSearchParams(params);
      },
      available: true
    },
    {
      icon: "KeyRound",
      label: "Grant Access",
      description: "Give access",
      color: "bg-green-500",
      action: () => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', 'access-codes');
        setSearchParams(params);
      },
      available: true
    }
  ];

  // Update bottom navigation tabs to match user request (Home, Calendar, Analytics, Notifications, More)
  const tabs = [
    { value: "dashboard", label: "Home", icon: "Home" },
    { value: "calendar", label: "Calendar", icon: "Calendar" },
    { value: "analytics", label: "Analytics", icon: "Analytics" },
    { value: "notifications", label: "Notifications", icon: "Notifications" },
    { value: "more", label: "More", icon: "MoreHorizontal" }
  ];

  // The "more" menu - ensure all supported
  const moreItems = [
    { value: "smart-booking", label: "Smart Booking", icon: "Brain" },
    { value: "access-codes", label: "Access Code", icon: "KeyRound" },
    { value: "booking", label: "Booking", icon: "Calendar" },
    { value: "members", label: "Members", icon: "Users" },
    { value: "events", label: "Events", icon: "CalendarDays" },
    { value: "resources", label: "Resources", icon: "Building2" },
    { value: "billing", label: "Billing", icon: "BarChart3" },
    { value: "payments", label: "Payment", icon: "BarChart3" }
  ];

  const iconMap = {
    Calendar: Calendar,
    KeyRound: KeyRound,
    Home: Home,
    Brain: Brain,
    Building2: Building2,
    Settings: Settings,
    Plus: Plus,
    Star: Star,
    Edit: Edit,
    Trash: Trash,
    Clock: Clock,
    MapPin: MapPin,
  };

  // Mobile header as per screenshot (gradient bar, circular icon, bold font)
  const Header = () => (
    <div className="bg-gradient-to-r from-[#35386a] via-[#633dc3] to-[#4152b2] p-4 pt-8 flex items-center justify-between shadow-lg rounded-b-xl relative">
      <div className="flex items-center">
        <div className="flex items-center gap-3">
          {/* Circle gradient icon */}
          <div className="w-10 h-10 rounded-[1.5rem] bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-500 flex items-center justify-center shadow-lg" />
          <span className="text-2xl font-bold font-display text-white drop-shadow tracking-tight">WorkspaceHub</span>
        </div>
      </div>
      <MobileHeaderMenu />
    </div>
  );

  // Render tab content based on selected tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardContent();
      case "calendar":
        return (
          <div className="p-0 pt-4">
            <BookingCalendar />
          </div>
        );
      case "smart-booking":
        return (
          <div className="p-0 pt-4">
            <SmartBookingDashboard />
          </div>
        );
      case "analytics":
        return (
          <div className="p-0 pt-4">
            <AnalyticsDashboard />
          </div>
        );
      case "members":
        // Swap placeholder with CrudManagement (if that's members manager)
        return (
          <div className="p-0 pt-4">
            <CrudManagement />
          </div>
        );
      case "events":
        return (
          <div className="p-0 pt-4">
            <CrudManagement />
          </div>
        );
      case "resources":
        return (
          <div className="p-0 pt-4">
            <CrudManagement />
          </div>
        );
      case "billing":
        return (
          <div className="p-0 pt-4">
            <AnalyticsDashboard />
          </div>
        );
      case "payments":
        return (
          <div className="p-0 pt-4">
            <AnalyticsDashboard />
          </div>
        );
      case "access-codes":
        return (
          <div className="p-0 pt-4">
            <CrudManagement />
          </div>
        );
      case "notifications":
        // You may want a NotificationCenter component, here we use CrudManagement as placeholder
        return (
          <div className="p-0 pt-4">
            <CrudManagement />
          </div>
        );
      default:
        return renderDashboardContent();
    }
  };

  const renderDashboardContent = () => (
    <div className="space-y-4">
      {/* Search Block */}
      <div className="rounded-xl shadow-sm border border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="pb-3 px-4 pt-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">Search</div>
        </div>
        <div className="px-4 pb-4">
          <GlobalSearch />
        </div>
      </div>

      {/* Quick Actions Block */}
      <div className="rounded-xl shadow-sm border border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="pb-3 px-4 pt-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">Quick Actions</div>
        </div>
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = iconMap[action.icon as keyof typeof iconMap] || Home;
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
        </div>
      </div>

      {/* Quick Insights Block */}
      <div className="rounded-xl shadow-sm border border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="pb-3 px-4 pt-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">Quick Insights</div>
        </div>
        <div className="px-4 pb-4">
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
        </div>
      </div>

      {/* Recent Bookings */}
      {hasRole('member') && (
        <div className="rounded-xl shadow-sm border border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="pb-3 px-4 pt-4">
            <div className="text-lg font-semibold text-gray-800 mb-1">Recent Bookings</div>
          </div>
          <div className="px-4 pb-4 space-y-3">
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
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="p-4 pb-28">{renderTabContent()}</div>
      {/* Bottom Navigation */}
      <MobileTabNavigation
        tabs={tabs}
        currentTab={activeTab}
        onTabChange={(tab) => {
          if (tab === "more") return;
          const params = new URLSearchParams(searchParams);
          params.set('tab', tab);
          setSearchParams(params);
        }}
        moreItems={moreItems}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
      />
    </div>
  );
};
