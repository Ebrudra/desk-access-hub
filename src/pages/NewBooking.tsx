import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Users, MapPin } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { BookingForm } from "@/components/crud/BookingForm";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const roomPresets = [
  {
    title: "Meeting Room (4 people)",
    prefill: {
      title: "Quick Meeting",
      attendees: 4
      // resource_id, start_time, end_time filled dynamically
    }
  },
  {
    title: "Conference Hall (20 people)",
    prefill: {
      title: "Quick Conference",
      attendees: 20
    }
  },
  {
    title: "Hot Desk (1 person)",
    prefill: {
      title: "Quick Desk",
      attendees: 1,
    }
  },
];

const NewBooking = () => {
  const navigate = useNavigate();
  const [formPrefill, setFormPrefill] = useState<any>(null);

  // Get resources and members for dynamic prefill
  const { data: resources } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data } = await supabase.from("resources").select("*");
      return data;
    }
  });
  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data } = await supabase.from("members").select("*");
      return data;
    }
  });

  const handleBookingSuccess = () => {
    navigate("/dashboard?tab=crud&subtab=bookings");
  };

  const handleQuickBook = (presetPrefill: any) => {
    const now = new Date();
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
    // Find first available resource and member
    const resource_id = resources?.length ? resources[0].id : "";
    const member_id = members?.length ? members[0].id : "";

    setFormPrefill({
      ...presetPrefill,
      resource_id,
      member_id,
      start_time: now.toISOString().slice(0, 16),
      end_time: inOneHour.toISOString().slice(0, 16),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Booking
          </h1>
          <p className="text-gray-600">
            Book a space for your next meeting or event
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BookingForm onSuccess={handleBookingSuccess} prefill={formPrefill} />
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Quick Book
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roomPresets.map((room, idx) => (
                    <Button
                      key={idx}
                      className="w-full"
                      variant="outline"
                      onClick={() => handleQuickBook(room.prefill)}
                    >
                      {room.title.includes("Meeting") || room.title.includes("Hot Desk") ? (
                        <Users className="mr-2 h-4 w-4" />
                      ) : (
                        <MapPin className="mr-2 h-4 w-4" />
                      )}
                      {room.title}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBooking;
