import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookingBasicInfo } from "@/components/forms/BookingBasicInfo";
import { BookingSelectors } from "@/components/forms/BookingSelectors";
import { BookingDateTime } from "@/components/forms/BookingDateTime";
import { BookingSpecialRequests } from "@/components/forms/BookingSpecialRequests";

// Define type for booking form data so it can be referenced in props and state
export interface BookingFormData {
  title: string;
  description: string;
  resource_id: string;
  member_id: string;
  start_time: string;
  end_time: string;
  attendees: number;
  special_requests: string;
}

interface BookingFormProps {
  bookingId?: string;
  onSuccess?: () => void;
  prefill?: Partial<BookingFormData>;
}

export const BookingForm = ({ bookingId, onSuccess, prefill }: BookingFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<BookingFormData>({
    title: prefill?.title || "",
    description: prefill?.description || "",
    resource_id: prefill?.resource_id || "",
    member_id: prefill?.member_id || "",
    start_time: prefill?.start_time || "",
    end_time: prefill?.end_time || "",
    attendees: prefill?.attendees ?? 1,
    special_requests: prefill?.special_requests || ""
  });

  const { data: resources } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase.from("resources").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select("*, profiles:user_id(*)");
      if (error) throw error;
      return data;
    },
  });

  const { data: booking } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!bookingId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      // Validation
      if (!data.title || !data.resource_id || !data.member_id || !data.start_time || !data.end_time) {
        throw new Error("Missing required booking fields");
      }
      // Extra debugging
      console.log("Creating booking with data:", data);
      const { error } = await supabase.from("bookings").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Booking created successfully" });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error?.message || "Failed to create booking", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!bookingId) throw new Error("Missing bookingId for update");
      // Validation
      if (!data.title || !data.resource_id || !data.member_id || !data.start_time || !data.end_time) {
        throw new Error("Missing required booking fields");
      }
      // Extra debugging
      console.log("Updating booking with data:", data);
      const { error } = await supabase
        .from("bookings")
        .update(data)
        .eq("id", bookingId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Booking updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error?.message || "Failed to update booking", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use current formData or fallback to logged-in user's id if required
    const data = {
      ...formData,
      attendees: parseInt(formData.attendees.toString()),
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
      member_id: formData.member_id,
    };
    if (bookingId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {bookingId ? "Edit Booking" : "Create New Booking"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <BookingBasicInfo formData={formData} onFormDataChange={setFormData} />
          <BookingSelectors 
            formData={formData} 
            onFormDataChange={setFormData}
            resources={resources}
            members={members}
          />
          <BookingDateTime formData={formData} onFormDataChange={setFormData} />
          <BookingSpecialRequests formData={formData} onFormDataChange={setFormData} />

          <Button 
            type="submit" 
            className="w-full"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            <Clock className="h-4 w-4 mr-2" />
            {bookingId ? "Update Booking" : "Create Booking"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
