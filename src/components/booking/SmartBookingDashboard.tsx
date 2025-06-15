
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { BookingPreferences, type BookingPreferences as BookingPreferencesType } from "./BookingPreferences";
import { SmartBookingSuggestions } from "./SmartBookingSuggestions";
import { Brain, Calendar, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

export const SmartBookingDashboard = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<BookingPreferencesType>({});
  const isMobile = useIsMobile();

  // Quick stats for the dashboard
  const { data: stats } = useQuery({
    queryKey: ["booking-stats"],
    queryFn: async () => {
      const [resourcesRes, bookingsRes] = await Promise.all([
        supabase.from("resources").select("*").eq("is_available", true),
        supabase.from("bookings").select("*").gte("start_time", new Date().toISOString())
      ]);

      const resources = resourcesRes.data || [];
      const upcomingBookings = bookingsRes.data || [];
      
      const availableNow = resources.filter(r => {
        const now = new Date();
        const hasConflict = upcomingBookings.some(b => 
          b.resource_id === r.id &&
          new Date(b.start_time) <= now &&
          new Date(b.end_time) > now
        );
        return !hasConflict;
      }).length;

      return {
        totalResources: resources.length,
        availableNow,
        upcomingBookings: upcomingBookings.length,
        utilizationRate: Math.round(((resources.length - availableNow) / resources.length) * 100) || 0
      };
    }
  });

  const handleSelectSuggestion = (suggestion: any) => {
    // Navigate to booking form with pre-filled data
    const searchParams = new URLSearchParams({
      resourceId: suggestion.resourceId,
      startTime: suggestion.suggestedTime.toISOString(),
      duration: suggestion.duration.toString(),
      preselected: 'true'
    });
    
    navigate(`/new-booking?${searchParams.toString()}`);
  };

  const statsData = [
    {
      title: "Available Now",
      value: stats?.availableNow || 0,
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Total Resources",
      value: stats?.totalResources || 0,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Upcoming Bookings",
      value: stats?.upcomingBookings || 0,
      icon: TrendingUp,
      color: "text-orange-600"
    },
    {
      title: "Utilization Rate",
      value: `${stats?.utilizationRate || 0}%`,
      icon: Brain,
      color: "text-purple-600"
    }
  ];

  return (
    <div className={`space-y-6 ${isMobile ? 'px-0' : 'container mx-auto px-4 py-8'}`}>
      {!isMobile && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            Smart Booking Assistant
          </h1>
          <p className="text-gray-600">
            Get AI-powered recommendations for your perfect workspace booking
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className={`grid gap-4 mb-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-4'}`}>
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardContent className={isMobile ? "p-3" : "p-4"}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {stat.title}
                  </p>
                  <p className={`font-bold ${stat.color} ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`${stat.color} ${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="suggestions" className="space-y-6">
        <TabsList className={`grid w-full grid-cols-2 ${isMobile ? 'h-10' : ''}`}>
          <TabsTrigger value="suggestions" className={isMobile ? 'text-sm' : ''}>
            Smart Suggestions
          </TabsTrigger>
          <TabsTrigger value="preferences" className={isMobile ? 'text-sm' : ''}>
            My Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-6">
          <SmartBookingSuggestions 
            preferences={preferences}
            onSelectSuggestion={handleSelectSuggestion}
          />
          
          <Card>
            <CardContent className={isMobile ? "p-4 text-center" : "p-6 text-center"}>
              <h3 className={`font-medium text-gray-900 mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
                Need something specific?
              </h3>
              <p className={`text-gray-600 mb-4 ${isMobile ? 'text-sm' : ''}`}>
                Browse all available resources or create a custom booking
              </p>
              <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'justify-center'}`}>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/?tab=resources')}
                  className={isMobile ? 'w-full' : ''}
                >
                  Browse All Resources
                </Button>
                <Button 
                  onClick={() => navigate('/new-booking')}
                  className={isMobile ? 'w-full' : ''}
                >
                  Manual Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <BookingPreferences 
            onPreferencesChange={setPreferences}
            initialPreferences={preferences}
          />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className={isMobile ? 'text-lg' : ''}>
                How Smart Suggestions Work
              </CardTitle>
              <CardDescription className={isMobile ? 'text-sm' : ''}>
                Our AI analyzes multiple factors to recommend the best booking options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                <div className="space-y-3">
                  <h4 className={`font-medium ${isMobile ? 'text-sm' : ''}`}>
                    Factors We Consider:
                  </h4>
                  <ul className={`space-y-1 text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    <li>• Your stated preferences</li>
                    <li>• Resource availability</li>
                    <li>• Popular booking times</li>
                    <li>• Budget constraints</li>
                    <li>• Capacity requirements</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className={`font-medium ${isMobile ? 'text-sm' : ''}`}>
                    Confidence Levels:
                  </h4>
                  <ul className={`space-y-1 text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    <li>🌟 80%+ Highly recommended</li>
                    <li>📈 60%+ Good match</li>
                    <li>⏰ 40%+ Suitable option</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
