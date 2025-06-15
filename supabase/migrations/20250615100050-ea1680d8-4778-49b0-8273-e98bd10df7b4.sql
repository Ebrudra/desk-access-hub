
-- Create access_codes table for managing booking access codes
CREATE TABLE public.access_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  qr_code_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_preferences table for storing user booking preferences
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  preferred_resource_types TEXT[] DEFAULT '{}',
  preferred_times TEXT[] DEFAULT '{}',
  default_duration INTEGER DEFAULT 2,
  notification_settings JSONB DEFAULT '{"booking_reminders": true, "booking_confirmations": true, "promotional_emails": false}',
  favorite_resources TEXT[] DEFAULT '{}',
  default_attendees INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for access_codes
CREATE POLICY "Users can view their own access codes" 
  ON public.access_codes 
  FOR SELECT 
  USING (auth.uid() = member_id);

CREATE POLICY "Users can create their own access codes" 
  ON public.access_codes 
  FOR INSERT 
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Users can update their own access codes" 
  ON public.access_codes 
  FOR UPDATE 
  USING (auth.uid() = member_id);

CREATE POLICY "Users can delete their own access codes" 
  ON public.access_codes 
  FOR DELETE 
  USING (auth.uid() = member_id);

-- Create RLS policies for user_preferences
CREATE POLICY "Users can view their own preferences" 
  ON public.user_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" 
  ON public.user_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON public.user_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" 
  ON public.user_preferences 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_access_codes_member_id ON public.access_codes(member_id);
CREATE INDEX idx_access_codes_booking_id ON public.access_codes(booking_id);
CREATE INDEX idx_access_codes_expires_at ON public.access_codes(expires_at);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
