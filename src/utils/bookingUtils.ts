
import { supabase } from '@/integrations/supabase/client';

export interface BookingSuggestion {
  spaceId: string;
  spaceName: string;
  startTime: string;
  endTime: string;
  confidence: number;
  reason: string;
}

export interface ConflictResolution {
  bookingId: string;
  suggestions: BookingSuggestion[];
}

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

export const fetchSpacesForBooking = async (): Promise<DatabaseSpace[]> => {
  const { data: spaces, error } = await supabase
    .from('spaces')
    .select('id, name, amenities')
    .gte('id', '00000000-0000-0000-0000-000000000000');

  if (error) throw error;
  return spaces || [];
};

export const fetchBookingsForDate = async (date: string): Promise<DatabaseBooking[]> => {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, resource_id, start_time, end_time, created_at')
    .gte('start_time', `${date}T00:00:00`)
    .lt('start_time', `${date}T23:59:59`);

  if (error) throw error;
  return bookings || [];
};

export const detectBookingConflicts = async (bookingData: {
  id: string;
  resource_id: string;
  start_time: string;
  end_time: string;
}): Promise<DatabaseBooking[]> => {
  const { data: conflicts, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('resource_id', bookingData.resource_id)
    .gte('start_time', bookingData.start_time.split('T')[0] + 'T00:00:00')
    .lt('start_time', bookingData.start_time.split('T')[0] + 'T23:59:59');

  if (error) throw error;
  return conflicts || [];
};

export const calculateDuration = (startTime: string, endTime: string): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Duration in hours
};
