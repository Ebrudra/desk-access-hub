
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./useAuth";

interface SendNotificationParams {
  type: 'email' | 'sms';
  templateName: string;
  recipient: string;
  variables: Record<string, string>;
}

export const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const sendNotification = async (params: SendNotificationParams) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-notification', {
        body: {
          ...params,
          userId: user?.id
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Notification Sent",
          description: `${params.type} notification sent successfully to ${params.recipient}`,
        });
      } else {
        throw new Error(data.error || 'Failed to send notification');
      }

      return data;
    } catch (error: any) {
      toast({
        title: "Notification Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendBookingConfirmation = async (recipient: string, bookingDetails: any) => {
    return sendNotification({
      type: 'email',
      templateName: 'booking_confirmation',
      recipient,
      variables: {
        user_name: bookingDetails.user_name || 'User',
        booking_title: bookingDetails.title || 'Booking',
        start_time: new Date(bookingDetails.start_time).toLocaleString(),
        duration: bookingDetails.duration || '2 hours',
        location: bookingDetails.location || 'Workspace'
      }
    });
  };

  const sendBookingReminder = async (recipient: string, bookingDetails: any) => {
    return sendNotification({
      type: 'email',
      templateName: 'booking_reminder',
      recipient,
      variables: {
        user_name: bookingDetails.user_name || 'User',
        booking_title: bookingDetails.title || 'Booking',
        start_time: new Date(bookingDetails.start_time).toLocaleString(),
        location: bookingDetails.location || 'Workspace'
      }
    });
  };

  const sendPaymentReceipt = async (recipient: string, paymentDetails: any) => {
    return sendNotification({
      type: 'email',
      templateName: 'payment_receipt',
      recipient,
      variables: {
        user_name: paymentDetails.user_name || 'User',
        amount: paymentDetails.amount || '$0.00',
        payment_date: new Date().toLocaleDateString(),
        description: paymentDetails.description || 'Payment'
      }
    });
  };

  return {
    sendNotification,
    sendBookingConfirmation,
    sendBookingReminder,
    sendPaymentReceipt,
    loading
  };
};
