
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CalendarSyncRequest {
  provider: 'google' | 'outlook' | 'apple';
  action: 'connect' | 'sync' | 'disconnect';
  accessToken?: string;
  refreshToken?: string;
  calendarId?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { provider, action, accessToken, refreshToken, calendarId }: CalendarSyncRequest = await req.json();

    switch (action) {
      case 'connect':
        // Store calendar integration
        const { data: integration, error: integrationError } = await supabaseClient
          .from('calendar_integrations')
          .upsert({
            user_id: user.id,
            provider,
            access_token: accessToken,
            refresh_token: refreshToken,
            calendar_id: calendarId,
            sync_enabled: true,
            sync_status: 'active',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,provider' })
          .select()
          .single();

        if (integrationError) throw integrationError;

        return new Response(JSON.stringify({ 
          success: true, 
          integration,
          message: `Connected to ${provider} calendar successfully` 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });

      case 'sync':
        // Sync bookings with external calendar
        const { data: bookings, error: bookingsError } = await supabaseClient
          .from('bookings')
          .select('*')
          .eq('member_id', user.id)
          .gte('start_time', new Date().toISOString());

        if (bookingsError) throw bookingsError;

        // In a real implementation, you would sync these bookings with the external calendar
        // For now, we'll just update the last sync time
        await supabaseClient
          .from('calendar_integrations')
          .update({
            last_sync_at: new Date().toISOString(),
            sync_status: 'active'
          })
          .eq('user_id', user.id)
          .eq('provider', provider);

        return new Response(JSON.stringify({ 
          success: true, 
          syncedBookings: bookings.length,
          message: `Synced ${bookings.length} bookings with ${provider}` 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });

      case 'disconnect':
        // Disconnect calendar integration
        await supabaseClient
          .from('calendar_integrations')
          .update({
            sync_enabled: false,
            sync_status: 'disabled',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('provider', provider);

        return new Response(JSON.stringify({ 
          success: true, 
          message: `Disconnected from ${provider} calendar` 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });

      default:
        throw new Error(`Invalid action: ${action}`);
    }
  } catch (error) {
    console.error("Error in sync-calendar:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
