
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, Users, MapPin, Star, TrendingUp } from "lucide-react";
import { format, addDays, isAfter, isBefore, addHours } from "date-fns";

interface SmartSuggestion {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceType: string;
  suggestedTime: Date;
  duration: number;
  capacity: number;
  confidence: number;
  reason: string;
  price: number;
  advantages: string[];
}

interface SmartBookingSuggestionsProps {
  preferences?: {
    resourceType?: string;
    capacity?: number;
    duration?: number;
    timePreference?: 'morning' | 'afternoon' | 'evening';
    budget?: number;
  };
  onSelectSuggestion?: (suggestion: SmartSuggestion) => void;
}

export const SmartBookingSuggestions = ({ 
  preferences = {}, 
  onSelectSuggestion 
}: SmartBookingSuggestionsProps) => {
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["smart-suggestions", preferences],
    queryFn: async () => {
      // Fetch resources and bookings
      const [resourcesRes, bookingsRes] = await Promise.all([
        supabase.from("resources").select("*").eq("is_available", true),
        supabase.from("bookings").select("*").gte("start_time", new Date().toISOString())
      ]);

      const resources = resourcesRes.data || [];
      const bookings = bookingsRes.data || [];

      // Generate smart suggestions
      const suggestions: SmartSuggestion[] = [];
      const now = new Date();
      const tomorrow = addDays(now, 1);
      const weekFromNow = addDays(now, 7);

      for (const resource of resources) {
        // Filter by preferences
        if (preferences.resourceType && resource.type !== preferences.resourceType) continue;
        if (preferences.capacity && resource.capacity < preferences.capacity) continue;

        // Find available time slots
        const timeSlots = generateTimeSlots(tomorrow, weekFromNow, preferences.timePreference);
        
        for (const timeSlot of timeSlots) {
          const duration = preferences.duration || 2; // Default 2 hours
          const endTime = addHours(timeSlot, duration);
          
          // Check if slot is available
          const isAvailable = !bookings.some(booking => 
            booking.resource_id === resource.id &&
            ((timeSlot >= new Date(booking.start_time) && timeSlot < new Date(booking.end_time)) ||
             (endTime > new Date(booking.start_time) && endTime <= new Date(booking.end_time)))
          );

          if (isAvailable) {
            const suggestion = createSuggestion(resource, timeSlot, duration, bookings, preferences);
            if (suggestion.confidence > 0.3) { // Only show suggestions with decent confidence
              suggestions.push(suggestion);
            }
          }
        }
      }

      // Sort by confidence and return top 6
      return suggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 6);
    }
  });

  const generateTimeSlots = (start: Date, end: Date, timePreference?: string) => {
    const slots: Date[] = [];
    const current = new Date(start);
    current.setHours(9, 0, 0, 0); // Start at 9 AM

    while (current <= end) {
      const hour = current.getHours();
      
      // Filter by time preference
      if (!timePreference || 
          (timePreference === 'morning' && hour >= 9 && hour < 12) ||
          (timePreference === 'afternoon' && hour >= 12 && hour < 17) ||
          (timePreference === 'evening' && hour >= 17 && hour < 20)) {
        slots.push(new Date(current));
      }
      
      current.setHours(current.getHours() + 1);
      
      // Move to next day at end of business hours
      if (current.getHours() >= 20) {
        current.setDate(current.getDate() + 1);
        current.setHours(9, 0, 0, 0);
      }
    }
    
    return slots;
  };

  const createSuggestion = (
    resource: any, 
    timeSlot: Date, 
    duration: number, 
    bookings: any[], 
    preferences: any
  ): SmartSuggestion => {
    let confidence = 0.5; // Base confidence
    const advantages: string[] = [];
    
    // Boost confidence based on factors
    const hour = timeSlot.getHours();
    
    // Popular times boost
    const popularBookings = bookings.filter(b => 
      b.resource_id === resource.id && 
      new Date(b.start_time).getHours() === hour
    );
    if (popularBookings.length > 2) {
      confidence += 0.2;
      advantages.push("Popular time slot");
    }

    // Capacity match
    if (preferences.capacity && resource.capacity >= preferences.capacity * 1.2) {
      confidence += 0.15;
      advantages.push("Spacious for your needs");
    }

    // Off-peak pricing advantage
    if (hour < 10 || hour > 16) {
      confidence += 0.1;
      advantages.push("Off-peak hours");
    }

    // Resource type exact match
    if (preferences.resourceType === resource.type) {
      confidence += 0.2;
      advantages.push("Perfect resource type");
    }

    // Budget consideration
    const estimatedPrice = (resource.hourly_rate || 20) * duration;
    if (!preferences.budget || estimatedPrice <= preferences.budget) {
      confidence += 0.1;
      if (preferences.budget && estimatedPrice < preferences.budget * 0.8) {
        advantages.push("Under budget");
      }
    } else {
      confidence -= 0.3; // Penalty for over budget
    }

    // Determine reason
    let reason = "Available time slot";
    if (confidence > 0.7) reason = "Highly recommended";
    else if (confidence > 0.5) reason = "Good match";
    else if (advantages.length > 0) reason = "Suitable option";

    return {
      id: `${resource.id}-${timeSlot.getTime()}`,
      resourceId: resource.id,
      resourceName: resource.name,
      resourceType: resource.type,
      suggestedTime: timeSlot,
      duration,
      capacity: resource.capacity,
      confidence: Math.min(confidence, 1),
      reason,
      price: estimatedPrice,
      advantages
    };
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800";
    if (confidence >= 0.6) return "bg-blue-100 text-blue-800";
    if (confidence >= 0.4) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <Star className="h-4 w-4" />;
    if (confidence >= 0.6) return <TrendingUp className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Smart Booking Suggestions</CardTitle>
          <CardDescription>Finding the best options for you...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Smart Booking Suggestions
        </CardTitle>
        <CardDescription>
          AI-powered recommendations based on your preferences and booking patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions?.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions available</h3>
            <p className="text-gray-500">Try adjusting your preferences or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions?.map((suggestion) => (
              <Card key={suggestion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{suggestion.resourceName}</h4>
                      <p className="text-sm text-gray-500 capitalize">
                        {suggestion.resourceType.replace('_', ' ')}
                      </p>
                    </div>
                    <Badge className={getConfidenceColor(suggestion.confidence)}>
                      {getConfidenceIcon(suggestion.confidence)}
                      <span className="ml-1">{Math.round(suggestion.confidence * 100)}%</span>
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(suggestion.suggestedTime, 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {format(suggestion.suggestedTime, 'h:mm a')} - {format(addHours(suggestion.suggestedTime, suggestion.duration), 'h:mm a')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      Up to {suggestion.capacity} people
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      ${suggestion.price.toFixed(2)} total
                    </div>
                  </div>

                  {suggestion.advantages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-1">Advantages:</p>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.advantages.map((advantage, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {advantage}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    variant={suggestion.confidence >= 0.7 ? "default" : "outline"}
                    onClick={() => onSelectSuggestion?.(suggestion)}
                  >
                    Book This Slot
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
