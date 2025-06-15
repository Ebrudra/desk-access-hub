
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, CreditCard, Users, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaymentIntegration } from "@/components/payments/PaymentIntegration";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

interface EnhancedBookingFormProps {
  onSuccess?: () => void;
  preselectedResource?: string;
  preselectedDateTime?: string;
}

export const EnhancedBookingForm = ({ 
  onSuccess, 
  preselectedResource, 
  preselectedDateTime 
}: EnhancedBookingFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    resourceId: preselectedResource || "",
    startTime: preselectedDateTime || "",
    duration: "2",
    attendees: "1",
    title: "",
    description: "",
    specialRequests: ""
  });
  const [showPayment, setShowPayment] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);

  const { data: resources } = useQuery({
    queryKey: ["available-resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("is_available", true);
      
      if (error) throw error;
      return data;
    }
  });

  const calculatePrice = (resourceId: string, duration: number) => {
    const resource = resources?.find(r => r.id === resourceId);
    if (!resource) return 0;
    
    const hourlyRate = resource.hourly_rate || 0;
    return hourlyRate * duration;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a booking.",
        variant: "destructive"
      });
      return;
    }

    try {
      const startDateTime = new Date(formData.startTime);
      const endDateTime = new Date(startDateTime.getTime() + parseInt(formData.duration) * 60 * 60 * 1000);
      const amount = calculatePrice(formData.resourceId, parseInt(formData.duration));

      // Create pending booking
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          member_id: user.id,
          resource_id: formData.resourceId,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          attendees: parseInt(formData.attendees),
          title: formData.title,
          description: formData.description,
          special_requests: formData.specialRequests,
          status: "pending",
          total_amount: amount
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      setPendingBookingId(booking.id);
      setTotalAmount(amount);
      setShowPayment(true);

      toast({
        title: "Booking Created",
        description: "Please complete payment to confirm your booking."
      });

    } catch (error) {
      console.error("Booking creation error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentSuccess = async () => {
    if (!pendingBookingId) return;

    try {
      // Update booking status to confirmed
      const { error } = await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", pendingBookingId);

      if (error) throw error;

      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed. Access codes will be generated shortly."
      });

      onSuccess?.();
    } catch (error) {
      console.error("Payment confirmation error:", error);
      toast({
        title: "Payment Error",
        description: "Payment was processed but there was an error confirming your booking.",
        variant: "destructive"
      });
    }
  };

  if (showPayment && totalAmount > 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{formData.duration} hours</span>
              </div>
              <div className="flex justify-between">
                <span>Attendees:</span>
                <span>{formData.attendees}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <PaymentIntegration
          bookingId={pendingBookingId}
          amount={totalAmount}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Book Your Space
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resource">Space</Label>
              <Select value={formData.resourceId} onValueChange={(value) => setFormData(prev => ({ ...prev, resourceId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a space" />
                </SelectTrigger>
                <SelectContent>
                  {resources?.map((resource) => (
                    <SelectItem key={resource.id} value={resource.id}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {resource.name} - ${resource.hourly_rate}/hr
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="8">Full day (8 hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendees">Attendees</Label>
              <Select value={formData.attendees} onValueChange={(value) => setFormData(prev => ({ ...prev, attendees: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {i + 1} {i === 0 ? 'person' : 'people'}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Booking Title</Label>
              <Input
                placeholder="e.g., Team Meeting, Client Presentation"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                placeholder="Brief description of your booking purpose"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                placeholder="Any special requirements or requests"
                value={formData.specialRequests}
                onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
              />
            </div>
          </div>

          <Separator />

          {formData.resourceId && formData.duration && (
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">Estimated Total</span>
              </div>
              <span className="text-xl font-bold">
                ${calculatePrice(formData.resourceId, parseInt(formData.duration)).toFixed(2)}
              </span>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg">
            <Clock className="h-4 w-4 mr-2" />
            Proceed to Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
