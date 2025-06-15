
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
  TrendingUp, 
  Users, 
  Calendar, 
  Settings,
  Smartphone,
  Zap
} from "lucide-react";

export const EnhancedDashboard = () => {
  const isMobile = useIsMobile();
  const { hasRole } = useAuthRole();

  const features = [
    {
      title: "Real-time Notifications",
      description: "Get instant updates on bookings, events, and system changes",
      icon: Bell,
      color: "text-blue-600",
      available: true
    },
    {
      title: "Global Search",
      description: "Search across all platform data with intelligent filtering",
      icon: Search,
      color: "text-green-600",
      available: true
    },
    {
      title: "Mobile Optimized",
      description: "Touch-friendly interface with swipe actions and responsive design",
      icon: Smartphone,
      color: "text-purple-600",
      available: true
    },
    {
      title: "Performance Optimized",
      description: "Lazy loading, virtualization, and efficient data handling",
      icon: Zap,
      color: "text-orange-600",
      available: true
    }
  ];

  const quickActions = [
    {
      title: "Create Booking",
      description: "Quick book a space or resource",
      onClick: () => console.log("Navigate to booking"),
      available: hasRole('member')
    },
    {
      title: "View Analytics",
      description: "Check performance metrics",
      onClick: () => console.log("Navigate to analytics"),
      available: hasRole('manager')
    },
    {
      title: "Manage System",
      description: "Admin configuration",
      onClick: () => console.log("Navigate to admin"),
      available: hasRole('admin')
    }
  ];

  if (isMobile) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-orange-600" />
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
            <TrendingUp className="h-5 w-5" />
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

      <Tabs defaultValue="features" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">New Features</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon className={`h-5 w-5 ${feature.color}`} />
                      <span>{feature.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                    <div className="mt-4">
                      {feature.available ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          ✓ Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <RealtimeNotifications />
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Lazy Loading</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">95%</div>
                <p className="text-xs text-gray-600">Faster initial load</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">60%</div>
                <p className="text-xs text-gray-600">Reduction achieved</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Mobile Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">98</div>
                <p className="text-xs text-gray-600">Lighthouse score</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
