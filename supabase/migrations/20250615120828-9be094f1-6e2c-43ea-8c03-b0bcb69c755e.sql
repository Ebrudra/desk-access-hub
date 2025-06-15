
-- Create audit_logs table for security monitoring
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  severity TEXT DEFAULT 'info', -- 'info', 'warning', 'error', 'critical'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create system_settings table for platform configuration
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create automated_tasks table for business logic automation
CREATE TABLE IF NOT EXISTS public.automated_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'access_code_generation', 'booking_reminder', 'cleanup', etc.
  schedule_expression TEXT, -- cron expression
  is_active BOOLEAN DEFAULT true,
  configuration JSONB DEFAULT '{}',
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  run_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create performance_metrics table for monitoring
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type TEXT NOT NULL, -- 'counter', 'gauge', 'histogram'
  labels JSONB DEFAULT '{}',
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create error_logs table for comprehensive error tracking
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  request_url TEXT,
  request_method TEXT,
  request_headers JSONB,
  response_status INTEGER,
  severity TEXT DEFAULT 'error', -- 'warning', 'error', 'critical'
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create smart_scheduling table for AI-powered resource scheduling
CREATE TABLE IF NOT EXISTS public.smart_scheduling (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recommended_slots JSONB NOT NULL, -- array of time slots with scores
  preferences JSONB DEFAULT '{}',
  constraints JSONB DEFAULT '{}',
  algorithm_version TEXT DEFAULT 'v1.0',
  confidence_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '24 hours')
);

-- Enable Row Level Security
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automated_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_scheduling ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audit_logs (admin only)
CREATE POLICY "Admin can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for system_settings
CREATE POLICY "Admin can manage system settings" ON public.system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public settings readable by all" ON public.system_settings
  FOR SELECT USING (is_public = true);

-- Create RLS policies for automated_tasks (admin only)
CREATE POLICY "Admin can manage automated tasks" ON public.automated_tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for performance_metrics (admin only)
CREATE POLICY "Admin can view performance metrics" ON public.performance_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert metrics" ON public.performance_metrics
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for error_logs (admin only)
CREATE POLICY "Admin can manage error logs" ON public.error_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert error logs" ON public.error_logs
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for smart_scheduling
CREATE POLICY "Users can view own scheduling recommendations" ON public.smart_scheduling
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage scheduling recommendations" ON public.smart_scheduling
  FOR ALL WITH CHECK (true);

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description, category, is_public) VALUES
  ('access_code_expiry_hours', '24', 'Default expiry time for access codes in hours', 'security', true),
  ('max_booking_duration_hours', '8', 'Maximum booking duration in hours', 'booking', true),
  ('advance_booking_days', '30', 'How many days in advance users can book', 'booking', true),
  ('automatic_cleanup_enabled', 'true', 'Enable automatic cleanup of expired data', 'maintenance', false),
  ('performance_monitoring_enabled', 'true', 'Enable performance monitoring', 'monitoring', false),
  ('audit_log_retention_days', '90', 'How long to keep audit logs', 'security', false);

-- Insert default automated tasks
INSERT INTO public.automated_tasks (name, type, schedule_expression, configuration) VALUES
  ('Generate Access Codes', 'access_code_generation', '0 6 * * *', '{"generate_for_todays_bookings": true}'),
  ('Send Booking Reminders', 'booking_reminder', '0 18 * * *', '{"hours_before": 24}'),
  ('Cleanup Expired Data', 'cleanup', '0 2 * * *', '{"cleanup_access_codes": true, "cleanup_old_logs": true}'),
  ('Performance Metrics Collection', 'metrics_collection', '*/15 * * * *', '{"collect_system_metrics": true}');
