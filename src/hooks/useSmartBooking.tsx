
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./useAuth";

interface BookingPreferences {
  preferred_times?: string[];
  preferred_resource_types?: string[];
  default_duration?: number;
  default_attendees?: number;
}

interface BookingConstraints {
  start_date: string;
  end_date: string;
  resource_types?: string[];
  min_capacity?: number;
  required_amenities?: string[];
}

export const useSmartBooking = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const getSmartRecommendations = useMutation({
    mutationFn: async ({ 
      resourceId, 
      preferences, 
      constraints 
    }: { 
      resourceId?: string; 
      preferences: BookingPreferences; 
      constraints: BookingConstraints; 
    }) => {
      if (!user) throw new Error("User not authenticated");

      setLoading(true);
      
      // Generate smart scheduling recommendations
      const recommendedSlots = await generateRecommendations(
        resourceId, 
        preferences, 
        constraints
      );

      // Store recommendations in database
      const { data, error } = await supabase
        .from("smart_scheduling")
        .insert({
          resource_id: resourceId,
          user_id: user.id,
          recommended_slots: recommendedSlots,
          preferences,
          constraints,
          confidence_score: calculateConfidenceScore(recommendedSlots),
          algorithm_version: "v1.0"
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Smart Recommendations Generated",
        description: "AI-powered booking recommendations are ready",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Recommendation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const { data: userPreferences } = useQuery({
    queryKey: ["user-preferences", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: recentRecommendations } = useQuery({
    queryKey: ["smart-recommendations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("smart_scheduling")
        .select(`
          *,
          resources (name, type, capacity, amenities)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return {
    getSmartRecommendations,
    userPreferences,
    recentRecommendations,
    loading,
  };
};

// AI-powered recommendation algorithm
async function generateRecommendations(
  resourceId: string | undefined,
  preferences: BookingPreferences,
  constraints: BookingConstraints
) {
  // Get available resources
  let resourcesQuery = supabase
    .from("resources")
    .select("*")
    .eq("is_available", true);

  if (resourceId) {
    resourcesQuery = resourcesQuery.eq("id", resourceId);
  }

  if (constraints.resource_types?.length) {
    resourcesQuery = resourcesQuery.in("type", constraints.resource_types);
  }

  if (constraints.min_capacity) {
    resourcesQuery = resourcesQuery.gte("capacity", constraints.min_capacity);
  }

  const { data: resources } = await resourcesQuery;

  // Get existing bookings for the date range
  const { data: existingBookings } = await supabase
    .from("bookings")
    .select("resource_id, start_time, end_time")
    .gte("start_time", constraints.start_date)
    .lte("end_time", constraints.end_date)
    .in("status", ["confirmed", "pending"]);

  const slots = [];

  // Generate time slots for each resource
  for (const resource of resources || []) {
    const resourceSlots = generateTimeSlotsForResource(
      resource,
      constraints,
      preferences,
      existingBookings || []
    );
    slots.push(...resourceSlots);
  }

  // Sort by recommendation score
  return slots.sort((a, b) => b.score - a.score).slice(0, 10);
}

function generateTimeSlotsForResource(
  resource: any,
  constraints: BookingConstraints,
  preferences: BookingPreferences,
  existingBookings: any[]
) {
  const slots = [];
  const duration = preferences.default_duration || 2; // hours
  const startDate = new Date(constraints.start_date);
  const endDate = new Date(constraints.end_date);

  // Generate slots for each day
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    // Business hours: 9 AM to 6 PM
    for (let hour = 9; hour <= 18 - duration; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(hour + duration, 0, 0, 0);

      // Check if slot conflicts with existing bookings
      const hasConflict = existingBookings.some(booking => 
        booking.resource_id === resource.id &&
        (
          (new Date(booking.start_time) <= slotStart && new Date(booking.end_time) > slotStart) ||
          (new Date(booking.start_time) < slotEnd && new Date(booking.end_time) >= slotEnd) ||
          (new Date(booking.start_time) >= slotStart && new Date(booking.end_time) <= slotEnd)
        )
      );

      if (!hasConflict) {
        const score = calculateSlotScore(resource, slotStart, preferences);
        slots.push({
          resource_id: resource.id,
          resource_name: resource.name,
          resource_type: resource.type,
          start_time: slotStart.toISOString(),
          end_time: slotEnd.toISOString(),
          score,
          reasons: generateRecommendationReasons(resource, slotStart, preferences, score)
        });
      }
    }
  }

  return slots;
}

function calculateSlotScore(resource: any, startTime: Date, preferences: BookingPreferences): number {
  let score = 50; // Base score

  // Prefer user's preferred times
  const hour = startTime.getHours();
  const timeOfDay = `${hour}:00`;
  
  if (preferences.preferred_times?.includes(timeOfDay)) {
    score += 30;
  }

  // Prefer user's preferred resource types
  if (preferences.preferred_resource_types?.includes(resource.type)) {
    score += 20;
  }

  // Boost score for peak hours (10 AM - 2 PM)
  if (hour >= 10 && hour <= 14) {
    score += 10;
  }

  // Resource-specific scoring
  if (resource.type === 'meeting_room' && resource.capacity >= 6) {
    score += 15; // Larger meeting rooms are generally preferred
  }

  if (resource.amenities?.includes('projector')) {
    score += 10;
  }

  if (resource.amenities?.includes('whiteboard')) {
    score += 5;
  }

  return Math.min(100, Math.max(0, score));
}

function generateRecommendationReasons(
  resource: any, 
  startTime: Date, 
  preferences: BookingPreferences, 
  score: number
): string[] {
  const reasons = [];

  if (score >= 80) {
    reasons.push("Highly recommended based on your preferences");
  }

  const hour = startTime.getHours();
  if (preferences.preferred_times?.includes(`${hour}:00`)) {
    reasons.push("Matches your preferred time");
  }

  if (preferences.preferred_resource_types?.includes(resource.type)) {
    reasons.push("Matches your preferred resource type");
  }

  if (hour >= 10 && hour <= 14) {
    reasons.push("Prime booking hours");
  }

  if (resource.amenities?.length > 0) {
    reasons.push(`Includes amenities: ${resource.amenities.join(', ')}`);
  }

  return reasons;
}

function calculateConfidenceScore(slots: any[]): number {
  if (slots.length === 0) return 0;
  
  const avgScore = slots.reduce((sum, slot) => sum + slot.score, 0) / slots.length;
  return Math.round(avgScore);
}
