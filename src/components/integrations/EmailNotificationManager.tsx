
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, Clock } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

export const EmailNotificationManager = () => {
  const [recipient, setRecipient] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [variables, setVariables] = useState<Record<string, string>>({});
  const { sendNotification, loading } = useNotifications();

  const handleSendTest = async () => {
    if (!recipient || !templateName) return;

    try {
      await sendNotification({
        type: 'email',
        templateName,
        recipient,
        variables
      });
      setRecipient("");
      setVariables({});
    } catch (error) {
      console.error("Failed to send test email:", error);
    }
  };

  const updateVariable = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5" />
          <span>Email Notification Manager</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Email</Label>
            <Input
              id="recipient"
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template">Email Template</Label>
            <Select value={templateName} onValueChange={setTemplateName}>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="booking_confirmation">Booking Confirmation</SelectItem>
                <SelectItem value="booking_reminder">Booking Reminder</SelectItem>
                <SelectItem value="payment_receipt">Payment Receipt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {templateName === 'booking_confirmation' && (
          <div className="space-y-4">
            <h4 className="font-medium">Template Variables</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>User Name</Label>
                <Input
                  value={variables.user_name || ''}
                  onChange={(e) => updateVariable('user_name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Booking Title</Label>
                <Input
                  value={variables.booking_title || ''}
                  onChange={(e) => updateVariable('booking_title', e.target.value)}
                  placeholder="Meeting Room A"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  value={variables.start_time || ''}
                  onChange={(e) => updateVariable('start_time', e.target.value)}
                  placeholder="2024-01-15 14:00"
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={variables.duration || ''}
                  onChange={(e) => updateVariable('duration', e.target.value)}
                  placeholder="2 hours"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={variables.location || ''}
                  onChange={(e) => updateVariable('location', e.target.value)}
                  placeholder="Main Office"
                />
              </div>
            </div>
          </div>
        )}

        {templateName === 'booking_reminder' && (
          <div className="space-y-4">
            <h4 className="font-medium">Template Variables</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>User Name</Label>
                <Input
                  value={variables.user_name || ''}
                  onChange={(e) => updateVariable('user_name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Booking Title</Label>
                <Input
                  value={variables.booking_title || ''}
                  onChange={(e) => updateVariable('booking_title', e.target.value)}
                  placeholder="Meeting Room A"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  value={variables.start_time || ''}
                  onChange={(e) => updateVariable('start_time', e.target.value)}
                  placeholder="2024-01-15 14:00"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={variables.location || ''}
                  onChange={(e) => updateVariable('location', e.target.value)}
                  placeholder="Main Office"
                />
              </div>
            </div>
          </div>
        )}

        {templateName === 'payment_receipt' && (
          <div className="space-y-4">
            <h4 className="font-medium">Template Variables</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>User Name</Label>
                <Input
                  value={variables.user_name || ''}
                  onChange={(e) => updateVariable('user_name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  value={variables.amount || ''}
                  onChange={(e) => updateVariable('amount', e.target.value)}
                  placeholder="$99.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Input
                  value={variables.payment_date || ''}
                  onChange={(e) => updateVariable('payment_date', e.target.value)}
                  placeholder="2024-01-15"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={variables.description || ''}
                  onChange={(e) => updateVariable('description', e.target.value)}
                  placeholder="Monthly subscription"
                />
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={handleSendTest} 
          disabled={!recipient || !templateName || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Test Email
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
