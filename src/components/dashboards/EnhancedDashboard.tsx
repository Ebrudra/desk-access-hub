import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RealtimeNotifications } from "@/components/notifications/RealtimeNotifications";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { MobileOptimizedCard } from "@/components/mobile/MobileOptimizedCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthRole } from "@/hooks/useAuthRole";
import { 
  Bell, 
  Search, 
  Bolt,
  ChartBar // <-- Import analytics icon
} from "lucide-react";
import { QuickActions } from "@/components/QuickActions";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

// Feature colors matching your reference image
const FEATURE_COLORS = [
  "bg-gradient-to-br from-blue-400 to-blue-500",
  "bg-gradient-to-br from-green-400 to-green-500",
  "bg-gradient-to-br from-purple-400 to-purple-500",
  "bg-gradient-to-br from-orange-400 to-orange-500"
];

export const EnhancedDashboard = () => {
  const isMobile = useIsMobile();
  const { hasRole } = useAuthRole();

  const features = [
    {
      title: "Real-time Notifications",
      description: "Get instant updates on bookings, events, and system changes",
      icon: Bell,
      color: FEATURE_COLORS[0],
      available: true
    },
    {
      title: "Global Search",
      description: "Search across all platform data with intelligent filtering",
      icon: Search,
      color: FEATURE_COLORS[1],
      available: true
    },
    {
      title: "Mobile Optimized",
      description: "Touch-friendly interface with swipe actions and responsive design",
      icon: ChartBar, // Changed from Bell to ChartBar for analytics relevance
      color: FEATURE_COLORS[2],
      available: true
    },
    {
      title: "Performance Optimized",
      description: "Lazy loading, virtualization, and efficient data handling",
      icon: Bolt,
      color: FEATURE_COLORS[3],
      available: true
    }
  ];

  // Quick Actions now matches features card design and color palette
  const quickActions = [
    {
      title: "Create Booking",
      description: "Quick book a space or resource",
      icon: Search,
      color: FEATURE_COLORS[0],
      onClick: () => {
        window.location.href = "/bookings/new";
      },
      available: true // force always available for testing
    },
    {
      title: "View Analytics",
      description: "Check performance metrics",
      icon: Bolt,
      color: FEATURE_COLORS[1],
      onClick: () => window.location.href = "/dashboard?tab=analytics",
      available: true
    },
    {
      title: "Manage System",
      description: "Admin configuration",
      icon: Bell,
      color: FEATURE_COLORS[2],
      onClick: () => window.location.href = "/dashboard?tab=crud",
      available: true
    },
    {
      title: "Grant Access",
      description: "Provide space access to a member",
      icon: Bolt,
      color: FEATURE_COLORS[3],
      onClick: () => window.location.href = "/dashboard?tab=access-codes",
      available: true,
    }
  ];

  if (isMobile) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bolt className="h-5 w-5 text-orange-600" />
              <span>Enhanced Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GlobalSearch />
          </CardContent>
        </Card>

        <div className="space-y-3">
          {features.map((feature, index) => (
            <MobileOptimizedCard
              key={index}
              title={feature.title}
              description={feature.description}
              actions={[
                {
                  label: "Explore",
                  onClick: () => console.log(`Explore ${feature.title}`)
                }
              ]}
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions
              .filter(action => action.available)
              .map((action, index) => (
                <MobileOptimizedCard
                  key={index}
                  title={action.title}
                  description={action.description}
                  onTap={action.onClick}
                />
              ))}
          </CardContent>
        </Card>

        <RealtimeNotifications />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bolt className="h-5 w-5" />
            <span>Enhanced Workspace Platform</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Experience the next generation of coworking space management with advanced features, 
            real-time capabilities, and mobile-first design.
          </p>
          <GlobalSearch />
        </CardContent>
      </Card>

      {/* MAIN TABS */}
      <Tabs defaultValue="features" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="features">New Features</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Quick Actions (bento style) */}
        <TabsContent value="quick-actions" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {quickActions.filter(action => action.available).map((action, i) => {
              const Icon = action.icon;
              return (
                <div
                  key={i}
                  className={
                    "group rounded-2xl p-6 shadow-md " +
                    action.color +
                    " hover:scale-105 transform transition duration-300 relative overflow-hidden"
                  }
                  style={{
                    minHeight: "180px",
                  }}
                  onClick={action.onClick}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center mb-3 space-x-4">
                    <Icon className="h-8 w-8 text-white drop-shadow-lg transition-transform group-hover:scale-125" />
                    <span className="text-xl font-bold text-white drop-shadow-sm">{action.title}</span>
                  </div>
                  <div className="text-white text-opacity-90 text-md">{action.description}</div>
                  <span className="absolute bottom-2 right-4 text-sm text-white opacity-60">
                    ✓ Available
                  </span>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <NotificationCenter />
        </TabsContent>

        {/* New Features (bento grid with new design) */}
        <TabsContent value="features" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className={
                    "group rounded-2xl p-6 shadow-md " +
                    feature.color +
                    " hover:scale-105 transform transition duration-300 relative overflow-hidden"
                  }
                  style={{
                    minHeight: "180px",
                  }}
                >
                  <div className="flex items-center mb-3 space-x-4">
                    <Icon className="h-8 w-8 text-white drop-shadow-lg transition-transform group-hover:scale-125" />
                    <span className="text-xl font-bold text-white drop-shadow-sm">{feature.title}</span>
                  </div>
                  <div className="text-white text-opacity-90 text-md">{feature.description}</div>
                  <span className="absolute bottom-2 right-4 text-sm text-white opacity-60">
                    {feature.available ? "✓ Available" : "Coming Soon"}
                  </span>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Coworking space performance metrics tab */}
        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Space Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">80%</div>
                <p className="text-xs text-gray-600">Average daily utilization</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Active Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">24</div>
                <p className="text-xs text-gray-600">This week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Most Popular Room</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-purple-600">Main Conference</div>
                <p className="text-xs text-gray-600">Booked 12 times</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
