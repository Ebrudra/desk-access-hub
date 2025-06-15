
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

export const SmartBookingDashboard = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<BookingPreferencesType>({});

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

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Brain className="h-8 w-8 text-blue-600" />
          Smart Booking Assistant
        </h1>
        <p className="text-gray-600">
          Get AI-powered recommendations for your perfect workspace booking
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
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
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="suggestions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suggestions">Smart Suggestions</TabsTrigger>
          <TabsTrigger value="preferences">My Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-6">
          <SmartBookingSuggestions 
            preferences={preferences}
            onSelectSuggestion={handleSelectSuggestion}
          />
          
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Need something specific?
              </h3>
              <p className="text-gray-600 mb-4">
                Browse all available resources or create a custom booking
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/?tab=resources')}
                >
                  Browse All Resources
                </Button>
                <Button 
                  onClick={() => navigate('/new-booking')}
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
              <CardTitle>How Smart Suggestions Work</CardTitle>
              <CardDescription>
                Our AI analyzes multiple factors to recommend the best booking options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Factors We Consider:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Your stated preferences</li>
                    <li>• Resource availability</li>
                    <li>• Popular booking times</li>
                    <li>• Budget constraints</li>
                    <li>• Capacity requirements</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Confidence Levels:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
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
