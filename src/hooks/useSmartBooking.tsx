
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookingSuggestion {
  spaceId: string;
  spaceName: string;
  startTime: string;
  endTime: string;
  confidence: number;
  reason: string;
}

interface ConflictResolution {
  bookingId: string;
  suggestions: BookingSuggestion[];
}

interface SpaceData {
  id: string;
  name: string;
  capacity?: number;
  amenities?: string[];
}

interface BookingData {
  id: string;
  space_id: string;
  date: string;
  start_time: string;
  end_time: string;
}

export const useSmartBooking = () => {
  const { toast } = useToast();

  const generateBookingSuggestions = async (
    date: string,
    duration: number,
    capacity?: number,
    amenities?: string[]
  ): Promise<BookingSuggestion[]> => {
    try {
      // Fetch available spaces for the date
      const { data: spaces, error: spacesError } = await supabase
        .from('spaces')
        .select('*')
        .gte('capacity', capacity || 1);

      if (spacesError) throw spacesError;

      // Fetch existing bookings for the date
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', date);

      if (bookingsError) throw bookingsError;

      const suggestions: BookingSuggestion[] = [];

      for (const space of (spaces || []) as SpaceData[]) {
        // Find available time slots
        const timeSlots = generateTimeSlots(date, duration, bookings as BookingData[], space.id);
        
        for (const slot of timeSlots) {
          const confidence = calculateConfidence(space, amenities, slot.hour);
          
          suggestions.push({
            spaceId: space.id,
            spaceName: space.name,
            startTime: slot.start,
            endTime: slot.end,
            confidence,
            reason: generateReason(space, confidence, slot.hour)
          });
        }
      }

      // Sort by confidence and return top suggestions
      return suggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);

    } catch (error) {
      console.error('Error generating booking suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to generate booking suggestions",
        variant: "destructive"
      });
      return [];
    }
  };

  const detectConflicts = async (bookingData: BookingData): Promise<ConflictResolution | null> => {
    try {
      const { data: conflicts, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('space_id', bookingData.space_id)
        .eq('date', bookingData.date)
        .or(`start_time.lte.${bookingData.end_time},end_time.gte.${bookingData.start_time}`);

      if (error) throw error;

      if (conflicts && conflicts.length > 0) {
        const suggestions = await generateBookingSuggestions(
          bookingData.date,
          calculateDuration(bookingData.start_time, bookingData.end_time),
          undefined,
          []
        );

        return {
          bookingId: bookingData.id,
          suggestions: suggestions.filter(s => s.spaceId !== bookingData.space_id)
        };
      }

      return null;
    } catch (error) {
      console.error('Error detecting conflicts:', error);
      return null;
    }
  };

  return {
    generateBookingSuggestions,
    detectConflicts
  };
};

// Helper functions
const generateTimeSlots = (date: string, duration: number, bookings: BookingData[], spaceId: string) => {
  const slots = [];
  const spaceBookings = bookings.filter(b => b.space_id === spaceId);
  
  // Generate hourly slots from 8 AM to 8 PM
  for (let hour = 8; hour <= 20 - duration; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + duration).toString().padStart(2, '0')}:00`;
    
    // Check if slot is available
    const isAvailable = !spaceBookings.some(booking => 
      (booking.start_time <= startTime && booking.end_time > startTime) ||
      (booking.start_time < endTime && booking.end_time >= endTime) ||
      (booking.start_time >= startTime && booking.end_time <= endTime)
    );

    if (isAvailable) {
      slots.push({
        start: `${date}T${startTime}`,
        end: `${date}T${endTime}`,
        hour
      });
    }
  }

  return slots;
};

const calculateConfidence = (space: SpaceData, amenities?: string[], hour?: number): number => {
  let confidence = 0.5; // Base confidence

  // Time-based scoring
  if (hour) {
    if (hour >= 9 && hour <= 11) confidence += 0.2; // Morning peak
    if (hour >= 14 && hour <= 16) confidence += 0.15; // Afternoon peak
    if (hour < 8 || hour > 18) confidence -= 0.1; // Off hours
  }

  // Amenity matching
  if (amenities && space.amenities) {
    const matchCount = amenities.filter(a => space.amenities!.includes(a)).length;
    confidence += (matchCount / amenities.length) * 0.3;
  }

  // Capacity utilization (prefer 70-90% utilization)
  if (space.capacity) {
    confidence += 0.1; // Bonus for having capacity info
  }

  return Math.min(1, Math.max(0, confidence));
};

const generateReason = (space: SpaceData, confidence: number, hour?: number): string => {
  const reasons = [];
  
  if (confidence > 0.8) {
    reasons.push("Highly recommended");
  }
  
  if (hour && hour >= 9 && hour <= 11) {
    reasons.push("Popular morning time slot");
  }
  
  if (space.amenities && space.amenities.length > 0) {
    reasons.push(`Includes ${space.amenities.slice(0, 2).join(', ')}`);
  }
  
  if (space.capacity) {
    reasons.push(`Capacity for ${space.capacity} people`);
  }

  return reasons.length > 0 ? reasons.join(', ') : "Available space";
};

const calculateDuration = (startTime: string, endTime: string): number => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Duration in hours
};
