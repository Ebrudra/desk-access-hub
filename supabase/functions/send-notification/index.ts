
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface NotificationRequest {
  type: 'email' | 'sms';
  templateName: string;
  recipient: string;
  variables: Record<string, string>;
  userId?: string;
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
    const { type, templateName, recipient, variables, userId }: NotificationRequest = await req.json();

    // Get email template
    const { data: template, error: templateError } = await supabaseClient
      .from('email_templates')
      .select('*')
      .eq('name', templateName)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    // Replace variables in template
    let subject = template.subject;
    let content = template.html_content;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      content = content.replace(new RegExp(placeholder, 'g'), value);
    });

    let notificationResult;
    let status = 'pending';
    let providerResponse = null;

    if (type === 'email') {
      try {
        notificationResult = await resend.emails.send({
          from: "Workspace <onboarding@resend.dev>",
          to: [recipient],
          subject: subject,
          html: content,
        });
        status = 'sent';
        providerResponse = notificationResult;
      } catch (error) {
        status = 'failed';
        providerResponse = { error: error.message };
      }
    } else if (type === 'sms') {
      // SMS implementation would go here (Twilio integration)
      status = 'pending';
      providerResponse = { message: 'SMS sending not implemented yet' };
    }

    // Log notification
    await supabaseClient.from('notification_logs').insert({
      user_id: userId,
      notification_type: templateName,
      channel: type,
      recipient,
      subject,
      content,
      status,
      provider_response: providerResponse,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
    });

    return new Response(JSON.stringify({ 
      success: status === 'sent', 
      status,
      result: notificationResult 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
