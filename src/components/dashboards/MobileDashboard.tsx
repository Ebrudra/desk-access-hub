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
import { MobileHomeTab } from "../mobile/tabs/MobileHomeTab";
import { MobileCalendarTab } from "../mobile/tabs/MobileCalendarTab";
import { MobileAnalyticsTab } from "../mobile/tabs/MobileAnalyticsTab";
import { MobileNotificationsTab } from "../mobile/tabs/MobileNotificationsTab";
import { MobileCrudTab } from "../mobile/tabs/MobileCrudTab";
import { MobileBillingTab } from "../mobile/tabs/MobileBillingTab";
import { MobilePaymentsTab } from "../mobile/tabs/MobilePaymentsTab";
import { MobileSmartBookingTab } from "../mobile/tabs/MobileSmartBookingTab";
import { MobileAccessCodesTab } from "../mobile/tabs/MobileAccessCodesTab";

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

  // Tab mapping system
  const tabComponents: Record<string, React.ReactNode> = {
    "dashboard": <MobileHomeTab bookings={bookings} />,
    "calendar": <MobileCalendarTab />,
    "analytics": <MobileAnalyticsTab />,
    "notifications": <MobileNotificationsTab />,
    "smart-booking": <MobileSmartBookingTab />,
    "access-codes": <MobileAccessCodesTab />,
    "billing": <MobileBillingTab />,
    "payments": <MobilePaymentsTab />,
    "members": <MobileCrudTab subtab="members" />,
    "events": <MobileCrudTab subtab="events" />,
    "resources": <MobileCrudTab subtab="resources" />,
    "booking": <MobileCrudTab subtab="bookings" />,
  };

  // Default fallback to Home tab
  const tabContent = tabComponents[activeTab] ?? <MobileHomeTab bookings={bookings} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="p-4 pb-28">{tabContent}</div>
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
