
-- Create subscribers table for Stripe subscription management
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table for one-time payments
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER,
  currency TEXT DEFAULT 'usd',
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create email_templates table for notification management
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create notification_logs table for tracking sent notifications
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  channel TEXT NOT NULL, -- 'email', 'sms', 'push'
  recipient TEXT NOT NULL,
  subject TEXT,
  content TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  provider_response JSONB,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create calendar_integrations table for external calendar sync
CREATE TABLE IF NOT EXISTS public.calendar_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'google', 'outlook', 'apple'
  provider_account_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  calendar_id TEXT,
  sync_enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'active', -- 'active', 'error', 'disabled'
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_integrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscribers
CREATE POLICY "Users can view own subscription" ON public.subscribers
  FOR SELECT USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Insert subscription info" ON public.subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Update subscription info" ON public.subscribers
  FOR UPDATE USING (true);

-- Create RLS policies for orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Insert order" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Update order" ON public.orders
  FOR UPDATE USING (true);

-- Create RLS policies for email_templates (admin only)
CREATE POLICY "Admin can manage email templates" ON public.email_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for notification_logs
CREATE POLICY "Users can view own notifications" ON public.notification_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Insert notification log" ON public.notification_logs
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for calendar_integrations
CREATE POLICY "Users can manage own calendar integrations" ON public.calendar_integrations
  FOR ALL USING (user_id = auth.uid());

-- Insert default email templates
INSERT INTO public.email_templates (name, subject, html_content, variables) VALUES
  ('booking_confirmation', 'Booking Confirmation - {{booking_title}}', 
   '<h1>Booking Confirmed</h1><p>Dear {{user_name}},</p><p>Your booking for {{booking_title}} has been confirmed.</p><p><strong>Details:</strong></p><ul><li>Date: {{start_time}}</li><li>Duration: {{duration}}</li><li>Location: {{location}}</li></ul><p>Thank you!</p>', 
   '{"user_name": "string", "booking_title": "string", "start_time": "string", "duration": "string", "location": "string"}'),
  
  ('booking_reminder', 'Reminder: Your booking is tomorrow - {{booking_title}}', 
   '<h1>Booking Reminder</h1><p>Dear {{user_name}},</p><p>This is a reminder that you have a booking tomorrow:</p><p><strong>{{booking_title}}</strong></p><p>Time: {{start_time}}</p><p>Location: {{location}}</p>', 
   '{"user_name": "string", "booking_title": "string", "start_time": "string", "location": "string"}'),
   
  ('payment_receipt', 'Payment Receipt - {{amount}}', 
   '<h1>Payment Receipt</h1><p>Dear {{user_name}},</p><p>Thank you for your payment of {{amount}}.</p><p><strong>Transaction Details:</strong></p><ul><li>Amount: {{amount}}</li><li>Date: {{payment_date}}</li><li>Description: {{description}}</li></ul>', 
   '{"user_name": "string", "amount": "string", "payment_date": "string", "description": "string"}');
