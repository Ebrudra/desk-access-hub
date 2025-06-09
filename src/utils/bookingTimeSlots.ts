
import { BookingSuggestion } from './bookingUtils';

type DatabaseSpace = {
  id: string;
  name: string;
  amenities?: string[] | null;
  capacity?: number | null;
};

type DatabaseBooking = {
  id: string;
  resource_id: string | null;
  start_time: string;
  end_time: string;
  created_at: string | null;
};

export const generateTimeSlots = (
  date: string, 
  duration: number, 
  bookings: DatabaseBooking[], 
  spaceId: string
) => {
  const slots = [];
  const spaceBookings = bookings.filter(b => b.resource_id === spaceId);
  
  // Generate hourly slots from 8 AM to 8 PM
  for (let hour = 8; hour <= 20 - duration; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + duration).toString().padStart(2, '0')}:00`;
    
    // Check if slot is available
    const isAvailable = !spaceBookings.some(booking => {
      const bookingStart = new Date(booking.start_time).getHours();
      const bookingEnd = new Date(booking.end_time).getHours();
      return (bookingStart <= hour && bookingEnd > hour) ||
             (bookingStart < hour + duration && bookingEnd >= hour + duration) ||
             (bookingStart >= hour && bookingEnd <= hour + duration);
    });

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

export const calculateConfidence = (space: DatabaseSpace, amenities?: string[], hour?: number): number => {
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

  return Math.min(1, Math.max(0, confidence));
};

export const generateReason = (space: DatabaseSpace, confidence: number, hour?: number): string => {
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

  return reasons.length > 0 ? reasons.join(', ') : "Available space";
};

export const generateBookingSuggestionsForSpace = (
  space: DatabaseSpace,
  date: string,
  duration: number,
  bookings: DatabaseBooking[],
  amenities?: string[]
): BookingSuggestion[] => {
  const timeSlots = generateTimeSlots(date, duration, bookings, space.id);
  const suggestions: BookingSuggestion[] = [];
  
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

  return suggestions;
};
