
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AUTOMATED-TASKS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { taskType, parameters } = await req.json();
    logStep("Processing task", { taskType, parameters });

    let result;

    switch (taskType) {
      case 'access_code_generation':
        result = await generateAccessCodes(supabaseClient, parameters);
        break;
      case 'booking_reminder':
        result = await sendBookingReminders(supabaseClient, parameters);
        break;
      case 'cleanup':
        result = await cleanupExpiredData(supabaseClient, parameters);
        break;
      case 'metrics_collection':
        result = await collectMetrics(supabaseClient, parameters);
        break;
      default:
        throw new Error(`Unknown task type: ${taskType}`);
    }

    // Update task execution stats
    await updateTaskStats(supabaseClient, taskType, true);

    logStep("Task completed successfully", result);
    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in automated-tasks", { message: errorMessage });
    
    // Log error to database
    await logError(error, req);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function generateAccessCodes(supabase: any, parameters: any) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  // Get bookings for tomorrow that don't have access codes
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      id, member_id, start_time, end_time,
      members!inner(id, user_id)
    `)
    .gte('start_time', tomorrow.toISOString())
    .lt('start_time', dayAfter.toISOString())
    .eq('status', 'confirmed');

  if (error) throw error;

  const accessCodes = [];
  
  for (const booking of bookings || []) {
    // Check if access code already exists
    const { data: existingCode } = await supabase
      .from('access_codes')
      .select('id')
      .eq('booking_id', booking.id)
      .single();

    if (!existingCode) {
      const code = generateRandomCode();
      const expiresAt = new Date(booking.end_time);
      expiresAt.setHours(expiresAt.getHours() + 2); // 2 hours after booking ends

      const { data: accessCode, error: codeError } = await supabase
        .from('access_codes')
        .insert({
          booking_id: booking.id,
          member_id: booking.member_id,
          code: code,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (codeError) throw codeError;
      accessCodes.push(accessCode);
    }
  }

  return { generated: accessCodes.length, codes: accessCodes };
}

async function sendBookingReminders(supabase: any, parameters: any) {
  const hoursBeforeReminder = parameters.hours_before || 24;
  const reminderTime = new Date();
  reminderTime.setHours(reminderTime.getHours() + hoursBeforeReminder);
  
  const endTime = new Date(reminderTime);
  endTime.setHours(endTime.getHours() + 1);

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      id, title, start_time, 
      members!inner(id, user_id, profiles!inner(first_name, last_name, id))
    `)
    .gte('start_time', reminderTime.toISOString())
    .lt('start_time', endTime.toISOString())
    .eq('status', 'confirmed');

  if (error) throw error;

  const reminders = [];
  
  for (const booking of bookings || []) {
    // Send notification using the send-notification function
    try {
      const { error: notificationError } = await supabase.functions.invoke('send-notification', {
        body: {
          type: 'email',
          templateName: 'booking_reminder',
          recipient: booking.members.profiles.id, // This will be resolved to email in the function
          variables: {
            user_name: `${booking.members.profiles.first_name} ${booking.members.profiles.last_name}`,
            booking_title: booking.title || 'Your Booking',
            start_time: new Date(booking.start_time).toLocaleString(),
            location: 'Workspace'
          }
        }
      });

      if (!notificationError) {
        reminders.push(booking.id);
      }
    } catch (error) {
      console.error('Failed to send reminder for booking:', booking.id, error);
    }
  }

  return { sent: reminders.length, bookings: reminders };
}

async function cleanupExpiredData(supabase: any, parameters: any) {
  const results = {};

  if (parameters.cleanup_access_codes) {
    const { error } = await supabase
      .from('access_codes')
      .delete()
      .lt('expires_at', new Date().toISOString());
    
    if (error) throw error;
    results.access_codes_cleaned = true;
  }

  if (parameters.cleanup_old_logs) {
    const retentionDays = 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const { error: auditError } = await supabase
      .from('audit_logs')
      .delete()
      .lt('created_at', cutoffDate.toISOString());

    const { error: errorLogError } = await supabase
      .from('error_logs')
      .delete()
      .lt('created_at', cutoffDate.toISOString())
      .eq('resolved', true);

    if (auditError || errorLogError) throw auditError || errorLogError;
    results.old_logs_cleaned = true;
  }

  return results;
}

async function collectMetrics(supabase: any, parameters: any) {
  const now = new Date().toISOString();
  const metrics = [];

  // Collect basic system metrics
  const { data: activeBookings } = await supabase
    .from('bookings')
    .select('id', { count: 'exact' })
    .eq('status', 'confirmed')
    .gte('start_time', now);

  const { data: totalMembers } = await supabase
    .from('members')
    .select('id', { count: 'exact' })
    .eq('membership_status', 'active');

  const { data: todayBookings } = await supabase
    .from('bookings')
    .select('id', { count: 'exact' })
    .gte('start_time', new Date().toISOString().split('T')[0])
    .lt('start_time', new Date(Date.now() + 86400000).toISOString().split('T')[0]);

  metrics.push(
    { metric_name: 'active_bookings', metric_value: activeBookings?.length || 0, metric_type: 'gauge' },
    { metric_name: 'total_active_members', metric_value: totalMembers?.length || 0, metric_type: 'gauge' },
    { metric_name: 'today_bookings', metric_value: todayBookings?.length || 0, metric_type: 'counter' }
  );

  // Insert metrics
  const { error } = await supabase
    .from('performance_metrics')
    .insert(metrics);

  if (error) throw error;

  return { metrics_collected: metrics.length };
}

async function updateTaskStats(supabase: any, taskType: string, success: boolean) {
  const { data: task } = await supabase
    .from('automated_tasks')
    .select('id, run_count, success_count, failure_count')
    .eq('type', taskType)
    .single();

  if (task) {
    const updates = {
      last_run_at: new Date().toISOString(),
      run_count: (task.run_count || 0) + 1,
    };

    if (success) {
      updates.success_count = (task.success_count || 0) + 1;
    } else {
      updates.failure_count = (task.failure_count || 0) + 1;
    }

    await supabase
      .from('automated_tasks')
      .update(updates)
      .eq('id', task.id);
  }
}

function generateRandomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function logError(error: any, req: Request) {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseClient.from('error_logs').insert({
      error_type: 'automated_task_error',
      error_message: error.message || String(error),
      stack_trace: error.stack,
      request_url: req.url,
      request_method: req.method,
      severity: 'error'
    });
  } catch (logError) {
    console.error('Failed to log error:', logError);
  }
}
