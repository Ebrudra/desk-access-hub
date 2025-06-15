import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, Users, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSpaces } from "@/hooks/useSpaces";
import { useToast } from "@/hooks/use-toast";

const bookingSchema = z.object({
  spaceId: z.string().min(1, { message: "Please select a space." }),
  startTime: z.string().min(1, { message: "Start time is required." }),
  endTime: z.string().min(1, { message: "End time is required." }),
  numberOfAttendees: z.number().min(1, { message: "Must have at least 1 attendee." }),
  purpose: z.string().optional(),
  notes: z.string().optional(),
});

type BookingSchemaType = z.infer<typeof bookingSchema>;

interface Space {
  id: string;
  name: string;
  capacity: number;
  hourlyRate: number;
}

export const EnhancedBookingForm = ({ onBookingComplete }: { onBookingComplete?: () => void }) => {
  const { user } = useAuth();
  const { spaces, isLoading: spacesLoading } = useSpaces();
  const { toast } = useToast();
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingSchemaType>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      numberOfAttendees: 1,
    },
  });

  useEffect(() => {
    if (spaces && spaces.length > 0) {
      setValue("spaceId", spaces[0].id);
    }
  }, [spaces, setValue]);

  const onSubmit = async (data: BookingSchemaType) => {
    if (!user?.id) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to create a booking.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate booking creation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate successful booking and payment required
      toast({
        title: "Booking Created",
        description: "Your booking has been created. Please complete the payment.",
      });
      setBookingId("temp_booking_id");
      setShowPayment(true);
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = async () => {
    toast({
      title: "Payment Successful",
      description: "Your booking has been confirmed and payment processed."
    });
    setShowPayment(false);
    onBookingComplete?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Create New Booking</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="spaceId">Select Space</Label>
            <Select onValueChange={(value) => setValue("spaceId", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a space" />
              </SelectTrigger>
              <SelectContent>
                {spacesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  spaces?.map((space) => (
                    <SelectItem key={space.id} value={space.id}>
                      {space.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.spaceId && (
              <p className="text-sm text-red-500">{errors.spaceId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                {...register("startTime")}
              />
              {errors.startTime && (
                <p className="text-sm text-red-500">{errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="datetime-local" {...register("endTime")} />
              {errors.endTime && (
                <p className="text-sm text-red-500">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfAttendees">Number of Attendees</Label>
            <Input
              id="numberOfAttendees"
              type="number"
              {...register("numberOfAttendees", { valueAsNumber: true })}
            />
            {errors.numberOfAttendees && (
              <p className="text-sm text-red-500">
                {errors.numberOfAttendees.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose (Optional)</Label>
            <Input id="purpose" type="text" {...register("purpose")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea id="notes" {...register("notes")} />
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Booking..." : "Create Booking"}
          </Button>
        </form>

        {showPayment && bookingId && (
          <div className="mt-6 p-4 border rounded-lg bg-blue-50">
            <h3 className="font-medium mb-2">Payment Required</h3>
            <p className="text-sm text-gray-600 mb-4">
              Complete your booking by processing the payment.
            </p>
            <Button onClick={handlePaymentSuccess} className="w-full">
              Process Payment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
