
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { Navigation } from "@/components/Navigation";
import { SpaceUtilization } from "@/components/SpaceUtilization";
import { BookingCalendar } from "@/components/BookingCalendar";
import { MemberList } from "@/components/MemberList";
import { SmartBookingDashboard } from "@/components/booking/SmartBookingDashboard";
import { CrudManagement } from "@/components/crud/CrudManagement";
import { MobileTabNavigation } from "@/components/ui/mobile-tab-navigation";
import { RoleManagement } from "@/components/RoleManagement";
import { RoleDashboardRenderer } from "@/components/RoleDashboardRenderer";
import { useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthRole } from "@/hooks/useAuthRole";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";
  const isMobile = useIsMobile();
  const { role, hasRole } = useAuthRole();

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  // Define tabs based on user role
  const getTabsForRole = () => {
    const baseTabs = [
      { value: "dashboard", label: "Dashboard", icon: "Home" }
    ];

    if (hasRole('member')) {
      baseTabs.push(
        { value: "smart-booking", label: "Smart Booking", icon: "Brain" },
        { value: "bookings", label: "My Bookings", icon: "Calendar" },
        { value: "spaces", label: "Browse Spaces", icon: "Building2" },
        { value: "access-codes", label: "Access Codes", icon: "KeyRound" }
      );
    }

    if (hasRole('manager')) {
      baseTabs.push(
        { value: "analytics", label: "Analytics", icon: "BarChart3" },
        { value: "members", label: "Members", icon: "Users" },
        { value: "calendar", label: "Calendar", icon: "CalendarDays" },
        { value: "access-control", label: "Access Control", icon: "Shield" },
        { value: "issues", label: "Issues", icon: "AlertTriangle" }
      );
    }

    if (hasRole('admin')) {
      baseTabs.push(
        { value: "crud", label: "Management", icon: "Settings" },
        { value: "roles", label: "Roles", icon: "Shield" },
        { value: "analytics", label: "Analytics", icon: "BarChart3" }
      );
    }

    return baseTabs;
  };

  const tabs = getTabsForRole();

  const renderTabContent = (tabValue: string) => {
    switch (tabValue) {
      case "dashboard":
        return <RoleDashboardRenderer />;
      case "smart-booking":
        return hasRole('member') ? <SmartBookingDashboard /> : <div>Access denied</div>;
      case "analytics":
        return hasRole('manager') ? <AnalyticsDashboard /> : <div>Access denied</div>;
      case "bookings":
        return hasRole('member') ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Bookings</h2>
            <p className="text-gray-600 mb-6">View and manage your reservations</p>
          </div>
        ) : <div>Access denied</div>;
      case "members":
        return hasRole('manager') ? <MemberList /> : <div>Access denied</div>;
      case "spaces":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Spaces</h2>
            <p className="text-gray-600 mb-6">Browse and book workspace resources</p>
            <SpaceUtilization />
          </div>
        );
      case "calendar":
        return hasRole('manager') ? <BookingCalendar /> : <div>Access denied</div>;
      case "crud":
        return hasRole('admin') ? <CrudManagement /> : <div>Access denied</div>;
      case "roles":
        return hasRole('admin') ? <RoleManagement /> : <div>Access denied</div>;
      case "access-codes":
        return hasRole('member') ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Codes</h2>
            <p className="text-gray-600 mb-6">Your active access codes and QR codes</p>
          </div>
        ) : <div>Access denied</div>;
      case "access-control":
        return hasRole('manager') ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Control</h2>
            <p className="text-gray-600 mb-6">Manage facility access and permissions</p>
          </div>
        ) : <div>Access denied</div>;
      case "issues":
        return hasRole('manager') ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Issues & Reports</h2>
            <p className="text-gray-600 mb-6">Handle facility maintenance and member reports</p>
          </div>
        ) : <div>Access denied</div>;
      default:
        return null;
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="pb-20">
          <div className="px-4 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                WorkSpace Hub
              </h1>
              <p className="text-sm text-gray-600">
                {role === 'admin' ? 'Administration Dashboard' : 
                 role === 'manager' ? 'Operations Dashboard' : 
                 'Member Dashboard'}
              </p>
            </div>

            {renderTabContent(currentTab)}
          </div>
        </main>

        <MobileTabNavigation 
          tabs={tabs}
          currentTab={currentTab}
          onTabChange={handleTabChange}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            WorkSpace Hub
          </h1>
          <p className="text-gray-600">
            {role === 'admin' ? 'Administration Dashboard - Manage your coworking platform' : 
             role === 'manager' ? 'Operations Dashboard - Daily facility management' : 
             'Member Dashboard - Your coworking experience'}
          </p>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className={`grid w-full ${tabs.length <= 7 ? `grid-cols-${Math.min(tabs.length, 7)}` : 'grid-cols-7'}`}>
            {tabs.slice(0, 7).map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {renderTabContent(tab.value)}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
