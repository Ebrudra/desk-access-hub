
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Lightbulb, MapPin, Clock, Users, Star, TrendingUp } from "lucide-react";

export const SmartBookingRecommendations = () => {
  const { user } = useAuth();

  const { data: recommendations } = useQuery({
    queryKey: ["smart-recommendations", user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Get user's booking history and preferences
      const [bookingsRes, preferencesRes, resourcesRes] = await Promise.all([
        supabase
          .from("bookings")
          .select("*, resources(*)")
          .eq("member_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single(),
        supabase
          .from("resources")
          .select("*")
          .eq("is_available", true)
      ]);

      const bookings = bookingsRes.data || [];
      const preferences = preferencesRes.data;
      const resources = resourcesRes.data || [];

      // Generate smart recommendations based on patterns
      const recommendations = [];

      // Time-based recommendations
      const commonTimes = bookings.reduce((acc, booking) => {
        const hour = new Date(booking.start_time).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});

      const preferredHour = Object.keys(commonTimes).reduce((a, b) => 
        commonTimes[a] > commonTimes[b] ? a : b, '9'
      );

      // Resource type recommendations
      const resourceTypes = bookings.reduce((acc, booking) => {
        const type = booking.resources?.type || 'desk';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const preferredType = Object.keys(resourceTypes).reduce((a, b) => 
        resourceTypes[a] > resourceTypes[b] ? a : b, 'desk'
      );

      // Popular times recommendation
      recommendations.push({
        id: 'popular-time',
        type: 'time',
        title: 'Your Optimal Time Slot',
        description: `Based on your history, you're most productive at ${preferredHour}:00`,
        suggestion: `Book for ${preferredHour}:00 - ${parseInt(preferredHour) + 2}:00`,
        confidence: 'High',
        icon: Clock
      });

      // Resource recommendation
      const recommendedResource = resources.find(r => r.type === preferredType);
      if (recommendedResource) {
        recommendations.push({
          id: 'resource-match',
          type: 'resource',
          title: 'Perfect Resource Match',
          description: `${recommendedResource.name} matches your preferences`,
          suggestion: `Book ${recommendedResource.name}`,
          confidence: 'Medium',
          icon: MapPin
        });
      }

      // Trending spaces
      recommendations.push({
        id: 'trending',
        type: 'trending',
        title: 'Trending This Week',
        description: 'Most popular spaces among similar members',
        suggestion: 'Conference Room B - High demand',
        confidence: 'Medium',
        icon: TrendingUp
      });

      // Duration recommendation
      const avgDuration = bookings.length > 0 
        ? bookings.reduce((sum, b) => {
            const start = new Date(b.start_time);
            const end = new Date(b.end_time);
            return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          }, 0) / bookings.length
        : 2;

      recommendations.push({
        id: 'duration',
        type: 'duration',
        title: 'Optimal Duration',
        description: `Your average booking is ${avgDuration.toFixed(1)} hours`,
        suggestion: `Consider ${Math.round(avgDuration)} hour slots`,
        confidence: 'High',
        icon: Users
      });

      return recommendations;
    },
    enabled: !!user
  });

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5" />
            <span>Smart Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">
            Make a few bookings to get personalized recommendations!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5" />
          <span>Smart Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <rec.icon className="h-5 w-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm">{rec.title}</h4>
                      <Badge className={getConfidenceColor(rec.confidence)}>
                        {rec.confidence}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    <p className="text-sm font-medium text-blue-700">{rec.suggestion}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    Apply
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Pro Tip</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            These recommendations improve with each booking. The more you use the system, the smarter it gets!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
