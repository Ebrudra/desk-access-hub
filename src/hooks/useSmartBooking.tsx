
import { useToast } from '@/hooks/use-toast';
import { BookingSuggestion, ConflictResolution, fetchSpacesForBooking, fetchBookingsForDate, detectBookingConflicts, calculateDuration } from '@/utils/bookingUtils';
import { generateBookingSuggestionsForSpace } from '@/utils/bookingTimeSlots';

export const useSmartBooking = () => {
  const { toast } = useToast();

  const generateBookingSuggestions = async (
    date: string,
    duration: number,
    capacity?: number,
    amenities?: string[]
  ): Promise<BookingSuggestion[]> => {
    try {
      // Fetch available spaces and bookings for the date
      const [spaces, bookings] = await Promise.all([
        fetchSpacesForBooking(),
        fetchBookingsForDate(date)
      ]);

      const suggestions: BookingSuggestion[] = [];

      for (const space of spaces) {
        const spaceSuggestions = generateBookingSuggestionsForSpace(
          space,
          date,
          duration,
          bookings,
          amenities
        );
        suggestions.push(...spaceSuggestions);
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

  const detectConflicts = async (bookingData: {
    id: string;
    resource_id: string;
    start_time: string;
    end_time: string;
  }): Promise<ConflictResolution | null> => {
    try {
      const conflicts = await detectBookingConflicts(bookingData);

      if (conflicts.length > 0) {
        const suggestions = await generateBookingSuggestions(
          bookingData.start_time.split('T')[0],
          calculateDuration(bookingData.start_time, bookingData.end_time),
          undefined,
          []
        );

        return {
          bookingId: bookingData.id,
          suggestions: suggestions.filter(s => s.spaceId !== bookingData.resource_id)
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
